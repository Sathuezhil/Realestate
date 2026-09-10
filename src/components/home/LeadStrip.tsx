"use client";

import { IntakeForm } from "@/components/leads/IntakeForm";

export function LeadStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="cta-panel overflow-hidden rounded-3xl border border-line bg-ivory-dark px-6 py-12 text-ink md:px-14">
        <p className="relative text-xs uppercase tracking-[0.22em] text-gold">Buyer brief</p>
        <h2 className="relative mt-3 max-w-2xl font-serif text-4xl md:text-5xl">
          Tell us how you want to live. We send three homes today.
        </h2>
        <p className="relative mt-4 max-w-xl text-ink-soft">
          Community, budget, beds, and timeline — a specialist replies with a private shortlist. No
          mailing list.
        </p>
        <div className="relative mt-8">
          <IntakeForm compact />
        </div>
      </div>
    </section>
  );
}
