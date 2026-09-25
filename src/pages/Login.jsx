import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useTier } from "../context/TierContext";

import Footer from "../components/Footer";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useTier();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const loggedIn = loginUser(formData.email);

    if (!loggedIn) {
      setErrors((previous) => ({
        ...previous,
        email: "No G3 account was found for this email. Create an account first.",
      }));
      return;
    }

    navigate("/account");
  };

  return (
    <main className="bg-[#0F001C]">
      <section className="min-h-[calc(100vh-100px)]">
        <div className="mx-auto grid max-w-7xl lg:min-h-[720px] lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="relative hidden overflow-hidden bg-g3-purple lg:flex lg:items-center">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-g3-pink/20 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-g3-light-purple/20 blur-3xl" />

            <div className="relative z-10 px-12 py-16 xl:px-20">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-g3-pink text-white">
                <Sparkles size={27} />
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-g3-light-purple">
                Welcome back
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-tight text-white">
                Your G3 Lounge is waiting.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                Sign in to keep your favourites, orders and G3 Lounge
                experience all in one place.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Access your saved favourites",
                  "Keep track of your orders",
                  "Stay updated on new G3 drops",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-white/80"
                  >
                    <span className="h-2 w-2 rounded-full bg-g3-pink" />
                    {item}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center bg-white/5 px-5 py-12 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">

              {/* MOBILE BRANDING */}
              <div className="mb-8 lg:hidden">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
                  G3 Lounge
                </p>

                <h1 className="mt-2 text-3xl font-black text-white">
                  Welcome back.
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  Sign in to continue your G3 experience.
                </p>
              </div>

              {/* FORM HEADER */}
              <div className="hidden lg:block">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
                  G3 Lounge
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  Welcome back. Enter your details below.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`h-13 w-full rounded-2xl border bg-[#0F001C] pl-11 pr-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                        errors.email
                          ? "border-red-300 focus:border-red-400"
                          : "border-white/15 focus:border-g3-light-purple"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-bold text-white"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-bold text-g3-pink transition hover:text-white"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`h-13 w-full rounded-2xl border bg-[#0F001C] pl-11 pr-12 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                        errors.password
                          ? "border-red-300 focus:border-red-400"
                          : "border-white/15 focus:border-g3-light-purple"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-g3-purple px-5 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-g3-pink"
                >
                  Sign In
                  <ArrowRight size={17} />
                </button>
              </form>

              {/* REGISTER */}
              <div className="mt-8 rounded-2xl bg-g3-light-pink p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-g3-pink">
                    <UserPlus size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white">
                      New to G3 Lounge?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/55">
                      Create an account and become part of the G3
                      Lounge community.
                    </p>

                    <Link
                      to="/register"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-black text-g3-pink transition hover:text-white"
                    >
                      Create an account
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* GUEST SHOPPING */}
              <div className="mt-6 text-center">
                <Link
                  to="/shop"
                  className="text-xs font-bold text-white/45 transition hover:text-white"
                >
                  Continue shopping as a guest
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

export default Login;