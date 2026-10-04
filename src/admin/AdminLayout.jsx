import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Boxes, FolderTree, LayoutDashboard, LogOut, Menu, ShoppingBag, Users, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("g3-admin-token");
    localStorage.removeItem("g3-admin-user");
    navigate("/admin/login", { replace: true });
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("g3-admin-user") || "null"); } catch { return null; }
  })();

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? "w-full" : "hidden lg:flex lg:w-64"} shrink-0 flex-col bg-[#0F001C] text-white`}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-g3-light-purple">G3 Store</p>
          <h2 className="mt-1 text-lg font-black">Admin Console</h2>
        </div>
        {mobile && <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 hover:bg-white/10"><X size={20} /></button>}
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-g3-purple text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-2xl bg-white/5 p-3">
          <p className="truncate text-xs font-black text-white">{user?.firstName || "Administrator"} {user?.lastName || ""}</p>
          <p className="mt-1 truncate text-[11px] text-white/40">{user?.email || "Admin account"}</p>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/55 hover:bg-white/5 hover:text-white"><LogOut size={18} /> Sign out</button>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-[#f8f6fb] text-[#160022]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl bg-[#0F001C] p-2 text-white"><Menu size={20} /></button>
            <div className="text-center"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-g3-pink">G3 Store</p><p className="text-sm font-black">Admin Console</p></div>
            <button onClick={() => navigate("/")} className="text-xs font-bold text-black/45">Store</button>
          </div>
          {mobileOpen && <div className="fixed inset-0 z-50 bg-[#0F001C] lg:hidden"><Sidebar mobile /></div>}
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AdminLayout;
