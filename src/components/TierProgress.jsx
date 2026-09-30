import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

function ProgressBar({ label, current, required }) {
  const percentage = Math.min(100, (current / required) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white/50">{label}</span>
        <span className="font-black text-white">
          {Math.min(current, required)} / {required}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-g3-gold transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TierProgress({
  orders,
  referrals,
  memberRequirement,
  premierRequirement,
  currentTier,
}) {
  if (currentTier === "premier") {
    return (
      <div className="rounded-3xl border border-g3-gold/20 bg-gradient-to-br from-[#1A002E] to-[#2D0A4E] p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-g3-gold text-[#0F001C]">
            <Check size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-g3-gold">
              Premier achieved
            </p>
            <h3 className="mt-1 text-xl font-black">
              You&apos;ve unlocked the top tier.
            </h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/65">
          Keep shopping and referring to enjoy the Premier benefits as G3
          Lounge grows.
        </p>
      </div>
    );
  }

  const target =
    currentTier === "member" ? premierRequirement : memberRequirement;
  const targetName = currentTier === "member" ? "Premier" : "Member";

  const ordersRemaining = Math.max(0, target.orders - orders);
  const referralsRemaining = Math.max(0, target.referrals - referrals);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-g3-gold">
            Next tier
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{targetName}</h3>
          <p className="mt-1 text-sm text-white/55">
            Your progress never resets. Every order and referral stays with
            you.
          </p>
        </div>

        <Link
          to="/tiers"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-black text-g3-gold hover:text-white"
        >
          View tiers <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <ProgressBar label="Orders" current={orders} required={target.orders} />
        <ProgressBar
          label="Referrals"
          current={referrals}
          required={target.referrals}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-g3-gold/20 bg-g3-gold/10 p-4 text-sm font-bold text-g3-gold">
        {ordersRemaining === 0 && referralsRemaining === 0
          ? `You're ready for ${targetName}.`
          : `${ordersRemaining} order${ordersRemaining === 1 ? "" : "s"} and ${referralsRemaining} referral${
              referralsRemaining === 1 ? "" : "s"
            } left to reach ${targetName}.`}
      </div>
    </div>
  );
}

export default TierProgress;