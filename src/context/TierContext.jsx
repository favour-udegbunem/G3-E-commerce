// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// const TierContext = createContext(null);

// export const TIER_REQUIREMENTS = {
//   member: {
//     orders: 2,
//     referrals: 1,
//   },
//   premier: {
//     orders: 10,
//     referrals: 5,
//   },
// };

// export const TIER_INFO = {
//   guest: {
//     label: "Guest",
//     badge: "G3 Guest",
//     color: "pink",
//     benefits: [
//       "Make orders from G3 Lounge",
//       "Create a wishlist",
//       "See selected new arrivals before everyone else",
//       "Get your personal referral code",
//       "Earn 1× discount per successful referral",
//       "Enjoy G3 Black Friday benefits",
//     ],
//   },
//   member: {
//     label: "Member",
//     badge: "G3 Member",
//     color: "purple",
//     benefits: [
//       "Everything in Guest",
//       "Be among the first to see new arrivals",
//       "Access members-only products",
//       "Use your personal G3 Lounge dashboard",
//       "Create a custom Gift Box",
//       "Earn 2× discount per successful referral",
//     ],
//   },
//   premier: {
//     label: "Premier",
//     badge: "G3 Premier",
//     color: "gold",
//     benefits: [
//       "Everything in Member",
//       "Doorstep delivery benefits",
//       "An extra gift with every order",
//       "Meet the President of Girls once per year",
//       "Access exclusive Premier products",
//       "Receive a Premier coupon code",
//       "Earn 3× discount per successful referral",
//     ],
//   },
// };

// const makeReferralCode = (firstName = "G3") => {
//   const cleanName = firstName
//     .replace(/[^a-zA-Z]/g, "")
//     .slice(0, 7)
//     .toUpperCase() || "G3";

//   const suffix = Math.random()
//     .toString(36)
//     .slice(2, 6)
//     .toUpperCase();

//   return `G3-${cleanName}-${suffix}`;
// };

// function calculateTier(orders, referrals) {
//   if (
//     orders >= TIER_REQUIREMENTS.premier.orders &&
//     referrals >= TIER_REQUIREMENTS.premier.referrals
//   ) {
//     return "premier";
//   }

//   if (
//     orders >= TIER_REQUIREMENTS.member.orders &&
//     referrals >= TIER_REQUIREMENTS.member.referrals
//   ) {
//     return "member";
//   }

//   return "guest";
// }

// function getSavedUser() {
//   try {
//     const saved = localStorage.getItem("g3-user");
//     return saved ? JSON.parse(saved) : null;
//   } catch {
//     return null;
//   }
// }

// function getSavedUsers() {
//   try {
//     const saved = localStorage.getItem("g3-users");
//     return saved ? JSON.parse(saved) : [];
//   } catch {
//     return [];
//   }
// }

// function TierProvider({ children }) {
//   const [user, setUser] = useState(getSavedUser);
//   const [welcomeTier, setWelcomeTier] = useState(() =>
//     localStorage.getItem("g3-tier-welcome") || ""
//   );

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("g3-user", JSON.stringify(user));

//       const users = getSavedUsers();
//       const existingIndex = users.findIndex((item) => item.id === user.id);

//       if (existingIndex >= 0) {
//         users[existingIndex] = user;
//       } else {
//         users.push(user);
//       }

//       localStorage.setItem("g3-users", JSON.stringify(users));
//     } else {
//       localStorage.removeItem("g3-user");
//     }
//   }, [user]);

//   const isAuthenticated = Boolean(user);

//   const orders = user?.orders ?? 0;
//   const referrals = user?.referrals ?? 0;
//   const currentTier = user
//     ? calculateTier(orders, referrals)
//     : "guest";

//   const setWelcome = (tier) => {
//     localStorage.setItem("g3-tier-welcome", tier);
//     setWelcomeTier(tier);
//   };

//   const clearWelcome = () => {
//     localStorage.removeItem("g3-tier-welcome");
//     setWelcomeTier("");
//   };

//   const registerUser = (details) => {
//     const newUser = {
//       id: `demo-${Date.now()}`,
//       firstName: details.firstName.trim(),
//       lastName: details.lastName.trim(),
//       email: details.email.trim().toLowerCase(),
//       phone: details.phone.trim(),
//       orders: 0,
//       referrals: 0,
//       referralCode: makeReferralCode(details.firstName),
//       referredBy: details.referredBy?.trim() || "",
//       giftBoxes: 0,
//       createdAt: new Date().toISOString(),
//     };

//     const users = getSavedUsers();
//     const normalizedEmail = newUser.email;

//     if (users.some((item) => item.email === normalizedEmail)) {
//       return null;
//     }

//     if (newUser.referredBy) {
//       const inviterIndex = users.findIndex(
//         (item) =>
//           item.referralCode?.toLowerCase() ===
//           newUser.referredBy.toLowerCase()
//       );

