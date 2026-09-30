import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, LockKeyhole, MapPin, ShoppingBag, Upload, User, WalletCards } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { useTier } from "../context/TierContext";
import { createOrder, getBankTransferInfo, initializePaystack } from "../api";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user, currentTier } = useTier();
  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const grandTotal = cartTotal + deliveryFee;
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", address: "", city: "", state: "", deliveryNote: "" });
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [bankInfo, setBankInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) setFormData((p) => ({ ...p, fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(), email: user.email || "", phone: user.phone || "" }));
  }, [isAuthenticated, user]);
  useEffect(() => { getBankTransferInfo().then(setBankInfo).catch(() => setBankInfo(null)); }, []);

  const handleChange = (e) => { const { name, value } = e.target; setFormData((p) => ({ ...p, [name]: value })); if (errors[name]) setErrors((p) => ({ ...p, [name]: "" })); };
  const validate = () => { const e = {}; ["fullName","email","phone","address","city","state"].forEach((key) => { if (!formData[key].trim()) e[key] = "This field is required."; }); setErrors(e); return !Object.keys(e).length; };

  const submit = async (e) => {
    e.preventDefault(); if (!validate()) return; setSaving(true); setError("");
    try {
      const names = formData.fullName.trim().split(/\s+/); const firstName = names.shift() || user.firstName; const lastName = names.join(" ") || user.lastName;
      const result = await createOrder({
        paymentMethod,
        items: cartItems.filter((x) => !x.isWelcomeGift && Number(x.price) > 0).map((item) => ({ productId: item.id, productCode: item.productCode || item.id, quantity: item.quantity })),
        shippingAddress: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()}`,
        customerFirstName: firstName, customerLastName: lastName, customerEmail: formData.email.trim(), customerPhone: formData.phone.trim(), notes: formData.deliveryNote.trim(),
      });
      const order = result.order;
      setCreatedOrder(order);
      sessionStorage.setItem("g3-last-order", JSON.stringify({ orderReference: order.orderNumber, orderId: order.id, paymentMethod, total: Number(order.total), customer: formData }));
      if (paymentMethod === "paystack") {
        const payment = await initializePaystack(order.id);
        window.location.href = payment.authorizationUrl;
        return;
      }
      clearCart();
    } catch (err) { setError(err.message || "Could not create your order."); } finally { setSaving(false); }
  };

  const whatsappNumber = (bankInfo?.whatsappNumber || "").replace(/\D/g, "");
  const shareProof = async () => {
    if (!createdOrder) return;
    const text = `G3 STORE PAYMENT PROOF\nOrder: ${createdOrder.orderNumber}\nAmount: ₦${Number(createdOrder.total).toLocaleString()}\nPayment method: Bank transfer\nI have completed the bank transfer. My receipt is attached.`;
    try {
      if (receipt && navigator.share && navigator.canShare?.({ files: [receipt] })) { await navigator.share({ text, files: [receipt] }); return; }
    } catch {}
    if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  if (cartItems.length === 0 && !createdOrder) return <main className="bg-[#0F001C] min-h-screen"><section className="mx-auto flex min-h-[650px] max-w-7xl items-center justify-center px-4 py-16"><div className="max-w-md text-center"><ShoppingBag size={40} className="mx-auto text-g3-pink"/><h1 className="mt-7 text-3xl font-black text-white">Your G3 Box is empty</h1><Link to="/shop" className="mt-7 inline-flex rounded-full bg-g3-purple px-7 py-3.5 text-sm font-black text-white">Start Shopping</Link></div></section><Footer/></main>;
  if (!isAuthenticated && !createdOrder) return <main className="bg-[#0F001C] min-h-screen"><section className="mx-auto flex min-h-[650px] max-w-2xl items-center justify-center px-5 py-16"><div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center"><User className="mx-auto text-g3-pink" size={40}/><h1 className="mt-5 text-2xl font-black text-white">Sign in to checkout</h1><p className="mt-2 text-sm text-white/55">Your G3 account keeps your order, membership and payment status together.</p><Link to="/login" className="mt-6 inline-flex rounded-full bg-g3-purple px-7 py-3.5 text-sm font-black text-white">Sign in</Link></div></section><Footer/></main>;
  if (createdOrder && paymentMethod === "bank_transfer") return <main className="min-h-screen bg-[#0F001C] text-white"><section className="mx-auto max-w-3xl px-5 py-16 sm:px-8"><div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10"><Check className="text-green-400" size={42}/><p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-g3-pink">Bank transfer order</p><h1 className="mt-2 text-3xl font-black">Order {createdOrder.orderNumber}</h1><p className="mt-3 text-sm leading-6 text-white/55">Transfer the exact total below. Your order stays pending until G3 verifies the transfer.</p><div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/40">Bank</p><p className="mt-1 font-black">{bankInfo?.bankName || "—"}</p></div><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/40">Account name</p><p className="mt-1 font-black">{bankInfo?.accountName || "—"}</p></div><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/40">Account number</p><p className="mt-1 flex items-center gap-2 font-black">{bankInfo?.accountNumber || "—"}{bankInfo?.accountNumber&&<button onClick={()=>navigator.clipboard?.writeText(bankInfo.accountNumber)}><Copy size={14}/></button>}</p></div></div><div className="mt-5 rounded-2xl bg-g3-gold/10 p-5"><p className="text-xs font-bold text-white/45">Amount to transfer</p><p className="mt-1 text-3xl font-black">₦{Number(createdOrder.total).toLocaleString()}</p></div><p className="mt-5 text-sm leading-6 text-white/55">{bankInfo?.instructions}</p><div className="mt-7 rounded-2xl border border-white/10 p-5"><p className="font-black">Send your proof of payment</p><p className="mt-1 text-xs leading-5 text-white/45">Choose your receipt. On supported phones it can be shared directly through the WhatsApp share sheet; otherwise the WhatsApp chat opens with your order details and you can attach the receipt there.</p><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-4 text-sm font-bold"><Upload size={17}/> {receipt ? receipt.name : "Choose receipt"}<input type="file" accept="image/*,.pdf" className="hidden" onChange={(e)=>setReceipt(e.target.files?.[0]||null)}/></label><button onClick={shareProof} disabled={!receipt && !whatsappNumber} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-g3-purple px-5 py-3.5 text-sm font-black disabled:opacity-40">Show proof of payment on WhatsApp <ArrowRight size={17}/></button></div><Link to="/account/orders" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white"><ArrowLeft size={16}/> View my orders</Link></div></section><Footer/></main>;

  return <main className="min-h-screen bg-[#0F001C] text-white"><section className="border-b border-white/10 bg-white/5"><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">Checkout</p><h1 className="mt-2 text-3xl font-black">Complete your G3 Box</h1><p className="mt-2 text-sm text-white/50">Choose how you want to pay and confirm your delivery details.</p></div></section><form onSubmit={submit} className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_380px]">
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"><div className="flex items-center gap-3"><MapPin className="text-g3-pink" size={20}/><div><h2 className="font-black">Delivery details</h2><p className="text-xs text-white/40">Where should we deliver your G3 Box?</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["fullName","Full name","text"],["email","Email","email"],["phone","Phone","tel"],["address","Address","text"],["city","City","text"],["state","State","text"]].map(([name,label,type])=><label key={name} className={name==="address"?"sm:col-span-2":""}><span className="mb-2 block text-xs font-bold text-white/70">{label}</span><input required name={name} type={type} value={formData[name]} onChange={handleChange} className="h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] px-4 text-sm outline-none focus:border-g3-light-purple"/>{errors[name]&&<span className="mt-1 block text-xs text-red-300">{errors[name]}</span>}</label>)}<label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold text-white/70">Delivery note <span className="font-normal text-white/35">(optional)</span></span><textarea name="deliveryNote" value={formData.deliveryNote} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/15 bg-[#0F001C] px-4 py-3 text-sm outline-none focus:border-g3-light-purple"/></label></div></section>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"><div className="flex items-center gap-3"><WalletCards className="text-g3-pink" size={20}/><div><h2 className="font-black">Payment method</h2><p className="text-xs text-white/40">Choose Paystack or bank transfer.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setPaymentMethod("paystack")} className={`rounded-2xl border p-5 text-left ${paymentMethod==="paystack"?"border-g3-light-purple bg-g3-purple/20":"border-white/10 bg-white/5"}`}><p className="font-black">Paystack</p><p className="mt-1 text-xs leading-5 text-white/45">Secure online payment. Payment is verified automatically.</p></button><button type="button" onClick={()=>setPaymentMethod("bank_transfer")} className={`rounded-2xl border p-5 text-left ${paymentMethod==="bank_transfer"?"border-g3-gold bg-g3-gold/10":"border-white/10 bg-white/5"}`}><p className="font-black">Bank transfer</p><p className="mt-1 text-xs leading-5 text-white/45">Transfer directly and send your receipt to G3 WhatsApp.</p></button></div></section>
      {error&&<div className="rounded-2xl bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</div>}
    </div>
    <aside className="lg:sticky lg:top-6 lg:self-start"><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><div className="flex items-center justify-between"><h2 className="font-black">Your G3 Box</h2><span className="rounded-full bg-g3-light-pink px-3 py-1 text-xs font-bold text-g3-pink">{cartItems.length} items</span></div><div className="mt-5 max-h-72 space-y-4 overflow-y-auto">{cartItems.map(item=><div key={item.id} className="flex gap-3"><img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-white/40">Qty {item.quantity}</p></div><p className="text-sm font-black">₦{(Number(item.price||0)*item.quantity).toLocaleString()}</p></div>)}</div><div className="mt-5 border-t border-white/10 pt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-white/45">Subtotal</span><b>₦{cartTotal.toLocaleString()}</b></div><div className="flex justify-between"><span className="text-white/45">Delivery</span><b>₦{deliveryFee.toLocaleString()}</b></div><div className="flex justify-between border-t border-white/10 pt-4 text-lg"><span className="font-black">Total</span><b>₦{grandTotal.toLocaleString()}</b></div></div><button disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-g3-gold px-6 py-4 text-sm font-black text-[#0F001C] hover:bg-g3-pink hover:text-white disabled:opacity-50">{saving?"Processing...":paymentMethod==="paystack"?"Continue to Paystack":"Create Bank Transfer Order"}<ArrowRight size={17}/></button><div className="mt-4 flex gap-2 rounded-2xl bg-[#0F001C] p-4"><LockKeyhole size={16} className="mt-0.5 shrink-0 text-g3-gold"/><p className="text-xs leading-5 text-white/45">G3 {currentTier || "guest"} account active. Your order information is used to process your purchase.</p></div></div><Link to="/box" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white/55 hover:text-white"><ArrowLeft size={17}/> Back to G3 Box</Link></aside>
  </form><Footer/></main>;
}
export default Checkout;
