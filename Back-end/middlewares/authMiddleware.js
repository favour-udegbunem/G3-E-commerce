import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;

const protect = async (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please log in.",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists.",
      });
    }

    // 5. Check account status
    if (!user.isActive) {
      return res.status(403).json({
        message: "This account is inactive.",
      });
    }

    // 6. Attach user to request
    req.user = user;

    // 7. Continue
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default protect;