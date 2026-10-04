import db from "../models/index.js";

const tierCanAccess = (userTier, accessLevel) => {
  if (accessLevel === "general") return true;
  if (accessLevel === "member") return ["member", "premier"].includes(userTier);
  if (accessLevel === "premier") return userTier === "premier";
  return false;
};

export const notifyEligibleUsersAboutProduct = async (product) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "tier"],
      where: { isActive: true },
      raw: true,
    });

    const eligible = users.filter((user) => tierCanAccess(user.tier, product.accessLevel));
    if (!eligible.length) return;

    try {
      await db.Notification.bulkCreate(
        eligible.map((user) => ({
          userId: user.id,
          type: "new_product",
          title: "New G3 product added",
          message: `${product.name} is now available in the G3 Lounge for your tier.`,
          data: {
            productId: product.id,
            productCode: product.productCode,
            accessLevel: product.accessLevel,
          },
        }))
      );
    } catch (error) {
      console.error("Product notification error:", error.message);
    }
  } catch (error) {
    console.error("Eligible user lookup error:", error.message);
  }
};

export const createUserNotification = async ({
  userId,
  type,
  title,
  message,
  data = null,
}) => {
  try {
    return await db.Notification.create({ userId, type, title, message, data });
  } catch (error) {
    console.error("Notification creation error:", error.message);
    return null;
  }
};
