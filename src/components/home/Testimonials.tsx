import { Reveal } from "@/components/motion/Reveal";

const quotes = [
  {
    quote:
      "We WhatsApped at noon and walked a Palm villa before sunset. No pressure, just the right home.",
    name: "James & Elena",
    detail: "Relocated from London · Palm Jumeirah",
  },
  {
    quote:
      "Clear files, honest pricing, and Downtown closed in eleven days. That is rare in this market.",
    name: "Amal Al Suwaidi",
    detail: "End-user · Downtown Dubai",
  },
  {
    quote:
      "They sent three Hills villas that actually matched the school run. We signed the one with the park.",
    name: "Rahul Mehta",
    detail: "Family move · Dubai Hills",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Clients</p>
          <h2 className="mt-2 font-serif text-4xl text-ink">What buyers tell us after the keys.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {quotes.map((item, index) => (
            <Reveal key={item.name} delay={index * 90}>
              <blockquote className="quote-card flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                <p className="flex-1 text-[15px] leading-7 text-ink-soft">“{item.quote}”</p>
                <footer className="mt-6 border-t border-line pt-4">
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="mt-1 text-xs text-muted">{item.detail}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
