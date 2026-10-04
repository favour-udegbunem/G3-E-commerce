import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

function isWelcomeGiftItem(item) {
  return (
    item?.isWelcomeGift === true ||
    item?.id === "welcome-g3-tshirt" ||
    item?.baseProductId === "welcome-g3-tshirt"
  );
}

function Cart() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <main className="bg-[#0F001C]">
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/45">
            <Link to="/" className="cursor-pointer transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">G3 Box</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-g3-pink text-white">
              <ShoppingBag size={23} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white sm:text-4xl">
                Your G3 Box
              </h1>
              <p className="mt-1 text-sm text-white/55">
                {cartItems.length === 0
                  ? "Your box is waiting for something special."
                  : `${cartItems.length} ${
                      cartItems.length === 1 ? "item" : "different items"
                    } in your box.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="mx-auto flex min-h-[520px] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
              <ShoppingBag size={40} />
            </div>
            <h2 className="mt-7 text-2xl font-black text-white">
              Your G3 Box is empty
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Nothing here yet. Explore G3 Lounge and find something special to
              add to your box.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-g3-purple px-7 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
            >
              Start Shopping
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="border-b border-white/10 px-5 py-5 sm:px-7">
                  <h2 className="font-black text-white">Items in your box</h2>
                </div>

                <div className="divide-y divide-white/10">
                  {cartItems.map((item) => {
                    const isGift = isWelcomeGiftItem(item);

                    return (
                      <div key={item.id} className="p-5 sm:p-7">
                        <div className="flex gap-4 sm:gap-6">
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-g3-light-pink sm:h-32 sm:w-32">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-base font-black text-white sm:text-lg">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-xs text-white/45">
                                  {isGift ? "Welcome gift · Free" : "G3 Lounge"}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/45 transition hover:bg-red-500/20 hover:text-red-400"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                              {/* Welcome gift: no + / - */}
                              {isGift ? (
                                <span className="rounded-full bg-g3-gold/20 px-4 py-2 text-xs font-bold text-g3-gold">
                                  Free gift · Qty 1
                                </span>
                              ) : (
                                <div className="flex items-center rounded-full border border-white/15">
                                  <button
                                    type="button"
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition hover:bg-g3-light-pink"
                                    aria-label={`Decrease ${item.name} quantity`}
                                  >
                                    <Minus size={15} />
                                  </button>

                                  <span className="w-8 text-center text-sm font-black text-white">
                                    {item.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => increaseQuantity(item.id)}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition hover:bg-g3-light-pink"
                                    aria-label={`Increase ${item.name} quantity`}
                                  >
                                    <Plus size={15} />
                                  </button>
                                </div>
                              )}

                              <div className="text-right">
                                <p className="text-base font-black text-white">
                                  {isGift
                                    ? "₦0"
                                    : `₦${(
                                        Number(item.price || 0) * item.quantity
                                      ).toLocaleString()}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                to="/shop"
                className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-white transition hover:text-g3-pink"
              >
                <ArrowLeft size={17} />
                Continue Shopping
              </Link>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="border-b border-white/10 px-6 py-5">
                  <h2 className="text-lg font-black text-white">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4 px-6 py-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">Items subtotal</span>
                    <span className="font-bold text-white">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">Delivery</span>
                    <span className="font-bold text-white">
                      ₦{deliveryFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-white/15 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white/55">Total</p>
                        <p className="mt-1 text-xs text-white/45">
                          Delivery included
                        </p>
                      </div>
                      <p className="text-2xl font-black text-white">
                        ₦{grandTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-g3-gold px-6 py-4 text-sm font-black text-[#0F001C] transition hover:bg-g3-pink hover:text-white"
                  >
                    Proceed to Checkout
                    <ArrowRight size={17} />
                  </Link>

                  <div className="rounded-2xl bg-g3-light-pink/50 p-4">
                    <p className="text-xs leading-5 text-white">
                      💗 You can shop as a guest. An account is required at
                      checkout so your order stays connected to your G3 Lounge
                      journey.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

export default Cart;