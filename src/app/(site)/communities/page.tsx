import { COMMUNITIES } from "@/lib/communities";
import { listProperties } from "@/lib/properties";
import { Reveal } from "@/components/motion/Reveal";
import { SmartImage } from "@/components/media/SmartImage";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Communities" };

export default async function CommunitiesPage() {
  const listings = await listProperties({});
  const counts = new Map<string, number>();
  const photos = new Map<string, string>();
  for (const property of listings) {
    const area = property.location.area;
    counts.set(area, (counts.get(area) ?? 0) + 1);
    if (!photos.has(area) && property.images[0]) photos.set(area, property.images[0]);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Dubai</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl md:text-5xl">Communities</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Palm, Downtown, Hills, Marina, and the gated streets we actually send people to.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {COMMUNITIES.map((community, index) => {
          const count = counts.get(community.name) ?? 0;
          const photo = photos.get(community.name) ?? community.image;
          return (
            <Reveal key={community.slug} delay={Math.min(index, 8) * 50}>
              <Link
                href={`/communities/${community.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ivory-dark">
                  {photo ? (
                    <SmartImage
                      src={photo}
                      alt={community.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-gold-hover">{community.short}</p>
                  <h2 className="mt-1 font-serif text-2xl text-ink">{community.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{community.tagline}</p>
                  <p className="mt-3 text-xs text-muted">
                    {count > 0 ? `${count} home${count === 1 ? "" : "s"} on the list` : "Ask for off-market"}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
