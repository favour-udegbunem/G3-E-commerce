import { ArrowRight, Check, Crown, Gem, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import TierBadge from "../components/TierBadge";
import TierProgress from "../components/TierProgress";
import {
  TIER_INFO,
  TIER_REQUIREMENTS,
  useTier,
} from "../context/TierContext";

const tierOrder = ["guest", "member", "premier"];
const icons = { guest: Sparkles, member: Gem, premier: Crown };

function Tiers() {
  const {
    currentTier,
    orders,
    referrals,
    memberRequirement,
    premierRequirement,
    isAuthenticated,
  } = useTier();

  return (
    <main className="bg-white/5">
      <section className="overflow-hidden bg-g3-purple">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-g3-pink/20 blur-3xl" />
          <div className="absolute -bottom-32 left-20 h-80 w-80 rounded-full bg-g3-light-purple/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-g3-gold">
              G3 Lounge
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Your journey through the Lounge starts here.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Every order and successful referral moves you forward. Your
              progress stays with you, so nothing starts over when you move
              from one tier to another.
            </p>
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <TierProgress
            orders={orders}
            referrals={referrals}
            memberRequirement={memberRequirement}
            premierRequirement={premierRequirement}
            currentTier={currentTier}
          />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {tierOrder.map((tier, index) => {
            const Icon = icons[tier];
            const info = TIER_INFO[tier];
            const isCurrent = currentTier === tier;

            return (
              <article
                key={tier}
                className={`relative overflow-hidden rounded-[2rem] border bg-white/5 p-7 shadow-sm transition ${
                  isCurrent
                    ? "border-g3-pink ring-2 ring-g3-pink/10"
                    : "border-white/10"
                }`}
              >
                {isCurrent && (
                  <span className="absolute right-5 top-5 rounded-full bg-g3-pink px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    You're here
                  </span>
                )}

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    tier === "guest"
                      ? "bg-g3-light-pink text-g3-pink"
                      : tier === "member"
                        ? "bg-g3-light-purple/20 text-g3-purple"
                        : "bg-g3-gold/15 text-g3-gold"
                  }`}
                >
                  <Icon size={26} />
                </div>

                <div className="mt-6">
                  <TierBadge tier={tier} />
                  <h2 className="mt-4 text-2xl font-black text-white">
                    Tier {index + 1}: {info.label}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {tier === "guest" &&
                      "Your starting point after creating your G3 Lounge account."}
                    {tier === "member" &&
                      `Reach ${TIER_REQUIREMENTS.member.orders} orders and ${TIER_REQUIREMENTS.member.referrals} successful referral to unlock Member.`}
                    {tier === "premier" &&
                      `Reach ${TIER_REQUIREMENTS.premier.orders} orders and ${TIER_REQUIREMENTS.premier.referrals} successful referrals to unlock Premier.`}
                  </p>
                </div>

                <div className="mt-7 space-y-3">
                  {info.benefits.map((benefit) => (
                    <div key={benefit} className="flex gap-3 text-sm">
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0 text-g3-pink"
                      />
                      <span className="text-white/65">{benefit}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-g3-gold/15 p-7 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
                Keep moving
              </p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Your next tier is closer than you think.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Refer friends with your personal code and keep shopping. Your
                completed progress is never reset.
              </p>
            </div>

            <Link
              to={isAuthenticated ? "/account" : "/register"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black text-white hover:bg-g3-pink"
            >
              {isAuthenticated ? "Go to My Dashboard" : "Join G3 Lounge"}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Tiers;
