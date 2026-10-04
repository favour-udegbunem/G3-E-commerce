import protect from "./authMiddleware.js";

const requireAdmin = async (req, res, next) => {
  await protect(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access is required.",
      });
    }

    next();
  });
};

export default requireAdmin;
