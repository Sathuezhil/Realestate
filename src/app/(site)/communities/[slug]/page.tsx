import { MortgageCalculator } from "@/components/tools/MortgageCalculator";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { SmartImage } from "@/components/media/SmartImage";
import { Reveal } from "@/components/motion/Reveal";
import { getCommunityBySlug, COMMUNITIES } from "@/lib/communities";
import { getPropertiesByCommunity } from "@/lib/properties";
import { formatNumber } from "@/lib/utils";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return COMMUNITIES.map((community) => ({ slug: community.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);
  if (!community) return { title: "Community" };
  return { title: community.name, description: community.tagline };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);
  if (!community) notFound();
  const homes = await getPropertiesByCommunity(community.name);
  const hero = homes[0]?.images[0] ?? community.image;
  const others = COMMUNITIES.filter((item) => item.slug !== community.slug).slice(0, 6);

  return (
    <div>
      <div className="relative min-h-[42vh] overflow-hidden bg-ivory-dark">
        {hero ? (
          <SmartImage
            src={hero}
            alt={community.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            <Link href="/communities" className="hover:underline">
              Communities
            </Link>
            <span className="mx-2 text-ivory/40">/</span>
            {community.short}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ivory md:text-6xl">{community.name}</h1>
          <p className="mt-3 max-w-2xl text-ivory/85">{community.tagline}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            {community.copy.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="mb-4 max-w-2xl leading-8 text-ink-soft">
                {paragraph}
              </p>
            ))}
            <ul className="mt-6 flex flex-wrap gap-2">
              {community.highlights.map((item) => (
                <li key={item} className="rounded-full border border-line bg-white px-4 py-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-gold-hover">On the list</p>
              <p className="mt-2 font-serif text-3xl text-ink">
                {homes.length > 0 ? `${formatNumber(homes.length)} home${homes.length === 1 ? "" : "s"}` : "Off-market"}
              </p>
              <p className="mt-2 text-sm text-muted">
                {homes.length > 0
                  ? "Available now. Book a viewing from any card."
                  : "Nothing live — WhatsApp us for off-market in this community."}
              </p>
              <Link href="/listings" className="mt-5 inline-block text-sm text-gold-hover hover:underline">
                All Dubai listings
              </Link>
            </div>
          </Reveal>
        </div>

        {homes.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-serif text-3xl text-ink">Homes in {community.short}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {homes.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16 rounded-2xl border border-line bg-white p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-gold-hover">Finance</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">Monthly payment</h2>
          <p className="mt-2 mb-6 max-w-xl text-sm text-muted">
            Indicative Dubai mortgage on a typical {community.short} price.
          </p>
          <MortgageCalculator
            defaultPrice={homes[0]?.price ?? 5_000_000}
            variant="page"
          />
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl text-ink">Other communities</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/communities/${item.slug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm hover:border-gold"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
