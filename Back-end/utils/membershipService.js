import db from "../models/index.js";

import {
  MEMBERSHIP_TIERS,
  MEMBERSHIP_CRITERIA,
  DISCOUNT_MULTIPLIERS,
} from "./membershipConfig.js";

const { Order, Referral } = db;

/**
 * Count the user's lifetime paid orders.
 */
const getPaidOrderCount = async (userId) => {
  return Order.count({
    where: {
      userId,
      paymentStatus: "paid",
    },
  });
};

/**
 * Count the user's lifetime qualified referrals.
 */
const getQualifiedReferralCount = async (userId) => {
  return Referral.count({
    where: {
      referrerUserId: userId,
      status: "qualified",
    },
  });
};

/**
 * Check whether the user has satisfied
 * all requirements for a specific tier.
 */
const qualifiesForTier = (
  tier,
  paidOrderCount,
  qualifiedReferralCount
) => {
  const criteria = MEMBERSHIP_CRITERIA[tier];

  if (!criteria) {
    return false;
  }

  return (
    paidOrderCount >= criteria.orders &&
    qualifiedReferralCount >= criteria.referrals
  );
};

/**
 * Get the user's progress toward the next tier.
 *
 * Counts are lifetime counts and are never reset.
 */
const getMembershipProgress = (
  tier,
  paidOrderCount,
  qualifiedReferralCount
) => {
  // Guest → Member
  if (tier === MEMBERSHIP_TIERS.GUEST) {
    return {
      nextTier: MEMBERSHIP_TIERS.MEMBER,

      orders: {
        current: paidOrderCount,
        required: MEMBERSHIP_CRITERIA.member.orders,
      },

      referrals: {
        current: qualifiedReferralCount,
        required: MEMBERSHIP_CRITERIA.member.referrals,
      },
    };
  }

  // Member → Premier
  if (tier === MEMBERSHIP_TIERS.MEMBER) {
    return {
      nextTier: MEMBERSHIP_TIERS.PREMIER,

      orders: {
        current: paidOrderCount,
        required: MEMBERSHIP_CRITERIA.premier.orders,
      },

      referrals: {
        current: qualifiedReferralCount,
        required: MEMBERSHIP_CRITERIA.premier.referrals,
      },
    };
  }

  // Premier has no higher tier.
  return {
    nextTier: null,

    orders: {
      current: paidOrderCount,
      required: null,
    },

    referrals: {
      current: qualifiedReferralCount,
      required: null,
    },
  };
};

/**
 * Evaluate and upgrade a user's membership tier.
 *
 * Progression:
 *
 * guest → member → premier
 *
 * Tiers never downgrade.
 * Lifetime order/referral counts never reset.
 */
export const evaluateMembership = async (user) => {
  const [paidOrderCount, qualifiedReferralCount] =
    await Promise.all([
      getPaidOrderCount(user.id),
      getQualifiedReferralCount(user.id),
    ]);

  let newTier = user.tier;

  // ------------------------------------------
  // Guest → Member
  // ------------------------------------------
  //
  // Requirements:
  // - 2 lifetime paid orders
  // - 1 qualified referral
  //
  if (
    user.tier === MEMBERSHIP_TIERS.GUEST &&
    qualifiesForTier(
      MEMBERSHIP_TIERS.MEMBER,
      paidOrderCount,
      qualifiedReferralCount
    )
  ) {
    newTier = MEMBERSHIP_TIERS.MEMBER;
  }

  // ------------------------------------------
  // Member → Premier
  // ------------------------------------------
  //
  // Requirements:
  // - 10 lifetime paid orders
  // - 5 qualified referrals
  //
  // This is intentionally checked after the
  // Member upgrade so a user who already has
  // enough lifetime activity can move directly
  // through the progression.
  //
  if (
    (user.tier === MEMBERSHIP_TIERS.MEMBER ||
      newTier === MEMBERSHIP_TIERS.MEMBER) &&
    qualifiesForTier(
      MEMBERSHIP_TIERS.PREMIER,
      paidOrderCount,
      qualifiedReferralCount
    )
  ) {
    newTier = MEMBERSHIP_TIERS.PREMIER;
  }

  // ------------------------------------------
  // Save only when the tier actually changes.
  // ------------------------------------------

  if (newTier !== user.tier) {
    user.tier = newTier;
    await user.save();
  }

  // ------------------------------------------
  // Return membership information.
  // ------------------------------------------

  return {
    tier: newTier,

    discountMultiplier:
      DISCOUNT_MULTIPLIERS[newTier],

    lifetime: {
      paidOrders: paidOrderCount,
      qualifiedReferrals: qualifiedReferralCount,
    },

    progress: getMembershipProgress(
      newTier,
      paidOrderCount,
      qualifiedReferralCount
    ),
  };
};