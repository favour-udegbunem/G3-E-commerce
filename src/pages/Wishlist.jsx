import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToBox = (product) => {
    addToCart(product);
  };

  return (
    <main className="bg-[#0F001C]">
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
            Your favourites
          </p>

          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-white/55">
            Keep the things you love close until you're ready
            for your G3 Box.
          </p>
        </div>
      </section>

      {wishlistItems.length === 0 ? (
        <section className="mx-auto flex min-h-[520px] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
              <Heart size={40} />
            </div>

            <h2 className="mt-7 text-2xl font-black text-white">
              Your wishlist is empty
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Found something you love? Tap the heart and save
              it here for later.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-purple px-7 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
            >
              Explore G3 Lounge
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-center justify-between">
            <p className="text-sm font-semibold text-white/55">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1
                ? "saved item"
                : "saved items"}
            </p>

            <Link
              to="/shop"
              className="flex items-center gap-1 text-sm font-bold text-white transition hover:text-g3-pink"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-g3-light-purple hover:shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-g3-light-pink">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-g3-pink shadow-lg transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Heart
                      size={18}
                      fill="currentColor"
                    />
                  </button>
                </div>

                <div className="p-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="line-clamp-2 text-sm font-bold text-white transition hover:text-g3-pink"
                  >
                    {product.name}
                  </Link>

                  <p className="mt-2 text-base font-black text-white">
                    ₦{product.price.toLocaleString()}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAddToBox(product)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-g3-purple px-4 py-3 text-xs font-black text-white transition hover:bg-g3-pink"
                  >
                    <ShoppingBag size={15} />
                    Add to G3 Box
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

export default Wishlist;