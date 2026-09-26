import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Gift, ShoppingBag } from "lucide-react";

import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useTier } from "../context/TierContext";

import G3Tshirt from "../assets/images/G3 t-shirt.png";

const STYLES = [
  { id: "classic-black", label: "Classic Black", note: "Bold G3 logo" },
  { id: "soft-purple", label: "Soft Purple", note: "Lounge exclusive" },
  { id: "gold-trim", label: "Gold Trim", note: "Premier feel" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function WelcomeGiftPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, claimWelcomeGift } = useTier();
  const { addToCart, cartItems } = useCart();

  const [styleId, setStyleId] = useState("classic-black");
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  const alreadyClaimed = Boolean(user?.welcomeGiftClaimed);
  const alreadyInCart = cartItems.some(
    (item) =>
      item.id === "welcome-g3-tshirt" ||
      item.baseProductId === "welcome-g3-tshirt"
  );

  const otherItemsInCart = useMemo(
    () =>
      cartItems.filter(
        (item) =>
          item.id !== "welcome-g3-tshirt" &&
          item.baseProductId !== "welcome-g3-tshirt"
      ),
    [cartItems]
  );

  const canRedeem = otherItemsInCart.length > 0;

  if (!isAuthenticated || !user) {
    return <Navigate to="/register" replace />;
  }

  if (alreadyClaimed && !alreadyInCart && !added) {
    return (
      <main className="min-h-screen bg-[#0F001C]">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <Gift className="mx-auto text-g3-gold" size={40} />
          <h1 className="mt-4 text-2xl font-black text-white">
            Welcome gift already claimed
          </h1>
          <p className="mt-2 text-sm text-white/55">
            This free Global Giant Girls T-Shirt is only available once per new
            account.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-g3-pink px-6 py-3 text-sm font-black text-white"
          >
            Continue shopping
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const selectedStyle = STYLES.find((s) => s.id === styleId);

  const handleAdd = () => {
    if (!canRedeem) return;

    addToCart({
      id: "welcome-g3-tshirt",
      baseProductId: "welcome-g3-tshirt",
      type: "item",
      name: `Global Giant Girls T-Shirt (${selectedStyle?.label} · ${size})`,
      price: 0,
      image: G3Tshirt,
      description: "Complimentary first-time G3 Lounge welcome gift.",
      isWelcomeGift: true,
      welcomeStyle: styleId,
      welcomeSize: size,
      quantity: 1,
    });

    claimWelcomeGift?.();
    setAdded(true);
    setTimeout(() => navigate("/box"), 900);
  };

  return (
    <main className="min-h-screen bg-[#0F001C]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mt-6 flex items-center gap-2 text-g3-gold">
          <Gift size={18} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            First-time welcome gift
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Global Giant Girls T-Shirt
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Free for first-time Lounge members. Choose style and size, then add it
          to your G3 Box. You must have at least one other item in your box to
          redeem this gift.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <img
              src={G3Tshirt}
              alt="Global Giant Girls T-Shirt"
              className="aspect-square w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white/40">
              Style
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setStyleId(style.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    styleId === style.id
                      ? "border-g3-gold bg-g3-gold/15 text-g3-gold"
                      : "border-white/10 bg-[#0F001C] text-white/80 hover:border-white/25"
                  }`}
                >
                  <span className="block text-sm font-black">{style.label}</span>
                  <span className="mt-1 block text-[11px] opacity-70">
                    {style.note}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-wider text-white/40">
              Size
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex h-11 w-14 items-center justify-center rounded-full text-sm font-bold transition ${
                    size === s
                      ? "bg-g3-pink text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-black text-white">₦0 · Welcome gift</p>
              <p className="mt-1 text-xs text-white/50">
                Selected: {selectedStyle?.label} · Size {size}
              </p>
              {!canRedeem && (
                <p className="mt-3 text-xs font-bold text-g3-pink">
                  Add at least one other product to your G3 Box before you can
                  redeem this free t-shirt.
                </p>
              )}
              {canRedeem && (
                <p className="mt-3 text-xs text-green-400">
                  You have other items in your box — you can redeem this gift.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!canRedeem || added || alreadyInCart}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-g3-gold px-6 py-4 text-sm font-black text-[#0F001C] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added || alreadyInCart ? (
                <>
                  <Check size={18} /> Added to G3 Box
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add free t-shirt to G3 Box
                </>
              )}
            </button>

            {!canRedeem && (
              <Link
                to="/shop"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Shop first, then claim gift
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default WelcomeGiftPage;