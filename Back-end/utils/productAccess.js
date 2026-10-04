const PRODUCT_ACCESS_LEVELS = {
  GENERAL: "general",
  MEMBER: "member",
  PREMIER: "premier",
};

const getUserAccessLevels = (user) => {
  // No logged-in user = guest access
  if (!user) {
    return [PRODUCT_ACCESS_LEVELS.GENERAL];
  }

  switch (user.tier) {
    case "premier":
      return [
        PRODUCT_ACCESS_LEVELS.GENERAL,
        PRODUCT_ACCESS_LEVELS.MEMBER,
        PRODUCT_ACCESS_LEVELS.PREMIER,
      ];

    case "member":
      return [
        PRODUCT_ACCESS_LEVELS.GENERAL,
        PRODUCT_ACCESS_LEVELS.MEMBER,
      ];

    case "guest":
    default:
      return [PRODUCT_ACCESS_LEVELS.GENERAL];
  }
};

export {
  PRODUCT_ACCESS_LEVELS,
  getUserAccessLevels,
};