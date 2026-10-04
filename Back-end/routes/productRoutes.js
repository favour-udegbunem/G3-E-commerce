import express from "express";

import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getNewArrivals,
  getCategories,
} from "../controllers/productController.js";

import optionalAuth from "../middlewares/optionalAuthMiddleware.js";

const router = express.Router();

// Optional authentication:
// guests can browse,
// members can see member-only products.
router.use(optionalAuth);

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

export default router;