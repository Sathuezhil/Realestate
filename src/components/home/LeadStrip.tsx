"use client";

import { whatsappHref } from "@/lib/contact";
import { useState } from "react";

export function LeadStrip() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const community = String(form.get("community") || "Dubai");
    const budget = String(form.get("budget") || "Open");
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "contact",
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: `Shortlist request — community: ${community}. Budget: ${budget}. Please send 3 matching homes today.`,
      }),
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not send.");
      setStatus("error");
      return;
    }
    event.currentTarget.reset();
    setStatus("sent");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="cta-panel overflow-hidden rounded-3xl bg-ink px-6 py-12 text-ivory md:px-14">
        <p className="relative text-xs uppercase tracking-[0.22em] text-gold">Complimentary shortlist</p>
        <h2 className="relative mt-3 max-w-2xl font-serif text-4xl md:text-5xl">
          Tell us the community. We send three homes today.
        </h2>
        <p className="relative mt-4 max-w-xl text-ivory/70">
          No mailing list. A specialist replies on WhatsApp or email with a private shortlist.
        </p>

        {status === "sent" ? (
          <p className="relative mt-8 max-w-md text-sm leading-7 text-ivory/85">
            Received. You will have a shortlist within the day — or WhatsApp us if you want it faster.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="relative mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input
              name="name"
              required
              placeholder="Name"
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm outline-none placeholder:text-ivory/40 focus:border-gold"
            />
            <input
              name="phone"
              required
              placeholder="Mobile / WhatsApp"
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm outline-none placeholder:text-ivory/40 focus:border-gold"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm outline-none placeholder:text-ivory/40 focus:border-gold"
            />
            <select
              name="community"
              className="rounded-xl border border-white/15 bg-ink px-3 py-3 text-sm outline-none focus:border-gold"
              defaultValue="Palm Jumeirah"
            >
              <option>Palm Jumeirah</option>
              <option>Downtown Dubai</option>
              <option>Dubai Marina</option>
              <option>Emirates Hills</option>
              <option>Dubai Hills</option>
              <option>Arabian Ranches</option>
              <option>Open — advise me</option>
            </select>
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-shine rounded-xl bg-gold py-3 text-sm font-medium text-ink hover:bg-gold-hover disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send my shortlist"}
            </button>
            <input type="hidden" name="budget" value="To be discussed" />
          </form>
        )}
        {error ? <p className="relative mt-3 text-sm text-red-200">{error}</p> : null}
        <a href={whatsappHref("Hello — please send me a private shortlist today.")} className="relative mt-5 inline-block text-sm text-gold hover:underline">
          Prefer WhatsApp? Message the studio now
        </a>
      </div>
    </section>
  );
}
