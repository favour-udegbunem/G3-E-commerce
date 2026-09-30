import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "./adminApi";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await adminLogin(form.email, form.password);

      if (data.user?.role !== "admin") {
        throw new Error("This account does not have administrator access.");
      }

      localStorage.setItem("g3-admin-token", data.token);
      localStorage.setItem("g3-admin-user", JSON.stringify(data.user));
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F001C] px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-2xl sm:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-g3-pink">
            <ShieldCheck size={27} />
          </div>

          <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-g3-light-purple">
            G3 Store Admin
          </p>
          <h1 className="mt-3 text-3xl font-black">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Manage products, prices, stock and catalogue visibility from one place.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email</span>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-13 w-full rounded-2xl border border-white/10 bg-[#0F001C] pl-11 pr-4 text-sm outline-none focus:border-g3-light-purple"
                  placeholder="admin@g3lounge.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-13 w-full rounded-2xl border border-white/10 bg-[#0F001C] pl-11 pr-4 text-sm outline-none focus:border-g3-light-purple"
                  placeholder="Enter your admin password"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-g3-purple px-5 py-4 text-sm font-black transition hover:bg-g3-pink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Enter Admin"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <Link to="/" className="mt-7 block text-center text-xs font-bold text-white/40 hover:text-white">
            Back to G3 Store
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
