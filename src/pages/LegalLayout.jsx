import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function LegalLayout({ eyebrow, title, intro, children }) {
  return <main className="min-h-screen bg-[#0F001C] text-white"><section className="border-b border-white/10 bg-white/5"><div className="mx-auto max-w-4xl px-5 py-14 sm:px-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">{eyebrow}</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">{intro}</p><div className="mt-6 flex flex-wrap gap-2"><Link to="/terms" className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/15">Terms</Link><Link to="/privacy" className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/15">Privacy</Link><Link to="/policies" className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/15">Store policies</Link></div></div></section><section className="mx-auto max-w-4xl px-5 py-10 sm:px-8"><article className="space-y-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-9">{children}</article></section><Footer /></main>;
}

export function LegalSection({ title, children }) { return <section><h2 className="text-lg font-black text-white">{title}</h2><div className="mt-3 space-y-3 text-sm leading-7 text-white/60">{children}</div></section>; }
