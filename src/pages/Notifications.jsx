import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Gift,
  Megaphone,
  Package,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";

function Notifications() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Your order has been delivered",
      message:
        "Your G3 order #G3-1001 has been marked as delivered. We hope you love everything!",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "gift",
      title: "Create something special",
      message:
        "Have someone special to celebrate? Create a custom G3 Gift Box just for them.",
      time: "Yesterday",
      unread: true,
    },
    {
      id: 3,
      type: "new",
      title: "New products are coming",
      message:
        "Fresh G3 products are being prepared. Stay tuned for the next drop.",
      time: "2 days ago",
      unread: true,
    },
    {
      id: 4,
      type: "promotion",
      title: "A little something for you",
      message:
        "Keep an eye on the G3 Store for upcoming member promotions and special offers.",
      time: "4 days ago",
      unread: false,
    },
    {
      id: 5,
      type: "lounge",
      title: "Welcome to G3 Lounge",
      message:
        "You're officially part of the G3 community. Explore your member benefits.",
      time: "1 week ago",
      unread: false,
    },
  ]);

  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter((notification) => notification.unread)
      : notifications;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationIcon = (type) => {
    const iconProps = {
      size: 20,
    };

    if (type === "order") {
      return <Package {...iconProps} />;
    }

    if (type === "gift") {
      return <Gift {...iconProps} />;
    }

    if (type === "new") {
      return <Sparkles {...iconProps} />;
    }

    if (type === "promotion") {
      return <Tag {...iconProps} />;
    }

    return <Megaphone {...iconProps} />;
  };

  const getNotificationStyle = (type) => {
    if (type === "order") {
      return "bg-purple-50 text-g3-purple";
    }

    if (type === "gift") {
      return "bg-g3-light-pink text-g3-pink";
    }

    if (type === "new") {
      return "bg-amber-50 text-g3-gold";
    }

    if (type === "promotion") {
      return "bg-pink-50 text-pink-500";
    }

    return "bg-blue-50 text-blue-500";
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
              Notifications
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

          {/* PAGE HEADER */}
          <div className="border-b border-g3-light-purple/20 bg-g3-purple">

            <div className="mx-auto max-w-6xl px-5 pb-9 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">

              <Link
                to="/account"
                className="inline-flex items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Back to Overview
              </Link>

              <div className="mt-6 flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-g3-pink text-white">
                  <Bell size={23} />
                </div>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-light-purple">
                    Stay updated
                  </p>

                  <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                    Notifications
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                    Keep up with your orders, new products, promotions
                    and everything happening in G3 Lounge.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* CONTENT */}
          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">

            {/* TOP BAR */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-black text-white">
                    Your Notifications
                  </h2>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-g3-pink px-2.5 py-1 text-[10px] font-black text-white">
                      {unreadCount} new
                    </span>
                  )}

                </div>

                <p className="mt-1 text-xs text-white/45">
                  Important updates from G3 Lounge.
                </p>

              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex w-fit text-white items-center gap-2 text-xs font-black text-g3-purple transition hover:text-g3-pink"
                >
                  <CheckCheck size={16} />
                  Mark all as read
                </button>
              )}

            </div>

            {/* FILTERS */}
            <div className="mt-6 flex gap-2">

              {["All", "Unread"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                    filter === option
                      ? "bg-g3-purple text-white"
                      : "bg-white text-g3-purple hover:bg-g3-light-pink hover:text-g3-pink"
                  }`}
                >
                  {option}
                </button>
              ))}

            </div>

            {/* NOTIFICATIONS */}
            <div className="mt-5 space-y-3">

              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <article
                    key={notification.id}
                    className={`group relative rounded-2xl border p-5 transition sm:p-6 ${
                      notification.unread
                        ? "border-g3-light-purple/30 bg-g3-gold/15 shadow-sm"
                        : "border-white/10 bg-white/5"
                    }`}
                  >

                    <div className="flex gap-4">

                      {/* ICON */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getNotificationStyle(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-center gap-2">

                            <h3 className="text-sm font-black text-white">
                              {notification.title}
                            </h3>

                            {notification.unread && (
                              <span className="h-2 w-2 rounded-full bg-g3-pink" />
                            )}

                          </div>

                          <span className="text-[10px] font-bold text-white/45">
                            {notification.time}
                          </span>

                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                          {notification.message}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">

                          {notification.unread && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(notification.id)
                              }
                              className="inline-flex items-center gap-1.5 text-[11px] font-black text-g3-pink transition hover:text-g3-pink"
                            >
                              <Check size={14} />
                              Mark as read
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(notification.id)
                            }
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/45 transition hover:text-red-500"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
                    <Bell size={27} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-white">
                    {filter === "Unread"
                      ? "You're all caught up"
                      : "No notifications yet"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
                    {filter === "Unread"
                      ? "You don't have any unread notifications right now."
                      : "We'll let you know when there's something new for you."}
                  </p>

                  {filter === "Unread" && (
                    <button
                      type="button"
                      onClick={() => setFilter("All")}
                      className="mt-6 rounded-full bg-g3-purple px-6 py-3 text-sm font-black text-white transition hover:bg-g3-pink"
                    >
                      View All Notifications
                    </button>
                  )}

                </div>
              )}

            </div>

            {/* INFO CARD */}
            <div className="mt-8 rounded-3xl bg-g3-gold/15 p-6 sm:p-8">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-g3-pink">
                  <ShoppingBag size={20} />
                </div>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-g3-pink">
                    G3 Lounge
                  </p>

                  <h3 className="mt-1 text-lg font-black text-white">
                    Never miss a drop.
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-white/55">
                    As a G3 Lounge member, you'll be able to receive
                    updates about your orders, new products, special
                    offers and member-exclusive experiences.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Notifications;