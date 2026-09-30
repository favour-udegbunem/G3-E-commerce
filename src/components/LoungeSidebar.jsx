import {
  Bell,
  Crown,
  Gem,
  Sparkles,
  Gift,
  Heart,
  Home,
  LogOut,
  Package,
  Settings,
  UserRound,
  X,
  Store,
  ShoppingBag,
  Ticket,
  Star,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTier } from "../context/TierContext";

function LoungeSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentTier } = useTier();

  const overviewPath =
    currentTier === "premier"
      ? "/account/premier"
      : currentTier === "member"
        ? "/account/member"
        : "/account";

  // ——— Tier-specific navigation ———
  const guestMainLinks = [
    { label: "Overview", path: overviewPath, icon: Home },
    { label: "My Orders", path: "/account/orders", icon: Package },
    { label: "My Wishlist", path: "/wishlist", icon: Heart },
    { label: "Notifications", path: "/account/notifications", icon: Bell },
  ];

  const memberMainLinks = [
    { label: "Member Lounge", path: overviewPath, icon: Home },
    { label: "My Orders", path: "/account/orders", icon: Package },
    { label: "Custom Gift Box", path: "/account/gift-box", icon: Gift, special: true },
    { label: "Members Shop", path: "/account/shop-members", icon: ShoppingBag },
    { label: "My Wishlist", path: "/wishlist", icon: Heart },
    { label: "Notifications", path: "/account/notifications", icon: Bell },
  ];

  const premierMainLinks = [
    { label: "Premier Lounge", path: overviewPath, icon: Crown },
    { label: "My Orders", path: "/account/orders", icon: Package },
    { label: "Custom Gift Box", path: "/account/gift-box", icon: Gift, special: true },
    { label: "Premier Shop", path: "/account/shop-members", icon: ShoppingBag },
    { label: "My Wishlist", path: "/wishlist", icon: Heart },
    { label: "Notifications", path: "/account/notifications", icon: Bell },
  ];

  const mainLinks =
    currentTier === "premier"
      ? premierMainLinks
      : currentTier === "member"
        ? memberMainLinks
        : guestMainLinks;

  const tierLink = {
    label:
      currentTier === "premier"
        ? "Premier Benefits"
        : currentTier === "member"
          ? "Member Benefits"
          : "My Tier & Benefits",
    path: "/tiers",
    icon:
      currentTier === "premier"
        ? Crown
        : currentTier === "member"
          ? Gem
          : Sparkles,
  };

  const accountLinks = [
    { label: "My Profile", path: "/account/profile", icon: UserRound },
    { label: "Settings", path: "/account/settings", icon: Settings },
  ];

  // Branding by tier
  const brandStyles =
    currentTier === "premier"
      ? {
          box: "bg-gradient-to-br from-[#1A002E] to-[#2D0A4E] border border-g3-gold/20",
          label: "text-g3-gold",
          title: "text-white",
          subtitle: "text-white/50",
          titleText: "Premier Area",
          subtitleText: "Elite G3 experience.",
        }
      : currentTier === "member"
        ? {
            box: "bg-gradient-to-br from-g3-purple to-[#5B1A8E]",
            label: "text-g3-light-purple",
            title: "text-white",
            subtitle: "text-white/60",
            titleText: "Member Area",
            subtitleText: "Your upgraded G3 space.",
          }
        : {
            box: "bg-g3-purple",
            label: "text-g3-light-purple",
            title: "text-white",
            subtitle: "text-white/60",
            titleText: "Lounge Area",
            subtitleText: "Your personal G3 space.",
          };

  const activeClass =
    currentTier === "premier"
      ? "bg-g3-gold text-white shadow-md"
      : "bg-g3-purple text-white shadow-md";

  const hoverClass =
    currentTier === "premier"
      ? "hover:bg-white/10 hover:text-g3-gold"
      : "hover:bg-white/10 hover:text-white";

  const specialClass =
    currentTier === "premier"
      ? "bg-amber-50 text-g3-gold hover:bg-g3-gold hover:text-white"
      : "bg-g3-light-pink text-g3-pink hover:bg-g3-pink hover:text-white";

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const renderLink = (item) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <Link
        key={item.path + item.label}
        to={item.path}
        onClick={closeMobile}
        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
          item.special
            ? specialClass
            : active
              ? activeClass
              : `text-white/70 ${hoverClass}`
        }`}
      >
        <Icon size={19} />
        <span>{item.label}</span>
        {item.special && (
          <span
            className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-black uppercase text-white ${
              currentTier === "premier" ? "bg-g3-gold" : "bg-g3-pink"
            }`}
          >
            New
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className={`mb-5 rounded-2xl p-4 ${brandStyles.box}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${brandStyles.label}`}>
          G3 Lounge
        </p>
        <h2 className={`mt-1 text-lg font-black ${brandStyles.title}`}>
          {brandStyles.titleText}
        </h2>
        <p className={`mt-1 text-xs leading-5 ${brandStyles.subtitle}`}>
          {brandStyles.subtitleText}
        </p>
        {currentTier === "premier" && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-g3-gold/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-g3-gold">
            <Crown size={11} /> Premier
          </div>
        )}
        {currentTier === "member" && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-g3-light-purple">
            <Gem size={11} /> Member
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
          {currentTier === "premier"
            ? "Premier"
            : currentTier === "member"
              ? "Member"
              : "G3 Lounge"}
        </p>
        <nav className="space-y-1">{mainLinks.map(renderLink)}</nav>
      </div>

      <div className="mt-6">
        <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
          Account
        </p>
        <nav className="space-y-1">
          {accountLinks.map(renderLink)}
          {renderLink(tierLink)}
        </nav>
      </div>

      <div className={`${isMobile ? "mt-8" : "mt-auto"} border-t border-white/10 pt-4`}>
        <Link
          to="/shop"
          onClick={closeMobile}
          className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-white/10 hover:text-white"
        >
          <Store size={19} />
          Back to G3 Store
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-red-500/15 hover:text-red-400"
        >
          <LogOut size={19} />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 lg:block bg-[#0F001C]">
        <div className="sticky top-0 flex min-h-screen flex-col p-4">
          <SidebarContent />
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-[70] w-[290px] bg-[#0F001C] shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-5">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p
                className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                  currentTier === "premier" ? "text-g3-gold" : "text-g3-pink"
                }`}
              >
                G3 Lounge
              </p>
              <h2 className="mt-1 text-xl font-black text-white">
                {brandStyles.titleText}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeMobile}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
          <SidebarContent isMobile />
        </div>
      </aside>
    </>
  );
}

export default LoungeSidebar;
