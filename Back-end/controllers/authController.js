import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../models/index.js";
import generateToken from "../utils/generateToken.js";
import { evaluateMembership } from "../utils/membershipService.js";
import { recordActivity } from "../utils/activityLogger.js";

const { User, Referral } = db;

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      referredBy,
    } = req.body;

    // 1. Check required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // 2. Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // 3. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 4. Check if email already exists
    const existingUser = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // 5. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Generate referral code
    const referralCode = `G3-${crypto.randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase()}`;

    // 7. Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
      referralCode,
      role: "customer",
      tier: "guest",
      isActive: true,
    });

    // 8. Record the referral when a valid code was supplied.
    // Referral status starts as qualified to match the current G3 membership rules.
    if (referredBy?.trim()) {
      const referrer = await User.findOne({
        where: {
          referralCode: referredBy.trim().toUpperCase(),
          isActive: true,
        },
      });

      if (referrer && referrer.id !== user.id) {
        await Referral.create({
          referrerUserId: referrer.id,
          referredUserId: user.id,
          referralCode: referrer.referralCode,
          status: "qualified",
          qualifiedAt: new Date(),
        });
      }
    }

    await recordActivity({
      userId: user.id,
      action: "account_registered",
      entityType: "user",
      entityId: user.id,
      description: `Created G3 Lounge account for ${user.firstName} ${user.lastName}.`,
    });

    // 9. Generate JWT
    const token = generateToken(user.id);

    // 10. Return safe user information
    return res.status(201).json({
      message: "G3 Lounge account created successfully.",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
        tier: user.tier,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating your account.",
    });
  }
};


// LOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find user
    const user = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    // 4. Check account exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // 5. Check account is active
    if (!user.isActive) {
      return res.status(403).json({
        message: "This account is inactive.",
      });
    }

    // 6. Compare password
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    await recordActivity({
      userId: user.id,
      action: "account_login",
      entityType: "user",
      entityId: user.id,
      description: `${user.firstName} ${user.lastName} logged in.`,
    });

    // 7. Generate JWT
    const token = generateToken(user.id);

    // 8. Return safe user information
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
        tier: user.tier,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
};


export const getMe = async (req, res) => {
  try {
    const membership = await evaluateMembership(req.user);

    return res.status(200).json({
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        referralCode: req.user.referralCode,
        tier: req.user.tier,
        role: req.user.role,
      },
      membership,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Could not load your account." });
  }
};
