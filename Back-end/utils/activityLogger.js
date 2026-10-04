import db from "../models/index.js";

export const recordActivity = async ({
  userId = null,
  action,
  entityType = null,
  entityId = null,
  description,
  metadata = null,
}) => {
  try {
    await db.ActivityLog.create({
      userId,
      action,
      entityType,
      entityId,
      description,
      metadata,
    });
  } catch (error) {
    // Activity logging must never break the business operation it is observing.
    console.error("Activity log error:", error.message);
  }
};
