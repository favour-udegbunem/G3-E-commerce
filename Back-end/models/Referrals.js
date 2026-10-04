import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Referral = sequelize.define(
    "Referral",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      referrerUserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      referredUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },

      referralCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "qualified",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "qualified",
      },

      qualifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "referrals",
      timestamps: true,
    }
  );

  return Referral;
};