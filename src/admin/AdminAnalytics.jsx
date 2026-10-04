import { useEffect, useState } from "react";
import { Activity, CircleDollarSign, ShoppingBag } from "lucide-react";
import { getAdminDashboardAnalytics } from "./adminApi";
import AdminDateRange from "./AdminDateRange";
import AdminLineChart from "./AdminLineChart";
import { formatDateTime } from "../utils/date";

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (days) => { const date = new Date(); date.setDate(date.getDate() - days); return date.toISOString().slice(0, 10); };
const money = (v) => `₦${Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

function AdminAnalytics() {
  const [startDate, setStartDate] = useState(daysAgo(179));
  const [endDate, setEndDate] = useState(today());
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { setLoading(true); setError(""); setData(await getAdminDashboardAnalytics({ startDate, endDate })); }
    catch (e) { setError(e.message || "Could not load analytics."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading && !data) return <div className="p-6 lg:p-10"><div className="rounded-3xl bg-white p-12 text-center font-bold text-black/45">Loading analytics...</div></div>;
  if (error && !data) return <div className="p-6 lg:p-10"><div className="rounded-3xl bg-red-50 p-8 font-bold text-red-700">{error}</div></div>;

  const totals = data?.totals || {};
  const cards = [
    ["Revenue", money(totals.revenue), CircleDollarSign],
    ["Lost order value", money(totals.losses), CircleDollarSign],
    ["Orders", totals.orders || 0, ShoppingBag],
    ["Activities", totals.activities || 0, Activity],
  ];

  return <div className="p-5 sm:p-7 lg:p-10">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">Analytics</p>
    <h1 className="mt-2 text-3xl font-black sm:text-4xl">G3 performance analytics</h1>
    <p className="mt-2 text-sm text-black/45">Choose any day or date range and map orders, revenue, losses and recorded activity.</p>

    <div className="mt-7"><AdminDateRange {...{ startDate, endDate, setStartDate, setEndDate, onApply: load, loading }} /></div>
    {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon]) => <div key={label} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-bold text-black/45">{label}</span><Icon size={19} className="text-g3-purple" /></div><p className="mt-3 text-3xl font-black">{value}</p></div>)}</div>

    <div className="mt-7 grid gap-5 xl:grid-cols-2">
      <AdminLineChart data={data?.analytics?.revenue || []} dataKey="revenue" title="Revenue" />
      <AdminLineChart data={data?.analytics?.orders || []} dataKey="orders" title="Orders received" format={(v) => `${Number(v).toLocaleString()} orders`} />
      <AdminLineChart data={data?.analytics?.losses || []} dataKey="losses" title="Losses / lost order value" subtitle="Cancelled or refunded order value" />
      <AdminLineChart data={data?.analytics?.activities || []} dataKey="activities" title="Application activity" format={(v) => `${Number(v).toLocaleString()} activities`} />
    </div>

    <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-black">Activity timeline</h3><span className="text-xs font-bold text-black/40">Exact date & time</span></div><div className="mt-4 divide-y divide-black/5">{(data?.recentActivities || []).map((activity) => <div key={activity.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">{activity.description}</p><p className="mt-1 text-[11px] capitalize text-black/40">{activity.action.replaceAll("_", " ")}</p></div><time className="text-xs font-bold text-black/40">{formatDateTime(activity.createdAt)}</time></div>)}{!data?.recentActivities?.length && <p className="py-8 text-sm text-black/40">No recorded activity for this period.</p>}</div></div>
  </div>;
}

export default AdminAnalytics;
