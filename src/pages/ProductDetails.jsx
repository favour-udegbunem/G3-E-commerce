import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-[#0F001C]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
            <ShoppingBag size={32} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-white">
            Product not found
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
            We couldn't find the product you're looking for.
            It may have been moved or removed.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.category === product.category
    )
    .slice(0, 5);

  const handleAddToBox = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2200);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }

    navigate("/checkout");
  };

  return (
    <main className="bg-white">

      {/* BREADCRUMB */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-white/45 transition hover:text-white"
            >
              Home
            </Link>

            <span className="text-white/40">/</span>

            <Link
              to="/shop"
              className="text-white/45 transition hover:text-white"
            >
              Shop
            </Link>

            <span className="text-white/40">/</span>

            <span className="font-semibold text-white">
              {product.name}
            </span>
          </div>
        </div>
      </section>

      {/* PRODUCT */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* IMAGE */}
          <div>
            <div className="relative overflow-hidden rounded-[2rem] bg-g3-light-pink">
              <div className="relative aspect-square">

                {/* IMAGE SKELETON */}
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-g3-light-pink" />
                )}

                {/* MAIN PRODUCT IMAGE
                    Eager because this image is above the fold. */}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  className={`h-full w-full object-cover transition-opacity duration-500 ${
                    imageLoaded
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
              </div>

              {product.newArrival && (
                <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-g3-pink px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
                  <Sparkles size={14} />
                  New Arrival
                </span>
              )}

              <button
                type="button"
                onClick={() =>
                  setLiked((current) => !current)
                }
                className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/5 shadow-lg transition ${
                  liked
                    ? "text-g3-pink"
                    : "text-white hover:text-g3-pink"
                }`}
                aria-label={
                  liked
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  fill={liked ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>

          {/* INFORMATION */}
          <div className="flex flex-col justify-center">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
              G3 Lounge
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <p className="text-2xl font-black text-white sm:text-3xl">
                ₦{product.price.toLocaleString()}
              </p>

              {product.newArrival && (
                <span className="rounded-full bg-g3-light-pink px-3 py-1 text-xs font-bold text-g3-pink">
                  Fresh in
                </span>
              )}
            </div>

            <div className="mt-7 h-px bg-white/10" />

            <p className="mt-7 text-sm leading-7 text-white/65 sm:text-base">
              {product.description ||
                "A thoughtful G3 Lounge pick selected with her everyday needs, style and experience in mind."}
            </p>

            {/* QUANTITY */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-black text-white">
                Quantity
              </p>

              <div className="flex w-fit items-center rounded-full border border-white/15">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-g3-light-pink"
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} />
                </button>

                <span className="w-10 text-center text-sm font-black text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => current + 1)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-g3-light-pink"
                  aria-label="Increase quantity"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={handleAddToBox}
                className={`flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-sm font-black transition ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-g3-purple text-white hover:bg-g3-pink"
                }`}
              >
                <ShoppingBag size={19} />

                {added
                  ? "Added to G3 Box ✓"
                  : "Add to G3 Box"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="min-h-14 rounded-full bg-g3-gold px-7 text-sm font-black text-white transition hover:bg-g3-purple"
              >
                Buy Now
              </button>
            </div>

            {/* GUEST CHECKOUT */}
            <div className="mt-5 rounded-2xl bg-g3-light-pink/50 p-4">
              <p className="text-sm font-bold text-white">
                💗 Shopping as a guest?
              </p>

              <p className="mt-1 text-xs leading-5 text-white/55">
                You can add products and shop as a guest. When you checkout,
                we'll ask you to create your free G3 Lounge account.
              </p>
            </div>

            {/* BENEFITS */}
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Truck
                  size={20}
                  className="mt-0.5 shrink-0 text-g3-pink"
                />

                <div>
                  <p className="text-xs font-black text-white">
                    Delivery
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-white/45">
                    Delivered to your location
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-g3-pink"
                />

                <div>
                  <p className="text-xs font-black text-white">
                    Secure
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-white/45">
                    Safe checkout experience
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw
                  size={20}
                  className="mt-0.5 shrink-0 text-g3-pink"
                />

                <div>
                  <p className="text-xs font-black text-white">
                    Support
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-white/45">
                    G3 Lounge customer support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS */}
      <section className="border-y border-white/10 bg-g3-light-pink/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-gold">
              Product Details
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Made for her everyday moments.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/65">
              G3 Lounge brings together thoughtful products,
              everyday essentials and special little things made
              with her in mind.
            </p>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
              You may also like
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              More from this collection
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

export default ProductDetails;