import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  categories,
  getProductsByCategory,
  products,
} from "../data/membersproduct";

import ProductCard from "../components/ProductCardMembers";
import Footer from "../components/Footer";
import ShopHeroCarousel from "../components/ShopHeroCarousel";
import TierGate from "../components/TierGate";
import { useTier } from "../context/TierContext";

function Shop() {
  const { currentTier, isAuthenticated } = useTier();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all";
  const searchFromUrl = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromUrl);

  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  useEffect(() => {
    setSearchTerm(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);

    const newParams = new URLSearchParams(searchParams);

    if (categoryId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryId);
    }

    setSearchParams(newParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch = searchTerm.trim();
    const newParams = new URLSearchParams(searchParams);

    if (trimmedSearch) {
      newParams.set("search", trimmedSearch);
    } else {
      newParams.delete("search");
    }

    setSearchParams(newParams);
  };

  const categoryProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    return getProductsByCategory(selectedCategory);
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchFromUrl
      .trim()
      .toLowerCase();

    let result = [...categoryProducts];

    if (normalizedSearch) {
      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.description,
          product.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "forMembers") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.forMembers)) -
          Number(Boolean(a.forMembers))
      );
    }

    return result;
  }, [
    categoryProducts,
    searchFromUrl,
    sortBy,
  ]);

  const activeCategoryName =
    selectedCategory === "all"
      ? "All Products"
      : categories.find(
          (category) => category.id === selectedCategory
        )?.name || "All Products";

  if (!isAuthenticated || (currentTier !== "member" && currentTier !== "premier")) {
    return <TierGate requiredTier="member" />;
  }

  return (
    <main className="bg-white/5">

      {/* SHOP HERO CAROUSEL */}
      <ShopHeroCarousel />

      {/* SHOP SEARCH */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-3xl"
          >
            <div className="relative sticky z-50">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="What are you looking for?"
                className="h-14 w-full rounded-full border border-white/15 bg-white/5 pl-12 pr-32 text-sm text-gray-800 outline-none placeholder:text-white/45 focus:border-g3-light-purple focus:bg-white focus:ring-4 focus:ring-g3-light-purple/20"
              />

              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-g3-pink px-6 py-3 text-sm font-black text-white transition hover:bg-g3-gold"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <section className="top-[100px] z-30 border-b border-white/10 bg-white/5/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-2 py-4">

            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className={`rounded-full px-5 py-2.5 cursor-pointer text-sm font-bold transition ${
                selectedCategory === "all"
                  ? "bg-g3-purple text-white"
                  : "bg-gray-100 text-white/55 hover:bg-g3-light-pink hover:text-g3-pink"
              }`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  handleCategoryChange(category.id)
                }
                className={`rounded-full px-5 py-2.5 cursor-pointer text-sm font-bold transition ${
                  selectedCategory === category.id
                    ? "bg-g3-pink text-white"
                    : "bg-gray-100 text-black/55 hover:bg-g3-light-pink hover:text-g3-pink"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* HEADING */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
              {searchFromUrl
                ? "Search results"
                : "Explore G3 Lounge"}
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              {searchFromUrl
                ? `Results for "${searchFromUrl}"`
                : activeCategoryName}
            </h2>

            <p className="mt-2 text-sm text-white/55">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}{" "}
              available
            </p>
          </div>

          {/* SORT + MOBILE FILTER */}
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(true)
              }
              className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white px-4 text-sm font-bold text-white lg:hidden"
            >
              <SlidersHorizontal size={17} />
              Filter
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="h-11 appearance-none rounded-full border border-white/15 bg-white pl-4 pr-10 text-sm font-bold text-white outline-none focus:border-g3-light-purple"
              >
                <option value="featured">
                  Featured
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45"
              />
            </div>
          </div>
        </div>

        {/* ACTIVE SEARCH */}
        {searchFromUrl && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/45">
              Searching for:
            </span>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");

                const newParams =
                  new URLSearchParams(searchParams);

                newParams.delete("search");

                setSearchParams(newParams);
              }}
              className="flex items-center gap-2 rounded-full bg-g3-light-pink px-3 py-1.5 text-xs font-bold text-g3-pink"
            >
              "{searchFromUrl}"
              <X size={13} />
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          /* EMPTY SEARCH STATE */
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-20 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-g3-light-pink text-g3-pink">
              <Search size={32} />
            </div>

            <h3 className="mt-6 text-2xl font-black text-white">
              We couldn't find that
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
              Try another search or explore all the lovely
              things available in G3 Lounge.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSearchParams({});
              }}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-purple px-6 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
            >
              View All Products
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-g3-purple px-6 py-10 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-gold">
                G3 Lounge
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Looking for something special?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                Build your G3 Box with products she will
                actually enjoy.
              </p>
            </div>

            <Link
              to="/box"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-g3-gold px-6 py-3.5 text-sm font-black text-white transition hover:bg-g3-pink"
            >
              View My G3 Box
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* MOBILE FILTER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">

          <button
            type="button"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-black/30"
            aria-label="Close filters"
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white/5 p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                Shop by Category
              </h3>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-white/55"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() => {
                  handleCategoryChange("all");
                  setMobileFiltersOpen(false);
                }}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${
                  selectedCategory === "all"
                    ? "bg-g3-purple text-white"
                    : "bg-gray-100 text-g3-purple"
                }`}
              >
                All Products
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    handleCategoryChange(category.id);
                    setMobileFiltersOpen(false);
                  }}
                  className={`rounded-xl px-4 py-3 text-sm font-bold ${
                    selectedCategory === category.id
                      ? "bg-g3-pink text-white"
                      : "bg-gray-100 text-g3-purple"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default Shop;