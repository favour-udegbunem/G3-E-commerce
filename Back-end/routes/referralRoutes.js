import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getMyReferrals, validateReferralCode } from "../controllers/referralController.js";

const router = express.Router();
router.get("/validate/:code", validateReferralCode);
router.get("/mine", protect, getMyReferrals);

export default router;