//       if (inviterIndex >= 0) {
//         users[inviterIndex] = {
//           ...users[inviterIndex],
//           referrals: (users[inviterIndex].referrals ?? 0) + 1,
//       };
//       }
//     }

//     users.push(newUser);
//     localStorage.setItem("g3-users", JSON.stringify(users));
//     setUser(newUser);
//     setWelcome("guest");

//     return newUser;
//   };

//   const loginUser = (email) => {
//     const normalizedEmail = email.trim().toLowerCase();
//     const savedUsers = getSavedUsers();
//     const foundUser = savedUsers.find(
//       (item) => item.email === normalizedEmail
//     );

//     if (!foundUser) {
//       return false;
//     }

//     setUser(foundUser);
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     clearWelcome();
//   };

//   const recordOrder = () => {
//     setUser((current) => {
//       if (!current) return current;

//       return {
//         ...current,
//         orders: (current.orders ?? 0) + 1,
//       };
//     });
//   };

//   const recordReferral = () => {
//     setUser((current) => {
//       if (!current) return current;

//       return {
//         ...current,
//         referrals: (current.referrals ?? 0) + 1,
//       };
//     });
//   };

//   const updateUser = (updates) => {
//     setUser((current) =>
//       current ? { ...current, ...updates } : current
//     );
//   };

//   const memberOrdersRemaining = Math.max(
//     0,
//     TIER_REQUIREMENTS.member.orders - orders
//   );

//   const memberReferralsRemaining = Math.max(
//     0,
//     TIER_REQUIREMENTS.member.referrals - referrals
//   );

//   const premierOrdersRemaining = Math.max(
//     0,
//     TIER_REQUIREMENTS.premier.orders - orders
//   );

//   const premierReferralsRemaining = Math.max(
//     0,
//     TIER_REQUIREMENTS.premier.referrals - referrals
//   );

//   const discountMultiplier =
//     currentTier === "premier"
//       ? 3
//       : currentTier === "member"
//         ? 2
//         : 1;

//   const value = {
//     user,
//     isAuthenticated,
//     currentTier,
//     tierInfo: TIER_INFO[currentTier],
//     orders,
//     referrals,
//     referralCode: user?.referralCode || "",
//     discountMultiplier,
//     memberOrdersRemaining,
//     memberReferralsRemaining,
//     premierOrdersRemaining,
//     premierReferralsRemaining,
//     premierRequirement: TIER_REQUIREMENTS.premier,
//     memberRequirement: TIER_REQUIREMENTS.member,
//     welcomeTier,
//     registerUser,
//     loginUser,
//     logout,
//     recordOrder,
//     recordReferral,
//     updateUser,
//     clearWelcome,
//   };

//   return (
//     <TierContext.Provider value={value}>
//       {children}
//     </TierContext.Provider>
//   );
// }

// export function useTier() {
//   const context = useContext(TierContext);

//   if (!context) {
//     throw new Error("useTier must be used inside TierProvider");
//   }

//   return context;
// }

// export default TierProvider;




import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const TierContext = createContext(null);

export const TIER_REQUIREMENTS = {
  member: {
    orders: 2,
    referrals: 1,
  },
  premier: {
    orders: 10,
    referrals: 5,
  },
};

export const TIER_INFO = {
  guest: {
    label: "Guest",
    badge: "G3 Guest",
    color: "pink",
    benefits: [
      "Make orders from G3 Lounge",
      "Create a wishlist",
      "See selected new arrivals before everyone else",
      "Get your personal referral code",
      "Earn 1× discount per successful referral",
      "Enjoy G3 Black Friday benefits",
    ],
  },
  member: {
    label: "Member",
    badge: "G3 Member",
    color: "purple",
    benefits: [
      "Everything in Guest",
      "Be among the first to see new arrivals",
      "Access members-only products",
      "Use your personal G3 Lounge dashboard",
      "Create a custom Gift Box",
      "Earn 2× discount per successful referral",
    ],
  },
  premier: {
    label: "Premier",
    badge: "G3 Premier",
    color: "gold",
    benefits: [
      "Everything in Member",
      "Doorstep delivery benefits",
      "An extra gift with every order",
      "Meet the President of Girls once per year",
      "Access exclusive Premier products",
      "Receive a Premier coupon code",
      "Earn 3× discount per successful referral",
    ],
  },
};

const makeReferralCode = (firstName = "G3") => {
  const cleanName =
    firstName.replace(/[^a-zA-Z]/g, "").slice(0, 7).toUpperCase() || "G3";

  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `G3-${cleanName}-${suffix}`;
};

function calculateTier(orders, referrals) {
  if (
    orders >= TIER_REQUIREMENTS.premier.orders &&
    referrals >= TIER_REQUIREMENTS.premier.referrals
  ) {
    return "premier";
  }

  if (
    orders >= TIER_REQUIREMENTS.member.orders &&
    referrals >= TIER_REQUIREMENTS.member.referrals
  ) {
    return "member";
  }

  return "guest";
}

