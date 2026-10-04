import { Op } from "sequelize";
import db from "../models/index.js";
import { recordActivity } from "../utils/activityLogger.js";
import { notifyEligibleUsersAboutProduct } from "../utils/notificationService.js";

const { Product, Category } = db;

const makeSlug = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `product-${Date.now()}`;

const uniqueSlug = async (name, excludeId = null) => {
  const base = makeSlug(name);
  let slug = base;
  let counter = 2;

  while (true) {
    const where = { slug };
    if (excludeId) where.id = { [Op.ne]: excludeId };

    const existing = await Product.findOne({ where });
    if (!existing) return slug;

    slug = `${base}-${counter++}`;
  }
};

const normalizeProductInput = (body) => {
  const tags = body.tags;
  let parsedTags = tags;

  if (typeof tags === "string") {
    try {
      parsedTags = JSON.parse(tags);
    } catch {
      parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }

  if (!Array.isArray(parsedTags)) parsedTags = [];

  return {
    productCode: body.productCode?.trim(),
    name: body.name?.trim(),
    categoryId: body.categoryId,
    description: body.description?.trim() || null,
    price: body.price,
    image: body.image?.trim() || null,
    imagePublicId: body.imagePublicId?.trim() || null,
    tags: parsedTags,
    featured: body.featured === true || body.featured === "true",
    newArrival: body.newArrival === true || body.newArrival === "true",
    accessLevel: body.accessLevel || "general",
    active: body.active !== false && body.active !== "false",
    stock: Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0,
    type: body.type === "package" ? "package" : "item",
    occasion: body.occasion?.trim() || null,
    ageRange: body.ageRange?.trim() || null,
    contents: Array.isArray(body.contents)
      ? body.contents
      : typeof body.contents === "string"
        ? body.contents.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
  };
};

const validateProduct = async (input) => {
  if (!input.productCode || !input.name || !input.price || !input.categoryId) {
    return "Product code, name, price and category are required.";
  }

  if (Number(input.price) < 0) return "Price cannot be negative.";
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    return "Stock must be a whole number of 0 or more.";
  }

  if (!["general", "member", "premier"].includes(input.accessLevel)) {
    return "Invalid product access level.";
  }

  const category = await Category.findOne({
    where: { id: input.categoryId, active: true },
  });

  if (!category) return "The selected category does not exist or is inactive.";

  return null;
};

export const getAdminProducts = async (req, res) => {
  try {
    const { search, categoryId, active } = req.query;
    const where = {};

    if (search?.trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { productCode: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (active === "true" || active === "false") where.active = active === "true";

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "slug"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ products, count: products.length });
  } catch (error) {
    console.error("Admin get products error:", error);
    return res.status(500).json({ message: "Could not load products." });
  }
};



export const createProduct = async (req, res) => {
  try {
    const input = normalizeProductInput(req.body);
    const validationError = await validateProduct(input);
    if (validationError) return res.status(400).json({ message: validationError });

    const duplicate = await Product.findOne({
      where: { productCode: input.productCode },
    });
    if (duplicate) {
      return res.status(409).json({ message: "That product code already exists." });
    }

    input.slug = await uniqueSlug(input.name);

    const product = await Product.create(input);
    const created = await Product.findByPk(product.id, {
      include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
    });

    await notifyEligibleUsersAboutProduct(created);
    await recordActivity({
      userId: req.user.id,
      action: "product_created",
      entityType: "product",
      entityId: created.id,
      description: `Added product ${created.name}.`,
      metadata: { accessLevel: created.accessLevel, productCode: created.productCode },
    });

    return res.status(201).json({ message: "Product created successfully.", product: created });
  } catch (error) {
    console.error("Admin create product error:", error);
    return res.status(500).json({ message: "Could not create product." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const input = normalizeProductInput({ ...product.toJSON(), ...req.body });
    const validationError = await validateProduct(input);
    if (validationError) return res.status(400).json({ message: validationError });

    const duplicate = await Product.findOne({
      where: {
        productCode: input.productCode,
        id: { [Op.ne]: product.id },
      },
    });
    if (duplicate) return res.status(409).json({ message: "That product code already exists." });

    if (input.name !== product.name) input.slug = await uniqueSlug(input.name, product.id);
    else input.slug = product.slug;

    await product.update(input);

    const updated = await Product.findByPk(product.id, {
      include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
    });

    await recordActivity({
      userId: req.user.id,
      action: "product_updated",
      entityType: "product",
      entityId: updated.id,
      description: `Updated product ${updated.name}.`,
      metadata: { accessLevel: updated.accessLevel, productCode: updated.productCode },
    });

    return res.json({ message: "Product updated successfully.", product: updated });
  } catch (error) {
    console.error("Admin update product error:", error);
    return res.status(500).json({ message: "Could not update product." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    await product.update({ active: false });
    await recordActivity({
      userId: req.user.id,
      action: "product_archived",
      entityType: "product",
      entityId: product.id,
      description: `Archived product ${product.name}.`,
      metadata: { productCode: product.productCode },
    });
    return res.json({ message: "Product archived successfully." });
  } catch (error) {
    console.error("Admin archive product error:", error);
    return res.status(500).json({ message: "Could not archive product." });
  }
};

export const permanentlyDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    /*
     * Do not permanently delete a product that appears
     * in an order history.
     *
     * This protects historical orders from losing their
     * product relationship.
     */
    const orderItemCount = await OrderItem.count({
      where: {
        productId: product.id,
      },
    });

    if (orderItemCount > 0) {
      return res.status(409).json({
        message:
          "This product cannot be permanently deleted because it is already part of an order history. Archive it instead.",
        orderItemCount,
      });
    }

    const productName = product.name;
    const productCode = product.productCode;
    const productId = product.id;

    await product.destroy();

    await recordActivity({
      userId: req.user.id,
      action: "product_permanently_deleted",
      entityType: "product",
      entityId: productId,
      description: `Permanently deleted product ${productName}.`,
      metadata: {
        productCode,
      },
    });

    return res.json({
      message: "Product permanently deleted.",
    });
  } catch (error) {
    console.error(
      "Permanent product delete error:",
      error
    );

    return res.status(500).json({
      message:
        "Could not permanently delete the product.",
    });
  }
};

export const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { active: true },
      order: [["name", "ASC"]],
    });
    return res.json({ categories });
  } catch (error) {
    console.error("Admin get categories error:", error);
    return res.status(500).json({ message: "Could not load categories." });
  }
};
