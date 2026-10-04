import express from "express";
import crypto from "crypto";
import requireAdmin from "../middlewares/adminMiddleware.js";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
} from "../controllers/adminProductController.js";
import {
  getDashboard,
  getDashboardAnalytics,
  getAdminOrders,
  updateAdminOrder,
  getAdminUsers,
  updateAdminUser,
  createCategory,
  updateCategory,
  archiveCategory,
} from "../controllers/adminController.js";

const router = express.Router();
router.use(requireAdmin);

router.get("/dashboard", getDashboard);

router.get("/cloudinary/signature", (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_PRODUCT_FOLDER || "g3-store/products";

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({ message: "Cloudinary is not configured on the server." });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");
  const signature = crypto
    .createHash("sha1")
    .update(`${signatureBase}${apiSecret}`)
    .digest("hex");

  return res.json({ cloudName, apiKey, timestamp, folder, signature });
});

router.get("/products", getAdminProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/categories", getAdminCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", archiveCategory);

router.get("/orders", getAdminOrders);
router.patch("/orders/:id", updateAdminOrder);

router.get("/users", getAdminUsers);
router.patch("/users/:id", updateAdminUser);

router.get("/dashboard/analytics", getDashboardAnalytics);

export default router;
