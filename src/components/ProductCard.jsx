// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Heart,
//   ShoppingBag,
//   ArrowUpRight,
// } from "lucide-react";

// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();
//   const { isInWishlist, toggleWishlist } = useWishlist();

//   const [imageLoaded, setImageLoaded] = useState(false);

//   // Optional: Force skeleton to show for at least 600ms (for testing)
//   useEffect(() => {
//     setImageLoaded(false);
//   }, [product.image]);

//   return (
//     <Link
//       to={`/product/${product.id}`}
//       className="group min-w-[210px] max-w-[230px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-g3-light-purple hover:shadow-xl"
//     >
//       {/* Image Container */}
//       <div className="relative aspect-square overflow-hidden bg-gray-100">
        
//         {/* Skeleton Loader */}
//         {!imageLoaded && (
//           <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
//         )}

//         <img
//           src={product.image}
//           alt={product.name}
//           loading="lazy"
//           onLoad={() => {
//             // Small delay so you can actually see the skeleton
//             setTimeout(() => setImageLoaded(true), 400);
//           }}
//           className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
//             imageLoaded ? "opacity-100" : "opacity-0"
//           }`}
//         />

//         {/* New Badge */}
//         {product.newArrival && (
//           <span className="absolute left-3 top-3 z-20 rounded-full bg-g3-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
//             New
//           </span>
//         )}

//         {/* Wishlist Button */}
//         <button
//           type="button"
//           onClick={(event) => {
//             event.preventDefault();
//             event.stopPropagation();
//             toggleWishlist(product);
//           }}
//           className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition ${
//             isInWishlist(product.id)
//               ? "text-g3-pink"
//               : "text-g3-purple hover:text-g3-pink"
//           }`}
//         >
//           <Heart
//             size={17}
//             fill={isInWishlist(product.id) ? "currentColor" : "none"}
//           />
//         </button>

//         {/* Add to G3 Box */}
//         <button
//           type="button"
//           onClick={(event) => {
//             event.preventDefault();
//             event.stopPropagation();
//             addToCart(product);
//           }}
//           className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-g3-purple shadow-lg transition hover:bg-g3-gold hover:text-white"
//         >
//           <ShoppingBag size={17} />
//         </button>
//       </div>

//       {/* Product Info */}
//       <div className="p-4">
//         <div className="mb-2 flex items-start justify-between gap-2">
//           <h3 className="line-clamp-2 text-sm font-bold text-white">
//             {product.name}
//           </h3>
//           <ArrowUpRight
//             size={16}
//             className="mt-0.5 shrink-0 text-white/35 transition group-hover:text-g3-purple"
//           />
//         </div>

//         <p className="text-base font-black text-white">
//           ₦{product.price.toLocaleString()}
//         </p>

//         <p className="mt-1 text-xs text-white/45">G3 Lounge</p>
//       </div>
//     </Link>
//   );
// }

// export default ProductCard;



import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [product.image]);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group w-[210px] min-w-[210px] max-w-[210px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-g3-gold/40 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-white/10">
        {!imageLoaded && (
          <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-white/10" />
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setTimeout(() => setImageLoaded(true), 300)}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {product.newArrival && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-g3-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition ${
            isInWishlist(product.id)
              ? "text-g3-pink"
              : "text-g3-purple hover:text-g3-pink"
          }`}
          aria-label={
            isInWishlist(product.id)
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart
            size={17}
            fill={isInWishlist(product.id) ? "currentColor" : "none"}
          />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            addToCart(product);
          }}
          className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-g3-purple shadow-lg transition hover:bg-g3-gold hover:text-white"
          aria-label={`Add ${product.name} to G3 Box`}
        >
          <ShoppingBag size={17} />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 break-words text-sm font-bold text-white">
            {product.name}
          </h3>
          <ArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-white/35 transition group-hover:text-g3-gold"
          />
        </div>

        <p className="text-base font-black text-white">
          ₦{product.price.toLocaleString()}
        </p>

        <p className="mt-1 text-xs text-white/45">G3 Lounge</p>
      </div>
    </Link>
  );
}

export default ProductCard;