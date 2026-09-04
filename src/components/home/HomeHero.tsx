"use client";

import { HeroSearch } from "@/components/home/HeroSearch";
import { STUDIO, whatsappHref } from "@/lib/contact";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeHero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden">
      <div className="hero-ken ken-pan absolute inset-0 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      <div className="hero-grain absolute inset-0 opacity-30" />
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />
      <div className="hero-rings" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="hero-spark" />
        <span className="hero-spark" />
        <span className="hero-spark" />
        <span className="hero-spark" />
      </div>

      <div
        className={`relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-8 ${
          ready ? "hero-copy-in" : "hero-copy-wait"
        }`}
      >
        <p className="hero-line text-xs uppercase tracking-[0.28em] text-gold">
          Private collection · Dubai · دبي
        </p>
        <h1 className="hero-line mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-white md:text-7xl">
          The right <span className="gold-shimmer">Dubai</span> address. Arranged privately.
        </h1>
        <p className="hero-line mt-5 max-w-xl text-base leading-7 text-white/85">
          Palm villas, Downtown penthouses, and gated community homes — with a specialist on WhatsApp
          and a viewing, often the same day.
        </p>
        <div className="hero-line mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-white/75">
          {["Same-day viewings", "DLD-ready files", "English & Arabic team"].map((item) => (
            <span key={item} className="chip rounded-full border border-white/20 px-3 py-1">
              {item}
            </span>
          ))}
        </div>
        <div className="hero-line mt-8 max-w-4xl">
          <HeroSearch />
        </div>
        <div className="hero-line mt-5 flex flex-wrap gap-3">
          <a
            href={whatsappHref()}
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp a specialist
          </a>
          <a
            href={STUDIO.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm text-white"
          >
            <Phone className="h-4 w-4" />
            {STUDIO.phoneDisplay}
          </a>
          <Link href="/listings" className="inline-flex items-center rounded-full px-5 py-2.5 text-sm text-white/80 underline-offset-4 hover:underline">
            Browse the collection
          </Link>
        </div>
        <div className="hero-line mt-10">
          <div className="scroll-cue flex flex-col items-start gap-1 text-[11px] uppercase tracking-[0.22em] text-white/55">
            <span>Scroll the collection</span>
            <span className="block h-8 w-px bg-gold/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
