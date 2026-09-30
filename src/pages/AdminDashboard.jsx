import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Wallet,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAdminDashboard,
  getAdminDashboardAnalytics,
} from "./adminApi";

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function RevenueGraph({ data }) {
  const width = 900;
  const height = 320;

  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 30;
  const paddingBottom = 50;

  const graphWidth =
    width - paddingLeft - paddingRight;

  const graphHeight =
    height - paddingTop - paddingBottom;

  const maxRevenue = Math.max(
    ...data.map((item) => Number(item.revenue || 0)),
    1
  );

  const points = data.map((item, index) => {
    const x =
      paddingLeft +
      (index / Math.max(data.length - 1, 1)) *
        graphWidth;

    const y =
      paddingTop +
      graphHeight -
      (Number(item.revenue || 0) / maxRevenue) *
        graphHeight;

    return {
      ...item,
      x,
      y,
    };
  });

  const line = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const area = [
    `${paddingLeft},${paddingTop + graphHeight}`,
    ...points.map((point) => `${point.x},${point.y}`),
    `${paddingLeft + graphWidth},${paddingTop + graphHeight}`,
  ].join(" ");

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-g3-purple">
            Analytics
          </p>

          <h2 className="mt-1 text-xl font-black">
            Revenue overview
          </h2>

          <p className="mt-1 text-sm text-black/45">
            Paid revenue over the last six months.
          </p>
        </div>

        <BarChart3 className="text-g3-purple" />
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[650px] w-full"
        >
          {[0, 0.25, 0.5, 0.75, 1].map(
            (percentage) => {
              const y =
                paddingTop +
                graphHeight -
                percentage * graphHeight;

              const value =
                maxRevenue * percentage;

              return (
                <g key={percentage}>
                  <line
                    x1={paddingLeft}
                    x2={paddingLeft + graphWidth}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    className="text-black/5"
                  />

                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    className="fill-black/40"
                  >
                    {money(value)}
                  </text>
                </g>
              );
            }
          )}

          <polygon
            points={area}
            className="fill-g3-purple/10"
          />

          <polyline
            points={line}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-g3-purple"
          />

          {points.map((point) => (
            <g key={point.month}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                className="fill-g3-purple"
              />

              <text
                x={point.x}
                y={height - 20}
                textAnchor="middle"
                fontSize="12"
                className="fill-black/50"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function OrdersGraph({ data }) {
  const maxOrders = Math.max(
    ...data.map((item) => Number(item.orders || 0)),
    1
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-g3-pink">
            Orders
          </p>

          <h2 className="mt-1 text-xl font-black">
            Order activity
          </h2>

          <p className="mt-1 text-sm text-black/45">
            Orders received over the last six months.
          </p>
        </div>

        <ShoppingBag className="text-g3-pink" />
      </div>

      <div className="mt-8 flex h-64 items-end gap-3">
        {data.map((item) => {
          const height =
            (Number(item.orders || 0) / maxOrders) *
            100;

          return (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col justify-end"
            >
              <div className="mb-2 text-center text-xs font-bold text-black/45">
                {item.orders}
              </div>

              <div
                className="rounded-t-xl bg-g3-purple transition-all"
                style={{
                  height: `${Math.max(height, 4)}%`,
                }}
              />

              <div className="mt-3 text-center text-xs font-bold text-black/45">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboard, analyticsData] =
        await Promise.all([
          getAdminDashboard(),
          getAdminDashboardAnalytics(),
        ]);

      setStats(dashboard.stats || {});
      setAnalytics(
        analyticsData.analytics?.revenue || []
      );
    } catch (err) {
      if (
        /authorized|access|token|login/i.test(
          err.message
        )
      ) {
        localStorage.removeItem("g3-admin-token");
        localStorage.removeItem("g3-admin-user");

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("g3-admin-token")) {
      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    loadDashboard();
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Revenue",
        value: money(stats?.paidRevenue),
        icon: Wallet,
      },
      {
        label: "Orders",
        value: stats?.orders || 0,
        icon: ShoppingBag,
      },
      {
        label: "Customers",
        value: stats?.users || 0,
        icon: Users,
      },
      {
        label: "Products",
        value: stats?.products || 0,
        icon: Package,
      },
    ],
    [stats]
  );

  const logout = () => {
    localStorage.removeItem("g3-admin-token");
    localStorage.removeItem("g3-admin-user");

    navigate("/admin/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f6fb] p-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold text-black/50">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6fb] text-[#160022]">
      <header className="bg-[#0F001C] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-light-purple">
              G3 Store
            </p>

            <h1 className="mt-1 text-2xl font-black">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8 lg:py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(
            ({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black/45">
                    {label}
                  </span>

                  <Icon
                    size={20}
                    className="text-g3-purple"
                  />
                </div>

                <p className="mt-4 text-2xl font-black">
                  {value}
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <RevenueGraph data={analytics} />

          <OrdersGraph data={analytics} />
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate("/admin/products")}
            className="rounded-3xl bg-[#0F001C] p-6 text-left text-white transition hover:bg-g3-purple"
          >
            <Package size={24} />

            <h2 className="mt-4 text-xl font-black">
              Manage Products
            </h2>

            <p className="mt-1 text-sm text-white/55">
              Add, edit, archive and manage your catalogue.
            </p>
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-3xl border border-black/5 bg-white p-6 text-left transition hover:border-g3-purple"
          >
            <ShoppingBag size={24} />

            <h2 className="mt-4 text-xl font-black">
              View Store
            </h2>

            <p className="mt-1 text-sm text-black/45">
              Open the customer-facing G3 Store.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;