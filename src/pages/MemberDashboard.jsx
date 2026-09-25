import {
  ArrowRight,
  Copy,
  Gift,
  Heart,
  Package,
  Share2,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";
import TierBadge from "../components/TierBadge";
import TierProgress from "../components/TierProgress";
import { useTier } from "../context/TierContext";
import { useWishlist } from "../context/WishlistContext";

function MemberDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    user,
    isAuthenticated,
    currentTier,
    orders,
    referrals,
    referralCode,
    discountMultiplier,
    memberRequirement,
    premierRequirement,
    premierOrdersRemaining,
    premierReferralsRemaining,
  } = useTier();

  const { wishlistCount } = useWishlist();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentTier === "guest") return <Navigate to="/account" replace />;
  if (currentTier === "premier") return <Navigate to="/account/premier" replace />;

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareReferral = async () => {
    const shareData = {
      title: "Join me on G3 Lounge",
      text: `Join G3 Lounge with my referral code: ${referralCode}`,
      url: `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
      return;
    }
    copyReferralCode();
  };

  return (
    <main className="min-h-screen bg-[#0F001C]">
      <div className="border-b border-white/10 bg-[#1A002E] lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-purple">
              Member
            </p>
            <h1 className="mt-0.5 text-lg font-black text-white">Your Hub</h1>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-full bg-g3-purple px-4 py-2.5 text-xs font-black text-white"
          >
            Menu
          </button>
        </div>
      </div>

      <div className="flex">
        <LoungeSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        <section className="min-w-0 flex-1">
          {/* Split hero — different from Guest full-width bar */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-g3-purple px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-g3-light-purple">
                <Sparkles size={12} /> Member Hub
              </div>
              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Hey {user.firstName},
                <br />
                you levelled up.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                Members-only products, custom gift boxes, and 2× referral rewards
                are unlocked. Next stop: Premier.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/account/shop-members"
                  className="inline-flex items-center gap-2 rounded-full bg-g3-gold/15 px-5 py-3 text-sm font-black text-white"
                >
                  Members Shop <ArrowRight size={16} />
                </Link>
                <Link
                  to="/account/gift-box"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-black text-white"
                >
                  Gift Box
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 bg-[#3A0164] px-5 py-8 sm:px-8 lg:px-10">
              <TierBadge tier="member" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-g3-light-purple">
                  Path to Premier
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {premierOrdersRemaining} order{premierOrdersRemaining !== 1 ? "s" : ""} ·{" "}
                  {premierReferralsRemaining} referral{premierReferralsRemaining !== 1 ? "s" : ""} left
                </p>
              </div>
              <Link to="/tiers" className="text-sm font-bold text-g3-gold underline-offset-2 hover:underline">
                View full requirements →
              </Link>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
            {/* Two-column body — not the Guest single column */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <Package size={18} className="text-g3-pink" />
                    <p className="mt-3 text-2xl font-black text-white">{orders}</p>
                    <p className="text-[11px] text-gray-400">Orders</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <Share2 size={18} className="text-g3-pink" />
                    <p className="mt-3 text-2xl font-black text-white">{referrals}</p>
                    <p className="text-[11px] text-gray-400">Referrals</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <Heart size={18} className="text-g3-pink" />
                    <p className="mt-3 text-2xl font-black text-white">{wishlistCount}</p>
                    <p className="text-[11px] text-gray-400">Wishlist</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="flex items-center gap-2 text-g3-purple">
                    <TrendingUp size={18} />
                    <span className="text-xs font-black uppercase tracking-wider">Progress</span>
                  </div>
                  <div className="mt-4">
                    <TierProgress
                      orders={orders}
                      referrals={referrals}
                      memberRequirement={memberRequirement}
                      premierRequirement={premierRequirement}
                      currentTier={currentTier}
                    />
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-g3-pink to-g3-purple p-6 text-white sm:p-8">
                  <Gift size={28} />
                  <h2 className="mt-4 text-2xl font-black">Custom Gift Box is yours</h2>
                  <p className="mt-2 max-w-md text-sm text-white/80">
                    Build boxes with products, packaging, and a personal note — a Member exclusive.
                  </p>
                  <Link
                    to="/account/gift-box"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-g3-gold/15 px-5 py-3 text-sm font-black text-white"
                  >
                    Open builder <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Sticky-style side column */}
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
                  <p className="text-xs font-black uppercase tracking-wider text-g3-pink">
                    Referral · 2× rewards
                  </p>
                  <p className="mt-3 break-all font-mono text-sm font-black text-white">
                    {referralCode}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={copyReferralCode}
                      className="flex flex-1 items-center justify-center cursor-pointer gap-2 rounded-full bg-g3-purple py-2.5 text-xs font-black text-white"
                    >
                      <Copy size={14} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={shareReferral}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 cursor-pointer text-g3-pink"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl bg-g3-purple p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-wider text-g3-light-purple">
                    Reward rate
                  </p>
                  <p className="mt-2 text-4xl font-black">{discountMultiplier}×</p>
                  <p className="mt-1 text-xs text-white/50">Per successful referral</p>
                </div>

                <Link
                  to="/account/shop-members"
                  className="flex items-center gap-3 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:ring-g3-purple"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-g3-purple">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Members Shop</p>
                    <p className="text-xs text-white/45">Exclusive catalogue</p>
                  </div>
                </Link>

                <Link
                  to="/account/orders"
                  className="flex items-center gap-3 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:ring-g3-purple"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-g3-purple">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">My Orders</p>
                    <p className="text-xs text-white/45">Track purchases</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default MemberDashboard;
