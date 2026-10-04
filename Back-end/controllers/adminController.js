import { Op } from "sequelize";
import db from "../models/index.js";
import { recordActivity } from "../utils/activityLogger.js";
import { createUserNotification } from "../utils/notificationService.js";

const { User, Product, Category, Order, OrderItem } = db;

const getDateRange = (query, defaultDays = 29) => {
  const today = new Date();
  const toDateOnly = (date) => date.toISOString().slice(0, 10);
  const isDateOnly = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "");

  let endDate = isDateOnly(query.endDate) ? query.endDate : toDateOnly(today);
  let startDate = isDateOnly(query.startDate) ? query.startDate : null;

  if (!startDate) {
    const start = new Date(`${endDate}T00:00:00`);
    start.setDate(start.getDate() - defaultDays);
    startDate = toDateOnly(start);
  }

  if (startDate > endDate) [startDate, endDate] = [endDate, startDate];
  return { startDate, endDate };
};

const buildDaySeries = (rows, startDate, endDate) => {
  const byDay = new Map(rows.map((row) => [String(row.day), row]));
  const series = [];
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const key = date.toISOString().slice(0, 10);
    const row = byDay.get(key);
    series.push({
      date: key,
      label: date.toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
      orders: Number(row?.orders || 0),
      revenue: Number(row?.revenue || 0),
      losses: Number(row?.losses || 0),
      activities: Number(row?.activities || 0),
    });
  }

  return series;
};

