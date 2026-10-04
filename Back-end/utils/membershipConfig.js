export const MEMBERSHIP_TIERS = {
  GUEST: "guest",
  MEMBER: "member",
  PREMIER: "premier",
};

export const MEMBERSHIP_CRITERIA = {
  member: {
    orders: 2,
    referrals: 1,
  },

  premier: {
    orders: 10,
    referrals: 5,
  },
};

export const DISCOUNT_MULTIPLIERS = {
  guest: 1,
  member: 2,
  premier: 3,
};