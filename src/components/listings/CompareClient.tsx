"use client";

import { PriceText } from "@/components/currency/PriceText";
import { SmartImage } from "@/components/media/SmartImage";
import { useBrowse } from "@/components/providers/BrowseProvider";
import { formatNumber, propertyTypeLabel } from "@/lib/utils";
import { type Property } from "@/types";
import { Check, Minus, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function parseIds(raw: string | null) {
  return (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function CompareClient() {
  const searchParams = useSearchParams();
  const { compareIds, removeCompare, clearCompare, ready } = useBrowse();
  const urlIds = parseIds(searchParams.get("ids"));
  const ids = urlIds.length > 0 ? urlIds : compareIds;
  const query = ids.join(",");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready && urlIds.length === 0) return;
    if (!query) {
      setProperties([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/properties?ids=${query}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { properties?: Property[] }) => {
        const list = data.properties ?? [];
        const order = new Map(ids.map((id, index) => [id, index]));
        setProperties([...list].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query, ready]);

  const amenities = useMemo(() => {
    const set = new Set<string>();
    for (const property of properties) {
      for (const amenity of property.amenities) set.add(amenity);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [properties]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-muted">Loading comparison...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Compare homes</h1>
        <p className="mt-3 text-ink-soft">Add 2 or 3 listings from the cards, then open this table.</p>
        <Link href="/listings" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm text-ivory">
          Browse listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Side by side</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl md:text-5xl">Compare {properties.length} homes</h1>
          <p className="mt-2 text-sm text-ink-soft">Price, size, and amenity differences at a glance.</p>
        </div>
        <button
          type="button"
          onClick={clearCompare}
          className="text-sm text-muted hover:text-ink"
        >
          Clear all
        </button>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="compare-table min-w-[40rem] w-full text-sm">
          <thead>
            <tr>
              <th className="compare-sticky w-36 bg-ivory p-4 text-left text-[11px] uppercase tracking-[0.16em] text-muted">
                Home
              </th>
              {properties.map((property) => (
                <th key={property.id} className="p-4 align-top">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <SmartImage
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                  </div>
                  <Link href={`/listings/${property.id}`} className="mt-3 block font-medium leading-snug text-ink hover:underline">
                    {property.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeCompare(property.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-ink"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow label="Price">
              {properties.map((property) => (
                <td key={property.id} className="p-4 font-serif text-2xl text-ink">
                  <PriceText aed={property.price} />
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Type">
              {properties.map((property) => (
                <td key={property.id} className="p-4">
                  {propertyTypeLabel(property.propertyType)}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Community">
              {properties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.location.area}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Beds">
              {properties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.bedrooms > 0 ? property.bedrooms : "—"}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Baths">
              {properties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.bathrooms}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Size">
              {properties.map((property) => (
                <td key={property.id} className="p-4">
                  {formatNumber(property.areaSqft)} sqft
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Price / sqft">
              {properties.map((property) => (
                <td key={property.id} className="p-4">
                  <PriceText aed={Math.round(property.price / Math.max(property.areaSqft, 1))} />
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Furnished">
              {properties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.furnished ? "Furnished" : "Unfurnished"}
                </td>
              ))}
            </CompareRow>
            {amenities.map((amenity) => (
              <CompareRow key={amenity} label={amenity}>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    {property.amenities.includes(amenity) ? (
                      <Check className="h-4 w-4 text-gold-hover" />
                    ) : (
                      <Minus className="h-4 w-4 text-line" />
                    )}
                  </td>
                ))}
              </CompareRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-t border-line">
      <th className="compare-sticky bg-ivory p-4 text-left text-[11px] uppercase tracking-[0.16em] text-muted">
        {label}
      </th>
      {children}
    </tr>
  );
}
