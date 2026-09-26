import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function ProductRow({ category, products }) {
  if (!products?.length) return null;

  return (
    <section className="py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-g3-gold">
            G3 Lounge
          </p>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            {category.name}
          </h2>
          {category.description && (
            <p className="mt-1 max-w-xl text-sm text-white/55">
              {category.description}
            </p>
          )}
        </div>

        <Link
          to={`/shop/${category.id}`}
          className="flex shrink-0 items-center gap-1 text-sm font-bold text-white transition hover:text-g3-gold"
        >
          See More
          <ChevronRight size={17} />
        </Link>
      </div>

      {/* Same cards as Shop — only the ROW gets the pink scrollbar */}
      <div className="flex gap-4 overflow-x-auto pb-5 scrollbar-g3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductRow;