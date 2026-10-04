import db from "../models/index.js";
import { Op } from "sequelize";
import { getUserAccessLevels } from "../utils/productAccess.js";

const { Product, Category } = db;

// ==========================================
// GET /api/v1/products
// ==========================================

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const where = {
      active: true,
    };

    // --------------------------------------
    // Guest/member access
    // --------------------------------------
    //
    // Guest:
    //   memberOnly must be false
    //
    // Member:
    //   can see both public and member products
    //
    where.accessLevel = {
      [Op.in]: getUserAccessLevels(req.user),
    };

    // --------------------------------------
    // Category filter
    // --------------------------------------

    if (category) {
      const categoryRecord = await Category.findOne({
        where: {
          slug: category.trim().toLowerCase(),
          active: true,
        },
      });

      if (!categoryRecord) {
        return res.status(200).json({
          products: [],
          count: 0,
        });
      }

      where.categoryId = categoryRecord.id;
    }

    // --------------------------------------
    // Search
    // --------------------------------------

    if (search && search.trim()) {
      where.name = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    // --------------------------------------
    // Fetch products
    // --------------------------------------

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching products.",
    });
  }
};

// ==========================================
// GET /api/v1/products/:id
// ==========================================

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const where = {
      active: true,
      [Op.or]: [
        { id },
        { productCode: id },
      ],
    };

    // Guests cannot access member-only products
    where.accessLevel = {
      [Op.in]: getUserAccessLevels(req.user),
    };

    const product = await Product.findOne({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching the product.",
    });
  }
};

// ==========================================
// GET /api/v1/products/featured
// ==========================================

export const getFeaturedProducts = async (req, res) => {
  try {
    const where = {
      active: true,
      featured: true,
    };

    where.accessLevel = {
      [Op.in]: getUserAccessLevels(req.user),
    };

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get featured products error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching featured products.",
    });
  }
};

// ==========================================
// GET /api/v1/products/new-arrivals
// ==========================================

export const getNewArrivals = async (req, res) => {
  try {
    const where = {
      active: true,
      newArrival: true,
    };

    where.accessLevel = {
      [Op.in]: getUserAccessLevels(req.user),
    };

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get new arrivals error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching new arrivals.",
    });
  }
};

// ==========================================
// GET /api/v1/products/categories
// ==========================================

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        active: true,
      },
      attributes: [
        "id",
        "name",
        "slug",
        "description",
      ],
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching categories.",
    });
  }
};