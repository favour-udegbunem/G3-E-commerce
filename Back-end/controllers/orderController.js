import crypto from "crypto";
import { Op } from "sequelize";
import db from "../models/index.js";
import { evaluateMembership } from "../utils/membershipService.js";
import { getUserAccessLevels } from "../utils/productAccess.js";
import { recordActivity } from "../utils/activityLogger.js";
import { createUserNotification } from "../utils/notificationService.js";

const { sequelize, Order, OrderItem, Product, Category } = db;

const shippingFee = () => Number(process.env.DEFAULT_SHIPPING_FEE || 2500);

const orderIncludes = [
  {
    model: OrderItem,
    as: "items",
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "productCode", "name", "image"],
      },
    ],
  },
];

const makeOrderNumber = () =>
  `G3-${Date.now().toString().slice(-8)}-${crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      productId: item.productId || null,
      productCode: item.productCode?.trim() || null,
      quantity: Number(item.quantity),
    }))
    .filter((item) => item.quantity > 0 && (item.productId || item.productCode));
};

export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      items,
      shippingAddress,
      customerFirstName,
      customerLastName,
      customerEmail,
      customerPhone,
      notes,
      paymentMethod,
    } = req.body;

    if (!["paystack", "bank_transfer"].includes(paymentMethod)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Choose a valid payment method." });
    }

    const normalizedItems = normalizeItems(items);
    if (!normalizedItems.length) {
      await transaction.rollback();
      return res.status(400).json({ message: "At least one product is required." });
    }

    const firstName = customerFirstName?.trim() || req.user.firstName;
    const lastName = customerLastName?.trim() || req.user.lastName;
    const email = customerEmail?.trim().toLowerCase() || req.user.email;
    const phone = customerPhone?.trim() || req.user.phone;

    if (!shippingAddress?.trim()) {
      await transaction.rollback();
      return res.status(400).json({ message: "A delivery address is required." });
    }

    const accessLevels = getUserAccessLevels(req.user);
    const resolvedItems = [];

    for (const requested of normalizedItems) {
      const where = requested.productId
        ? { id: requested.productId }
        : { productCode: requested.productCode };

      const product = await Product.findOne({
        where: { ...where, active: true },
        include: [
          { model: Category, as: "category", attributes: ["id", "name", "slug"] },
        ],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: "One of the selected products no longer exists." });
      }

      if (!accessLevels.includes(product.accessLevel)) {
        await transaction.rollback();
        return res.status(403).json({
          message: `${product.name} is not available for your membership tier.`,
        });
      }

      if (product.stock < requested.quantity) {
        await transaction.rollback();
        return res.status(409).json({
          message: `${product.name} does not have enough stock available.`,
          availableStock: product.stock,
        });
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * requested.quantity;

      resolvedItems.push({ product, quantity: requested.quantity, unitPrice, lineTotal });
    }

    const subtotal = resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const discount = 0;
    const delivery = shippingFee();
    const total = subtotal - discount + delivery;

    const order = await Order.create(
      {
        orderNumber: makeOrderNumber(),
        userId: req.user.id,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        subtotal,
        discount,
        shippingFee: delivery,
        total,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: shippingAddress.trim(),
        notes: notes?.trim() || null,
      },
      { transaction }
    );

    for (const item of resolvedItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.product.id,
          productCode: item.product.productCode,
          productName: item.product.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        },
        { transaction }
      );

      await item.product.decrement("stock", {
        by: item.quantity,
        transaction,
      });
    }

    await transaction.commit();

    const created = await Order.findByPk(order.id, { include: orderIncludes });

    await recordActivity({
      userId: req.user.id,
      action: "order_created",
      entityType: "order",
      entityId: order.id,
      description: `Placed order ${order.orderNumber}.`,
      metadata: { total: Number(order.total), paymentMethod: order.paymentMethod },
    });

    await createUserNotification({
      userId: req.user.id,
      type: "order",
      title: "Order received",
      message: `${order.orderNumber} has been received by G3 Lounge.`,
      data: { orderId: order.id, orderNumber: order.orderNumber, status: order.status },
    });

    return res.status(201).json({
      message: "Order created successfully.",
      order: created,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Could not create your order." });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      where.status = status;
    }

    const orders = await Order.findAll({
      where,
      include: orderIncludes,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ orders, count: orders.length });
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({ message: "Could not load your orders." });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: orderIncludes,
    });

    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ message: "Could not load the order." });
  }
};

export const cancelMyOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: OrderItem, as: "items" }],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Order not found." });
    }

    if (!["pending", "processing"].includes(order.status) || order.paymentStatus === "paid") {
      await transaction.rollback();
      return res.status(409).json({ message: "This order can no longer be cancelled." });
    }

    for (const item of order.items) {
      await Product.increment("stock", {
        by: item.quantity,
        where: { id: item.productId },
        transaction,
      });
    }

    await order.update({ status: "cancelled" }, { transaction });
    await transaction.commit();

    await recordActivity({
      userId: req.user.id,
      action: "order_cancelled",
      entityType: "order",
      entityId: order.id,
      description: `Cancelled order ${order.orderNumber}.`,
    });

    await createUserNotification({
      userId: req.user.id,
      type: "order",
      title: "Order cancelled",
      message: `${order.orderNumber} has been cancelled.`,
      data: { orderId: order.id, orderNumber: order.orderNumber, status: "cancelled" },
    });

    return res.json({ message: "Order cancelled successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Cancel order error:", error);
    return res.status(500).json({ message: "Could not cancel the order." });
  }
};

export const getMembership = async (req, res) => {
  try {
    const membership = await evaluateMembership(req.user);
    return res.json({ membership });
  } catch (error) {
    console.error("Membership error:", error);
    return res.status(500).json({ message: "Could not load membership information." });
  }
};
