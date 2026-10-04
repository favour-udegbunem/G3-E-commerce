import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },

      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      referralCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      tier: {
        type: DataTypes.ENUM("guest", "member", "premier"),
        allowNull: false,
        defaultValue: "guest",
      },

      role: {
        type: DataTypes.ENUM("customer", "admin"),
        allowNull: false,
        defaultValue: "customer",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};