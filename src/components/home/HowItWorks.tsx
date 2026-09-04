import { Reveal } from "@/components/motion/Reveal";
import { CalendarCheck, KeyRound, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Tell us how you want to live",
    copy: "Community, budget, school run, sea view — we listen first.",
  },
  {
    icon: KeyRound,
    title: "A short private list",
    copy: "Three to five homes that actually fit. No brochure spam.",
  },
  {
    icon: CalendarCheck,
    title: "Viewing the same day",
    copy: "We arrange access, meet you on site, and handle the DLD paperwork after.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">How it works</p>
          <h2 className="mt-2 max-w-xl font-serif text-4xl text-ink">From first message to keys.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 90}>
              <div className="h-full rounded-2xl border border-line p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(28,25,22,0.06)]">
                <step.icon className="icon-float h-6 w-6 text-gold-hover" />
                <p className="step-num mt-5 text-xs uppercase tracking-[0.18em] text-muted">0{index + 1}</p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-soft">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
