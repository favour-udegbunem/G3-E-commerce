import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { runDatabaseMigrations } from "./utils/databaseMigrations.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed."));
    },
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buffer) => {
      req.rawBody = Buffer.from(buffer);
    },
  })
);

app.get("/", (_req, res) => {
  res.json({
    name: "G3 Lounge Backend",
    status: "ok",
    version: "1.0.0",
  });
});

app.get("/health", async (_req, res) => {
  try {
    await db.sequelize.authenticate();
    return res.json({ status: "ok", database: "connected" });
  } catch {
    return res.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/referrals", referralRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, _req, res, _next) => {
  console.error("Unhandled server error:", error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Connected to MySQL successfully!");

    await runDatabaseMigrations(db.sequelize, db.Sequelize);
    console.log("🚀 Database is ready");

    app.listen(PORT, () => {
      console.log(`🔥 G3 Lounge Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
