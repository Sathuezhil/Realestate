"use client";

import { PropertyCard } from "@/components/listings/PropertyCard";
import { useBrowse } from "@/components/providers/BrowseProvider";
import { type Property } from "@/types";
import { useEffect, useState } from "react";

export function RecentlyViewed({
  excludeId,
  embedded = false,
}: {
  excludeId?: string;
  embedded?: boolean;
}) {
  const { recentIds, ready } = useBrowse();
  const [properties, setProperties] = useState<Property[]>([]);
  const query = recentIds.filter((id) => id !== excludeId).slice(0, 6).join(",");

  useEffect(() => {
    if (!ready) return;
    if (!query) {
      setProperties([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/properties?ids=${query}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { properties?: Property[] }) => setProperties(data.properties ?? []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });
    return () => controller.abort();
  }, [query, ready]);

  if (properties.length === 0) return null;

  const body = (
    <>
      <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Recently viewed</p>
      <h2 className={`mt-2 font-serif text-ink ${embedded ? "text-2xl" : "text-3xl md:text-4xl"}`}>
        Pick up where you left off
      </h2>
      <div className="property-rail mt-6">
        {properties.map((property) => (
          <div key={property.id} className="property-rail-item">
            <PropertyCard property={property} tilt={false} />
          </div>
        ))}
      </div>
    </>
  );

  if (embedded) return <section className="mb-10">{body}</section>;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{body}</div>
    </section>
  );
}
