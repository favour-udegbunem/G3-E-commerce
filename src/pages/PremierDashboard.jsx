import {
  ArrowRight,
  Copy,
  Crown,
  Gift,
  Heart,
  Package,
  Share2,
  ShoppingBag,
  Star,
  Ticket,
  Truck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";
import TierBadge from "../components/TierBadge";
import { useTier } from "../context/TierContext";
import { useWishlist } from "../context/WishlistContext";

function PremierDashboard() {
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
  } = useTier();

  const { wishlistCount } = useWishlist();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentTier !== "premier") {
    if (currentTier === "member") return <Navigate to="/account/member" replace />;
    return <Navigate to="/account" replace />;
  }

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

  const premierCoupon = `PREMIER-${(user.firstName || "G3").slice(0, 4).toUpperCase()}`;

  return (
    <main className="min-h-screen bg-[#0F001C]">
      {/* Mobile */}
      <div className="border-b border-white/5 bg-[#1A002E] lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-gold">
              Premier
            </p>
            <h1 className="mt-0.5 text-lg font-black text-white">Command Center</h1>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-full bg-g3-gold px-4 py-2.5 text-xs font-black text-[#1A002E]"
          >
            Menu
          </button>
        </div>
      </div>

      <div className="flex">
        <LoungeSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        <section className="min-w-0 flex-1">
          {/* Compact elite top bar */}
          <div className="border-b border-white/5 bg-[#1A002E] px-5 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-g3-gold text-[#1A002E] shadow-lg shadow-amber-500/20">
                  <Crown size={26} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-gold">
                    Premier status active
                  </p>
                  <h1 className="text-2xl font-black text-white sm:text-3xl">
                    {user.firstName}&apos;s Elite Desk
                  </h1>
                </div>
              </div>
              <TierBadge tier="premier" />
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
            {/* BENTO GRID — completely different structure */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Big welcome tile */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-g3-gold to-amber-600 p-6 text-[#1A002E] md:col-span-2 lg:col-span-2 lg:row-span-2">
                <Crown className="absolute -right-4 -top-4 h-28 w-28 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest text-[#1A002E]/70">
                  Highest tier unlocked
                </p>
                <h2 className="mt-3 max-w-xs text-2xl font-black leading-tight sm:text-3xl">
                  You sit at the top of G3 Lounge.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#1A002E]/80">
                  Doorstep delivery, extra gifts, Premier coupons, and the annual
                  President of Girls meeting are all yours.
                </p>
                <Link
                  to="/account/shop-members"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A002E] px-5 py-3 text-sm font-black text-g3-gold"
                >
                  Shop Premier picks <ArrowRight size={16} />
                </Link>
              </div>

              {/* Stats tiles */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <Package className="text-g3-gold" size={22} />
                <p className="mt-4 text-3xl font-black text-white">{orders}</p>
                <p className="text-xs text-white/50">Orders</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <Share2 className="text-g3-gold" size={22} />
                <p className="mt-4 text-3xl font-black text-white">{referrals}</p>
                <p className="text-xs text-white/50">Referrals</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <Heart className="text-g3-pink" size={22} />
                <p className="mt-4 text-3xl font-black text-white">{wishlistCount}</p>
                <p className="text-xs text-white/50">Wishlist</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <Star className="text-g3-gold" size={22} />
                <p className="mt-4 text-3xl font-black text-g3-gold">{discountMultiplier}×</p>
                <p className="text-xs text-white/50">Referral boost</p>
              </div>

              {/* Coupon tile */}
              <div className="rounded-3xl border border-g3-gold/30 bg-gradient-to-br from-[#2D0A4E] to-[#1A002E] p-6 md:col-span-2">
                <div className="flex items-center gap-2 text-g3-gold">
                  <Ticket size={18} />
                  <span className="text-xs font-black uppercase tracking-wider">Your coupon</span>
                </div>
                <p className="mt-4 font-mono text-2xl font-black tracking-[0.15em] text-white">
                  {premierCoupon}
                </p>
                <p className="mt-2 text-xs text-white/40">Use at checkout for Premier savings</p>
              </div>

              {/* Referral tile */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-2">
                <p className="text-xs font-black uppercase tracking-wider text-g3-gold">
                  Invite & earn 3×
                </p>
                <div className="mt-4 flex overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <span className="flex flex-1 items-center truncate px-4 py-3 font-mono text-sm font-bold text-white">
                    {referralCode}
                  </span>
                  <button
                    type="button"
                    onClick={copyReferralCode}
                    className="bg-g3-gold px-4 text-xs font-black text-[#1A002E]"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={shareReferral}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-2.5 text-sm font-bold text-white/80 hover:bg-white/5"
                >
                  <Share2 size={16} /> Share code
                </button>
              </div>
            </div>

            {/* Horizontal benefit strip */}
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { icon: Truck, label: "Doorstep delivery" },
                { icon: Gift, label: "Extra gift / order" },
                { icon: Crown, label: "President meeting" },
                { icon: Sparkles, label: "Premier products" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <b.icon size={18} className="text-g3-gold" />
                  <span className="text-sm font-bold text-white">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Action row */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                to="/account/gift-box"
                className="flex items-center gap-4 rounded-2xl border border-g3-gold/20 bg-g3-gold/10 p-5 transition hover:bg-g3-gold/20"
              >
                <Gift className="text-g3-gold" size={24} />
                <div>
                  <p className="font-black text-white">Gift Box</p>
                  <p className="text-xs text-white/40">Build with extra gift</p>
                </div>
              </Link>
              <Link
                to="/account/shop-members"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <ShoppingBag className="text-g3-gold" size={24} />
                <div>
                  <p className="font-black text-white">Premier Shop</p>
                  <p className="text-xs text-white/40">Exclusive catalogue</p>
                </div>
              </Link>
              <Link
                to="/account/orders"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <Package className="text-g3-gold" size={24} />
                <div>
                  <p className="font-black text-white">Orders</p>
                  <p className="text-xs text-white/40">Track everything</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PremierDashboard;
