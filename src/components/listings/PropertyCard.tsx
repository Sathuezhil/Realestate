"use client";

import { CompareToggle } from "@/components/listings/CompareToggle";
import { PriceText } from "@/components/currency/PriceText";
import { TiltCard } from "@/components/motion/TiltCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { useBrowse } from "@/components/providers/BrowseProvider";
import { formatNumber, cn, propertyTypeLabel } from "@/lib/utils";
import { type Property } from "@/types";
import { SmartImage } from "@/components/media/SmartImage";
import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PropertyCard({
  property,
  tilt = true,
}: {
  property: Property;
  tilt?: boolean;
}) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const { isCompared } = useBrowse();
  const router = useRouter();
  const saved = isFavorite(property.id);
  const exclusive = property.price >= 20_000_000;
  const isNew = new Date(property.createdAt) >= new Date("2026-08-01");

  async function onFavorite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      router.push(`/login?next=/listings/${property.id}`);
      return;
    }
    await toggleFavorite(property.id);
  }

  const card = (
      <Link
        href={`/listings/${property.id}`}
        className={cn(
          "group block h-full overflow-hidden rounded-2xl border bg-white shadow-[0_10px_40px_rgba(28,25,22,0.04)]",
          isCompared(property.id) ? "border-gold" : "border-line",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.14]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            <span className="rounded-full bg-ivory/95 px-3 py-1 text-xs uppercase tracking-wide text-ink">
              {propertyTypeLabel(property.propertyType)}
            </span>
            {exclusive ? (
              <span className="badge-glow rounded-full bg-gold px-3 py-1 text-xs uppercase tracking-wide text-ink">
                Exclusive
              </span>
            ) : null}
            {isNew ? (
              <span className="badge-glow rounded-full bg-ink/90 px-3 py-1 text-xs uppercase tracking-wide text-ivory">
                Just listed
              </span>
            ) : null}
          </div>
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={onFavorite}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ivory/95 text-ink transition hover:text-gold-hover"
              aria-label={saved ? "Remove favorite" : "Save listing"}
            >
              <Heart className={`h-4 w-4 ${saved ? "heart-pop fill-gold text-gold" : ""}`} />
            </button>
            <CompareToggle propertyId={property.id} />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-10 text-sm text-white opacity-100 transition duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            Book a private viewing →
          </div>
        </div>
        <div className="space-y-3 p-5">
          <p className="font-serif text-2xl text-ink">
            <PriceText aed={property.price} />
          </p>
          <h3 className="text-lg font-medium leading-snug text-ink break-words">{property.title}</h3>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" />
            {property.location.area}, {property.location.city}
          </p>
          <div className="flex flex-wrap gap-4 border-t border-line pt-3 text-sm text-ink-soft">
            {property.bedrooms > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" /> {property.bedrooms} beds
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4" /> {property.bathrooms} baths
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4" /> {formatNumber(property.areaSqft)} sqft
            </span>
          </div>
        </div>
      </Link>
  );

  return tilt ? <TiltCard>{card}</TiltCard> : card;
}