function getSavedUser() {
  try {
    const saved = localStorage.getItem("g3-user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function getSavedUsers() {
  try {
    const saved = localStorage.getItem("g3-users");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function TierProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [welcomeTier, setWelcomeTier] = useState(
    () => localStorage.getItem("g3-tier-welcome") || ""
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem("g3-user", JSON.stringify(user));

      const users = getSavedUsers();
      const existingIndex = users.findIndex((item) => item.id === user.id);

      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem("g3-users", JSON.stringify(users));
    } else {
      localStorage.removeItem("g3-user");
    }
  }, [user]);

  const isAuthenticated = Boolean(user);

  const orders = user?.orders ?? 0;
  const referrals = user?.referrals ?? 0;
  const currentTier = user ? calculateTier(orders, referrals) : "guest";

  const setWelcome = (tier) => {
    localStorage.setItem("g3-tier-welcome", tier);
    setWelcomeTier(tier);
  };

  const clearWelcome = () => {
    localStorage.removeItem("g3-tier-welcome");
    setWelcomeTier("");
  };

  const registerUser = (details) => {
    const newUser = {
      id: `demo-${Date.now()}`,
      firstName: details.firstName.trim(),
      lastName: details.lastName.trim(),
      email: details.email.trim().toLowerCase(),
      phone: details.phone.trim(),
      orders: 0,
      referrals: 0,
      referralCode: makeReferralCode(details.firstName),
      referredBy: details.referredBy?.trim() || "",
      giftBoxes: 0,
      createdAt: new Date().toISOString(),
      isFirstTimeUser: true,
      welcomeGiftClaimed: false,
      welcomeGift: "Global Giant Girls T-Shirt",
    };

    const users = getSavedUsers();
    const normalizedEmail = newUser.email;

    if (users.some((item) => item.email === normalizedEmail)) {
      return null;
    }

    if (newUser.referredBy) {
      const inviterIndex = users.findIndex(
        (item) =>
          item.referralCode?.toLowerCase() ===
          newUser.referredBy.toLowerCase()
      );

      if (inviterIndex >= 0) {
        users[inviterIndex] = {
          ...users[inviterIndex],
          referrals: (users[inviterIndex].referrals ?? 0) + 1,
        };
      }
    }

    users.push(newUser);
    localStorage.setItem("g3-users", JSON.stringify(users));
    setUser(newUser);
    setWelcome("guest");

    return newUser;
  };

  const loginUser = (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const savedUsers = getSavedUsers();
    const foundUser = savedUsers.find(
      (item) => item.email === normalizedEmail
    );

    if (!foundUser) {
      return false;
    }

    setUser(foundUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    clearWelcome();
  };

  const claimWelcomeGift = () => {
    setUser((current) => {
      if (!current || current.welcomeGiftClaimed) return current;
      return {
        ...current,
        welcomeGiftClaimed: true,
        isFirstTimeUser: false,
      };
    });
  };

  const recordOrder = () => {
    setUser((current) => {
      if (!current) return current;

      return {
        ...current,
        orders: (current.orders ?? 0) + 1,
      };
    });
  };

  const recordReferral = () => {
    setUser((current) => {
      if (!current) return current;

      return {
        ...current,
        referrals: (current.referrals ?? 0) + 1,
      };
    });
  };

  const updateUser = (updates) => {
    setUser((current) =>
      current ? { ...current, ...updates } : current
    );
  };

  const memberOrdersRemaining = Math.max(
    0,
    TIER_REQUIREMENTS.member.orders - orders
  );

  const memberReferralsRemaining = Math.max(
    0,
    TIER_REQUIREMENTS.member.referrals - referrals
  );

  const premierOrdersRemaining = Math.max(
    0,
    TIER_REQUIREMENTS.premier.orders - orders
  );

  const premierReferralsRemaining = Math.max(
    0,
    TIER_REQUIREMENTS.premier.referrals - referrals
  );

  const discountMultiplier =
    currentTier === "premier" ? 3 : currentTier === "member" ? 2 : 1;

  const value = {
    user,
    isAuthenticated,
    currentTier,
    tierInfo: TIER_INFO[currentTier],
    orders,
    referrals,
    referralCode: user?.referralCode || "",
    discountMultiplier,
    memberOrdersRemaining,
    memberReferralsRemaining,
    premierOrdersRemaining,
    premierReferralsRemaining,
    premierRequirement: TIER_REQUIREMENTS.premier,
    memberRequirement: TIER_REQUIREMENTS.member,
    welcomeTier,
    registerUser,
    loginUser,
    logout,
    recordOrder,
    claimWelcomeGift,
    recordReferral,
    updateUser,
    clearWelcome,
  };

  return (
    <TierContext.Provider value={value}>{children}</TierContext.Provider>
  );
}

export function useTier() {
  const context = useContext(TierContext);

  if (!context) {
    throw new Error("useTier must be used inside TierProvider");
  }

  return context;
}

export default TierProvider;