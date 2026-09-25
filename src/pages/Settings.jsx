import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";

function Settings() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    newProducts: true,
    promotions: true,
    loungeUpdates: true,
  });

  const [saved, setSaved] = useState(false);

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));

    setSaved(false);
  };

  const savePreferences = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const notificationSettings = [
    {
      key: "orderUpdates",
      title: "Order updates",
      description:
        "Get notified when your order is confirmed, shipped or delivered.",
    },
    {
      key: "newProducts",
      title: "New products",
      description:
        "Be the first to know when new G3 products and collections arrive.",
    },
    {
      key: "promotions",
      title: "Promotions & offers",
      description:
        "Receive updates about discounts, special offers and member promotions.",
    },
    {
      key: "loungeUpdates",
      title: "G3 Lounge updates",
      description:
        "Receive important announcements and updates about your member experience.",
    },
  ];

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
              Settings
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

        {/* MAIN */}
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

              <div className="mt-6 flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-g3-pink text-white">
                  <ShieldCheck size={23} />
                </div>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-light-purple">
                    Your preferences
                  </p>

                  <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                    Settings
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                    Manage your G3 Lounge preferences, notifications and
                    account settings.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* CONTENT */}
          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">

            {/* ACCOUNT SETTINGS */}
            <section>

              <div className="mb-4">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">
                  Account
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Account settings
                </h2>

              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

                <Link
                  to="/account/profile"
                  className="flex items-center gap-4 border-b border-white/10 p-5 transition hover:bg-g3-light-pink/40 sm:p-6"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                    <UserRound size={20} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="text-sm font-black text-white">
                      Profile information
                    </h3>

                    <p className="mt-1 text-xs text-white/50">
                      Manage your name, email address and phone number.
                    </p>

                  </div>

                  <ChevronRight
                    size={19}
                    className="shrink-0 text-gray-300"
                  />

                </Link>

                <Link
                  to="/account/profile"
                  className="flex items-center gap-4 p-5 transition hover:bg-g3-light-pink/40 sm:p-6"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-g3-purple">
                    <Lock size={20} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="text-sm font-black text-white">
                      Password & security
                    </h3>

                    <p className="mt-1 text-xs text-white/50">
                      Update your password and keep your account secure.
                    </p>

                  </div>

                  <ChevronRight
                    size={19}
                    className="shrink-0 text-gray-300"
                  />

                </Link>

              </div>

            </section>

            {/* NOTIFICATION PREFERENCES */}
            <section className="mt-10">

              <div className="mb-4">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">
                  Notifications
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Notification preferences
                </h2>

                <p className="mt-1 text-sm text-white/55">
                  Choose the updates you'd like to receive from G3.
                </p>

              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

                {notificationSettings.map((setting, index) => (
                  <div
                    key={setting.key}
                    className={`flex items-center gap-4 p-5 sm:p-6 ${
                      index !== notificationSettings.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }`}
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                      <Bell size={20} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="text-sm font-black text-white">
                        {setting.title}
                      </h3>

                      <p className="mt-1 max-w-2xl text-xs leading-5 text-white/55">
                        {setting.description}
                      </p>

                    </div>

                    {/* TOGGLE */}
                    <button
                      type="button"
                      onClick={() => togglePreference(setting.key)}
                      aria-label={`Toggle ${setting.title}`}
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        preferences[setting.key]
                          ? "bg-g3-purple"
                          : "bg-gray-200"
                      }`}
                    >

                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                          preferences[setting.key]
                            ? "left-6"
                            : "left-1"
                        }`}
                      />

                    </button>

                  </div>
                ))}

              </div>

              <div className="mt-4 flex items-center justify-between gap-4">

                {saved ? (
                  <p className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                    <Check size={15} />
                    Preferences saved
                  </p>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={savePreferences}
                  className="rounded-xl bg-g3-purple px-6 py-3 text-xs font-black text-white transition hover:bg-g3-pink"
                >
                  Save Preferences
                </button>

              </div>

            </section>

            {/* EMAIL */}
            <section className="mt-10">

              <div className="mb-4">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">
                  Communication
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Email preferences
                </h2>

              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-g3-purple">
                    <Mail size={20} />
                  </div>

                  <div>

                    <h3 className="text-sm font-black text-white">
                      Your registered email
                    </h3>

                    <p className="mt-1 text-sm font-bold text-gray-700">
                      member@g3lounge.com
                    </p>

                    <p className="mt-2 text-xs leading-5 text-white/55">
                      This is the email currently connected to your G3
                      Lounge account. You can change it from your profile.
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* DANGER / LOGOUT */}
            <section className="mt-10">

              <div className="mb-4">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                  Account actions
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Sign out
                </h2>

              </div>

              <div className="rounded-3xl border border-red-100 bg-white/5 p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <LogOut size={20} />
                    </div>

                    <div>

                      <h3 className="text-sm font-black text-gray-800">
                        Log out of G3 Lounge
                      </h3>

                      <p className="mt-1 max-w-xl text-xs leading-5 text-white/55">
                        End your current session on this device.
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="rounded-xl border border-red-200 px-5 py-3 text-xs font-black text-red-500 transition hover:bg-red-50"
                  >
                    Log Out
                  </button>

                </div>

              </div>

            </section>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Settings;