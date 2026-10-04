import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  getMembership,
} from "../controllers/orderController.js";

const router = express.Router();
router.use(protect);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/membership", getMembership);
router.get("/:id", getMyOrderById);
router.post("/:id/cancel", cancelMyOrder);

export default router;
