import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  Sparkles,
  ShoppingBag,
  Shirt,
  SprayCan,
  Star,
  WalletCards,
  Droplets,
} from "lucide-react";
import { Link } from "react-router-dom";

import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow";
import Footer from "../components/Footer";

import {
  categories,
  getProductsByCategory,
  products,
} from "../data/products";

const categoryIcons = {
  "beauty-self-care": Sparkles,
  accessories: Star,
  "bags-personal": ShoppingBag,
  stationery: BookOpen,
  "fashion-hair": Shirt,
  "period-care": Heart,
  "gifts-fun": Gift,
};

const pickNames = [
  "Perfume",
  "Roll-On",
  "Body Spray",
  "Lip Balm",
  "Earrings",
  "Tote Bag",
];

function Home() {
  const loungePicks = pickNames
    .map((name) => products.find((product) => product.name === name))
    .filter(Boolean);

  const newArrivals = products.filter((product) => product.newArrival);

  return (
    <main className="bg-[#0F001C]">

      {/* HERO */}
      <HeroCarousel />

      {/* SHOP BY CATEGORY */}
      <section className="border-y border-white/10 bg-[#0F001C]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-g3-gold">
                Explore
              </p>

              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Shop by Category
              </h2>

              <p className="mt-1 text-sm text-white/55">
                Find something special for every part of her everyday life.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-1 text-sm font-bold text-white transition hover:text-g3-gold sm:flex"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] || Gift;

              return (
                <Link
                  key={category.id}
                  to={`/shop/${category.id}`}
                  className="group flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-g3-light-pink/30 px-3 py-5 text-center transition duration-300 hover:-translate-y-1 hover:border-g3-light-purple hover:bg-g3-purple hover:shadow-lg"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white shadow-sm transition group-hover:bg-g3-gold group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <span className="text-xs font-bold text-white transition group-hover:text-white">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/shop"
            className="mt-5 flex w-fit items-center gap-1 text-sm font-bold text-white sm:hidden"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* G3 LOUNGE PICKS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#0F001C]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-g3-gold">
              <Sparkles size={17} />

              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Handpicked for her
              </span>
            </div>

            <h2 className="text-2xl font-black text-white sm:text-3xl">
              G3 Lounge Picks
            </h2>

            <p className="mt-1 text-sm text-white/55">
              A few things we think she'll love.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-1 text-sm font-bold text-white transition hover:text-g3-gold sm:flex"
          >
            Shop all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loungePicks.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              className="absolute -left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg transition hover:bg-g3-purple hover:text-white lg:flex"
              aria-label="Previous G3 Lounge picks"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {loungePicks.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <button
              type="button"
              className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg transition hover:bg-g3-purple hover:text-white lg:flex"
              aria-label="Next G3 Lounge picks"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <p className="rounded-2xl bg-g3-light-pink/30 p-8 text-center text-sm text-white/55">
            G3 Lounge picks will appear here.
          </p>
        )}
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#0F001C]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-g3-pink">
                <Star size={17} />

                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Fresh in
                </span>
              </div>

              <h2 className="text-2xl font-black text-white sm:text-3xl">
                New Arrivals
              </h2>

              <p className="mt-1 text-sm text-white/55">
                Fresh finds just added to G3 Lounge.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-1 text-sm font-bold text-white transition hover:text-g3-gold sm:flex"
            >
              See more
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">

            {/* NEW ARRIVALS PROMO CARD */}
            <div className="relative hidden min-h-[360px] overflow-hidden rounded-3xl bg-g3-purple p-7 lg:flex lg:flex-col lg:justify-between">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-g3-pink/30 blur-3xl" />

              <div className="relative z-10">
                <span className="inline-flex rounded-full bg-g3-gold px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                  Just added
                </span>

                <h3 className="mt-5 text-3xl font-black leading-tight text-white">
                  Something
                  <br />
                  new for her.
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/70">
                  Discover fresh products and little finds that make everyday
                  moments more special.
                </p>
              </div>

              <Link
                to="/shop"
                className="relative z-10 flex w-fit items-center gap-2 rounded-full bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-g3-gold hover:text-white"
              >
                Shop new arrivals
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* PRODUCTS */}
            <div className="relative min-w-0">
              {newArrivals.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {newArrivals.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-white/5">
                  <p className="text-sm text-white/55">
                    New arrivals will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/shop"
            className="mt-5 flex w-fit items-center gap-1 text-sm font-bold text-white sm:hidden"
          >
            See all new arrivals
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CATEGORY PRODUCT SECTIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.id);

          return (
            <ProductRow
              key={category.id}
              category={category}
              products={categoryProducts.slice(0, 5)}
            />
          );
        })}
      </section>

      {/* PROMOTIONAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-g3-purple px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-g3-pink/30 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-g3-light-purple/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-g3-light-purple">
              G3 Lounge
            </span>

            <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
              Make her next moment a special one.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              From little everyday essentials to thoughtful gifts, find
              something she will actually love.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-g3-gold px-6 py-3 text-sm font-black text-[#0F001C] transition hover:bg-white/5 hover:text-white"
            >
              Explore G3 Lounge
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY G3 LOUNGE */}
      <section className="border-t border-white/10 bg-g3-light-pink/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-gold">
              Why G3 Lounge
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Shopping made around her.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">

            <div className="text-center">
              <p className="text-3xl font-black text-white">
                01
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                Made for her
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Products selected around the everyday needs, style and
                experiences of girls.
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-black text-g3-gold">
                02
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                Easy shopping
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Find what you need, add it to your G3 Box and place your order
                without unnecessary steps.
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-black text-g3-pink">
                03
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                Thoughtful choices
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Everyday products, personal-care essentials and gifts brought
                together in one convenient place.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* REUSABLE FOOTER */}
      <Footer />

    </main>
  );
}

export default Home;