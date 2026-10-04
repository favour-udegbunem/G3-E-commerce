import { ArrowLeft, CalendarClock, ChevronDown, Menu, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LoungeSidebar from "../components/LoungeSidebar";
import { getMyOrders } from "../api";
import { useTier } from "../context/TierContext";
import { formatDateTime } from "../utils/date";

const statusOptions = ["All Orders", "pending", "processing", "shipped", "delivered", "cancelled"];

function Orders() {
  const { isAuthenticated } = useTier();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("All Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const data = await getMyOrders();
      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load your orders.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    load(true);
    const timer = window.setInterval(() => load(false), 10000);
    return () => window.clearInterval(timer);
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const filteredOrders = filter === "All Orders" ? orders : orders.filter((order) => order.status === filter);
  const getStatusStyle = (status) => ({
    delivered: "bg-green-50 text-green-600",
    shipped: "bg-blue-50 text-blue-600",
    processing: "bg-amber-50 text-amber-600",
    pending: "bg-purple-50 text-g3-purple",
    cancelled: "bg-red-50 text-red-600",
  }[status] || "bg-white/5 text-white/65");

  return <main className="min-h-screen bg-[#0F001C]">
    <div className="border-b border-white/10 bg-[#1A002E] lg:hidden"><div className="flex items-center justify-between px-4 py-4 sm:px-6"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">G3 Lounge</p><h1 className="mt-1 text-lg font-black text-white">My Orders</h1></div><button type="button" onClick={() => setMobileSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-g3-purple text-white" aria-label="Open dashboard menu"><Menu size={20} /></button></div></div>
    <div className="flex">
      <LoungeSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
      <section className="min-w-0 flex-1">
        <div className="border-b border-g3-light-purple/20 bg-g3-purple"><div className="mx-auto max-w-6xl px-5 pb-9 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10"><Link to="/account" className="inline-flex items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white"><ArrowLeft size={15} /> Back to Overview</Link><div className="mt-6"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-light-purple">Shopping activity</p><h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">My Orders</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/60">Keep track of your G3 purchases, deliveries and order history. Statuses stay in sync with the G3 Admin Console.</p></div></div></div>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black text-white">Order History</h2><p className="mt-1 text-xs text-white/45">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}</p></div><div className="relative"><select value={filter} onChange={(e) => setFilter(e.target.value)} className="appearance-none rounded-full border border-white/15 bg-g3-gold/15 py-3 pl-4 pr-10 text-sm font-bold text-white outline-none"><option value="All Orders">All Orders</option>{statusOptions.slice(1).map((option) => <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45" /></div></div>
          {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
          <div className="mt-6 space-y-4">
            {loading ? <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-sm font-bold text-white/45">Loading your orders...</div> : filteredOrders.length > 0 ? filteredOrders.map((order) => <article key={order.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"><div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex items-center gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink"><Package size={20} /></div><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-black text-white">{order.orderNumber}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${getStatusStyle(order.status)}`}>{order.status}</span></div><div className="mt-2 flex items-center gap-1.5 text-xs text-white/45"><CalendarClock size={13} /> {formatDateTime(order.createdAt)}</div></div></div><div className="sm:text-right"><p className="text-xs text-white/45">Total</p><p className="mt-1 text-lg font-black text-white">₦{Number(order.total || 0).toLocaleString("en-NG")}</p></div></div><div className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-g3-pink">Items</p><p className="mt-1 text-sm font-bold text-white/65">{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</p></div><span className="text-xs font-bold text-white/35">Last updated {formatDateTime(order.updatedAt)}</span></div><div className="mt-5 flex flex-wrap gap-2">{(order.items || []).map((item) => <span key={item.id} className="rounded-full bg-white/5 px-3 py-2 text-xs font-bold text-white/55">{item.productName} × {item.quantity}</span>)}</div></div></article>) : <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink"><ShoppingBag size={27} /></div><h3 className="mt-5 text-lg font-black text-white">No {filter === "All Orders" ? "orders" : filter} orders</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">Your order history will appear here as soon as you place an order.</p><Link to="/shop" className="mt-6 inline-flex rounded-full bg-g3-purple px-6 py-3 text-sm font-black text-white transition hover:bg-g3-pink">Shop G3 Lounge</Link></div>}
          </div>
        </div>
      </section>
    </div>
  </main>;
}

export default Orders;
