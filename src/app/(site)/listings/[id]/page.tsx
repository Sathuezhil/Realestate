import { FavoriteButton } from "@/components/property/FavoriteButton";
import { CompareToggle } from "@/components/listings/CompareToggle";
import { PriceText } from "@/components/currency/PriceText";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { ImageGallery } from "@/components/property/ImageGallery";
import { SimilarHomes } from "@/components/listings/SimilarHomes";
import { ViewTracker } from "@/components/property/ViewTracker";
import { PropertyMap } from "@/components/maps/MapLoaders";
import { Reveal } from "@/components/motion/Reveal";
import { getPropertyById, getSimilarProperties } from "@/lib/properties";
import { getCommunityByArea } from "@/lib/communities";
import { MortgageCalculator } from "@/components/tools/MortgageCalculator";
import { formatNumber, propertyTypeLabel, statusLabel } from "@/lib/utils";
import { Bath, BedDouble, Maximize2, Phone } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
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
  const similar = await getSimilarProperties(property, 3);
  const community = getCommunityByArea(property.location.area);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ViewTracker propertyId={property.id} />
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
                {community ? (
                  <Link href={`/communities/${community.slug}`} className="hover:underline">
                    {property.location.address}
                  </Link>
                ) : (
                  property.location.address
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl text-ink">
                <PriceText aed={property.price} />
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">Listed in AED</p>
              <Link
                href="#mortgage"
                className="mt-2 block text-sm text-gold-hover hover:underline"
              >
                Estimate monthly payment
              </Link>
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <FavoriteButton propertyId={property.id} />
                <CompareToggle propertyId={property.id} variant="label" />
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
              {community ? (
                <Link href={`/communities/${community.slug}`} className="hover:underline">
                  {property.location.area}
                </Link>
              ) : (
                property.location.area
              )}
              , {property.location.city}
            </p>
            <PropertyMap property={property} />
          </div>

          <div id="mortgage" className="mt-10 rounded-2xl border border-line bg-white p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-gold-hover">Finance</p>
            <h2 className="mt-1 font-serif text-3xl text-ink">Monthly payment</h2>
            <p className="mt-1 mb-5 text-sm text-muted">
              Indicative Dubai mortgage on this price.{" "}
              <Link href={`/mortgage?price=${property.price}`} className="text-gold-hover hover:underline">
                Open full calculator
              </Link>
            </p>
            <MortgageCalculator defaultPrice={property.price} propertyTitle={property.title} />
          </div>
        </div>
        </Reveal>

        <Reveal delay={120}>
        <aside className="h-fit rounded-2xl border border-line bg-white p-6 shadow-[0_16px_50px_rgba(28,25,22,0.06)] lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.16em] text-gold-hover">Private viewing</p>
          <h2 className="mt-1 font-serif text-2xl text-ink">Pick a day and time</h2>
          <p className="mt-1 mb-5 text-sm text-muted">
            Slots are Dubai time. We confirm on WhatsApp — often the same day.
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

      <SimilarHomes properties={similar} />
    </div>
  );
}
