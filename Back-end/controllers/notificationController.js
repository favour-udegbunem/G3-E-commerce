import { Op } from "sequelize";
import db from "../models/index.js";

const { Notification } = db;

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 100,
    });

    return res.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ message: "Could not load notifications." });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    await notification.update({ readAt: notification.readAt || new Date() });
    return res.json({ notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ message: "Could not update the notification." });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.update(
      { readAt: new Date() },
      { where: { userId: req.user.id, readAt: { [Op.is]: null } } }
    );
    return res.json({ message: "Notifications marked as read." });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ message: "Could not update notifications." });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ message: "Notification not found." });
    return res.json({ message: "Notification removed." });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({ message: "Could not remove the notification." });
  }
};
