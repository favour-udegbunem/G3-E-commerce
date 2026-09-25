import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

function TierGate({ requiredTier = "member" }) {
  const label = requiredTier === "premier" ? "Premier" : "Member";

  return (
    <main className="min-h-[70vh] bg-[#0F001C] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
          <LockKeyhole size={34} />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
          {label} exclusive
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">
          This experience is unlocked at {label} tier.
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Complete your G3 Lounge tier requirements to unlock this feature.
          Your progress never resets.
        </p>
        <Link
          to="/tiers"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-purple px-7 py-3.5 text-sm font-black text-white hover:bg-g3-pink"
        >
          See My Progress <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}

export default TierGate;
