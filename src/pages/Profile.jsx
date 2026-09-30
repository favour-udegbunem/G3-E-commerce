import {
  ArrowLeft,
  Check,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";
import TierBadge from "../components/TierBadge";
import { useTier } from "../context/TierContext";

function Profile() {
  const { user, currentTier, updateUser } = useTier();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const overviewPath =
    currentTier === "premier"
      ? "/account/premier"
      : currentTier === "member"
        ? "/account/member"
        : "/account";

  const isPremier = currentTier === "premier";
  const isMember = currentTier === "member";
  const accentLabel = isPremier ? "text-g3-gold" : "text-g3-pink";
  const headerBg = isPremier
    ? "bg-gradient-to-br from-[#1A002E] via-[#2D0A4E] to-[#1A002E]"
    : isMember
      ? "bg-gradient-to-br from-g3-purple via-[#4B0E7A] to-g3-purple"
      : "bg-g3-purple";
  const menuBtn = isPremier
    ? "bg-g3-gold hover:bg-g3-purple"
    : "bg-g3-purple hover:bg-g3-pink";

  const [profile, setProfile] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  }));

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [saved, setSaved] = useState(false);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    updateUser(profile);
    setSaved(true);
  };

  const handleChangePassword = (event) => {
    event.preventDefault();

    // Backend will eventually handle password changes here.
    console.log("Password change requested");

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#0F001C]">

      {/* MOBILE HEADER */}
      <div className="border-b border-white/10 bg-[#1A002E] lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${accentLabel}`}>
              G3 Lounge
            </p>

            <h1 className="mt-1 text-lg font-black text-white">
              My Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className={`rounded-full px-4 py-2.5 text-xs font-black text-white transition ${menuBtn}`}
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
          <div className={`border-b border-g3-light-purple/20 ${headerBg}`}>

            <div className="mx-auto max-w-6xl px-5 pb-9 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">

              <Link
                to={overviewPath}
                className="inline-flex items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Back to Overview
              </Link>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPremier ? "text-g3-gold" : "text-g3-light-purple"}`}>
                    {isPremier ? "Premier account" : isMember ? "Member account" : "Account information"}
                  </p>

                  <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                    My Profile
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                    {isPremier
                      ? "Your elite G3 profile. Manage details with Premier priority."
                      : isMember
                        ? "Your Member profile. Keep your details up to date."
                        : "Manage your personal information and account details."}
                  </p>
                </div>
                <TierBadge tier={currentTier} />
              </div>

            </div>

          </div>

          {/* CONTENT */}
          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">

            {/* PROFILE CARD */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

              {/* PROFILE TOP */}
              <div className="border-b border-white/10 bg-gradient-to-r from-g3-purple to-[#4b087c] p-6 sm:p-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  {/* AVATAR */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-g3-gold/15 text-2xl font-black text-white shadow-lg">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-xl font-black text-white">
                        {profile.firstName} {profile.lastName}
                      </h2>

                      <TierBadge tier={currentTier} compact />

                    </div>

                    <p className="mt-1 text-sm text-white/60">
                      {profile.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* PERSONAL INFORMATION */}
              <form
                onSubmit={handleSaveProfile}
                className="p-6 sm:p-8"
              >

                <div className="mb-7">

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-pink">
                    Personal information
                  </p>

                  <h2 className="mt-2 text-xl font-black text-white">
                    Your Details
                  </h2>

                  <p className="mt-1 text-sm text-white/55">
                    Keep your information up to date.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* FIRST NAME */}
                  <div>

                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-xs font-black text-white/60"
                    >
                      First Name
                    </label>

                    <div className="relative">

                      <UserRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                      />

                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                      />

                    </div>

                  </div>

                  {/* LAST NAME */}
                  <div>

                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-xs font-black text-white/60"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                    />

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-black text-white/60"
                    >
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                      />

                    </div>

                  </div>

                  {/* PHONE */}
                  <div>

                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-black text-white/60"
                    >
                      Phone / WhatsApp
                    </label>

                    <div className="relative">

                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        placeholder="+234..."
                        className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                      />

                    </div>

                  </div>

                </div>

                {/* EMAIL NOTE */}
                <div className="mt-6 rounded-2xl bg-g3-gold/15 p-4">

                  <div className="flex gap-3">

                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-g3-pink"
                    />

                    <div>

                      <p className="text-xs font-black text-white">
                        Your email is used for account
                        communication.
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/55">
                        G3 may use your email to send order updates,
                        important account information and member
                        notifications.
                      </p>

                    </div>

                  </div>

                </div>

                {/* SAVE */}
                <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

                  {saved ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50">
                        <Check size={15} />
                      </span>

                      Changes saved successfully.
                    </div>
                  ) : (
                    <p className="text-xs text-white/45">
                      Make sure your details are correct before
                      saving.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>

                </div>

              </form>

            </div>

            {/* PASSWORD CARD */}
            <form
              onSubmit={handleChangePassword}
              className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                      <LockKeyhole size={19} />
                    </div>

                    <h2 className="text-xl font-black text-white">
                      Password & Security
                    </h2>

                  </div>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                    Keep your G3 Lounge account secure by using a
                    strong password.
                  </p>

                </div>

              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-3">

                {/* CURRENT PASSWORD */}
                <div>

                  <label
                    htmlFor="current"
                    className="mb-2 block text-xs font-black text-white/60"
                  >
                    Current Password
                  </label>

                  <input
                    id="current"
                    name="current"
                    type="password"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                  />

                </div>

                {/* NEW PASSWORD */}
                <div>

                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-xs font-black text-white/60"
                  >
                    New Password
                  </label>

                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                  />

                </div>

                {/* CONFIRM PASSWORD */}
                <div>

                  <label
                    htmlFor="confirm"
                    className="mb-2 block text-xs font-black text-white/60"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                  />

                </div>

              </div>

              <div className="mt-6 flex justify-end border-t border-white/10 pt-6">

                <button
                  type="submit"
                  className="rounded-full border cursor-pointer border-g3-purple px-6 py-3 text-sm font-black text-white transition hover:bg-g3-purple hover:text-white"
                >
                  Update Password
                </button>

              </div>

            </form>

            {/* ACCOUNT STATUS — tier aware */}
            <div className={`mt-6 rounded-3xl border p-6 sm:p-8 ${
              isPremier
                ? "border-amber-100 bg-gradient-to-br from-amber-50/80 to-white"
                : isMember
                  ? "border-g3-light-purple/30 bg-gradient-to-br from-purple-50/50 to-white"
                  : "border-white/10 bg-white/5"
            }`}>

              <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                isPremier ? "text-g3-gold" : "text-g3-pink"
              }`}>
                Membership
              </p>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-black text-white">
                    {isPremier
                      ? "G3 Lounge Premier"
                      : isMember
                        ? "G3 Lounge Member"
                        : "G3 Lounge Guest"}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
                    {isPremier
                      ? "You have full access to every Premier privilege."
                      : isMember
                        ? "You have access to G3 Lounge member features."
                        : "Complete orders and referrals to unlock Member benefits."}
                  </p>
                </div>

                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
                  isPremier
                    ? "bg-amber-50 text-g3-gold"
                    : isMember
                      ? "bg-purple-50 text-g3-purple"
                      : "bg-green-50 text-green-600"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    isPremier ? "bg-g3-gold" : isMember ? "bg-g3-purple" : "bg-green-500"
                  }`} />
                  {isPremier
                    ? "Active Premier"
                    : isMember
                      ? "Active Member"
                      : "Active Guest"}
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Profile;