import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Image as ImageIcon,
  LogOut,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  archiveAdminProduct,
  createAdminProduct,
  getAdminCategories,
  getAdminProducts,
  updateAdminProduct,
} from "./adminApi";
import { uploadProductImage } from "./cloudinaryUpload";

const emptyForm = {
  productCode: "",
  name: "",
  categoryId: "",
  price: "",
  stock: "0",
  description: "",
  image: "",
  imagePublicId: "",
  tags: "",
  accessLevel: "general",
  featured: false,
  newArrival: false,
  active: true,
  type: "item",
  occasion: "",
  ageRange: "",
  contents: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [productData, categoryData] = await Promise.all([
        getAdminProducts({ search }),
        getAdminCategories(),
      ]);
      setProducts(productData.products || []);
      setCategories(categoryData.categories || []);
    } catch (err) {
      if (/authorized|access|token|login/i.test(err.message)) {
        localStorage.removeItem("g3-admin-token");
        localStorage.removeItem("g3-admin-user");
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("g3-admin-token")) {
      navigate("/admin/login", { replace: true });
      return;
    }
    load();
  }, [search]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.active).length,
    low: products.filter((p) => p.active && Number(p.stock) <= 5).length,
  }), [products]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setShowForm(true);
    setError("");
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      productCode: product.productCode || "",
      name: product.name || "",
      categoryId: product.categoryId || product.category?.id || "",
      price: product.price || "",
      stock: product.stock ?? 0,
      description: product.description || "",
      image: product.image || "",
      imagePublicId: product.imagePublicId || "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      accessLevel: product.accessLevel || "general",
      featured: Boolean(product.featured),
      newArrival: Boolean(product.newArrival),
      active: Boolean(product.active),
      type: product.type || "item",
      occasion: product.occasion || "",
      ageRange: product.ageRange || "",
      contents: Array.isArray(product.contents) ? product.contents.join("\n") : "",
    });
    setShowForm(true);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags,
        type: form.type,
        occasion: form.occasion,
        ageRange: form.ageRange,
        contents: form.contents,
      };

      if (editingId) await updateAdminProduct(editingId, payload);
      else await createAdminProduct(payload);

      setShowForm(false);
      setForm(emptyForm);
      setNotice(editingId ? "Product updated successfully." : "Product added to the catalogue.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const archive = async (product) => {
    if (!window.confirm(`Archive “${product.name}”? It will no longer appear in the store.`)) return;

    try {
      await archiveAdminProduct(product.id);
      setNotice("Product archived.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("g3-admin-token");
    localStorage.removeItem("g3-admin-user");
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f8f6fb] text-[#160022]">
      <header className="border-b border-black/5 bg-[#0F001C] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-light-purple">G3 Store</p>
            <h1 className="text-xl font-black">Admin Catalogue</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="hidden rounded-xl px-3 py-2 text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white sm:block">View store</button>
            <button onClick={logout} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15"><LogOut size={15} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8 lg:py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Products", stats.total, PackagePlus],
            ["Active", stats.active, CheckCircle2],
            ["Low stock", stats.low, Sparkles],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><span className="text-sm font-bold text-black/50">{label}</span><Icon size={18} className="text-g3-purple" /></div>
              <p className="mt-3 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black">Products</h2>
            <p className="mt-1 text-sm text-black/50">Add and manage products without editing application code.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-g3-purple px-5 py-3.5 text-sm font-black text-white hover:bg-g3-pink"><Plus size={18} /> Add product</button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm">
          <Search size={18} className="text-black/35" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product name or code..." className="w-full bg-transparent text-sm outline-none" />
        </div>

        {notice && <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{notice}</div>}
        {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

        <div className="mt-6 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm font-bold text-black/45">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center"><PackagePlus className="mx-auto text-black/20" size={40} /><p className="mt-4 font-black">No products found</p><p className="mt-1 text-sm text-black/45">Add your first product from the button above.</p></div>
          ) : (
            <div className="divide-y divide-black/5">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f4eff8]">
                    {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={24} className="text-black/20" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-black">{product.name}</h3>
                      {!product.active && <span className="rounded-full bg-black/5 px-2 py-1 text-[10px] font-black uppercase">Archived</span>}
                      {product.newArrival && <span className="rounded-full bg-purple-50 px-2 py-1 text-[10px] font-black uppercase text-g3-purple">New</span>}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-black/40">{product.productCode} · {product.category?.name || "No category"}</p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm"><span className="font-black">{money(product.price)}</span><span className={Number(product.stock) <= 5 ? "font-bold text-orange-600" : "text-black/50"}>Stock: {product.stock}</span><span className="text-black/50">Access: {product.accessLevel}</span></div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => openEdit(product)} className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-black hover:bg-black/5"><Pencil size={15} /> Edit</button>
                    {product.active && <button onClick={() => archive(product)} className="flex items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"><Archive size={15} /> Archive</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-2xl rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-g3-pink">Catalogue</p><h2 className="mt-1 text-xl font-black">{editingId ? "Edit product" : "Add product"}</h2></div>
              <button onClick={() => setShowForm(false)} className="rounded-xl p-2 hover:bg-black/5"><X size={20} /></button>
            </div>

            <form onSubmit={submit} className="grid gap-5 p-6 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="label">Product name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="e.g. Pink Petals Body Spray" /></label>
              <label><span className="label">Product code</span><input required value={form.productCode} onChange={(e) => setForm({ ...form, productCode: e.target.value })} className="field" placeholder="beauty-009" /></label>
              <label><span className="label">Category</span><select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="field"><option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <label><span className="label">Price (₦)</span><input required min="0" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="field" /></label>
              <label><span className="label">Stock quantity</span><input required min="0" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="field" /></label>
              <div className="sm:col-span-2">
                <span className="label">Product image</span>
                <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#faf8fc] p-3 sm:flex-row sm:items-center">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f4eff8]">
                    {form.image ? <img src={form.image} alt="Product preview" className="h-full w-full object-cover" /> : <ImageIcon size={28} className="text-black/20" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-g3-purple px-4 py-2.5 text-xs font-black text-white hover:bg-g3-pink">
                      {uploadingImage ? "Uploading..." : form.image ? "Replace image" : "Choose image"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploadingImage || saving}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (!file) return;
                          setUploadingImage(true);
                          setError("");
                          try {
                            const uploaded = await uploadProductImage(file);
                            setForm((current) => ({ ...current, image: uploaded.url, imagePublicId: uploaded.publicId }));
                          } catch (err) {
                            setError(err.message);
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                    </label>
                    <p className="mt-2 text-[11px] leading-5 text-black/40">JPG, PNG, WebP or GIF. Maximum 8 MB. Images are stored securely in Cloudinary.</p>
                  </div>
                </div>
              </div>
              <label className="sm:col-span-2"><span className="label">Description</span><textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="field resize-none" /></label>
              <label><span className="label">Access level</span><select value={form.accessLevel} onChange={(e) => setForm({ ...form, accessLevel: e.target.value })} className="field"><option value="general">Everyone</option><option value="member">Members</option><option value="premier">Premier</option></select></label>
              <label><span className="label">Tags</span><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="field" placeholder="beauty, fragrance" /></label>
              <label><span className="label">Store type</span><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="field"><option value="item">Product</option><option value="package">Package</option></select></label>
              <label><span className="label">Age range</span><input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} className="field" placeholder="10-12" /></label>
              <label><span className="label">Occasion</span><input value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} className="field" placeholder="birthday" /></label>
              <label className="sm:col-span-2"><span className="label">Package contents</span><textarea rows="3" value={form.contents} onChange={(e) => setForm({ ...form, contents: e.target.value })} className="field resize-none" placeholder="One item per line (optional for packages)" /></label>
              <div className="sm:col-span-2 grid gap-3 rounded-2xl bg-black/[0.03] p-4 sm:grid-cols-3">
                <label className="check"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                <label className="check"><input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} /> New arrival</label>
                <label className="check"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-2xl px-5 py-3 text-sm font-black hover:bg-black/5">Cancel</button>
                <button disabled={saving || uploadingImage} className="rounded-2xl bg-g3-purple px-6 py-3 text-sm font-black text-white hover:bg-g3-pink disabled:opacity-50">{saving ? "Saving..." : editingId ? "Save changes" : "Add product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`.label{display:block;margin-bottom:.5rem;font-size:.75rem;font-weight:800;color:rgba(22,0,34,.55)}.field{width:100%;border:1px solid rgba(0,0,0,.1);border-radius:1rem;padding:.8rem .9rem;font-size:.875rem;outline:none;background:white}.field:focus{border-color:#6d28d9}.check{display:flex;align-items:center;gap:.55rem;font-size:.8rem;font-weight:800}`}</style>
    </main>
  );
}

export default AdminProducts;
