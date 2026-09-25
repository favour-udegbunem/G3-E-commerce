import { useEffect, useState } from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

// Product images
import Package1 from "../assets/images/package1.jpg";
import Package2 from "../assets/images/package2.jpg";
import Package3 from "../assets/images/package3.jpg";
import Package4 from "../assets/images/package4.jpg";
import Package5 from "../assets/images/package5.jpg";
import Package6 from "../assets/images/package6.jpg";
import Package7 from "../assets/images/package7.jpg";

const slides = [
  {
    image: Package1,
    title: "Something special,",
    highlight: "made for her.",
    subtitle:
      "Discover thoughtful gifts, beautiful essentials and everyday products designed to celebrate girls.",
    label: "Made for her",
  },

  {
    image: Package2,
    title: "Style meets,",
    highlight: "everyday life.",
    subtitle:
      "From beautiful accessories to practical essentials, find something she'll love to carry, wear and enjoy.",
    label: "Everyday style",
  },

  {
    image: Package3,
    title: "Little details,",
    highlight: "big moments.",
    subtitle:
      "Discover beautiful pieces chosen to add something special to her everyday moments.",
    label: "Little details",
  },

  {
    image: Package4,
    title: "Made for her,",
    highlight: "made for every day.",
    subtitle:
      "Explore useful and beautiful essentials designed with her lifestyle, personality and everyday needs in mind.",
    label: "Made for every day",
  },

  {
    image: Package5,
    title: "Things she'll love,",
    highlight: "things she'll use.",
    subtitle:
      "From personal essentials to fun accessories, G3 Lounge brings together products made with her in mind.",
    label: "Made with her in mind",
  },

  {
    image: Package6,
    title: "Feel good,",
    highlight: "look good, be you.",
    subtitle:
      "Find thoughtful beauty, fashion and self-care essentials that fit naturally into her everyday life.",
    label: "Be you",
  },

  {
    image: Package7,
    title: "Beautiful things,",
    highlight: "for beautiful moments.",
    subtitle:
      "Whether you're shopping for her or simply treating her to something special, there's something waiting at G3 Lounge.",
    label: "Beautiful moments",
  },
];

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) =>
        previous === slides.length - 1 ? 0 : previous + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((previous) =>
      previous === slides.length - 1 ? 0 : previous + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((previous) =>
      previous === 0 ? slides.length - 1 : previous - 1
    );
  };

  const slide = slides[currentSlide];

  return (
    <section className="bg-[#0F001C] px-3 py-3 sm:px-5 lg:px-8">
      <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] bg-g3-purple">
        {/* Decorative glow */}
        <div className="absolute -left-20 -top-20 z-10 h-72 w-72 rounded-full bg-g3-pink/30 blur-3xl" />

        <div className="absolute -bottom-24 right-1/3 z-10 h-72 w-72 rounded-full bg-g3-light-purple/20 blur-3xl" />

        <div className="relative grid min-h-[520px] lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT CONTENT */}
          <div className="relative z-20 flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-g3-gold px-4 py-2">
              <Sparkles size={15} className="text-white" />

              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                Welcome to G3 Lounge
              </span>
            </div>

            <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {slide.title}
              <br />

              <span className="text-g3-light-purple">
                {slide.highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              {slide.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-g3-gold px-6 py-3.5 text-sm font-black text-[#0F001C] transition hover:bg-white/5 hover:text-white"
              >
                Explore the Lounge
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
              >
                View Products
              </Link>
            </div>
          </div>

          {/* PRODUCT IMAGE */}
          <div className="relative min-h-[300px] overflow-hidden lg:min-h-full">
            {/* Purple overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-g3-purple via-g3-purple/10 to-transparent" />

            <img
              key={slide.image}
              src={slide.image}
              alt={slide.label}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            />

            {/* IMAGE CAPTION */}
            <div className="absolute bottom-7 left-7 z-20">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-light-purple">
                G3 Lounge
              </p>

              <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                {slide.label}
              </h2>

              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Beautiful products. Beautiful moments.
              </p>
            </div>

            {/* PREVIOUS */}
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous slide"
              className="absolute left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft size={21} />
            </button>

            {/* NEXT */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white/5 hover:text-white"
            >
              <ChevronRight size={21} />
            </button>

            {/* SLIDE INDICATORS */}
            <div className="absolute bottom-7 right-7 z-20 flex gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-g3-gold"
                      : "w-2.5 bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;