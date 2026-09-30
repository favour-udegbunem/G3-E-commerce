import { Crown, Gem, Sparkles } from "lucide-react";

const icons = {
  guest: Sparkles,
  member: Gem,
  premier: Crown,
};

function TierBadge({ tier = "guest", compact = false }) {
  const Icon = icons[tier] || Sparkles;

  const styles = {
    guest: "bg-g3-light-pink text-g3-pink",
    member: "bg-g3-light-purple/25 text-g3-light-purple",
    premier: "bg-g3-gold/15 text-g3-gold",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-black ${
        compact ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-xs"
      } ${styles[tier] || styles.guest}`}
    >
      <Icon size={compact ? 13 : 15} />
      G3 {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

export default TierBadge;