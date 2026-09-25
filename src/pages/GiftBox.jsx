import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gift,
  Heart,
  Minus,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import LoungeSidebar from "../components/LoungeSidebar";
import { products } from "../data/products";
import TierGate from "../components/TierGate";
import { useTier } from "../context/TierContext";

function GiftBox() {
  const { currentTier, isAuthenticated } = useTier();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [step, setStep] = useState(1);

  const [recipient, setRecipient] = useState("");

  const [occasion, setOccasion] = useState("");

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [giftMessage, setGiftMessage] = useState("");

  const [packaging, setPackaging] = useState("Classic");

  const recipientOptions = [
    "Myself",
    "Friend",
    "Sister",
    "Daughter",
    "Granddaughter",
    "Niece",
    "Mom",
    "Other",
  ];

  const occasionOptions = [
    "Birthday",
    "Valentine",
    "Graduation",
    "Celebration",
    "Just Because",
    "Ramadan",
    "Easter",
    "Christmas",
    "New Year",
    "Matriculation",
    "Other",
  ];

  const packagingOptions = [
    {
      name: "Classic",
      description: "Simple, beautiful G3 presentation.",
    },
    {
      name: "Pretty Pink",
      description: "A playful pink gift experience.",
    },
    {
      name: "Premium",
      description: "A special presentation for special moments.",
    },
  ];

  const addProduct = (product) => {
    setSelectedProducts((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setSelectedProducts((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setSelectedProducts((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts((current) =>
      current.filter((item) => item.id !== productId)
    );
  };

  const total = useMemo(() => {
    return selectedProducts.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * item.quantity,
      0
    );
  }, [selectedProducts]);

  const itemCount = useMemo(() => {
    return selectedProducts.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [selectedProducts]);

  const canContinue = () => {
    if (step === 1) {
      return recipient !== "";
    }

    if (step === 2) {
      return occasion !== "";
    }

    if (step === 3) {
      return selectedProducts.length > 0;
    }

    return true;
  };

  const nextStep = () => {
    if (!canContinue()) {
      return;
    }

    setStep((current) => Math.min(current + 1, 5));
  };

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  if (!isAuthenticated || (currentTier !== "member" && currentTier !== "premier")) {
    return <TierGate requiredTier="member" />;
  }

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
              Custom Gift Box
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

        {/* PAGE */}
        <section className="min-w-0 flex-1">

          {/* PAGE HEADER */}
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
                  <Gift size={23} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-light-purple">
                    Member Exclusive
                  </p>

                  <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                    Create a Custom Gift Box
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                    Put together something personal for someone
                    special.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* BUILDER */}
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">

            {/* STEP INDICATOR */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">

              <div className="flex items-center justify-between">

                {[1, 2, 3, 4, 5].map((number) => (
                  <div
                    key={number}
                    className="flex flex-1 items-center"
                  >

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${
                        step >= number
                          ? "bg-g3-purple text-white"
                          : "bg-gray-100 text-g3-gold"
                      }`}
                    >
                      {step > number ? (
                        <Check size={16} />
                      ) : (
                        number
                      )}
                    </div>

                    {number < 5 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 transition ${
                          step > number
                            ? "bg-g3-purple"
                            : "bg-gray-100"
                        }`}
                      />
                    )}

                  </div>
                ))}

              </div>

              <div className="mt-3 hidden justify-between text-[10px] font-bold text-white/45 sm:flex">
                <span>Recipient</span>
                <span>Occasion</span>
                <span>Products</span>
                <span>Message</span>
                <span>Preview</span>
              </div>

              <p className="mt-3 text-xs font-bold text-g3-purple sm:hidden">
                Step {step} of 5
              </p>

            </div>

            {/* BUILDER GRID */}
            <div className="grid gap-6 xl:grid-cols-[1fr_350px]">

              {/* LEFT CONTENT */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">

                {/* STEP 1 */}
                {step === 1 && (
                  <div>

                    <div className="mb-7">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-pink">
                        Step 01
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-white">
                        Who are you creating this gift for?
                      </h2>

                      <p className="mt-2 text-sm text-white/55">
                        Tell us who this little surprise is meant
                        for.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                      {recipientOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setRecipient(option)}
                          className={`rounded-2xl cursor-pointer border p-5 text-left transition ${
                            recipient === option
                              ? "border-g3-pink bg-g3-light-pink text-g3-purple"
                              : "border-white/10 bg-white/5 text-white/65 hover:border-g3-light-purple hover:bg-g3-pink"
                          }`}
                        >
                          <div className="flex items-center justify-between">

                            <span className="text-sm font-black">
                              {option}
                            </span>

                            {recipient === option && (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-g3-pink text-white">
                                <Check size={14} />
                              </span>
                            )}

                          </div>
                        </button>
                      ))}

                    </div>

                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>

                    <div className="mb-7">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-pink">
                        Step 02
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-white">
                        What's the occasion?
                      </h2>

                      <p className="mt-2 text-sm text-white/55">
                        Choose the reason behind the gift.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                      {occasionOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setOccasion(option)}
                          className={`rounded-2xl border p-5 text-left transition ${
                            occasion === option
                              ? "border-g3-pink bg-g3-light-pink text-g3-purple"
                              : "border-white/10 bg-white/5 text-white/65 hover:border-g3-light-purple hover:bg-purple-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">

                            <span className="text-sm font-black">
                              {option}
                            </span>

                            {occasion === option && (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-g3-pink text-white">
                                <Check size={14} />
                              </span>
                            )}

                          </div>
                        </button>
                      ))}

                    </div>

                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>

                    <div className="mb-7">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-pink">
                        Step 03
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-white">
                        Choose what goes inside.
                      </h2>

                      <p className="mt-2 text-sm text-white/55">
                        Pick the G3 products you want in your box.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      {products.slice(0, 12).map((product) => (
                        <div
                          key={product.id}
                          className="flex gap-3 rounded-2xl border border-white/10 p-3 transition hover:border-g3-light-purple"
                        >

                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 object-cover"
                          />

                          <div className="min-w-0 flex-1">

                            <h3 className="truncate text-sm font-black text-white">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-xs font-bold text-g3-pink">
                              ₦{Number(product.price || 0).toLocaleString()}
                            </p>

                            <button
                              type="button"
                              onClick={() => addProduct(product)}
                              className="mt-3 inline-flex items-center gap-1 rounded-full bg-g3-purple px-3 py-1.5 text-[10px] font-black text-white transition hover:bg-g3-pink"
                            >
                              <Plus size={13} />
                              Add
                            </button>

                          </div>

                        </div>
                      ))}

                    </div>

                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div>

                    <div className="mb-7">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-pink">
                        Step 04
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-white">
                        Add a personal message.
                      </h2>

                      <p className="mt-2 text-sm text-white/55">
                        A few words can make the gift feel even more
                        personal.
                      </p>
                    </div>

                    <textarea
                      value={giftMessage}
                      onChange={(event) =>
                        setGiftMessage(event.target.value)
                      }
                      maxLength={300}
                      rows={7}
                      placeholder="Write something thoughtful..."
                      className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-gray-800 outline-none transition placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/10"
                    />

                    <div className="mt-2 text-right text-xs text-white/45">
                      {giftMessage.length}/300
                    </div>

                    <div className="mt-8">

                      <h3 className="text-sm font-black text-white">
                        Choose your packaging
                      </h3>

                      <div className="mt-4 space-y-3">

                        {packagingOptions.map((option) => (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() =>
                              setPackaging(option.name)
                            }
                            className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                              packaging === option.name
                                ? "border-g3-pink bg-g3-light-pink"
                                : "border-white/10 hover:border-g3-light-purple"
                            }`}
                          >
                            <div>

                              <p className="text-sm font-black text-white">
                                {option.name}
                              </p>

                              <p className="mt-1 text-xs text-white/50">
                                {option.description}
                              </p>

                            </div>

                            {packaging === option.name && (
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-g3-pink text-white">
                                <Check size={15} />
                              </span>
                            )}

                          </button>
                        ))}

                      </div>

                    </div>

                  </div>
                )}

                {/* STEP 5 */}
                {step === 5 && (
                  <div>

                    <div className="mb-7">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-g3-pink">
                        Step 05
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-white">
                        Your gift box is ready.
                      </h2>

                      <p className="mt-2 text-sm text-white/55">
                        Take one final look before saving your box.
                      </p>
                    </div>

                    <div className="rounded-3xl bg-g3-light-pink p-6">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-g3-pink text-white">
                          <Gift size={22} />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-g3-pink">
                            {occasion || "Special Occasion"}
                          </p>

                          <h3 className="text-lg font-black text-white">
                            Gift for {recipient || "Someone Special"}
                          </h3>
                        </div>

                      </div>

                      {giftMessage && (
                        <div className="mt-6 rounded-2xl bg-white/5 p-5">
                          <div className="flex gap-3">
                            <Heart
                              size={18}
                              className="mt-0.5 shrink-0 text-g3-pink"
                              fill="currentColor"
                            />

                            <p className="text-sm leading-6 text-white/65">
                              {giftMessage}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="mt-6">

                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-black text-white">
                            Items
                          </h3>

                          <span className="text-xs font-bold text-white/45">
                            {itemCount} item
                            {itemCount !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="space-y-3">

                          {selectedProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 rounded-2xl bg-white p-3"
                            >

                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-14 w-14 rounded-xl object-cover"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-black text-white">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-xs text-white/45">
                                  ₦
                                  {Number(
                                    product.price || 0
                                  ).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(product.id)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-white/65"
                                >
                                  <Minus size={13} />
                                </button>

                                <span className="w-4 text-center text-xs font-black text-g3-purple">
                                  {product.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(product.id)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-white/65"
                                >
                                  <Plus size={13} />
                                </button>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeProduct(product.id)
                                }
                                className="ml-1 text-gray-300 transition hover:text-red-500"
                                aria-label={`Remove ${product.name}`}
                              >
                                <Trash2 size={17} />
                              </button>

                            </div>
                          ))}

                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* NAVIGATION */}
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={previousStep}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/65 transition hover:border-g3-light-purple hover:text-g3-purple"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 5 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canContinue()}
                      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white transition ${
                        canContinue()
                          ? "bg-g3-purple hover:bg-g3-pink"
                          : "cursor-not-allowed bg-gray-300"
                      }`}
                    >
                      Continue
                      <ArrowRight size={16} />
                    </button>
                  )}

                  {step === 5 && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-g3-purple px-6 py-3 text-sm font-black text-white transition hover:bg-g3-pink"
                    >
                      Save Gift Box
                      <Check size={16} />
                    </button>
                  )}

                </div>

              </div>

              {/* LIVE SUMMARY */}
              <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 xl:sticky xl:top-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-g3-light-pink text-g3-pink">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-g3-pink">
                      Your Box
                    </p>

                    <h2 className="text-lg font-black text-white">
                      Gift Summary
                    </h2>
                  </div>

                </div>

                <div className="mt-6 space-y-4 border-t border-white/10 pt-5">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">
                      Recipient
                    </span>

                    <span className="font-bold text-white">
                      {recipient || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">
                      Occasion
                    </span>

                    <span className="font-bold text-white">
                      {occasion || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">
                      Items
                    </span>

                    <span className="font-bold text-white">
                      {itemCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">
                      Packaging
                    </span>

                    <span className="font-bold text-white">
                      {packaging}
                    </span>
                  </div>

                </div>

                <div className="mt-6 border-t border-white/10 pt-5">

                  <div className="flex items-end justify-between">

                    <span className="text-sm font-bold text-white/55">
                      Estimated Total
                    </span>

                    <span className="text-2xl font-black text-white">
                      ₦{total.toLocaleString()}
                    </span>

                  </div>

                </div>

                <div className="mt-5 rounded-2xl bg-white/5 p-4">

                  <p className="text-xs leading-5 text-white/55">
                    Your gift box is currently a draft. You can
                    review and save it before adding it to your
                    G3 Box.
                  </p>

                </div>

              </aside>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default GiftBox;