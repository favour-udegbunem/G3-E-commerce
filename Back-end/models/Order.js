import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      paymentStatus: {
        type: DataTypes.ENUM(
          "pending",
          "paid",
          "failed",
          "refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      paymentReference: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true,
      },

      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      discount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },

      shippingFee: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },

      total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      // Snapshot of the customer information used for this order.
      customerFirstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      customerLastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      customerEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      customerPhone: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },

      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  return Order;
};