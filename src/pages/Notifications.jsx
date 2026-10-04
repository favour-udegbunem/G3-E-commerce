import { ArrowLeft, Bell, Check, CheckCheck, Gift, Menu, Megaphone, Package, ShoppingBag, Sparkles, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoungeSidebar from "../components/LoungeSidebar";
import { deleteNotification, getMyNotifications, markAllNotificationsRead, markNotificationRead } from "../api";
import { formatDateTime } from "../utils/date";
import { useTier } from "../context/TierContext";

function Notifications() {
  const { isAuthenticated } = useTier();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (showLoader = false) => {
    try { if (showLoader) setLoading(true); const data = await getMyNotifications(); setNotifications(data.notifications || []); setError(""); }
    catch (err) { setError(err.message || "Could not load notifications."); }
    finally { if (showLoader) setLoading(false); }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    load(true);
    const timer = window.setInterval(() => load(false), 10000);
    return () => window.clearInterval(timer);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const unreadCount = notifications.filter((item) => !item.readAt).length;
  const filteredNotifications = filter === "Unread" ? notifications.filter((item) => !item.readAt) : notifications;
  const iconFor = (type) => type === "order" ? <Package size={20} /> : type === "new_product" ? <Sparkles size={20} /> : type === "gift" ? <Gift size={20} /> : type === "promotion" ? <Tag size={20} /> : <Megaphone size={20} />;
  const styleFor = (type) => type === "order" ? "bg-blue-50 text-blue-600" : type === "new_product" ? "bg-g3-light-pink text-g3-pink" : type === "promotion" ? "bg-amber-50 text-g3-gold" : "bg-g3-light-purple text-g3-purple";

  const markRead = async (id) => { try { await markNotificationRead(id); setNotifications((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item)); } catch (err) { setError(err.message); } };
  const markAll = async () => { try { await markAllNotificationsRead(); setNotifications((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() }))); } catch (err) { setError(err.message); } };
  const remove = async (id) => { try { await deleteNotification(id); setNotifications((current) => current.filter((item) => item.id !== id)); } catch (err) { setError(err.message); } };

  return <main className="min-h-screen bg-[#0F001C]">
    <div className="border-b border-white/10 bg-[#1A002E] lg:hidden"><div className="flex items-center justify-between px-4 py-4 sm:px-6"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">G3 Lounge</p><h1 className="mt-1 text-lg font-black text-white">Notifications</h1></div><button type="button" onClick={() => setMobileSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-g3-purple text-white" aria-label="Open dashboard menu"><Menu size={20} /></button></div></div>
    <div className="flex"><LoungeSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} /><section className="min-w-0 flex-1">
      <div className="border-b border-g3-light-purple/20 bg-g3-purple"><div className="mx-auto max-w-5xl px-5 pb-9 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10"><Link to="/account" className="inline-flex items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white"><ArrowLeft size={15} /> Back to Overview</Link><div className="mt-6 flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-g3-pink text-white"><Bell size={23} /></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-light-purple">Stay updated</p><h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">Notifications</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/60">Order updates, new products, promotions and G3 Lounge activity for your account.</p></div></div></div></div>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {error && <div className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-3"><h2 className="text-xl font-black text-white">Your Notifications</h2>{unreadCount > 0 && <span className="rounded-full bg-g3-pink px-2.5 py-1 text-[10px] font-black text-white">{unreadCount} new</span>}</div><p className="mt-1 text-xs text-white/45">Updates are saved to your G3 account.</p></div>{unreadCount > 0 && <button type="button" onClick={markAll} className="inline-flex w-fit items-center gap-2 text-xs font-black text-g3-pink"><CheckCheck size={16} /> Mark all as read</button>}</div>
        <div className="mt-6 flex gap-2">{["All", "Unread"].map((option) => <button key={option} type="button" onClick={() => setFilter(option)} className={`rounded-full px-5 py-2.5 text-xs font-black transition ${filter === option ? "bg-g3-purple text-white" : "bg-white text-g3-purple hover:bg-g3-light-pink"}`}>{option}</button>)}</div>
        <div className="mt-5 space-y-3">
          {loading ? <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-sm font-bold text-white/45">Loading notifications...</div> : filteredNotifications.length ? filteredNotifications.map((notification) => <article key={notification.id} className={`rounded-2xl border p-5 transition sm:p-6 ${!notification.readAt ? "border-g3-light-purple/30 bg-g3-gold/15" : "border-white/10 bg-white/5"}`}><div className="flex gap-4"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styleFor(notification.type)}`}>{iconFor(notification.type)}</div><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><h3 className="text-sm font-black text-white">{notification.title}</h3>{!notification.readAt && <span className="h-2 w-2 rounded-full bg-g3-pink" />}</div><span className="text-[10px] font-bold text-white/45">{formatDateTime(notification.createdAt)}</span></div><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{notification.message}</p><div className="mt-4 flex flex-wrap gap-3">{!notification.readAt && <button type="button" onClick={() => markRead(notification.id)} className="inline-flex items-center gap-1.5 text-[11px] font-black text-g3-pink"><Check size={14} /> Mark as read</button>}<button type="button" onClick={() => remove(notification.id)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/45 hover:text-red-500"><Trash2 size={14} /> Remove</button></div></div></div></article>) : <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink"><Bell size={27} /></div><h3 className="mt-5 text-lg font-black text-white">{filter === "Unread" ? "You're all caught up" : "No notifications yet"}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">We'll let you know when something important happens in G3 Lounge.</p></div>}
        </div>
        <div className="mt-8 rounded-3xl bg-g3-gold/15 p-6 sm:p-8"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-g3-pink"><ShoppingBag size={20} /></div><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-g3-pink">G3 Lounge</p><h3 className="mt-1 text-lg font-black text-white">Never miss a drop.</h3><p className="mt-1 max-w-xl text-sm leading-6 text-white/55">New product notices are targeted automatically using the access level chosen by the G3 Admin.</p></div></div></div>
      </div>
    </section></div>
  </main>;
}

export default Notifications;
