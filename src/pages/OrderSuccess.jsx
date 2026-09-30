<<<<<<< HEAD
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Home, Package, ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { verifyPaystack } from "../api";

function OrderSuccess() {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const { cartItems, cartTotal, clearCart } = useCart();
  const [status, setStatus] = useState(reference ? "verifying" : "received");
  const [message, setMessage] = useState("");
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem("g3-last-order") || "null"); } catch { return null; } })();
  const orderReference = reference || saved?.orderReference || "G3-PENDING";
  const deliveryFee = cartItems.length ? 2500 : 0;

  useEffect(() => {
    if (!reference) return;
    verifyPaystack(reference).then((result) => {
      if (result.verified) { setStatus("paid"); clearCart(); }
      else { setStatus("failed"); setMessage("The payment has not been confirmed yet. Check your order status before trying again."); }
    }).catch((e) => { setStatus("failed"); setMessage(e.message); });
  }, [reference, clearCart]);

  return <main className="min-h-screen bg-[#0F001C] text-white"><section className="border-b border-white/10 bg-white/5"><div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8"><div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${status === "failed" ? "bg-red-500/10 text-red-300" : "bg-green-50 text-green-600"}`}>{status === "verifying"?<div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"/>:<CheckCircle2 size={42}/>}</div><p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-g3-pink">{status === "paid" ? "Payment confirmed" : status === "failed" ? "Payment needs attention" : "Order received"}</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{status === "verifying" ? "Confirming your payment..." : status === "failed" ? "We could not confirm the payment" : "Thank you for shopping with G3 Lounge!"}</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">{message || (status === "verifying" ? "Please wait while G3 verifies the Paystack transaction." : "Your order is connected to your G3 account and can be tracked from your order history.")}</p><div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-g3-light-pink px-4 py-2 text-xs font-bold text-g3-purple">Order Reference: <span className="text-g3-pink">{orderReference}</span></div></div></section><section className="mx-auto max-w-5xl px-5 py-10 sm:px-8"><div className="grid gap-6 md:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><Package className="text-g3-pink" size={23}/><h2 className="mt-4 font-black">What happens next?</h2><div className="mt-5 space-y-4 text-sm text-white/55"><p>1. Your order is stored in the G3 backend.</p><p>2. Payment status is verified and attached to the order.</p><p>3. G3 prepares and dispatches the order according to the delivery process.</p></div></div><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><ShoppingBag className="text-g3-pink" size={23}/><h2 className="mt-4 font-black">Order summary</h2><div className="mt-5 space-y-3 text-sm text-white/55"><div className="flex justify-between"><span>Items</span><span>{cartItems.length}</span></div><div className="flex justify-between"><span>Subtotal</span><span>₦{cartTotal.toLocaleString()}</span></div><div className="flex justify-between"><span>Delivery</span><span>₦{deliveryFee.toLocaleString()}</span></div></div></div></div><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/account/orders" className="inline-flex items-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black">My Orders <ArrowRight size={16}/></Link><Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-g3-gold px-6 py-3.5 text-sm font-black text-[#0F001C]">Continue Shopping</Link><Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-black"><Home size={16}/> Home</Link></div></section><Footer/></main>;
}
export default OrderSuccess;
=======
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
  UserPlus,
  Home,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useTier } from "../context/TierContext";
import Footer from "../components/Footer";

