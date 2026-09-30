import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { useTier } from "../context/TierContext";

function WelcomeGift() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useTier();

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const storageKey = `g3-welcome-gift-dismissed-${user.id}`;
    const alreadyDismissed =
      localStorage.getItem(storageKey) === "true";

    setDismissed(alreadyDismissed);
  }, [user?.id]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (user.welcomeGiftClaimed) {
    return null;
  }

  if (dismissed) {
    return null;
  }

  if (
    user.isFirstTimeUser === false &&
    user.welcomeGiftClaimed !== false
  ) {
    return null;
  }

  const handleClick = () => {
    const storageKey = `g3-welcome-gift-dismissed-${user.id}`;

    localStorage.setItem(storageKey, "true");
    setDismissed(true);

    navigate("/welcome-gift");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-md cursor-pointer rounded-2xl border border-g3-gold/40 bg-[#1A002E] p-4 text-left shadow-2xl transition hover:border-g3-gold hover:bg-[#22003a] sm:left-auto"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-g3-gold text-[#0F001C]">
          <Gift size={18} />
        </div>

        <div>
          <p className="text-sm font-black text-white">
            Welcome gift unlocked — tap here
          </p>

          <p className="mt-1 text-xs leading-5 text-white/60">
            Claim your free Global Giant Girls T-Shirt. Choose style & size,
            then add it to your G3 Box (with other items).
          </p>
        </div>
      </div>
    </button>
  );
}

export default WelcomeGift;