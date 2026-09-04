import { Reveal } from "@/components/motion/Reveal";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden py-24">
        <div
          className="ken-pan absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Our story</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl text-white md:text-6xl">
            A quieter way to find a <span className="gold-shimmer">home</span>.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="font-serif text-3xl leading-snug text-ink">
            Aurelia is a listings platform for people who care about neighbourhood, light, and how a
            house actually lives.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 leading-8 text-ink-soft">
            We started with a simple brief: fewer, better homes, photographed honestly, and searchable
            without noise. Apartments, villas, and offices are listed with the same care — price,
            plan, amenities, and a map you can trust.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-4 leading-8 text-ink-soft">
            This first release is the public experience: search, filter, save favourites, and enquire.
            An admin studio for publishing listings and managing leads is next.
          </p>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ["Considered", "Every listing includes the details you need to decide — not a brochure of adjectives."],
            ["Local", "Palm Jumeirah, Downtown, Marina, Emirates Hills, Dubai Hills, and Arabian Ranches — with more communities to follow."],
            ["Direct", "Enquire on a home and the listing associate receives it the same day."],
          ].map(([title, copy], index) => (
            <Reveal key={title} delay={index * 90}>
              <div className="rounded-2xl border border-line p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(28,25,22,0.06)]">
                <h2 className="font-serif text-2xl text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-ink-soft">{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
