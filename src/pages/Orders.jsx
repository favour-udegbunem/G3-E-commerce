import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";

function Orders() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("All Orders");

  // Temporary frontend data.
  // The backend will eventually replace this.
  const orders = [
    {
      id: "G3-1001",
      date: "September 18, 2026",
      status: "Delivered",
      items: 3,
      total: 18500,
      products: [
        "G3 Beauty Set",
        "Pink Hair Bow",
        "G3 Jotter",
      ],
    },
    {
      id: "G3-1002",
      date: "September 15, 2026",
      status: "Processing",
      items: 2,
      total: 12500,
      products: [
        "Fancy Tote Bag",
        "Period Planner Jotter",
      ],
    },
    {
      id: "G3-1003",
      date: "September 10, 2026",
      status: "Shipped",
      items: 4,
      total: 27000,
      products: [
        "G3 Body Spray",
        "Hair Bonnet",
        "Bracelet",
        "Lip Balm",
      ],
    },
  ];

  const statusOptions = [
    "All Orders",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const filteredOrders =
    filter === "All Orders"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-green-50 text-green-600";
    }

    if (status === "Shipped") {
      return "bg-blue-50 text-blue-600";
    }

    if (status === "Processing") {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-white/5 text-white/65";
  };

  return (
    <main className="min-h-screen bg-[#0F001C]">

      {/* MOBILE HEADER */}
      <div className="border-b border-white/10 bg-[#1A002E] lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">
              G3 Lounge
            </p>

            <h1 className="mt-1 text-lg font-black text-white">
              My Orders
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-full bg-g3-purple px-4 py-2.5 text-xs font-black text-white transition hover:bg-g3-pink"
          >
            Menu
          </button>

        </div>
      </div>

      <div className="flex">

        {/* SIDEBAR */}
        <LoungeSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">

          {/* HEADER */}
          <div className="border-b border-g3-light-purple/20 bg-g3-purple">

            <div className="mx-auto max-w-6xl px-5 pb-9 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">

              <Link
                to="/account"
                className="inline-flex items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Back to Overview
              </Link>

              <div className="mt-6">

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-light-purple">
                  Shopping activity
                </p>

                <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  My Orders
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                  Keep track of your G3 purchases, deliveries and
                  order history.
                </p>

              </div>

            </div>

          </div>

          {/* CONTENT */}
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">

            {/* TOP BAR */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-black text-white">
                  Order History
                </h2>

                <p className="mt-1 text-xs text-white/45">
                  {filteredOrders.length} order
                  {filteredOrders.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* FILTER */}
              <div className="relative">

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value)
                  }
                  className="appearance-none rounded-full border border-white/15 bg-g3-gold/15 py-3 pl-4 pr-10 text-sm font-bold text-white outline-none transition focus:border-g3-light-purple"
                >
                  {statusOptions.map((option) => (
                    <option key={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45"
                />

              </div>

            </div>

            {/* ORDERS */}
            <div className="mt-6 space-y-4">

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <article
                    key={order.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                  >

                    {/* ORDER HEADER */}
                    <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                          <Package size={20} />
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-sm font-black text-white">
                              {order.id}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>

                          </div>

                          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
                            <CalendarDays size={13} />
                            {order.date}
                          </div>

                        </div>

                      </div>

                      <div className="sm:text-right">

                        <p className="text-xs text-white/45">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-black text-white">
                          ₦{order.total.toLocaleString()}
                        </p>

                      </div>

                    </div>

                    {/* ORDER BODY */}
                    <div className="p-5 sm:p-6">

                      <div className="flex items-center justify-between">

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-g3-pink">
                            Items
                          </p>

                          <p className="mt-1 text-sm font-bold text-white/65">
                            {order.items} item
                            {order.items !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <Link
                          to={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-white transition hover:text-g3-pink"
                        >
                          View Details
                          <ArrowRight size={14} />
                        </Link>

                      </div>

                      {/* PRODUCT LIST */}
                      <div className="mt-5 flex flex-wrap gap-2">

                        {order.products.map((product) => (
                          <span
                            key={product}
                            className="rounded-full bg-white/5 px-3 py-2 text-xs font-bold text-white/55"
                          >
                            {product}
                          </span>
                        ))}

                      </div>

                    </div>

                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
                    <ShoppingBag size={27} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-white">
                    No {filter.toLowerCase()} orders
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
                    You don't have any orders in this category
                    yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => setFilter("All Orders")}
                    className="mt-6 rounded-full bg-g3-purple px-6 py-3 text-sm font-black text-white transition hover:bg-g3-pink"
                  >
                    View All Orders
                  </button>

                </div>
              )}

            </div>

            {/* SHOPPING CTA */}
            <div className="mt-8 overflow-hidden rounded-3xl bg-g3-gold/15">

              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">
                    Keep exploring
                  </p>

                  <h2 className="mt-2 text-xl font-black text-white">
                    Looking for something new?
                  </h2>

                  <p className="mt-1 text-sm text-white/55">
                    Discover more from the G3 Store.
                  </p>

                </div>

                <Link
                  to="/shop"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
                >
                  Shop Now
                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Orders;