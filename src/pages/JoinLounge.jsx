import {
  ArrowRight,
  Bell,
  Gift,
  Heart,
  ShoppingBag,
  Users,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";

function JoinLounge() {
  const benefits = [
    {
      icon: Bell,
      title: "Early Access",
      description:
        "Be among the first to know when new products, collections and special drops arrive.",
    },
    {
      icon: Gift,
      title: "Member Offers",
      description:
        "Get access to selected promotions and special offers created for G3 Lounge members.",
    },
    {
      icon: Heart,
      title: "Save Your Favourites",
      description:
        "Keep your favourite G3 products in one place with your personal wishlist.",
    },
    {
      icon: ShoppingBag,
      title: "Track Your Orders",
      description:
        "Keep your purchases organised and follow your orders from your account.",
    },
  ];

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="overflow-hidden bg-g3-purple">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-g3-pink/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-g3-light-pink">
                <Sparkles size={14} />
                Welcome to G3 Lounge
              </span>

              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                More than shopping.
                <span className="block text-g3-light-purple">
                  It's a lounge.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                Join the G3 Lounge community and stay connected to the
                products, offers and moments created with girls in mind.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-g3-pink px-7 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-g3-gold"
                >
                  Join G3 Lounge
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-g3-pink/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-g3-light-purple/20 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-g3-pink text-white">
                  <Users size={30} />
                </div>

                <h2 className="mt-6 text-2xl font-black text-white">
                  Become part of G3
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  You can still shop as a guest. Joining simply gives you
                  more ways to stay connected with G3 Lounge.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "Early notifications",
                    "Personal wishlist",
                    "Order history",
                    "Member offers",
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
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#0F001C]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
              Why join?
            </p>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Your G3 experience, all in one place.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/55">
              Shopping remains open to everyone. Membership simply gives
              you extra features and benefits.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-g3-light-purple hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-g3-light-pink text-g3-pink">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-g3-purple">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
              Simple
            </p>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Getting started takes minutes.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Create your account",
                text: "Tell us a few basic details and create your G3 Lounge account.",
              },
              {
                number: "02",
                title: "Explore G3",
                text: "Browse products, save favourites and discover what's new.",
              },
              {
                number: "03",
                title: "Stay connected",
                text: "Receive relevant updates and manage your G3 experience from your account.",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-g3-purple text-sm font-black text-white">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-g3-gold/15">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-g3-pink sm:text-4xl">
            Ready to join the lounge?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-g3-purple">
            Create your account and become part of the G3 Lounge
            community.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-g3-purple px-7 py-4 text-sm font-black text-white transition hover:bg-g3-pink"
            >
              Create My Account
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full border border-g3-purple/20 bg-white/5 px-7 py-4 text-sm font-bold text-g3-purple transition hover:border-g3-pink hover:text-g3-pink"
            >
              Shop as Guest
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default JoinLounge;