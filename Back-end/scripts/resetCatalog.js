import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config();

const { sequelize, Product, OrderItem } = db;

const run = async () => {
  if (process.env.CONFIRM_RESET_CATALOG !== "YES") {
    throw new Error("Set CONFIRM_RESET_CATALOG=YES to permanently remove the current product catalogue.");
  }

  await sequelize.authenticate();

  const orderItemCount = await OrderItem.count();
  if (orderItemCount > 0) {
    throw new Error("The catalogue cannot be wiped because order history already references products. Archive the products instead so order history remains intact.");
  }

  const deleted = await Product.destroy({ where: {}, force: true });
  console.log(`🧹 Removed ${deleted} products. The catalogue is ready for fresh products from Admin.`);
  await sequelize.close();
};

run().catch(async (error) => {
  console.error("❌ Catalogue reset failed:", error.message);
  try { await sequelize.close(); } catch {}
  process.exit(1);
});
