import { ArrowRight, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTier } from "../context/TierContext";
import TierBadge from "./TierBadge";

function TierWelcomeModal() {
  const navigate = useNavigate();
  const { welcomeTier, clearWelcome } = useTier();

  if (!welcomeTier) return null;

  const handleExplore = () => {
    clearWelcome();
    navigate("/tiers");
  };

  const handleClose = () => clearWelcome();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#1A002E] shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
          aria-label="Close"
        >
          <X size={19} />
        </button>

        <div className="bg-gradient-to-br from-[#1A002E] to-[#2D0A4E] px-6 pb-8 pt-10 text-center text-white sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-g3-gold text-[#0F001C] shadow-lg shadow-amber-500/20">
            <Sparkles size={29} />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-g3-gold">
            Welcome to G3 Lounge
          </p>
          <h2 className="mt-2 text-3xl font-black">
            You&apos;ve earned your badge! 🎉
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/65">
            Your G3 journey has officially started. Learn how the Lounge
            tiers work and what you can unlock next.
          </p>
        </div>

        <div className="border-t border-white/10 p-6 text-center sm:p-8">
          <TierBadge tier="guest" />
          <p className="mt-4 text-sm leading-6 text-white/55">
            You are now a registered G3 Guest. Your orders and referrals will
            build toward your next tier.
          </p>

          <button
            type="button"
            onClick={handleExplore}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-g3-gold px-6 py-4 text-sm font-black text-[#0F001C] transition hover:bg-white"
          >
            Learn About G3 Tiers
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TierWelcomeModal;