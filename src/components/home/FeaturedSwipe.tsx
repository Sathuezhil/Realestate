"use client";

import { PriceText } from "@/components/currency/PriceText";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { propertyTypeLabel } from "@/lib/utils";
import { type Property } from "@/types";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const AUTO_MS = 2000;
const EXIT_MS = 420;
const STACK = 3;

export function FeaturedSwipe({ properties }: { properties: Property[] }) {
  const count = properties.length;
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState<"left" | null>(null);
  const exiting = useRef(false);

  const goNext = useCallback(() => {
    if (exiting.current || count < 2) return;
    exiting.current = true;
    setExit("left");
    window.setTimeout(() => {
      setIndex((current) => (current + 1) % count);
      setExit(null);
      exiting.current = false;
    }, EXIT_MS);
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [count, goNext]);

  if (count === 0) return null;

  const current = properties[index];
  const stack = Array.from({ length: Math.min(STACK, count) }, (_, depth) => {
    const property = properties[(index + depth) % count];
    return { property, depth, key: `${property.id}-${index}-${depth}` };
  });

  return (
    <div className="featured-stage">
      <p key={current.id} className="featured-watermark" aria-hidden>
        {current.location.area}
      </p>
      <div className="featured-stage-orb featured-stage-orb-a" />
      <div className="featured-stage-orb featured-stage-orb-b" />
      <div className="featured-stage-grain" />
      <p className="featured-spine featured-spine-left">Aurelia · Private list</p>
      <p className="featured-spine featured-spine-right">{current.location.city}</p>

      <aside className="featured-rail featured-rail-left">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Now showing</p>
        <p key={`${current.id}-area`} className="featured-rail-title mt-3 font-serif text-4xl leading-tight text-ink">
          {current.location.area}
        </p>
        <p className="mt-3 max-w-[16rem] text-sm leading-6 text-muted">
          {propertyTypeLabel(current.propertyType)} in {current.location.city}. Tap the card to open the full file.
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-gold">دبي · Private collection</p>
      </aside>

      <div className="featured-stage-center">
        <p className="mb-2 text-center text-xs uppercase tracking-[0.18em] text-muted">
          New home every 2 seconds
        </p>
        <p key={`${current.id}-mobile`} className="featured-mobile-meta mb-5 text-center font-serif text-xl text-ink">
          {current.location.area}
        </p>
        <div className="featured-deck">
          {stack
            .slice()
            .reverse()
            .map(({ property, depth, key }) => {
              const isTop = depth === 0;
              return (
                <div
                  key={key}
                  className={`featured-deck-card${isTop ? " is-top" : ""}${exit && isTop ? " is-exit-left" : ""}`}
                  style={{ "--depth": depth } as CSSProperties}
                >
                  <PropertyCard property={property} tilt={false} />
                </div>
              );
            })}
        </div>
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {properties.map((property, i) => (
            <span
              key={property.id}
              className={`h-1.5 rounded-full ${i === index ? "w-6 bg-gold" : "w-1.5 bg-line"}`}
            />
          ))}
        </div>
      </div>

      <aside className="featured-rail featured-rail-right">
        <p className="font-serif text-6xl tabular-nums text-gold/50">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
          of {String(count).padStart(2, "0")}
        </p>
        <p key={`${current.id}-price`} className="featured-rail-title mt-8 font-serif text-3xl text-ink">
          <PriceText aed={current.price} />
        </p>
        <p className="mt-2 text-sm text-muted">Tap the home to view details, gallery, and book a viewing.</p>
      </aside>
    </div>
  );
}
