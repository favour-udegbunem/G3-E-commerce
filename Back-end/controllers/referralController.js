import db from "../models/index.js";
import { evaluateMembership } from "../utils/membershipService.js";

const { User, Referral } = db;

export const getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.findAll({
      where: { referrerUserId: req.user.id },
      include: [
        {
          model: User,
          as: "referredUser",
          attributes: ["id", "firstName", "lastName", "email", "tier", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const membership = await evaluateMembership(req.user);

    return res.json({
      referralCode: req.user.referralCode,
      referrals,
      count: referrals.filter((item) => item.status === "qualified").length,
      membership,
    });
  } catch (error) {
    console.error("Get referrals error:", error);
    return res.status(500).json({ message: "Could not load referrals." });
  }
};

export const validateReferralCode = async (req, res) => {
  try {
    const code = req.params.code?.trim().toUpperCase();
    if (!code) return res.status(400).json({ message: "Referral code is required." });

    const user = await User.findOne({ where: { referralCode: code, isActive: true } });
    if (!user) return res.status(404).json({ valid: false, message: "Referral code not found." });

    return res.json({
      valid: true,
      referrer: { firstName: user.firstName },
    });
  } catch (error) {
    console.error("Validate referral error:", error);
    return res.status(500).json({ message: "Could not validate the referral code." });
  }
};
