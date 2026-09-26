import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  Gift,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

import Footer from "../components/Footer";
import { ageRanges, occasions, getPackages, products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useTier } from "../context/TierContext";

const budgets = [
  { id: "under-10k", label: "Under ₦10,000", max: 10000 },
  { id: "10-15k", label: "₦10,000 – ₦15,000", max: 15000 },
  { id: "15-20k", label: "₦15,000 – ₦20,000", max: 20000 },
  { id: "20k-plus", label: "₦20,000+", max: Infinity },
];

const CHILDREN_KEY = "g3-children";

function loadChildren() {
  try {
    const raw = localStorage.getItem(CHILDREN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChildren(list) {
  localStorage.setItem(CHILDREN_KEY, JSON.stringify(list));
}

function CustomBox() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, currentTier } = useTier();

  const allPackages = useMemo(() => {
    const pkgs = getPackages();
    if (pkgs.length > 0) return pkgs;
    return products.filter((p) => p.featured).slice(0, 8).map((p) => ({
      ...p,
      type: "package",
      contents: p.contents || ["Curated G3 essentials"],
    }));
  }, []);

  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [added, setAdded] = useState(false);

  const [children, setChildren] = useState(loadChildren);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [notifyChild, setNotifyChild] = useState(true);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("10-12");

  useEffect(() => {
    saveChildren(children);
  }, [children]);

  const matches = useMemo(() => {
    let list = [...allPackages];
    if (age) list = list.filter((pkg) => !pkg.ageRange || pkg.ageRange === age);
    if (occasion)
      list = list.filter((pkg) => !pkg.occasion || pkg.occasion === occasion);
    if (budget) {
      const b = budgets.find((x) => x.id === budget);
      if (b) list = list.filter((pkg) => pkg.price <= b.max);
    }
    if (list.length === 0) return allPackages;
    return list;
  }, [allPackages, age, occasion, budget]);

  const selected = allPackages.find((p) => p.id === selectedPackageId);
  const selectedChild = children.find((c) => c.id === selectedChildId);

  const addChild = () => {
    const name = newChildName.trim();
    if (!name) return;
    const child = {
      id: `child-${Date.now()}`,
      name,
      ageRange: newChildAge,
      notify: true,
    };
    setChildren((prev) => [...prev, child]);
    setSelectedChildId(child.id);
    setNewChildName("");
  };

  const removeChild = (id) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
    if (selectedChildId === id) setSelectedChildId("");
  };

  const canNext =
    (step === 1 && !!age) ||
    (step === 2 && !!occasion) ||
    (step === 3 && !!budget) ||
    (step === 4 && !!selectedPackageId) ||
    step === 5 ||
    step === 6;

  const handleAdd = () => {
    if (!selected) return;

    const cartLineId = selectedChild
      ? `${selected.id}__${selectedChild.id}`
      : `${selected.id}__self`;

    addToCart({
      ...selected,
      id: cartLineId,
      baseProductId: selected.id,
      recipientChildId: selectedChild?.id || null,
      recipientName: selectedChild?.name || null,
      notifyRecipient: selectedChild ? notifyChild : false,
      customMessage: message.trim() || undefined,
      name: selectedChild
        ? `${selected.name} → ${selectedChild.name}`
        : message.trim()
          ? `${selected.name} (Personalised)`
          : selected.name,
    });

    setAdded(true);
    setTimeout(() => navigate("/box"), 1000);
  };

  return (
    <main className="min-h-screen bg-[#0F001C]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/shop?type=package"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to packages
        </Link>

        <div className="mt-6 flex items-center gap-2 text-g3-gold">
          <Gift size={18} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Customise a Box
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Build something special for her.
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Create one box — or several for different daughters. Assign each box
          to a child and choose who gets a notification.
        </p>

        <div className="mt-8 flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${
                n <= step ? "bg-g3-pink" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-bold text-white/40">Step {step} of 6</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          {step === 1 && (
            <>
              <h2 className="text-xl font-black text-white">Her age range</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {ageRanges.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAge(a.id)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold ${
                      age === a.id
                        ? "border-g3-pink bg-g3-pink text-white"
                        : "border-white/10 bg-[#0F001C] text-white/80"
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-black text-white">Occasion</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {occasions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOccasion(o.id)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold ${
                      occasion === o.id
                        ? "border-g3-gold bg-g3-gold text-[#0F001C]"
                        : "border-white/10 bg-[#0F001C] text-white/80"
                    }`}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-black text-white">Budget</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudget(b.id)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold ${
                      budget === b.id
                        ? "border-g3-purple bg-g3-purple text-white"
                        : "border-white/10 bg-[#0F001C] text-white/80"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-black text-white">Choose a package</h2>
              <p className="mt-1 text-sm text-white/50">
                {matches.length} option{matches.length === 1 ? "" : "s"}
              </p>
              <div className="mt-5 space-y-3">
                {matches.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left ${
                      selectedPackageId === pkg.id
                        ? "border-g3-pink bg-g3-pink/10"
                        : "border-white/10 bg-[#0F001C]"
                    }`}
                  >
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="h-16 w-16 rounded-xl object-cover bg-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-white">{pkg.name}</p>
                      <p className="mt-1 text-xs capitalize text-white/45">
                        {pkg.ageRange ? `Ages ${pkg.ageRange}` : "All ages"}
                        {pkg.occasion
                          ? ` · ${String(pkg.occasion).replace(/-/g, " ")}`
                          : ""}
                      </p>
                      <p className="mt-2 text-sm font-black text-g3-gold">
                        ₦{Number(pkg.price).toLocaleString()}
                      </p>
                    </div>
                    {selectedPackageId === pkg.id && (
                      <Check className="text-g3-pink" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-xl font-black text-white">Who is this box for?</h2>
              <p className="mt-1 text-sm text-white/50">
                Add each daughter so you can build separate boxes.
              </p>

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChildId("");
                    setNotifyChild(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-bold ${
                    !selectedChildId
                      ? "border-g3-gold bg-g3-gold/10 text-g3-gold"
                      : "border-white/10 bg-[#0F001C] text-white/80"
                  }`}
                >
                  <UserRound size={18} />
                  For me / general gift
                </button>

                {children.map((child) => (
                  <div
                    key={child.id}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                      selectedChildId === child.id
                        ? "border-g3-pink bg-g3-pink/10"
                        : "border-white/10 bg-[#0F001C]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedChildId(child.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white">
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{child.name}</p>
                        <p className="text-xs text-white/45">Ages {child.ageRange}</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="rounded-full p-2 text-white/40 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-white/40">
                  Add a daughter
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Her name"
                    className="h-11 flex-1 rounded-xl border border-white/15 bg-[#0F001C] px-4 text-sm text-white outline-none"
                  />
                  <select
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    className="h-11 rounded-xl border border-white/15 bg-[#0F001C] px-3 text-sm text-white"
                  >
                    {ageRanges.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addChild}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-g3-pink px-4 text-sm font-black text-white"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {selectedChild && (
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#0F001C] p-4">
                  <input
                    type="checkbox"
                    checked={notifyChild}
                    onChange={(e) => setNotifyChild(e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-sm font-bold text-white">
                      <Bell size={16} className="text-g3-gold" />
                      Notify {selectedChild.name}
                    </span>
                    <span className="mt-1 block text-xs text-white/50">
                      She&apos;ll get a notification that a G3 box is being prepared for her.
                    </span>
                  </span>
                </label>
              )}
            </>
          )}

          {step === 6 && (
            <>
              <h2 className="text-xl font-black text-white">Personal message</h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write a short note for the card..."
                className="mt-5 w-full rounded-2xl border border-white/15 bg-[#0F001C] px-4 py-3 text-sm text-white outline-none"
              />
              <div className="mt-5 rounded-2xl border border-g3-gold/30 bg-g3-gold/10 p-4">
                <p className="text-xs font-black uppercase text-g3-gold">Box summary</p>
                {selected && (
                  <>
                    <p className="mt-2 font-black text-white">{selected.name}</p>
                    <p className="text-sm text-white/60">
                      ₦{Number(selected.price).toLocaleString()}
                    </p>
                  </>
                )}
                {selectedChild ? (
                  <p className="mt-1 text-sm text-white/70">
                    For: <strong>{selectedChild.name}</strong>
                    {notifyChild ? " · notification on" : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-white/70">General gift box</p>
                )}
              </div>
            </>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white"
              >
                Back
              </button>
            )}
            {step < 6 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-g3-pink px-6 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                disabled={!selected || added}
                className="inline-flex items-center gap-2 rounded-full bg-g3-gold px-6 py-3 text-sm font-black text-[#0F001C] disabled:opacity-40"
              >
                <Sparkles size={16} />
                {added ? "Added ✓" : "Add package to G3 Box"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default CustomBox;