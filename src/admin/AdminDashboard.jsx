import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Boxes, CircleDollarSign, Clock3, ShoppingBag, Users } from "lucide-react";
import { getAdminDashboard } from "./adminApi";

const money = (v) => `₦${Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

function LineChart({
  data = [],
  dataKey,
  title,
  format = money,
}) {
  const width = 900;
  const height = 300;

  const padding = {
    top: 25,
    right: 30,
    bottom: 45,
    left: 70,
  };

  const chartWidth =
    width - padding.left - padding.right;

  const chartHeight =
    height - padding.top - padding.bottom;

  const values = data.map((item) =>
    Number(item?.[dataKey] || 0)
  );

  const maxValue = Math.max(...values, 1);

  const minValue = 0;

  const getX = (index) => {
    if (data.length <= 1) {
      return padding.left + chartWidth / 2;
    }

    return (
      padding.left +
      (index / (data.length - 1)) * chartWidth
    );
  };

  const getY = (value) => {
    const percentage =
      (value - minValue) /
      Math.max(maxValue - minValue, 1);

    return (
      padding.top +
      chartHeight -
      percentage * chartHeight
    );
  };

  const points = data.map((item, index) => ({
    x: getX(index),
    y: getY(Number(item?.[dataKey] || 0)),
    value: Number(item?.[dataKey] || 0),
    label: item?.label || "",
  }));

  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const areaPoints =
    points.length > 0
      ? [
          `${points[0].x},${padding.top + chartHeight}`,
          ...points.map(
            (point) => `${point.x},${point.y}`
          ),
          `${
            points[points.length - 1].x
          },${padding.top + chartHeight}`,
        ].join(" ")
      : "";

  const labelIndexes =
    data.length <= 7
      ? data.map((_, index) => index)
      : [
          0,
          Math.floor(data.length / 4),
          Math.floor(data.length / 2),
          Math.floor((data.length * 3) / 4),
          data.length - 1,
        ];

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-g3-purple">
            Analytics
          </p>

          <h3 className="mt-1 text-base font-black">
            {title}
          </h3>

          <p className="mt-1 text-xs text-black/40">
            Last 30 days
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-black text-g3-purple">
            {format(
              values.reduce(
                (total, value) => total + value,
                0
              )
            )}
          </p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-black/30">
            Total
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 overflow-x-auto">
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-[#f8f6fb]">
            <div className="text-center">
              <p className="text-sm font-black text-black/45">
                No data available yet
              </p>

              <p className="mt-1 text-xs text-black/30">
                Data will appear here when activity is recorded.
              </p>
            </div>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-64 min-w-[650px] w-full"
            role="img"
            aria-label={title}
          >
            {/* Horizontal grid lines */}
            {gridLines.map((ratio) => {
              const y =
                padding.top +
                chartHeight -
                ratio * chartHeight;

              const value =
                maxValue * ratio;

              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    x2={width - padding.right}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    className="text-black/5"
                  />

                  <text
                    x={padding.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    className="fill-black/35"
                  >
                    {format(value)}
                  </text>
                </g>
              );
            })}

            {/* Area under graph */}
            {points.length > 1 && (
              <polygon
                points={areaPoints}
                className="fill-g3-purple/10"
              />
            )}

            {/* Main line */}
            {points.length > 1 && (
              <polyline
                points={linePoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-g3-purple"
              />
            )}

            {/* Data points */}
            {points.map((point, index) => (
              <g key={`${point.label}-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  className="fill-white stroke-g3-purple"
                  strokeWidth="3"
                />

                <title>
                  {point.label}: {format(point.value)}
                </title>
              </g>
            ))}

            {/* X-axis labels */}
            {labelIndexes.map((index) => {
              const point = points[index];

              if (!point) return null;

              return (
                <text
                  key={`label-${index}`}
                  x={point.x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="11"
                  className="fill-black/35"
                >
                  {point.label}
                </text>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const load = async () => { try { setLoading(true); setData(await getAdminDashboard()); } catch(e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const cards = useMemo(() => data ? [
    ["Revenue", money(data.stats?.paidRevenue), CircleDollarSign],
    ["Orders", data.stats?.orders || 0, ShoppingBag],
    ["Customers", data.stats?.users || 0, Users],
    ["Active products", data.stats?.activeProducts || 0, Boxes],
    ["Pending orders", data.stats?.pendingOrders || 0, Clock3],
    ["Low stock", data.stats?.lowStock || 0, AlertTriangle],
  ] : [], [data]);
  if (loading) return <div className="p-6 lg:p-10"><div className="rounded-3xl bg-white p-12 text-center font-bold text-black/45">Loading your dashboard...</div></div>;
  if (error) return <div className="p-6 lg:p-10"><div className="rounded-3xl bg-red-50 p-8 font-bold text-red-700">{error}</div></div>;
  return <div className="p-5 sm:p-7 lg:p-10">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">Overview</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Good day, Admin.</h1><p className="mt-2 text-sm text-black/45">Your G3 Store performance at a glance.</p></div><button onClick={load} className="w-fit rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-black hover:bg-black/5">Refresh data</button></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value,Icon]) => <div key={label} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-bold text-black/45">{label}</span><Icon size={19} className="text-g3-purple" /></div><p className="mt-3 text-3xl font-black">{value}</p></div>)}</div>
    <div className="mt-7 grid gap-5 xl:grid-cols-2"><LineChart data={data.revenueTrend || []} dataKey="revenue" title="Revenue trend" /><LineChart data={data.orderTrend || []} dataKey="orders" title="Order volume" format={(v)=>`${Number(v).toLocaleString()} orders`} /></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
      <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><h3 className="font-black">Top products</h3><div className="mt-4 divide-y divide-black/5">{(data.topProducts || []).length ? data.topProducts.map((p,i)=><div key={p.productName} className="flex items-center justify-between gap-4 py-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-g3-light-pink text-xs font-black text-g3-purple">{i+1}</span><span className="truncate text-sm font-bold">{p.productName}</span></div><div className="shrink-0 text-right"><p className="text-sm font-black">{p.quantity} sold</p><p className="text-[11px] text-black/40">{money(p.revenue)}</p></div></div>) : <p className="py-8 text-sm text-black/40">No order data yet.</p>}</div></div>
      <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><h3 className="font-black">Membership mix</h3><div className="mt-5 space-y-4">{(data.tierBreakdown || []).map((x)=><div key={x.tier}><div className="flex justify-between text-xs font-bold"><span className="capitalize">{x.tier}</span><span>{x.count}</span></div><div className="mt-2 h-2 rounded-full bg-black/5"><div className="h-2 rounded-full bg-g3-purple" style={{width:`${Math.min(100, (x.count/Math.max(data.stats.users,1))*100)}%`}} /></div></div>)}</div></div>
    </div>
    <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-black">Low stock</h3><span className="text-xs font-bold text-black/40">5 units or fewer</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(data.lowStockProducts || []).map(p=><div key={p.id} className="rounded-2xl bg-[#f8f6fb] p-4"><p className="truncate text-sm font-black">{p.name}</p><p className="mt-1 text-xs font-bold text-orange-600">{p.stock} left</p></div>)}{!data.lowStockProducts?.length && <p className="py-4 text-sm text-black/40">No low-stock products.</p>}</div></div>
  </div>;
}
export default AdminDashboard;
