import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { useTier } from "../context/TierContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
  } = useCart();

  const { isAuthenticated, user } = useTier();

  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    deliveryNote: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please enter your city.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "Please enter your state.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
     * TEMPORARY:
     *
     * Later today the backend will receive:
     *
     * formData
     * cartItems
     * cartTotal
     * deliveryFee
     * grandTotal
     *
     * and create the actual order in MySQL.
     */

    const orderReference = `G3-${Date.now().toString().slice(-8)}`;

    sessionStorage.setItem(
      "g3-last-order",
      JSON.stringify({
        orderReference,
        customer: formData,
        items: cartItems,
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
      })
    );

    navigate("/order-success", {
      state: { orderReference },
    });
  };

  /*
   * Don't allow checkout with an empty G3 Box.
   */
  if (cartItems.length === 0) {
    return (
      <main className="bg-[#0F001C]">
        <section className="mx-auto flex min-h-[650px] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
              <ShoppingBag size={40} />
            </div>

            <h1 className="mt-7 text-3xl font-black text-white">
              Your G3 Box is empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Add something special to your G3 Box before
              continuing to checkout.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-purple px-7 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
            >
              Start Shopping
              <ArrowRight size={17} />
            </Link>

          </div>
        </section>

        <Footer />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="bg-[#0F001C]">
        <section className="mx-auto flex min-h-[650px] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
              <User size={34} />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
              One quick step before payment
            </p>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Create your G3 Lounge account
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">
              You can browse, add products to your G3 Box and shop as a guest.
              To complete checkout, we need you to create a free G3 Lounge account.
            </p>

            <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
              {[
                "Your order stays connected to you",
                "You receive your G3 Guest badge",
                "You unlock your referral code",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-g3-light-pink/60 p-4 text-xs font-bold leading-5 text-white">
                  {item}
                </div>
              ))}
            </div>

            <Link
              to="/register?redirect=/checkout"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-g3-purple px-7 py-4 text-sm font-black text-white transition hover:bg-g3-pink sm:w-auto"
            >
              Create My Account & Continue
              <ArrowRight size={17} />
            </Link>

            <p className="mt-4 text-xs text-white/45">
              Already have an account? <Link to="/login" className="font-black text-g3-pink hover:text-white">Sign in</Link>
            </p>

            <Link to="/box" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white/45 hover:text-white">
              <ArrowLeft size={15} /> Back to G3 Box
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#0F001C]">

      {/* HEADER */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex items-center gap-2 text-sm text-white/45">
            <Link
              to="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/box"
              className="transition hover:text-white"
            >
              G3 Box
            </Link>

            <span>/</span>

            <span className="font-semibold text-white">
              Checkout
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-g3-pink text-white">
              <LockKeyhole size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white sm:text-4xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-white/55">
                Almost there. Let's get your G3 Box to you.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CHECKOUT */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_390px]"
        >

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* CUSTOMER INFORMATION */}
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

              <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                    <User size={19} />
                  </div>

                  <div>
                    <h2 className="font-black text-white">
                      Your Information
                    </h2>

                    <p className="mt-0.5 text-xs text-white/45">
                      We need these details to process your order.
                    </p>
                  </div>

                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">

                {/* FULL NAME */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`h-12 w-full rounded-xl border bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                      errors.fullName
                        ? "border-red-300 focus:border-red-400"
                        : "border-white/15 focus:border-g3-light-purple"
                    }`}
                  />

                  {errors.fullName && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-white"
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
                    className={`h-12 w-full rounded-xl border bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                      errors.email
                        ? "border-red-300 focus:border-red-400"
                        : "border-white/15 focus:border-g3-light-purple"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0801 234 5678"
                    className={`h-12 w-full rounded-xl border bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                      errors.phone
                        ? "border-red-300 focus:border-red-400"
                        : "border-white/15 focus:border-g3-light-purple"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

              </div>
            </section>

            {/* DELIVERY INFORMATION */}
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

              <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h2 className="font-black text-white">
                      Delivery Information
                    </h2>

                    <p className="mt-0.5 text-xs text-white/45">
                      Where should we deliver your G3 Box?
                    </p>
                  </div>

                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">

                {/* ADDRESS */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, area..."
                    className={`w-full resize-none rounded-xl border bg-[#0F001C] px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                      errors.address
                        ? "border-red-300 focus:border-red-400"
                        : "border-white/15 focus:border-g3-light-purple"
                    }`}
                  />

                  {errors.address && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* CITY */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Awka"
                    className={`h-12 w-full rounded-xl border bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                      errors.city
                        ? "border-red-300 focus:border-red-400"
                        : "border-white/15 focus:border-g3-light-purple"
                    }`}
                  />

                  {errors.city && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* STATE */}
                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Anambra"
                    className={`h-12 w-full rounded-xl border bg-[#0F001C] px-4 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10 ${
                      errors.state
                        ? "border-red-300 focus:border-red-400"
                        : "border-white/15 focus:border-g3-light-purple"
                    }`}
                  />

                  {errors.state && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* DELIVERY NOTE */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="deliveryNote"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Delivery Note{" "}
                    <span className="font-normal text-white/45">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="deliveryNote"
                    name="deliveryNote"
                    rows="2"
                    value={formData.deliveryNote}
                    onChange={handleChange}
                    placeholder="Anything the delivery person should know?"
                    className="w-full resize-none rounded-xl border border-white/15 bg-[#0F001C] px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white/5 focus:ring-4 focus:ring-g3-light-purple/10"
                  />
                </div>

              </div>
            </section>

            {/* PAYMENT */}
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

              <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-g3-light-pink text-g3-pink">
                    <LockKeyhole size={19} />
                  </div>

                  <div>
                    <h2 className="font-black text-white">
                      Payment
                    </h2>

                    <p className="mt-0.5 text-xs text-white/45">
                      Secure payment will be connected to the backend.
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-6 sm:p-8">

                <div className="rounded-2xl border-2 border-g3-light-purple bg-g3-light-pink/40 p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white shadow-sm">
                      <LockKeyhole size={19} />
                    </div>

                    <div>
                      <p className="font-black text-white">
                        Secure Online Payment
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/55">
                        Your payment will be processed securely.
                        We'll connect the payment gateway when
                        the G3 Lounge backend is ready.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-4 rounded-2xl bg-g3-light-pink/50 p-4">
                  <p className="text-xs font-bold text-white">
                    G3 Guest account active
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    You are checking out as {user?.firstName || "a G3 Guest"}.
                    Your order will count toward your Lounge progress.
                  </p>
                </div>

              </div>
            </section>

          </div>

          {/* RIGHT SIDE — ORDER SUMMARY */}
          <aside className="lg:sticky lg:top-28 lg:self-start">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-black text-white">
                    Your G3 Box
                  </h2>

                  <span className="rounded-full bg-g3-light-pink px-3 py-1 text-xs font-bold text-g3-pink">
                    {cartItems.length}{" "}
                    {cartItems.length === 1
                      ? "item"
                      : "items"}
                  </span>

                </div>
              </div>

              {/* ITEMS */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 px-6 py-5"
                  >

                    <Link
                      to={`/product/${item.id}`}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-g3-light-pink"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-g3-purple px-1 text-[9px] font-black text-white">
                        {item.quantity}
                      </span>
                    </Link>

                    <div className="min-w-0 flex-1">

                      <Link
                        to={`/product/${item.id}`}
                        className="line-clamp-2 text-sm font-bold text-white transition hover:text-g3-pink"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-xs text-white/45">
                        ₦{item.price.toLocaleString()} each
                      </p>

                    </div>

                    <p className="shrink-0 text-sm font-black text-white">
                      ₦
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </p>

                  </div>
                ))}

              </div>

              {/* SUMMARY */}
              <div className="border-t border-white/10 px-6 py-6">

                <div className="space-y-4">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">
                      Subtotal
                    </span>

                    <span className="font-bold text-white">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">
                      Delivery
                    </span>

                    <span className="font-bold text-white">
                      ₦{deliveryFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-white/15 pt-5">

                    <div className="flex items-end justify-between gap-4">

                      <div>
                        <p className="text-sm font-bold text-white/55">
                          Total
                        </p>

                        <p className="mt-1 text-xs text-white/45">
                          Delivery included
                        </p>
                      </div>

                      <p className="text-2xl font-black text-white">
                        ₦{grandTotal.toLocaleString()}
                      </p>

                    </div>

                  </div>

                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-g3-gold px-6 py-4 text-sm font-black text-white transition hover:bg-g3-pink"
                >
                  Continue to Payment
                  <ArrowRight size={17} />
                </button>

                <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#0F001C] p-4">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-green-500"
                  />

                  <p className="text-xs leading-5 text-white/55">
                    Your order information is kept private and
                    will only be used to process your G3 Lounge
                    order.
                  </p>
                </div>

              </div>
            </div>

            {/* BACK TO BOX */}
            <Link
              to="/box"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-g3-pink"
            >
              <ArrowLeft size={17} />
              Back to G3 Box
            </Link>

          </aside>

        </form>
      </section>

      <Footer />
    </main>
  );
}

export default Checkout;