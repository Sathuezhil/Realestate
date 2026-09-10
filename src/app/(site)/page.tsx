import { RecentlyViewed } from "@/components/listings/RecentlyViewed";
import { CountUp } from "@/components/home/CountUp";
import { CommunityMarquee } from "@/components/home/CommunityMarquee";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedSwipe } from "@/components/home/FeaturedSwipe";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LeadStrip } from "@/components/home/LeadStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { Reveal } from "@/components/motion/Reveal";
import { COMMUNITIES } from "@/lib/communities";
import { getFeaturedProperties } from "@/lib/properties";
import { seedProperties } from "@/data/properties";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  let featured = seedProperties.filter((property) => property.status === "available").slice(0, 6);
  try {
    featured = await getFeaturedProperties();
  } catch (error) {
    console.error("HomePage featured listings failed", error);
  }

  return (
    <div>
      <HomeHero />
      <CommunityMarquee />

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <CountUp to={12} suffix="+" label="Homes ready to view" />
          <CountUp to={6} label="Prime communities" />
          <CountUp to={24} suffix="h" label="Typical first viewing" />
          <Reveal>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 text-gold-hover" />
              <div>
                <p className="font-serif text-2xl text-ink">DLD ready</p>
                <p className="mt-1 text-sm text-muted">Title, NOC, and viewing access handled</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Private list</p>
              <h2 className="mt-2 font-serif text-4xl text-ink">Homes clients ask for first</h2>
              <p className="mt-2 max-w-xl text-sm text-ink-soft">
                Beach, Burj views, and gated villas — a new home every two seconds. Tap a card to open it.
              </p>
            </div>
            <Link href="/listings" className="hidden items-center gap-2 text-sm text-ink md:inline-flex">
              All listings <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div>
          <FeaturedSwipe properties={featured} />
        </div>
      </section>

      <HowItWorks />

      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Communities</p>
            <h2 className="mt-2 font-serif text-4xl text-ink">Where our clients actually live</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {COMMUNITIES.filter((item) =>
              ["palm-jumeirah", "downtown-dubai", "dubai-hills", "dubai-marina", "emirates-hills", "arabian-ranches"].includes(
                item.slug,
              ),
            ).map((community, index) => (
              <Reveal key={community.slug} delay={index * 50}>
                <Link
                  href={`/communities/${community.slug}`}
                  className="chip inline-block rounded-full border border-line bg-white px-5 py-2 text-sm text-ink"
                >
                  {community.name}
                </Link>
              </Reveal>
            ))}
            <Reveal delay={350}>
              <Link href="/communities" className="chip inline-block rounded-full border border-line bg-ink px-5 py-2 text-sm text-ivory">
                All communities
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Testimonials />
      <RecentlyViewed />
      <LeadStrip />
    </div>
  );
}
