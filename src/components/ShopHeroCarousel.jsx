import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Perfume from "../assets/images/perfume.jpg";
import Fancybackpack from "../assets/images/fancy back pack.jpg";
import Necklace from "../assets/images/necklace.jpg";
import Hairbonnet from "../assets/images/hair bonnet.jpg";
import Waterbottle from "../assets/images/water bottle.jpg";

const slides = [
  {
    image: Perfume,
    eyebrow: "BEAUTY & SELF-CARE",
    title: "Find something that feels like you.",
    description:
      "Discover beauty and self-care essentials made for your everyday moments.",
    button: "Shop Beauty",
    link: "/shop?category=beauty-self-care",
  },
  {
    image: Fancybackpack,
    eyebrow: "BAGS & PERSONAL",
    title: "Carry your style everywhere.",
    description:
      "From everyday essentials to statement pieces, find something made for your lifestyle.",
    button: "Shop Bags",
    link: "/shop?category=bags-personal",
  },
  {
    image: Necklace,
    eyebrow: "ACCESSORIES",
    title: "It's the little details.",
    description:
      "Add the finishing touch with accessories that make your everyday look feel special.",
    button: "Shop Accessories",
    link: "/shop?category=accessories",
  },
  {
    image: Hairbonnet,
    eyebrow: "FASHION & HAIR",
    title: "Everyday care, everyday confidence.",
    description:
      "Explore pieces designed to fit naturally into your everyday routine.",
    button: "Shop Fashion",
    link: "/shop?category=fashion-hair",
  },
  {
    image: Waterbottle,
    eyebrow: "EVERYDAY ESSENTIALS",
    title: "Things she'll love. Things she'll use.",
    description:
      "Explore G3 Lounge and discover useful, beautiful things for every day.",
    button: "Explore Shop",
    link: "/shop",
  },
];

export default function ShopHeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-[#0F001C]">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="relative min-h-[500px] overflow-hidden rounded-[32px] bg-[#F3E8E2]">
          
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
          />

          {/* Overlay */}
          {/* Pink overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-g3-pink via-g3-pink/40 to-transparent" />

          {/* Content */}
          <div className="relative z-20 flex min-h-[500px] items-center px-6 py-12 sm:px-10 lg:px-16">
            <div className="max-w-xl text-white">
              <p className="mb-4 text-xs font-bold tracking-[0.25em] sm:text-sm">
                {slide.eyebrow}
              </p>

              <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/90 sm:text-base">
                {slide.description}
              </p>

              <Link
                to={slide.link}
                className="mt-8 inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#111827] transition hover:bg-[#F3F4F6]"
              >
                {slide.button}
              </Link>
            </div>
          </div>

          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white sm:left-6"
          >
            <ArrowLeft size={19} />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white sm:right-6"
          >
            <ArrowRight size={19} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}