function OrderSuccess() {
  const location = useLocation();
  const { recordOrder, orders } = useTier();
  const { cartItems, cartTotal, clearCart } = useCart();

  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const savedOrder = (() => {
    try {
      const value = sessionStorage.getItem("g3-last-order");
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  })();

  const orderReference =
    location.state?.orderReference ||
    savedOrder?.orderReference ||
    "G3-PENDING";

  useEffect(() => {
    const recordedKey = sessionStorage.getItem("g3-recorded-order");

    if (orderReference && orderReference !== "G3-PENDING" && recordedKey !== orderReference) {
      recordOrder();
      sessionStorage.setItem("g3-recorded-order", orderReference);
    }
  }, [orderReference, recordOrder]);

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <main className="bg-[#0F001C]">

      {/* SUCCESS HERO */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={42} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
            Order received
          </p>

          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Thank you for shopping with G3 Lounge!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">
            Your order has been received. We’ll keep you updated
            as your G3 Box moves through the delivery process.
          </p>

          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-g3-light-pink px-4 py-2 text-xs font-bold text-g3-purple">
            Order Reference:
            <span className="text-g3-pink">
              {orderReference}
            </span>
          </div>

        </div>
      </section>

      {/* ORDER CONTENT */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* DELIVERY */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-g3-light-purple/15 text-white">
                  <Package size={21} />
                </div>

                <div>
                  <h2 className="text-base font-black text-white">
                    What happens next?
                  </h2>

                  <p className="mt-1 text-xs text-white/55">
                    Your order journey starts here.
                  </p>
                </div>

              </div>

              <div className="mt-7 space-y-5">

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-g3-purple text-xs font-black text-white">
                    1
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white/90">
                      Order received
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/55">
                      Your order details have been received by G3
                      Lounge.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-g3-light-purple text-xs font-black text-white">
                    2
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white/90">
                      Preparing your G3 Box
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/55">
                      Your items will be prepared and packaged for
                      delivery.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-g3-light-pink text-xs font-black text-g3-pink">
                    3
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white/90">
                      On the way to you
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/55">
                      Once dispatched, your order can be tracked
                      through G3 Lounge.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* MEMBERSHIP CTA */}
            <div className="overflow-hidden rounded-3xl bg-g3-purple p-6 text-white sm:p-8">

              <div className="max-w-xl">

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-g3-light-purple">
                  <UserPlus size={13} />
                  G3 Lounge Membership
                </div>

                <h2 className="mt-4 text-2xl font-black">
                  Want more from G3 Lounge?
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  Join the G3 Lounge community and get access to
                  early product drops, special promotions,
                  notifications and a better way to manage your
                  orders.
                </p>

                <Link
                  to="/join"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-g3-gold px-6 py-3.5 text-sm font-black text-[#0F001C] transition hover:bg-white/5 hover:text-white"
                >
                  Join G3 Lounge
                  <ArrowRight size={17} />
                </Link>

              </div>
            </div>

          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white">
                Order Summary
              </h2>

              <ShoppingBag
                size={20}
                className="text-g3-pink"
              />
            </div>

            {cartItems.length > 0 ? (
              <div className="mt-6 space-y-4">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xs font-bold text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-[11px] text-white/45">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-1 text-xs font-black text-white">
                        ₦
                        {(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <p className="mt-6 text-sm text-white/55">
                Your order has been successfully submitted.
              </p>
            )}

            <div className="mt-6 border-t border-white/10 pt-5">

              <div className="flex justify-between text-sm text-white/55">
                <span>Subtotal</span>
                <span>
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-white/55">
                <span>Delivery</span>
                <span>
                  ₦{deliveryFee.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm font-black text-white">
                  Total
                </span>

                <span className="text-xl font-black text-white">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>

            </div>

          </div>

        </div>

        <div className="mt-8 rounded-3xl border border-g3-light-purple/20 bg-white/5 p-6 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-g3-pink">
            G3 Lounge progress
          </p>
          <h2 className="mt-2 text-xl font-black text-white">
            Your order has been added to your Lounge journey.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/55">
            You now have {orders} completed order{orders === 1 ? "" : "s"}. Keep going to unlock your next tier.
          </p>
          <Link
            to="/tiers"
            className="mt-5 inline-flex items-center gap-2 text-sm font-black text-g3-pink hover:text-white"
          >
            View my tier progress <ArrowRight size={16} />
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            to="/shop"
            onClick={handleClearCart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-g3-purple px-7 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink sm:w-auto"
          >
            Continue Shopping
            <ShoppingBag size={17} />
          </Link>

          <Link
            to="/"
            onClick={handleClearCart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-g3-light-purple/30 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-g3-light-pink sm:w-auto"
          >
            Back Home
            <Home size={17} />
          </Link>

        </div>

      </section>

      <Footer />

    </main>
  );
}

export default OrderSuccess;
>>>>>>> 00d3d502e7d0cc5ce7ff327d094d601a32a8e35c
