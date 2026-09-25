import {
  ArrowRight,
  Copy,
  Crown,
  Gift,
  Heart,
  Package,
  Share2,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";
import TierBadge from "../components/TierBadge";
import TierProgress from "../components/TierProgress";
import { useTier } from "../context/TierContext";
import { useWishlist } from "../context/WishlistContext";

function Account() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    user,
    isAuthenticated,
    currentTier,
    tierInfo,
    orders,
    referrals,
    referralCode,
    discountMultiplier,
    memberRequirement,
    premierRequirement,
  } = useTier();

  const { wishlistCount } = useWishlist();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Auto-redirect Members and Premier to their dedicated dashboards
  if (currentTier === "member") {
    return <Navigate to="/account/member" replace />;
  }

  if (currentTier === "premier") {
    return <Navigate to="/account/premier" replace />;
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

  return (
    <main className="min-h-screen bg-[#0F001C]">
      <div className="border-b border-white/10 bg-[#1A002E] lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">
              G3 Lounge
            </p>
            <h1 className="mt-1 text-lg font-black text-white">
              My Account
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 rounded-full bg-g3-purple px-4 py-2.5 text-xs font-black text-white transition hover:bg-g3-pink"
          >
            Menu
          </button>
        </div>
      </div>

      <div className="flex">
        <LoungeSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        <section className="min-w-0 flex-1">
          <div className="border-b border-g3-light-purple/20 bg-g3-purple">
            <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-8 sm:pb-11 sm:pt-10 lg:px-10 lg:pt-11">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-light-purple">
                    Welcome to your lounge
                  </p>
                  <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                    Welcome back, {user.firstName} 👋
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                    Everything you need to manage your G3 Lounge experience is
                    right here.
                  </p>
                </div>
                <TierBadge tier={currentTier} />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-g3-purple">
                    <Package size={21} />
                  </div>
                  <span className="text-xs font-bold text-gray-400">Orders</span>
                </div>
                <p className="mt-5 text-3xl font-black text-white">{orders}</p>
                <p className="mt-1 text-xs text-white/45">Completed orders</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                    <Share2 size={21} />
                  </div>
                  <span className="text-xs font-bold text-gray-400">Referrals</span>
                </div>
                <p className="mt-5 text-3xl font-black text-white">{referrals}</p>
                <p className="mt-1 text-xs text-white/45">Successful referrals</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                    <Heart size={21} />
                  </div>
                  <span className="text-xs font-bold text-gray-400">Wishlist</span>
                </div>
                <p className="mt-5 text-3xl font-black text-white">{wishlistCount}</p>
                <p className="mt-1 text-xs text-white/45">Saved products</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-g3-gold">
                    <Crown size={21} />
                  </div>
                  <span className="text-xs font-bold text-gray-400">Referral reward</span>
                </div>
                <p className="mt-5 text-3xl font-black text-white">{discountMultiplier}×</p>
                <p className="mt-1 text-xs text-white/45">Discount per referral</p>
              </div>
            </div>

            <div className="mt-8">
              <TierProgress
                orders={orders}
                referrals={referrals}
                memberRequirement={memberRequirement}
                premierRequirement={premierRequirement}
                currentTier={currentTier}
              />
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl bg-g3-purple p-7 text-white sm:p-9">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <TierBadge tier={currentTier} />
                  <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                    {tierInfo.label} benefits are active.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                    You currently earn {discountMultiplier}× discount per
                    successful referral. Keep building your G3 journey to
                    unlock more benefits.
                  </p>
                </div>
                <Link
                  to="/tiers"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-g3-gold px-6 py-3.5 text-sm font-black text-white hover:bg-g3-pink"
                >
                  Explore Benefits <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-g3-pink">
                    Your referral code
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Invite someone to G3 Lounge
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                    Share your code with friends. When your referrals are
                    successfully confirmed by G3, they count toward your next
                    tier.
                  </p>
                </div>

                <div className="w-full max-w-md">
                  <div className="flex overflow-hidden rounded-2xl border border-white/15 bg-black/30">
                    <div className="flex min-w-0 flex-1 items-center px-4 py-4">
                      <span className="truncate text-sm font-black tracking-wider text-white">
                        {referralCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={copyReferralCode}
                      className="flex items-center gap-2 bg-g3-purple px-5 text-xs font-black text-white hover:bg-g3-pink"
                    >
                      <Copy size={15} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={shareReferral}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-g3-light-purple/30 px-5 py-3 text-sm font-black text-white hover:bg-g3-light-pink"
                  >
                    <Share2 size={17} /> Share My Referral
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl bg-g3-light-pink">
              <div className="grid items-center lg:grid-cols-[1.4fr_0.6fr]">
                <div className="p-7 sm:p-9 lg:p-11">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-g3-pink">
                    <Gift size={13} />
                    {currentTier === "guest" ? "Member Exclusive" : "Unlocked for you"}
                  </div>
                  <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight text-g3-purple sm:text-4xl">
                    Create a gift box they'll remember.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">
                    Build a thoughtful custom G3 Box with products, an occasion,
                    packaging and your personal message.
                  </p>
                  {currentTier === "member" || currentTier === "premier" ? (
                    <Link
                      to="/account/gift-box"
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
                    >
                      Create Gift Box <ArrowRight size={17} />
                    </Link>
                  ) : (
                    <Link
                      to="/tiers"
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
                    >
                      Unlock as a Member <ArrowRight size={17} />
                    </Link>
                  )}
                </div>

                <div className="hidden min-h-[280px] items-center justify-center bg-g3-pink/10 lg:flex">
                  <div className="flex h-36 w-36 rotate-3 items-center justify-center rounded-[2rem] bg-white shadow-xl">
                    <Gift size={58} className="text-g3-pink" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-pink">
                    Shopping activity
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Your G3 journey
                  </h2>
                </div>
                <Link
                  to="/account/orders"
                  className="hidden items-center gap-1 text-sm font-bold text-white transition hover:text-g3-pink sm:flex"
                >
                  View Orders <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-g3-purple text-white">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">
                        {orders === 0 ? "Your first order is waiting." : `${orders} order${orders === 1 ? "" : "s"} completed`}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/50">
                        Every completed order contributes to your tier journey.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-g3-purple px-6 py-3 text-sm font-black text-white hover:bg-g3-pink"
                  >
                    Continue Shopping <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-g3-purple text-white">
                    <UserRound size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="mt-1 text-xs text-white/45">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/account/profile"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-g3-pink"
                >
                  Manage Profile <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Account;
