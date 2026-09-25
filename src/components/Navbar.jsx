import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Package,
  ShoppingBag,
  Heart,
  Menu,
  X,
  UserPlus,
  LogIn,
} from "lucide-react";

import Logo from "../assets/Logo.png";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTier } from "../context/TierContext";
import TierBadge from "./TierBadge";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, currentTier, user } = useTier();

  return (
    <header className="sticky top-0 z-50 border-b border-g3-gold/15 bg-[#0F001C]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* MAIN NAVBAR */}
        <div className="flex min-h-[100px] items-center gap-4">

          {/* LOGO */}
          <Link
            to="/"
            className="shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={Logo}
              alt="G3 Lounge"
              className="h-24 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP ACTIONS */}
          <div className="ml-auto hidden items-center gap-2 md:flex">

            {/* ACCOUNT / JOIN */}
            {isAuthenticated ? (
              <Link
                to="/account"
                className="flex min-h-14 items-center gap-3 rounded-full px-3 text-white/85 transition hover:bg-white/10"
                title={`Signed in as ${user?.firstName || "G3 Guest"}`}
              >
                <TierBadge tier={currentTier} />
              </Link>
            ) : (
              <>
                {/* GUEST BADGE */}
                <Link
                  to="/register"
                  title="You are currently a G3 Guest"
                  className="flex min-h-14 items-center"
                >
                  <TierBadge tier="guest" />
                </Link>

                {/* JOIN */}
                <Link
                  to="/register"
                  className="flex h-12 items-center gap-2 rounded-full bg-g3-gold px-5 text-sm font-black text-[#0F001C] transition hover:bg-white"
                >
                  <UserPlus size={18} />
                  <span>Join G3 Lounge</span>
                </Link>
              </>
            )}

            {/* ORDERS */}
            <Link
              to={isAuthenticated ? "/account/orders" : "/login"}
              className="flex h-12 items-center gap-2 rounded-full px-3 text-white/85 transition hover:bg-white/10"
              aria-label="Orders"
            >
              <Package size={21} />

              <span className="hidden text-sm font-semibold xl:block">
                Orders
              </span>
            </Link>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="relative flex h-12 items-center gap-2 rounded-full px-3 text-white/85 transition hover:bg-white/10"
              aria-label="Wishlist"
            >
              <Heart
                size={21}
                className={
                  wishlistCount > 0
                    ? "text-g3-pink"
                    : ""
                }
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />

              <span className="hidden text-sm font-semibold xl:block">
                Wishlist
              </span>

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-g3-pink px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* G3 BOX */}
            <Link
              to="/box"
              className="relative flex h-12 items-center gap-2 rounded-full px-3 text-white/85 transition hover:bg-white/10"
              aria-label="G3 Box"
            >
              <ShoppingBag size={21} />

              <span className="hidden text-sm font-semibold xl:block">
                G3 Box
              </span>

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-g3-gold px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* SHOP NOW */}
            <Link
              to="/shop"
              className="ml-2 rounded-full bg-g3-gold px-6 py-3 text-sm font-black text-[#fff] transition hover:-translate-y-0.5 hover:bg-g3-pink"
            >
              Shop Now
            </Link>

          </div>

          {/* MOBILE ACTIONS */}
          <div className="ml-auto flex items-center gap-1 md:hidden">

            {/* MOBILE ACCOUNT */}
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10"
              aria-label="Log in"
            >
              <UserPlus size={21} />
            </Link>

            {/* MOBILE WISHLIST */}
            <Link
              to="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10"
              aria-label="Wishlist"
            >
              <Heart
                size={21}
                className={
                  wishlistCount > 0
                    ? "text-g3-pink"
                    : ""
                }
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-g3-pink px-1 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* MOBILE G3 BOX */}
            <Link
              to="/box"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10"
              aria-label="G3 Box"
            >
              <ShoppingBag size={21} />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-g3-gold px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() =>
                setMenuOpen((previous) => !previous)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {menuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

          </div>
        </div>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-g3-gold/15 bg-[#0F001C] px-5 py-5 md:hidden">

          <div className="flex flex-col gap-2">

            {/* JOIN G3 LOUNGE */}
            <Link
              to="/join"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-g3-pink px-5 py-3.5 text-sm font-black text-white transition hover:bg-g3-purple"
            >
              <UserPlus size={18} />
              Join G3 Lounge
            </Link>

            {/* LOG IN */}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-g3-purple/10 px-5 py-3.5 text-sm font-bold text-g3-purple transition hover:bg-g3-light-purple/10"
            >
              <LogIn size={18} />
              Log In
            </Link>

            {/* SHOP EVERYTHING */}
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-g3-purple px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-g3-pink"
            >
              Shop Everything
            </Link>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-g3-purple transition hover:bg-g3-light-purple/10"
            >
              <span className="flex items-center gap-3">
                <Heart
                  size={19}
                  className={
                    wishlistCount > 0
                      ? "text-g3-pink"
                      : ""
                  }
                  fill={
                    wishlistCount > 0
                      ? "currentColor"
                      : "none"
                  }
                />

                My Wishlist
              </span>

              {wishlistCount > 0 && (
                <span className="rounded-full bg-g3-pink px-2 py-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* G3 BOX */}
            <Link
              to="/box"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-g3-purple transition hover:bg-g3-light-purple/10"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag size={19} />
                My G3 Box
              </span>

              {cartCount > 0 && (
                <span className="rounded-full bg-g3-gold px-2 py-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ORDERS */}
            <Link
              to={
                isAuthenticated
                  ? "/account/orders"
                  : "/login"
              }
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-g3-purple transition hover:bg-g3-light-purple/10"
            >
              <Package size={19} />
              My Orders
            </Link>

          </div>
        </div>
      )}

    </header>
  );
}

export default Navbar;