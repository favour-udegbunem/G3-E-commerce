import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  initializePayment,
  verifyPayment,
  handlePaystackWebhook,
  getBankTransferInfo,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/bank-transfer-info", getBankTransferInfo);
router.post("/webhook", handlePaystackWebhook);
router.post("/initialize", protect, initializePayment);
router.get("/verify/:reference", protect, verifyPayment);

export default router;
