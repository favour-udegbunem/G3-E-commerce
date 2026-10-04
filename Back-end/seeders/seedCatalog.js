import db from "../models/index.js";

const { sequelize, Category, Product } = db;

// ==========================================
// CATEGORY DATA
// ==========================================

const categoryData = [
  {
    name: "Beauty & Self-Care",
    slug: "beauty-self-care",
    description:
      "Little things that help her feel fresh, confident and cared for.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Cute everyday pieces made to complete her look.",
  },
  {
    name: "Bags & Personal",
    slug: "bags-personal",
    description:
      "Useful everyday essentials she can carry and keep close.",
  },
  {
    name: "Stationery",
    slug: "stationery",
    description:
      "Jotters, cards and thoughtful essentials for her everyday life.",
  },
  {
    name: "Fashion & Hair",
    slug: "fashion-hair",
    description:
      "Comfortable and stylish essentials for everyday living.",
  },
  {
    name: "Period Care",
    slug: "period-care",
    description:
      "Practical essentials to help girls prepare, plan and feel comfortable.",
  },
  {
    name: "Gifts & Fun",
    slug: "gifts-fun",
    description:
      "Fun, thoughtful and memorable items for every occasion.",
  },
];

// ==========================================
// PRODUCT DATA
// ==========================================

const productData = [
  // Products go here...
];

// ==========================================
// SEED FUNCTION
// ==========================================

const seedCatalog = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ Database connected.");

    // --------------------------------------
    // Seed Categories
    // --------------------------------------

    const categoryMap = {};

    for (const category of categoryData) {
      const [createdCategory] = await Category.findOrCreate({
        where: {
          slug: category.slug,
        },
        defaults: category,
      });

      categoryMap[category.slug] = createdCategory.id;
    }

    console.log("✅ Categories seeded.");

    // --------------------------------------
    // Seed Products
    // --------------------------------------

    for (const product of productData) {
      await Product.findOrCreate({
        where: {
          productCode: product.productCode,
        },
        defaults: {
          ...product,
          categoryId: categoryMap[product.category],
        },
      });
    }

    console.log("✅ Products seeded.");
    console.log("🎉 G3 Lounge catalog seeding completed.");

    await sequelize.close();
  } catch (error) {
    console.error("❌ Catalog seeding failed:", error);

    await sequelize.close();
    process.exit(1);
  }
};

seedCatalog();