import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Boxes, CircleDollarSign, Clock3, ShoppingBag, Users } from "lucide-react";
import { getAdminDashboard } from "./adminApi";
import AdminDateRange from "./AdminDateRange";
import AdminLineChart from "./AdminLineChart";
import { formatDateTime } from "../utils/date";

const money = (v) => `₦${Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (days) => { const date = new Date(); date.setDate(date.getDate() - days); return date.toISOString().slice(0, 10); };

function AdminDashboard() {
  const [startDate, setStartDate] = useState(daysAgo(29));
  const [endDate, setEndDate] = useState(today());
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setData(await getAdminDashboard({ startDate, endDate }));
    } catch (e) {
      setError(e.message || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cards = data ? [
    ["Revenue", money(data.stats?.paidRevenue), CircleDollarSign],
    ["Lost order value", money(data.stats?.losses), CircleDollarSign],
    ["Orders", data.stats?.orders || 0, ShoppingBag],
    ["Customers", data.stats?.users || 0, Users],
    ["Active products", data.stats?.activeProducts || 0, Boxes],
    ["Pending orders", data.stats?.pendingOrders || 0, Clock3],
    ["Low stock", data.stats?.lowStock || 0, AlertTriangle],
    ["Activities", data.stats?.activities || 0, Activity],
  ] : [];

  if (loading && !data) return <div className="p-6 lg:p-10"><div className="rounded-3xl bg-white p-12 text-center font-bold text-black/45">Loading your dashboard...</div></div>;
  if (error && !data) return <div className="p-6 lg:p-10"><div className="rounded-3xl bg-red-50 p-8 font-bold text-red-700">{error}</div></div>;

  return (
    <div className="p-5 sm:p-7 lg:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">Overview</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Good day, Admin.</h1><p className="mt-2 text-sm text-black/45">Your G3 Store performance at a glance.</p></div>
        <button onClick={load} className="w-fit rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-black hover:bg-black/5">Refresh data</button>
      </div>

      <div className="mt-7"><AdminDateRange {...{ startDate, endDate, setStartDate, setEndDate, onApply: load, loading }} /></div>

      {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => <div key={label} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-bold text-black/45">{label}</span><Icon size={19} className="text-g3-purple" /></div><p className="mt-3 text-2xl font-black sm:text-3xl">{value}</p></div>)}
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-2">
        <AdminLineChart data={data?.revenueTrend || []} dataKey="revenue" title="Revenue trend" subtitle={`${data?.dateRange?.startDate} → ${data?.dateRange?.endDate}`} />
        <AdminLineChart data={data?.orderTrend || []} dataKey="orders" title="Order volume" subtitle="Orders received per day" format={(v) => `${Number(v).toLocaleString()} orders`} />
        <AdminLineChart data={data?.lossTrend || []} dataKey="losses" title="Losses / lost order value" subtitle="Cancelled or refunded order value" />
        <AdminLineChart data={data?.activityTrend || []} dataKey="activities" title="Application activity" subtitle="Recorded business activities" format={(v) => `${Number(v).toLocaleString()} activities`} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><h3 className="font-black">Top products</h3><div className="mt-4 divide-y divide-black/5">{(data?.topProducts || []).length ? data.topProducts.map((p, i) => <div key={p.productName} className="flex items-center justify-between gap-4 py-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-g3-light-pink text-xs font-black text-g3-purple">{i + 1}</span><span className="truncate text-sm font-bold">{p.productName}</span></div><div className="shrink-0 text-right"><p className="text-sm font-black">{p.quantity} sold</p><p className="text-[11px] text-black/40">{money(p.revenue)}</p></div></div>) : <p className="py-8 text-sm text-black/40">No paid order data yet.</p>}</div></div>
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><h3 className="font-black">Membership mix</h3><div className="mt-5 space-y-4">{(data?.tierBreakdown || []).map((x) => <div key={x.tier}><div className="flex justify-between text-xs font-bold"><span className="capitalize">{x.tier}</span><span>{x.count}</span></div><div className="mt-2 h-2 rounded-full bg-black/5"><div className="h-2 rounded-full bg-g3-purple" style={{ width: `${Math.min(100, (x.count / Math.max(data?.stats?.users || 1, 1)) * 100)}%` }} /></div></div>)}</div></div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-black">Low stock</h3><span className="text-xs font-bold text-black/40">5 units or fewer</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{(data?.lowStockProducts || []).map((p) => <div key={p.id} className="rounded-2xl bg-[#f8f6fb] p-4"><p className="truncate text-sm font-black">{p.name}</p><p className="mt-1 text-xs font-bold text-orange-600">{p.stock} left</p></div>)}{!data?.lowStockProducts?.length && <p className="py-4 text-sm text-black/40">No low-stock products.</p>}</div></div>
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-black">Recent activities</h3><span className="text-xs font-bold text-black/40">Date & time recorded</span></div><div className="mt-4 divide-y divide-black/5">{(data?.recentActivities || []).slice(0, 10).map((activity) => <div key={activity.id} className="py-3"><div className="flex items-start justify-between gap-4"><p className="text-sm font-bold">{activity.description}</p><time className="shrink-0 text-[10px] font-bold text-black/35">{formatDateTime(activity.createdAt)}</time></div><p className="mt-1 text-[11px] text-black/40">{activity.action.replaceAll("_", " ")}</p></div>)}{!data?.recentActivities?.length && <p className="py-8 text-sm text-black/40">No activities recorded for this period.</p>}</div></div>
      </div>
    </div>
  );
}

export default AdminDashboard;
