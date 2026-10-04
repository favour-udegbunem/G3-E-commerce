import Sequelize from "sequelize";
import dbConfig from "../config/database.js";
import dotenv from "dotenv";

import UserModel from "./User.js";
import CategoryModel from "./Category.js";
import ProductModel from "./Product.js";
import OrderModel from "./Order.js";
import OrderItemModel from "./OrderItem.js";
import ReferralModel from "./Referrals.js";
import NotificationModel from "./Notification.js";
import ActivityLogModel from "./ActivityLog.js";

dotenv.config();

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize);
db.Category = CategoryModel(sequelize);
db.Product = ProductModel(sequelize);
db.Order = OrderModel(sequelize);
db.OrderItem = OrderItemModel(sequelize);
db.Referral = ReferralModel(sequelize);
db.Notification = NotificationModel(sequelize);
db.ActivityLog = ActivityLogModel(sequelize);

db.Category.hasMany(db.Product, { foreignKey: "categoryId", as: "products" });
db.Product.belongsTo(db.Category, { foreignKey: "categoryId", as: "category" });

db.User.hasMany(db.Order, { foreignKey: "userId", as: "orders" });
db.Order.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Order.hasMany(db.OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "orderId", as: "order" });

db.Product.hasMany(db.OrderItem, { foreignKey: "productId", as: "orderItems" });
db.OrderItem.belongsTo(db.Product, { foreignKey: "productId", as: "product" });

db.User.hasMany(db.Referral, { foreignKey: "referrerUserId", as: "referralsMade" });
db.User.hasOne(db.Referral, { foreignKey: "referredUserId", as: "referredBy" });
db.Referral.belongsTo(db.User, { foreignKey: "referrerUserId", as: "referrer" });
db.Referral.belongsTo(db.User, { foreignKey: "referredUserId", as: "referredUser" });

db.User.hasMany(db.Notification, { foreignKey: "userId", as: "notifications", onDelete: "CASCADE" });
db.Notification.belongsTo(db.User, { foreignKey: "userId", as: "user" });
db.User.hasMany(db.ActivityLog, { foreignKey: "userId", as: "activities", onDelete: "SET NULL" });
db.ActivityLog.belongsTo(db.User, { foreignKey: "userId", as: "user" });

export default db;
