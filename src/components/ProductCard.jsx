// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Heart, ShoppingBag, ArrowUpRight, Lock } from "lucide-react";

// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";
// import { useTier } from "../context/TierContext";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();
//   const { isInWishlist, toggleWishlist } = useWishlist();
//   const { currentTier, isAuthenticated } = useTier();
//   const [imageLoaded, setImageLoaded] = useState(false);

//   useEffect(() => {
//     setImageLoaded(false);
//   }, [product.image]);

//   const isMemberOrAbove =
//     isAuthenticated &&
//     (currentTier === "member" || currentTier === "premier");

//   const isEarlyAccessLocked =
//     product.memberEarlyAccess === true && !isMemberOrAbove;

//   return (
//     <Link
//       to={`/product/${product.id}`}
//       className="group flex w-[220px] min-w-[220px] max-w-[220px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1A002E] transition duration-300 hover:-translate-y-1 hover:border-g3-gold/40 hover:shadow-xl"
//     >
//       <div className="relative aspect-square w-full overflow-hidden bg-white/5">
//         {!imageLoaded && (
//           <div className="absolute inset-0 z-10 animate-pulse bg-white/10" />
//         )}

//         <img
//           src={product.image}
//           alt={product.name}
//           loading="lazy"
//           onLoad={() => setImageLoaded(true)}
//           className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
//             imageLoaded ? "opacity-100" : "opacity-0"
//           } ${isEarlyAccessLocked ? "opacity-80" : ""}`}
//         />

//         {product.newArrival && (
//           <span className="absolute left-3 top-3 z-20 rounded-full bg-g3-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
//             New
//           </span>
//         )}

//         {product.memberEarlyAccess && (
//           <span
//             className={`absolute z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
//               product.newArrival ? "left-3 top-12" : "left-3 top-3"
//             } ${
//               isEarlyAccessLocked
//                 ? "bg-white/90 text-g3-purple"
//                 : "bg-g3-purple text-white"
//             }`}
//           >
//             {isEarlyAccessLocked ? "Members early" : "Member access"}
//           </span>
//         )}

//         <button
//           type="button"
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             toggleWishlist(product);
//           }}
//           className={`absolute right-3 top-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition ${
//             isInWishlist(product.id)
//               ? "text-g3-pink"
//               : "text-g3-purple hover:text-g3-pink"
//           }`}
//         >
//           <Heart
//             size={16}
//             fill={isInWishlist(product.id) ? "currentColor" : "none"}
//           />
//         </button>

//         <button
//           type="button"
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             if (isEarlyAccessLocked) return;
//             addToCart(product);
//           }}
//           disabled={isEarlyAccessLocked}
//           className={`absolute bottom-3 right-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-md transition ${
//             isEarlyAccessLocked
//               ? "cursor-not-allowed bg-white/80 text-g3-purple"
//               : "bg-white text-g3-purple hover:bg-g3-gold hover:text-white"
//           }`}
//           aria-label={
//             isEarlyAccessLocked
//               ? "Members early access only"
//               : `Add ${product.name} to G3 Box`
//           }
//         >
//           {isEarlyAccessLocked ? <Lock size={16} /> : <ShoppingBag size={16} />}
//         </button>
//       </div>

//       <div className="flex flex-1 flex-col p-4">
//         <div className="mb-2 flex items-start justify-between gap-2">
//           <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">
//             {product.name}
//           </h3>
//           <ArrowUpRight
//             size={15}
//             className="mt-0.5 shrink-0 text-white/30 transition group-hover:text-g3-gold"
//           />
//         </div>

//         <p className="text-base font-black text-white">
//           ₦{Number(product.price).toLocaleString()}
//         </p>

//         {isEarlyAccessLocked ? (
//           <p className="mt-1 text-xs font-bold text-g3-gold">
//             Unlock as Member →
//           </p>
//         ) : (
//           <p className="mt-1 text-xs capitalize text-white/40">
//             {product.type === "package"
//               ? [
//                   product.ageRange ? `Ages ${product.ageRange}` : null,
//                   product.occasion
//                     ? String(product.occasion).replace(/-/g, " ")
//                     : null,
//                 ]
//                   .filter(Boolean)
//                   .join(" · ") || "Girl Package"
//               : "G3 Lounge"}
//           </p>
//         )}
//       </div>
//     </Link>
//   );
// }

// export default ProductCard;



import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowUpRight, Lock } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTier } from "../context/TierContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { currentTier, isAuthenticated } = useTier();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [product.image]);

  const isMemberOrAbove =
    isAuthenticated &&
    (currentTier === "member" || currentTier === "premier");

  const isEarlyAccessLocked =
    product.memberEarlyAccess === true && !isMemberOrAbove;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex w-[220px] min-w-[220px] max-w-[220px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1A002E] transition duration-300 hover:-translate-y-1 hover:border-g3-gold/40 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-white/5">
        {!imageLoaded && (
          <div className="absolute inset-0 z-10 animate-pulse bg-white/10" />
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {product.newArrival && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-g3-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}

        {product.memberEarlyAccess && (
          <span
            className={`absolute z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
              product.newArrival ? "left-3 top-12" : "left-3 top-3"
            } ${
              isEarlyAccessLocked
                ? "bg-white/90 text-g3-purple"
                : "bg-g3-purple text-white"
            }`}
          >
            {isEarlyAccessLocked ? "Members early" : "Member access"}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition ${
            isInWishlist(product.id)
              ? "text-g3-pink"
              : "text-g3-purple hover:text-g3-pink"
          }`}
        >
          <Heart
            size={16}
            fill={isInWishlist(product.id) ? "currentColor" : "none"}
          />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isEarlyAccessLocked) return;
            addToCart(product);
          }}
          disabled={isEarlyAccessLocked}
          className={`absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition ${
            isEarlyAccessLocked
              ? "cursor-not-allowed bg-white/80 text-g3-purple"
              : "cursor-pointer bg-white text-g3-purple hover:bg-g3-gold hover:text-white"
          }`}
        >
          {isEarlyAccessLocked ? <Lock size={16} /> : <ShoppingBag size={16} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">
            {product.name}
          </h3>
          <ArrowUpRight
            size={15}
            className="mt-0.5 shrink-0 text-white/30 transition group-hover:text-g3-gold"
          />
        </div>

        <p className="text-base font-black text-white">
          ₦{Number(product.price).toLocaleString()}
        </p>

        {isEarlyAccessLocked ? (
          <p className="mt-1 text-xs font-bold text-g3-gold">
            Unlock as Member →
          </p>
        ) : (
          <p className="mt-1 text-xs capitalize text-white/40">
            {product.type === "package"
              ? [
                  product.ageRange ? `Ages ${product.ageRange}` : null,
                  product.occasion
                    ? String(product.occasion).replace(/-/g, " ")
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Girl Package"
              : "G3 Lounge"}
          </p>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;