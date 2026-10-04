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
