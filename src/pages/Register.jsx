import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  UserPlus,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useTier } from "../context/TierContext";

import Footer from "../components/Footer";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerUser } = useTier();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referredBy: searchParams.get("ref") || "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Your password must contain at least 8 characters."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    const registeredUser = registerUser(formData);

    if (!registeredUser) {
      setError("An account already exists with this email address. Please log in instead.");
      return;
    }

    const redirect = searchParams.get("redirect");
    navigate(redirect || "/account");
  };

  const benefits = [
    "Early access to new product drops",
    "Member-only promotions and offers",
    "Save your favourite products",
    "Track your G3 Lounge orders",
    "Receive important G3 notifications",
  ];

  return (
    <main className="bg-[#0F001C]">

      {/* MAIN AUTH SECTION */}
      <section className="min-h-[calc(100vh-100px)] py-10 sm:py-14">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl lg:grid-cols-[0.85fr_1.15fr]">

            {/* LEFT SIDE */}
            <div className="relative hidden overflow-hidden bg-g3-purple p-10 text-white lg:block xl:p-14">

              {/* Decorative circles */}
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-g3-pink/20 blur-3xl" />

              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-g3-light-purple/20 blur-3xl" />

              <div className="relative flex h-full flex-col">

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-g3-light-purple">
                  <UserPlus size={14} />
                  Join G3 Lounge
                </div>

                <h1 className="mt-8 text-4xl font-black leading-tight xl:text-5xl">
                  Your G3
                  <span className="block text-g3-pink">
                    experience starts here.
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                  Create your free G3 Lounge account and get
                  more from every visit.
                </p>

                <div className="mt-10 space-y-4">

                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-g3-pink">
                        <Check size={15} />
                      </div>

                      <span className="text-sm font-semibold text-white/80">
                        {benefit}
                      </span>
                    </div>
                  ))}

                </div>

                <div className="mt-auto pt-12">

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
                        <Heart
                          size={18}
                          fill="currentColor"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-black">
                          Made for her.
                        </p>

                        <p className="mt-1 text-xs text-white/50">
                          Welcome to the G3 community.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-6 sm:p-10 lg:p-12">

              {/* MOBILE BRANDING */}
              <div className="mb-8 lg:hidden">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-g3-light-pink text-g3-pink">
                    <UserPlus size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-g3-pink">
                      G3 Lounge
                    </p>

                    <h1 className="text-xl font-black text-white">
                      Create your account
                    </h1>
                  </div>

                </div>

              </div>

              {/* FORM HEADER */}
              <div>

                <p className="hidden text-xs font-black uppercase tracking-[0.2em] text-g3-pink lg:block">
                  Welcome to the Lounge
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  Join G3 Lounge and make your shopping
                  experience more personal.
                </p>

              </div>

              {/* ERROR */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* NAME */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-xs font-bold text-white/80"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your first name"
                      className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-xs font-bold text-white/80"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Your last name"
                      className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                    />
                  </div>

                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-bold text-white/80"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="text-xs font-bold text-white/80"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                  />
                </div>

                {/* REFERRAL */}
                <div>
                  <label
                    htmlFor="referredBy"
                    className="text-xs font-bold text-white/80"
                  >
                    Referral Code <span className="font-normal text-white/45">(Optional)</span>
                  </label>

                  <input
                    id="referredBy"
                    name="referredBy"
                    type="text"
                    value={formData.referredBy}
                    onChange={handleChange}
                    placeholder="Enter a friend's G3 code"
                    className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                  />

                  <p className="mt-2 text-[11px] text-white/45">
                    If someone invited you, enter their referral code here.
                  </p>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-xs font-bold text-white/80"
                  >
                    Password
                  </label>

                  <div className="relative mt-2">

                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] pl-11 pr-12 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                  <p className="mt-2 text-[11px] text-white/45">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-bold text-white/80"
                  >
                    Confirm Password
                  </label>

                  <div className="relative mt-2">

                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Enter your password again"
                      className="h-12 w-full rounded-xl border border-white/15 bg-[#0F001C] pl-11 pr-12 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>
                </div>

                {/* TERMS */}
                <div className="flex items-start gap-3">

                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 accent-[#3A0164]"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-white/55"
                  >
                    I agree to the G3 Lounge terms and understand
                    that my account will be used to provide my
                    member experience.
                  </label>

                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-g3-purple px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-g3-pink"
                >
                  Create My G3 Account
                  <ArrowRight size={17} />
                </button>

              </form>

              {/* LOGIN */}
              <div className="mt-7 border-t border-white/10 pt-6 text-center">

                <p className="text-sm text-white/55">
                  Already have a G3 Lounge account?
                </p>

                <Link
                  to="/login"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-black text-white transition hover:text-g3-pink"
                >
                  Log in
                  <ArrowRight size={15} />
                </Link>

              </div>

              {/* GUEST SHOPPING */}
              <div className="mt-6 text-center">

                <Link
                  to="/shop"
                  className="text-xs font-semibold text-white/45 transition hover:text-white"
                >
                  Continue shopping without an account
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}

export default Register;