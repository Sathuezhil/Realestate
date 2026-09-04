"use client";

import { whatsappHref } from "@/lib/contact";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function EnquiryForm({
  propertyId,
  propertyTitle,
  source = "property",
}: {
  propertyId?: string;
  propertyTitle?: string;
  source?: "property" | "contact";
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const viewing = String(form.get("viewing") || "");
    const note = String(form.get("message") || "");
    const message = viewing ? `${note}\n\nPreferred viewing: ${viewing}` : note;
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        source,
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message,
      }),
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not send enquiry.");
      setStatus("error");
      return;
    }
    event.currentTarget.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-ivory p-6 text-sm leading-7 text-ink-soft">
        Thank you. A specialist will confirm a viewing time shortly — usually within a few hours.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        name="name"
        required
        placeholder="Full name"
        className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
      <input
        name="phone"
        required
        placeholder="Mobile / WhatsApp"
        className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
      {propertyId ? (
        <select
          name="viewing"
          className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
          defaultValue="Today or tomorrow"
        >
          <option>Today or tomorrow</option>
          <option>This week</option>
          <option>Weekend only</option>
          <option>I am overseas — video tour first</option>
        </select>
      ) : null}
      <textarea
        name="message"
        required
        rows={4}
        placeholder={propertyId ? "I would like to schedule a viewing..." : "How can we help?"}
        className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shine w-full rounded-xl bg-ink py-3 text-sm font-medium text-ivory transition hover:bg-ink-soft disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : propertyId ? "Request a viewing" : "Send message"}
      </button>
      {propertyId ? (
        <a
          href={whatsappHref(
            `Hello Aurelia — I would like to view ${propertyTitle ?? "this listing"} (${propertyId}).`,
          )}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-medium text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp this listing
        </a>
      ) : null}
    </form>
  );
}
