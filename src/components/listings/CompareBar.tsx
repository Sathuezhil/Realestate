"use client";

import { SmartImage } from "@/components/media/SmartImage";
import { useBrowse } from "@/components/providers/BrowseProvider";
import { MAX_COMPARE } from "@/lib/browse";
import { type Property } from "@/types";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CompareBar() {
  const { compareIds, removeCompare, clearCompare } = useBrowse();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (compareIds.length === 0) {
      setProperties([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/properties?ids=${compareIds.join(",")}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { properties?: Property[] }) => {
        const list = data.properties ?? [];
        const order = new Map(compareIds.map((id, index) => [id, index]));
        setProperties([...list].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });
    return () => controller.abort();
  }, [compareIds]);

  if (compareIds.length === 0) return null;

  const ready = compareIds.length >= 2;

  return (
    <div className="compare-bar">
      <div className="compare-bar-inner">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
          {properties.map((property) => (
            <div key={property.id} className="relative h-12 w-12 shrink-0">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-line">
                <SmartImage
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCompare(property.id)}
                className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory"
                aria-label={`Remove ${property.title}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {Array.from({ length: MAX_COMPARE - properties.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-line text-[10px] uppercase tracking-wide text-muted"
            >
              Add
            </div>
          ))}
          <p className="hidden shrink-0 text-sm text-ink-soft sm:block">
            {compareIds.length} of {MAX_COMPARE} homes
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={clearCompare} className="text-xs text-muted hover:text-ink">
            Clear
          </button>
          {ready ? (
            <Link
              href={`/compare?ids=${compareIds.join(",")}`}
              className="rounded-full bg-ink px-4 py-2 text-sm text-ivory"
            >
              Compare
            </Link>
          ) : (
            <span className="rounded-full border border-line px-4 py-2 text-sm text-muted">Pick 2–3</span>
          )}
        </div>
      </div>
    </div>
  );
}
