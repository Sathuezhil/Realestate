import { FavoriteButton } from "@/components/property/FavoriteButton";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { ImageGallery } from "@/components/property/ImageGallery";
import { PropertyMap } from "@/components/maps/MapLoaders";
import { Reveal } from "@/components/motion/Reveal";
import { getPropertyById } from "@/lib/properties";
import { formatNumber, formatPrice, propertyTypeLabel, statusLabel } from "@/lib/utils";
import { Bath, BedDouble, Maximize2, Phone } from "lucide-react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return { title: "Listing" };
  return { title: property.title, description: property.description.slice(0, 160) };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <ImageGallery images={property.images} title={property.title} />
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <Reveal>
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold-hover">
                {propertyTypeLabel(property.propertyType)} · {statusLabel(property.status)}
              </p>
              <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">{property.title}</h1>
              <p className="mt-3 text-ink-soft">
                {property.location.address}
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl text-ink">{formatPrice(property.price)}</p>
              <div className="mt-3">
                <FavoriteButton propertyId={property.id} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 rounded-2xl border border-line bg-white px-6 py-5 text-sm">
            {property.bedrooms > 0 ? (
              <span className="inline-flex items-center gap-2">
                <BedDouble className="h-4 w-4" /> {property.bedrooms} bedrooms
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Bath className="h-4 w-4" /> {property.bathrooms} bathrooms
            </span>
            <span className="inline-flex items-center gap-2">
              <Maximize2 className="h-4 w-4" /> {formatNumber(property.areaSqft)} sqft
            </span>
            <span>{property.furnished ? "Furnished" : "Unfurnished"}</span>
          </div>

          <div className="mt-10 space-y-4">
            <h2 className="font-serif text-3xl text-ink">About this home</h2>
            {property.description.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="leading-8 text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="font-serif text-3xl text-ink">Amenities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span key={amenity} className="chip rounded-full border border-line bg-white px-4 py-2 text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-serif text-3xl text-ink">Location</h2>
            <p className="mt-2 mb-4 text-sm text-muted">
              {property.location.area}, {property.location.city}
            </p>
            <PropertyMap property={property} />
          </div>
        </div>
        </Reveal>

        <Reveal delay={120}>
        <aside className="h-fit rounded-2xl border border-line bg-white p-6 shadow-[0_16px_50px_rgba(28,25,22,0.06)] lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.16em] text-gold-hover">Private viewing</p>
          <h2 className="mt-1 font-serif text-2xl text-ink">See it this week</h2>
          <p className="mt-1 mb-5 text-sm text-muted">
            Specialists typically reply within an hour. Access can be arranged the same day.
          </p>
          <EnquiryForm propertyId={property.id} propertyTitle={property.title} source="property" />
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Listed by</p>
            <p className="mt-2 font-medium text-ink">{property.agent.name}</p>
            <a href={`tel:${property.agent.phone}`} className="mt-1 inline-flex items-center gap-2 text-sm text-ink-soft">
              <Phone className="h-4 w-4" />
              {property.agent.phone}
            </a>
            <p className="text-sm text-muted">{property.agent.email}</p>
          </div>
        </aside>
        </Reveal>
      </div>
    </div>
  );
}
