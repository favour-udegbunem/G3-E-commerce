import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();
router.use(protect);
router.get("/", getMyNotifications);
router.patch("/:id/read", markNotificationRead);
router.post("/read-all", markAllNotificationsRead);
router.delete("/:id", deleteNotification);

export default router;