export const getDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = getDateRange(req.query, 29);

    const [users, products, activeProducts, orders, pendingOrders, revenue, lossValue] = await Promise.all([
      User.count(),
      Product.count(),
      Product.count({ where: { active: true } }),
      Order.count({ where: { createdAt: { [Op.gte]: new Date(`${startDate}T00:00:00`), [Op.lt]: new Date(`${endDate}T23:59:59.999`) } } }),
      Order.count({ where: { status: { [Op.in]: ["pending", "processing"] }, createdAt: { [Op.gte]: new Date(`${startDate}T00:00:00`), [Op.lt]: new Date(`${endDate}T23:59:59.999`) } } }),
      Order.sum("total", { where: { paymentStatus: "paid", createdAt: { [Op.gte]: new Date(`${startDate}T00:00:00`), [Op.lt]: new Date(`${endDate}T23:59:59.999`) } } }),
      Order.sum("total", { where: { [Op.or]: [{ status: "cancelled" }, { paymentStatus: "refunded" }], createdAt: { [Op.gte]: new Date(`${startDate}T00:00:00`), [Op.lt]: new Date(`${endDate}T23:59:59.999`) } } }),
    ]);

    const [trendRows] = await db.sequelize.query(`
      SELECT DATE(o.createdAt) AS day,
             COUNT(*) AS orders,
             COALESCE(SUM(CASE WHEN o.paymentStatus='paid' THEN o.total ELSE 0 END),0) AS revenue,
             COALESCE(SUM(CASE WHEN o.status='cancelled' OR o.paymentStatus='refunded' THEN o.total ELSE 0 END),0) AS losses,
             0 AS activities
      FROM orders o
      WHERE o.createdAt >= :startDate
        AND o.createdAt < DATE_ADD(:endDate, INTERVAL 1 DAY)
      GROUP BY DATE(o.createdAt)
      ORDER BY day ASC
    `, { replacements: { startDate, endDate } });

    const [activityRows] = await db.sequelize.query(`
      SELECT DATE(createdAt) AS day, COUNT(*) AS activities
      FROM activity_logs
      WHERE createdAt >= :startDate
        AND createdAt < DATE_ADD(:endDate, INTERVAL 1 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY day ASC
    `, { replacements: { startDate, endDate } });

    const mergedRows = new Map(trendRows.map((row) => [String(row.day), { ...row }]));
    for (const row of activityRows) {
      const key = String(row.day);
      mergedRows.set(key, { ...(mergedRows.get(key) || { day: key }), activities: row.activities });
    }

    const series = buildDaySeries(Array.from(mergedRows.values()), startDate, endDate);

    const [topProductRows] = await db.sequelize.query(`
      SELECT oi.productName AS productName,
             SUM(oi.quantity) AS quantity,
             SUM(oi.lineTotal) AS revenue
      FROM order_items oi
      INNER JOIN orders o ON o.id=oi.orderId
      WHERE o.paymentStatus='paid'
        AND o.createdAt >= :startDate
        AND o.createdAt < DATE_ADD(:endDate, INTERVAL 1 DAY)
      GROUP BY oi.productName
      ORDER BY quantity DESC, revenue DESC
      LIMIT 10
    `, { replacements: { startDate, endDate } });

    const topProducts = topProductRows.map((product) => ({
      productName: product.productName,
      quantity: Number(product.quantity || 0),
      revenue: Number(product.revenue || 0),
    }));

    const tierRows = await User.findAll({
      attributes: ["tier", [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"]],
      group: ["tier"],
      raw: true,
    });

    const tierBreakdown = tierRows.map((row) => ({
      tier: row.tier || "guest",
      count: Number(row.count || 0),
    }));

    const lowStockProducts = await Product.findAll({
      where: { active: true, stock: { [Op.lte]: 5 } },
      attributes: ["id", "name", "stock"],
      order: [["stock", "ASC"], ["name", "ASC"]],
      limit: 20,
    });

    const recentActivities = await db.ActivityLog.findAll({
      where: { createdAt: { [Op.gte]: new Date(`${startDate}T00:00:00`), [Op.lt]: new Date(`${endDate}T23:59:59.999`) } },
      include: [{ model: User, as: "user", attributes: ["firstName", "lastName", "email"] }],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    return res.json({
      dateRange: { startDate, endDate },
      stats: {
        users,
        products,
        activeProducts,
        orders,
        pendingOrders,
        paidRevenue: Number(revenue || 0),
        losses: Number(lossValue || 0),
        lowStock: lowStockProducts.length,
        activities: series.reduce((sum, item) => sum + item.activities, 0),
      },
      revenueTrend: series.map(({ label, date, revenue }) => ({ label, date, revenue })),
      orderTrend: series.map(({ label, date, orders }) => ({ label, date, orders })),
      lossTrend: series.map(({ label, date, losses }) => ({ label, date, losses })),
      activityTrend: series.map(({ label, date, activities }) => ({ label, date, activities })),
      topProducts,
      tierBreakdown,
      lowStockProducts,
      recentActivities,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ message: "Could not load dashboard statistics." });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      search,
      startDate,
      endDate,
    } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search?.trim()) {
      where[Op.or] = [
        {
          orderNumber: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          customerEmail: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          customerFirstName: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          customerLastName: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
      ];
    }

    /*
     * Date filtering
     *
     * startDate = 2026-10-01
     * endDate   = 2026-10-01
     *
     * returns every order received during that day.
     */
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(startDate || "") ||
      /^\d{4}-\d{2}-\d{2}$/.test(endDate || "")
    ) {
      const start =
        /^\d{4}-\d{2}-\d{2}$/.test(startDate || "")
          ? startDate
          : endDate;

      const end =
        /^\d{4}-\d{2}-\d{2}$/.test(endDate || "")
          ? endDate
          : startDate;

      const firstDate =
        start <= end ? start : end;

      const lastDate =
        start <= end ? end : start;

      where.createdAt = {
        [Op.gte]: `${firstDate} 00:00:00`,
        [Op.lt]: db.sequelize.literal(
          `DATE_ADD('${lastDate} 00:00:00', INTERVAL 1 DAY)`
        ),
      };
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error(
      "Admin orders error:",
      error
    );

    return res.status(500).json({
      message: "Could not load orders.",
    });
  }
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = getDateRange(req.query, 179);

    const [rows] = await db.sequelize.query(`
      SELECT DATE(createdAt) AS day,
             COUNT(*) AS orders,
             COALESCE(SUM(CASE WHEN paymentStatus='paid' THEN total ELSE 0 END),0) AS revenue,
             COALESCE(SUM(CASE WHEN status='cancelled' OR paymentStatus='refunded' THEN total ELSE 0 END),0) AS losses
      FROM orders
      WHERE createdAt >= :startDate
        AND createdAt < DATE_ADD(:endDate, INTERVAL 1 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY day ASC
    `, { replacements: { startDate, endDate } });

    const [activities] = await db.sequelize.query(`
      SELECT DATE(createdAt) AS day, COUNT(*) AS activities
      FROM activity_logs
      WHERE createdAt >= :startDate
        AND createdAt < DATE_ADD(:endDate, INTERVAL 1 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY day ASC
    `, { replacements: { startDate, endDate } });

    const merged = new Map(rows.map((row) => [String(row.day), { ...row }]));
    for (const row of activities) {
      const key = String(row.day);
      merged.set(key, { ...(merged.get(key) || { day: key }), activities: row.activities });
    }

    const series = buildDaySeries(Array.from(merged.values()), startDate, endDate);
    const recentActivities = await db.ActivityLog.findAll({
      where: { createdAt: { [Op.gte]: new Date(`${startDate}T00:00:00`), [Op.lt]: new Date(`${endDate}T23:59:59.999`) } },
      include: [{ model: User, as: "user", attributes: ["firstName", "lastName", "email"] }],
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    return res.json({
      dateRange: { startDate, endDate },
      analytics: {
        revenue: series.map(({ date, label, revenue }) => ({ date, label, revenue })),
        orders: series.map(({ date, label, orders }) => ({ date, label, orders })),
        losses: series.map(({ date, label, losses }) => ({ date, label, losses })),
        activities: series.map(({ date, label, activities }) => ({ date, label, activities })),
      },
      totals: {
        revenue: series.reduce((sum, item) => sum + item.revenue, 0),
        orders: series.reduce((sum, item) => sum + item.orders, 0),
        losses: series.reduce((sum, item) => sum + item.losses, 0),
        activities: series.reduce((sum, item) => sum + item.activities, 0),
      },
      recentActivities,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return res.status(500).json({ message: "Could not load dashboard analytics." });
  }
};

export const updateAdminOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const allowedStatus = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const allowedPayment = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    const updates = {};

    /*
     * ---------------------------------------------------------
     * ORDER STATUS
     * ---------------------------------------------------------
     * Admin can still manually update the actual order status.
     */
    if (req.body.status !== undefined) {
      if (!allowedStatus.includes(req.body.status)) {
        return res.status(400).json({
          message: "Invalid order status.",
        });
      }

      updates.status = req.body.status;
    }

    /*
     * ---------------------------------------------------------
     * PAYMENT METHOD
     * ---------------------------------------------------------
     * Once an order has been created, its payment method should
     * not be changed by the admin.
     *
     * This prevents someone from changing a Paystack order into
     * bank transfer and then manually marking it as paid.
     */
    if (req.body.paymentMethod !== undefined) {
      const requestedPaymentMethod =
        req.body.paymentMethod || null;

      if (requestedPaymentMethod !== order.paymentMethod) {
        return res.status(400).json({
          message:
            "Payment method cannot be changed after an order has been created.",
        });
      }
    }

    /*
     * ---------------------------------------------------------
     * PAYMENT STATUS
     * ---------------------------------------------------------
     * PAYSTACK:
     * The payment status is controlled by Paystack verification
     * and webhook events. Admin cannot manually change it.
     *
     * BANK TRANSFER:
     * Admin is allowed to manually update the payment status.
     */
    if (req.body.paymentStatus !== undefined) {
      if (!allowedPayment.includes(req.body.paymentStatus)) {
        return res.status(400).json({
          message: "Invalid payment status.",
        });
      }

      /*
       * Paystack payments are controlled automatically.
       */
      if (order.paymentMethod === "paystack") {
        if (req.body.paymentStatus !== order.paymentStatus) {
          return res.status(403).json({
            message:
              "Paystack payment status is managed automatically by Paystack and cannot be changed manually.",
          });
        }

        /*
         * If the admin sends the same payment status that already
         * exists, simply ignore it rather than treating it as a
         * manual payment-status change.
         */
      }

      /*
       * Bank-transfer payments can be manually verified by admin.
       */
      if (order.paymentMethod === "bank_transfer") {
        updates.paymentStatus = req.body.paymentStatus;

        if (
          req.body.paymentStatus === "paid" &&
          !order.paidAt
        ) {
          updates.paidAt = new Date();
        }

        /*
         * If payment is moved away from "paid", clear paidAt.
         */
        if (req.body.paymentStatus !== "paid") {
          updates.paidAt = null;
        }
      }

      /*
       * For orders where paymentMethod is missing/null,
       * do not allow manual payment changes.
       *
       * This prevents an unidentified payment from being
       * accidentally marked as paid.
       */
      if (
        order.paymentMethod !== "paystack" &&
        order.paymentMethod !== "bank_transfer"
      ) {
        return res.status(403).json({
          message:
            "This order does not have a supported payment method for manual payment-status updates.",
        });
      }
    }

    /*
     * paymentReference is NOT manually editable for Paystack.
     * It is created by Paystack initialization.
     */
    if (req.body.paymentReference !== undefined) {
      if (order.paymentMethod === "paystack") {
        return res.status(403).json({
          message:
            "Paystack payment reference cannot be changed manually.",
        });
      }

      updates.paymentReference =
        req.body.paymentReference || null;
    }

    const previousStatus = order.status;
    const previousPaymentStatus = order.paymentStatus;

    await order.update(updates);

    /*
     * ---------------------------------------------------------
     * ORDER STATUS NOTIFICATION
     * ---------------------------------------------------------
     */
    if (
      updates.status &&
      updates.status !== previousStatus
    ) {
      await createUserNotification({
        userId: order.userId,
        type: "order",
        title: "Your order status changed",
        message: `${order.orderNumber} is now ${updates.status}.`,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: updates.status,
        },
      });
    }

    /*
     * ---------------------------------------------------------
     * PAYMENT STATUS NOTIFICATION
     * ---------------------------------------------------------
     *
     * This remains here for BANK TRANSFER updates.
     *
     * Paystack updates will normally come through the payment
     * controller/webhook rather than this admin controller.
     */
    if (
      updates.paymentStatus &&
      updates.paymentStatus !== previousPaymentStatus
    ) {
      await createUserNotification({
        userId: order.userId,
        type: "order",
        title: "Payment status updated",
        message: `${order.orderNumber} payment is now ${updates.paymentStatus}.`,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: updates.paymentStatus,
        },
      });
    }

    /*
     * ---------------------------------------------------------
     * ACTIVITY LOG
     * ---------------------------------------------------------
     */
    await recordActivity({
      userId: req.user.id,
      action: "order_updated",
      entityType: "order",
      entityId: order.id,
      description: `Admin updated ${order.orderNumber}.`,
      metadata: {
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      },
    });

    return res.json({
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Admin update order error:", error);

    return res.status(500).json({
      message: "Could not update the order.",
    });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { search, role, tier, active } = req.query;
    const where = {};

    if (role) where.role = role;
    if (tier) where.tier = tier;
    if (active === "true" || active === "false") where.isActive = active === "true";
    if (search?.trim()) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search.trim()}%` } },
        { lastName: { [Op.like]: `%${search.trim()}%` } },
        { email: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ["passwordHash"] },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ users, count: users.length });
  } catch (error) {
    console.error("Admin users error:", error);
    return res.status(500).json({ message: "Could not load users." });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (req.body.role !== undefined) {
      if (!["customer", "admin"].includes(req.body.role)) return res.status(400).json({ message: "Invalid role." });
      if (req.user.id === user.id && req.body.role !== "admin") {
        return res.status(409).json({ message: "You cannot remove administrator access from your own account." });
      }
      user.role = req.body.role;
    }
    if (req.body.tier !== undefined) {
      if (!["guest", "member", "premier"].includes(req.body.tier)) return res.status(400).json({ message: "Invalid membership tier." });
      user.tier = req.body.tier;
    }
    if (req.body.isActive !== undefined) {
      if (req.user.id === user.id && !req.body.isActive) {
        return res.status(409).json({ message: "You cannot deactivate your own administrator account." });
      }
      user.isActive = Boolean(req.body.isActive);
    }

    await user.save();

    const safeUser = user.toJSON();
    delete safeUser.passwordHash;

    await recordActivity({
      userId: req.user.id,
      action: "user_updated",
      entityType: "user",
      entityId: user.id,
      description: `Admin updated account ${user.email}.`,
      metadata: { role: user.role, tier: user.tier, isActive: user.isActive },
    });

    return res.json({
      message: "User updated successfully.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    return res.status(500).json({ message: "Could not update the user." });
  }
};

const makeSlug = (value) =>
  value.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const createCategory = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ message: "Category name is required." });

    const slug = makeSlug(req.body.slug || name);
    const existing = await Category.findOne({ where: { [Op.or]: [{ name }, { slug }] } });
    if (existing) return res.status(409).json({ message: "A category with that name or slug already exists." });

    const category = await Category.create({
      name,
      slug,
      description: req.body.description?.trim() || null,
      active: req.body.active !== false,
    });

    await recordActivity({
      userId: req.user.id,
      action: "category_created",
      entityType: "category",
      entityId: category.id,
      description: `Created category ${category.name}.`,
    });

    return res.status(201).json({ message: "Category created successfully.", category });
  } catch (error) {
    console.error("Create category error:", error);
    return res.status(500).json({ message: "Could not create category." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    const name = req.body.name?.trim() || category.name;
    const slug = makeSlug(req.body.slug || name);
    const duplicate = await Category.findOne({
      where: { [Op.or]: [{ name }, { slug }], id: { [Op.ne]: category.id } },
    });
    if (duplicate) return res.status(409).json({ message: "A category with that name or slug already exists." });

    await category.update({
      name,
      slug,
      description: req.body.description?.trim() ?? category.description,
      active: req.body.active === undefined ? category.active : Boolean(req.body.active),
    });

    await recordActivity({
      userId: req.user.id,
      action: "category_updated",
      entityType: "category",
      entityId: category.id,
      description: `Updated category ${category.name}.`,
    });

    return res.json({ message: "Category updated successfully.", category });
  } catch (error) {
    console.error("Update category error:", error);
    return res.status(500).json({ message: "Could not update category." });
  }
};

export const archiveCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    const productCount = await Product.count({ where: { categoryId: category.id, active: true } });
    if (productCount > 0) {
      return res.status(409).json({
        message: "Move or archive the active products in this category before archiving the category.",
        productCount,
      });
    }

    await category.update({ active: false });
    await recordActivity({
      userId: req.user.id,
      action: "category_archived",
      entityType: "category",
      entityId: category.id,
      description: `Archived category ${category.name}.`,
    });
    return res.json({ message: "Category archived successfully." });
  } catch (error) {
    console.error("Archive category error:", error);
    return res.status(500).json({ message: "Could not archive category." });
  }
};
