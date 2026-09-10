"use client";

import { whatsappHref } from "@/lib/contact";
import {
  INTAKE_BEDS,
  INTAKE_BUDGETS,
  INTAKE_COMMUNITIES,
  INTAKE_TIMELINES,
} from "@/lib/intake";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-line bg-ivory px-3 py-3 text-sm outline-none placeholder:text-muted focus:border-gold";

export function IntakeForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setStatus("sending");
    setError("");
    const form = new FormData(formEl);
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "intake",
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        community: form.get("community"),
        budget: form.get("budget"),
        bedrooms: form.get("bedrooms"),
        timeline: form.get("timeline"),
        message: form.get("message"),
      }),
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not send.");
      setStatus("error");
      return;
    }
    formEl.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm leading-7 text-ink-soft">
        Brief received. A specialist will send three matching homes today — or WhatsApp us if you want
        it faster.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <input name="name" required placeholder="Full name" className={inputClass} />
        <input name="phone" required placeholder="Mobile / WhatsApp" className={inputClass} />
        <input name="email" type="email" required placeholder="Email" className={inputClass} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Community</span>
          <select name="community" required defaultValue="Palm Jumeirah" className={inputClass}>
            {INTAKE_COMMUNITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Budget</span>
          <select name="budget" required defaultValue="AED 5M – 10M" className={inputClass}>
            {INTAKE_BUDGETS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Beds</span>
          <select name="bedrooms" required defaultValue="3+" className={inputClass}>
            {INTAKE_BEDS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Timeline</span>
          <select name="timeline" required defaultValue="This month" className={inputClass}>
            {INTAKE_TIMELINES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      {compact ? null : (
        <textarea
          name="message"
          rows={3}
          placeholder="School run, sea view, furnished — anything we should know."
          className={inputClass}
        />
      )}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-shine rounded-xl bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold-hover disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send my brief"}
        </button>
        <a
          href={whatsappHref("Hello Aurelia — I would like a private shortlist. I can share community, budget, beds, and timeline.")}
          className="text-sm text-gold-hover hover:underline"
        >
          Prefer WhatsApp?
        </a>
      </div>
    </form>
  );
}
