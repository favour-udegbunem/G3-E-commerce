import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token = guest
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findByPk(decoded.userId);

    if (user && user.isActive) {
      req.user = user;
    }

    return next();
  } catch (error) {
    // Invalid/expired token is treated as guest
    return next();
  }
};

export default optionalAuth;