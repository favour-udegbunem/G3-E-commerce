import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as apiLogin, register as apiRegister } from "../api";

const TierContext = createContext(null);

export const TIER_REQUIREMENTS = {
  member: { orders: 2, referrals: 1 },
  premier: { orders: 10, referrals: 5 },
};

export const TIER_INFO = {
  guest: { label: "Guest", badge: "G3 Guest", color: "pink", benefits: ["Make orders from G3 Lounge", "Create a wishlist", "See selected new arrivals before everyone else", "Get your personal referral code"] },
  member: { label: "Member", badge: "G3 Member", color: "purple", benefits: ["Everything in Guest", "Access members-only products", "Use your personal G3 Lounge dashboard", "Create a custom Gift Box"] },
  premier: { label: "Premier", badge: "G3 Premier", color: "gold", benefits: ["Everything in Member", "Doorstep delivery benefits", "An extra gift with every order", "Access exclusive Premier products"] },
};

const getStoredUser = () => { try { return JSON.parse(localStorage.getItem("g3-user") || "null"); } catch { return null; } };
const getStoredWelcome = () => localStorage.getItem("g3-tier-welcome") || "";
const token = () => localStorage.getItem("g3-user-token") || localStorage.getItem("g3-token") || "";

function TierProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [membership, setMembership] = useState(null);
  const [welcomeTier, setWelcomeTier] = useState(getStoredWelcome);
  const [loading, setLoading] = useState(Boolean(token()));

  const applySession = (data) => {
    setUser(data.user || null);
    setMembership(data.membership || null);
    if (data.user) localStorage.setItem("g3-user", JSON.stringify(data.user));
  };

  const refreshUser = async () => {
    const t = token();
    if (!t) { setLoading(false); return null; }
    try { const data = await getMe(); applySession(data); return data; }
    catch { localStorage.removeItem("g3-user-token"); localStorage.removeItem("g3-token"); localStorage.removeItem("g3-user"); setUser(null); setMembership(null); return null; }
    finally { setLoading(false); }
  };

  useEffect(() => { refreshUser(); }, []);

  const registerUser = async (details) => {
    const data = await apiRegister(details);
    localStorage.setItem("g3-user-token", data.token);
    localStorage.removeItem("g3-token");
    applySession({ user: data.user, membership: { tier: data.user.tier, discountMultiplier: 1, lifetime: { paidOrders: 0, qualifiedReferrals: 0 }, progress: { nextTier: "member", orders: { current: 0, required: 2 }, referrals: { current: 0, required: 1 } } } });
    localStorage.setItem("g3-tier-welcome", "guest"); setWelcomeTier("guest");
    return data.user;
  };

  const loginUser = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem("g3-user-token", data.token);
    localStorage.removeItem("g3-token");
    applySession({ user: data.user });
    await refreshUser();
    return data.user;
  };

  const logout = () => { localStorage.removeItem("g3-user-token"); localStorage.removeItem("g3-token"); localStorage.removeItem("g3-user"); setUser(null); setMembership(null); localStorage.removeItem("g3-tier-welcome"); setWelcomeTier(""); };
  const claimWelcomeGift = () => localStorage.setItem("g3-welcome-gift-claimed", "true");
  const recordOrder = () => refreshUser();
  const recordReferral = () => refreshUser();
  const updateUser = (updates) => setUser((current) => { const next = current ? { ...current, ...updates } : current; if (next) localStorage.setItem("g3-user", JSON.stringify(next)); return next; });
  const setWelcome = (tier) => { localStorage.setItem("g3-tier-welcome", tier); setWelcomeTier(tier); };
  const clearWelcome = () => { localStorage.removeItem("g3-tier-welcome"); setWelcomeTier(""); };

  const isAuthenticated = Boolean(user && token());
  const currentTier = membership?.tier || user?.tier || "guest";
  const orders = membership?.lifetime?.paidOrders || 0;
  const referrals = membership?.lifetime?.qualifiedReferrals || 0;
  const discountMultiplier = membership?.discountMultiplier || (currentTier === "premier" ? 3 : currentTier === "member" ? 2 : 1);
  const memberOrdersRemaining = Math.max(0, TIER_REQUIREMENTS.member.orders - orders);
  const memberReferralsRemaining = Math.max(0, TIER_REQUIREMENTS.member.referrals - referrals);
  const premierOrdersRemaining = Math.max(0, TIER_REQUIREMENTS.premier.orders - orders);
  const premierReferralsRemaining = Math.max(0, TIER_REQUIREMENTS.premier.referrals - referrals);

  const value = useMemo(() => ({ user, isAuthenticated, loading, currentTier, tierInfo: TIER_INFO[currentTier], orders, referrals, referralCode: user?.referralCode || "", discountMultiplier, memberOrdersRemaining, memberReferralsRemaining, premierOrdersRemaining, premierReferralsRemaining, premierRequirement: TIER_REQUIREMENTS.premier, memberRequirement: TIER_REQUIREMENTS.member, membership, welcomeTier, registerUser, loginUser, logout, recordOrder, claimWelcomeGift, recordReferral, updateUser, clearWelcome, setWelcome, refreshUser }), [user, isAuthenticated, loading, currentTier, orders, referrals, discountMultiplier, membership, welcomeTier]);
  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() { const context = useContext(TierContext); if (!context) throw new Error("useTier must be used inside TierProvider"); return context; }
export default TierProvider;
