import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Logo from "../assets/Logo.png";

function Footer() {
  return (
    <footer className="bg-[#1A002E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img
                src={Logo}
                alt="G3 Lounge"
                className="h-20 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Thoughtful products, everyday essentials and special little things
              made with her in mind.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-g3-gold">
              Shop
            </h3>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <Link to="/shop" className="block transition hover:text-white">
                All Products
              </Link>
              <Link
                to="/shop/beauty-self-care"
                className="block transition hover:text-white"
              >
                Beauty & Self-Care
              </Link>
              <Link
                to="/shop/accessories"
                className="block transition hover:text-white"
              >
                Accessories
              </Link>
              <Link
                to="/shop/fashion-hair"
                className="block transition hover:text-white"
              >
                Fashion & Hair
              </Link>
              <Link
                to="/shop/period-care"
                className="block transition hover:text-white"
              >
                Period Care
              </Link>
              <Link
                to="/shop/gifts-fun"
                className="block transition hover:text-white"
              >
                Gifts & Fun
              </Link>
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-g3-gold">
              Help
            </h3>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <Link to="/box" className="block transition hover:text-white">
                My G3 Box
              </Link>
              <Link
                to="/wishlist"
                className="block transition hover:text-white"
              >
                Wishlist
              </Link>
              <Link
                to="/checkout"
                className="block transition hover:text-white"
              >
                Checkout
              </Link>
              <Link to="/login" className="block transition hover:text-white">
                Login / Register
              </Link>
              <a href="#" className="block transition hover:text-white">
                Shipping & Delivery
              </a>
              <a href="#" className="block transition hover:text-white">
                Returns & Support
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-g3-gold">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-g3-gold" />
                <span>hello@g3lounge.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-g3-gold" />
                <span>+234 XXX XXX XXXX</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-g3-gold" />
                <span>Nigeria</span>
              </div>
            </div>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-g3-gold px-5 py-3 text-sm font-black text-[#0F001C] transition hover:bg-white/5 hover:text-white"
            >
              Shop Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-center text-xs text-white/40 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} G3 Lounge. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;