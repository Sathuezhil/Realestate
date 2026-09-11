"use client";

import { HeroSearch } from "@/components/home/HeroSearch";
import { STUDIO, whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const HERO_SPOTS = [
  { x: "6%", y: "10%", s: 5, d: "0s", t: "4.2s" },
  { x: "14%", y: "18%", s: 3, d: "0.5s", t: "5s" },
  { x: "22%", y: "8%", s: 8, d: "1.1s", t: "4.6s" },
  { x: "31%", y: "16%", s: 4, d: "0.2s", t: "5.4s" },
  { x: "39%", y: "7%", s: 6, d: "1.6s", t: "4.8s" },
  { x: "48%", y: "13%", s: 4, d: "0.8s", t: "5.1s" },
  { x: "57%", y: "6%", s: 9, d: "0.3s", t: "5.8s" },
  { x: "66%", y: "15%", s: 4, d: "1.4s", t: "4.4s" },
  { x: "74%", y: "9%", s: 6, d: "0.7s", t: "5.2s" },
  { x: "83%", y: "18%", s: 3, d: "1.9s", t: "4.9s" },
  { x: "91%", y: "11%", s: 7, d: "0.4s", t: "5.6s" },
  { x: "11%", y: "28%", s: 4, d: "1.2s", t: "4.7s" },
  { x: "27%", y: "24%", s: 3, d: "2.1s", t: "5.3s" },
  { x: "43%", y: "22%", s: 5, d: "0.9s", t: "4.5s" },
  { x: "61%", y: "26%", s: 4, d: "1.7s", t: "5.5s" },
  { x: "78%", y: "23%", s: 7, d: "0.1s", t: "4.3s" },
  { x: "88%", y: "31%", s: 3, d: "2.4s", t: "5.7s" },
  { x: "8%", y: "42%", s: 5, d: "1.3s", t: "4.8s" },
  { x: "19%", y: "38%", s: 3, d: "2s", t: "5s" },
  { x: "35%", y: "34%", s: 4, d: "0.6s", t: "4.4s" },
  { x: "52%", y: "36%", s: 3, d: "1.8s", t: "5.4s" },
  { x: "69%", y: "33%", s: 6, d: "0.35s", t: "4.9s" },
  { x: "85%", y: "40%", s: 4, d: "2.2s", t: "5.1s" },
  { x: "94%", y: "27%", s: 5, d: "1s", t: "4.6s" },
  { x: "16%", y: "52%", s: 3, d: "1.5s", t: "5.8s" },
  { x: "72%", y: "48%", s: 4, d: "0.85s", t: "4.2s" },
  { x: "81%", y: "55%", s: 3, d: "2.3s", t: "5.3s" },
  { x: "4%", y: "22%", s: 3, d: "1.1s", t: "4.7s" },
] as const;

export function HomeHero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative isolate overflow-hidden md:min-h-[92vh]">
      <div className="hero-bg absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="hero-bg-image"
        />
        <div className="hero-light" aria-hidden />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
      <div className="hero-grain absolute inset-0 opacity-30" />
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />
      <div className="hero-rings" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="hero-spots pointer-events-none absolute inset-0" aria-hidden>
        {HERO_SPOTS.map((spot) => (
          <span
            key={`${spot.x}-${spot.y}`}
            className="hero-spark"
            style={{
              left: spot.x,
              top: spot.y,
              width: spot.s,
              height: spot.s,
              animationDelay: spot.d,
              animationDuration: spot.t,
            }}
          />
        ))}
      </div>

      <div
        className={`relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-24 pt-10 sm:px-6 sm:pb-16 sm:pt-24 md:min-h-[92vh] md:pt-28 lg:px-8 ${
          ready ? "hero-copy-in" : "hero-copy-wait"
        }`}
      >
        <p className="hero-line text-[10px] uppercase tracking-[0.16em] text-gold sm:text-xs sm:tracking-[0.28em]">
          Private collection · Dubai · دبي
        </p>
        <h1 className="hero-line mt-3 max-w-3xl font-serif text-[2.15rem] leading-[1.12] text-white sm:mt-4 sm:text-5xl sm:leading-[1.05] md:text-7xl">
          The right <span className="gold-shimmer">Dubai</span> address. Arranged privately.
        </h1>
        <p className="hero-line mt-4 max-w-xl text-sm leading-6 text-white/85 sm:mt-5 sm:text-base sm:leading-7">
          Palm villas, Downtown penthouses, and gated community homes — with a specialist on WhatsApp
          and a viewing, often the same day.
        </p>
        <div className="hero-line mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.1em] text-white/75 sm:mt-6 sm:text-[11px] sm:tracking-[0.14em]">
          {["Same-day viewings", "DLD-ready files", "English & Arabic team"].map((item) => (
            <span key={item} className="chip rounded-full border border-white/20 px-3 py-1">
              {item}
            </span>
          ))}
        </div>
        <div className="hero-line mt-6 max-w-4xl sm:mt-8">
          <HeroSearch />
        </div>
        <div className="hero-line mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-3">
          <a
            href={whatsappHref()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp a specialist
          </a>
          <a
            href={STUDIO.phoneHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm text-white"
          >
            <Phone className="h-4 w-4" />
            {STUDIO.phoneDisplay}
          </a>
          <Link href="/listings" className="inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm text-white/80 underline-offset-4 hover:underline">
            Browse the collection
          </Link>
        </div>
        <div className="hero-line mt-8 hidden sm:mt-10 sm:block">
          <div className="scroll-cue flex flex-col items-start gap-1 text-[11px] uppercase tracking-[0.22em] text-white/55">
            <span>Scroll the collection</span>
            <span className="block h-8 w-px bg-gold/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
