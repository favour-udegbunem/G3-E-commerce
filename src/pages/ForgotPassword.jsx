import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    /*
      FRONTEND DEMO ONLY

      Later this will become:

      POST /api/auth/forgot-password

      The backend will:
      1. Check whether the account exists
      2. Create a secure password-reset token
      3. Send a password-reset email
      4. The user follows the link
      5. The user creates a new password
    */

    console.log("Password reset requested for:", email);

    setSubmitted(true);
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
                <LockKeyhole size={27} />
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-g3-light-purple">
                Account recovery
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-tight text-white">
                We'll help you get back into G3 Lounge.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                Enter the email address connected to your account and
                we'll guide you through the password recovery process.
              </p>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center bg-white/5 px-5 py-12 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">

              {/* MOBILE HEADER */}
              <div className="lg:hidden">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
                  G3 Lounge
                </p>

                <h1 className="mt-3 text-3xl font-black text-white">
                  Forgot your password?
                </h1>
              </div>

              {!submitted ? (
                <>
                  {/* DESKTOP HEADER */}
                  <div className="hidden lg:block">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
                      G3 Lounge
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-white">
                      Forgot your password?
                    </h2>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/55">
                    No worries. Enter your email address below and we'll
                    help you reset your password.
                  </p>

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
                          type="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            setError("");
                          }}
                          placeholder="you@example.com"
                          className={`h-13 w-full rounded-2xl border bg-[#0F001C] pl-11 pr-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                            error
                              ? "border-red-300 focus:border-red-400"
                              : "border-white/15 focus:border-g3-light-purple"
                          }`}
                        />
                      </div>

                      {error && (
                        <p className="mt-2 text-xs font-semibold text-red-500">
                          {error}
                        </p>
                      )}
                    </div>

                    {/* SUBMIT */}
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-g3-purple px-5 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-g3-pink"
                    >
                      Send Reset Instructions
                      <ArrowRight size={17} />
                    </button>
                  </form>
                </>
              ) : (
                /* SUCCESS STATE */
                <div className="text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
                    <CheckCircle2 size={40} />
                  </div>

                  <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
                    Check your inbox
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-white">
                    Reset instructions sent
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/55">
                    If an account exists with{" "}
                    <span className="font-bold text-white">
                      {email}
                    </span>
                    , you'll receive instructions for resetting your
                    password.
                  </p>

                  <div className="mt-7 rounded-2xl bg-g3-light-pink p-5 text-left">
                    <div className="flex gap-3">
                      <Sparkles
                        size={19}
                        className="mt-0.5 shrink-0 text-g3-pink"
                      />

                      <p className="text-xs leading-5 text-white/65">
                        Check your spam or junk folder if you don't see
                        the email shortly.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail("");
                    }}
                    className="mt-7 text-xs font-black text-g3-pink transition hover:text-white"
                  >
                    Try another email
                  </button>

                </div>
              )}

              {/* BACK LINKS */}
              <div className="mt-8 flex flex-col items-center gap-4">

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-g3-pink"
                >
                  <ArrowLeft size={16} />
                  Back to Log In
                </Link>

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

export default ForgotPassword;