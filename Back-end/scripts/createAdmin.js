import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config();

const { sequelize, User } = db;

const run = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  await sequelize.authenticate();
  await sequelize.sync();

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: {
      firstName: process.env.ADMIN_FIRST_NAME?.trim() || "G3",
      lastName: process.env.ADMIN_LAST_NAME?.trim() || "Admin",
      email,
      phone: process.env.ADMIN_PHONE?.trim() || "0000000000",
      passwordHash,
      referralCode: `G3-ADMIN-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
      tier: "premier",
      role: "admin",
      isActive: true,
    },
  });

  if (user.role !== "admin") {
    user.role = "admin";
    user.passwordHash = passwordHash;
    user.isActive = true;
    await user.save();
  }

  console.log(`Admin account ready: ${user.email}`);
  await sequelize.close();
};

run().catch(async (error) => {
  console.error("Could not create admin:", error.message);
  try { await sequelize.close(); } catch {}
  process.exit(1);
});
