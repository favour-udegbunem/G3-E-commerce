import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      // Frontend product ID, e.g. beauty-001
      productCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      imagePublicId: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      tags: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      newArrival: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      accessLevel: {
        type: DataTypes.ENUM(
          "general",
          "member",
          "premier"
        ),
        allowNull: false,
        defaultValue: "general",
      },

      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      // Optional storefront metadata used by G3 package/custom-box experiences.
      type: {
        type: DataTypes.ENUM("item", "package"),
        allowNull: false,
        defaultValue: "item",
      },

      occasion: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      ageRange: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      contents: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );

  return Product;
};