"use client";

import { whatsappHref } from "@/lib/contact";
import {
  dubaiYmd,
  formatViewingAt,
  isViewingSlotOpen,
  VIEWING_TIMES,
  viewingAtIso,
  viewingDayParts,
} from "@/lib/utils";
import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { type ViewingType } from "@/types";
import { useEffect, useMemo, useState } from "react";

const DAYS = 8;

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
  const [bookedSlot, setBookedSlot] = useState("");
  const [viewingType, setViewingType] = useState<ViewingType>("in-person");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    const nextDays = Array.from({ length: DAYS }, (_, index) => dubaiYmd(index)).filter((ymd) =>
      VIEWING_TIMES.some((slot) => isViewingSlotOpen(ymd, slot)),
    );
    setDays(nextDays);
    setDate((current) => current || nextDays[0] || "");
  }, []);

  const openTimes = useMemo(
    () => (date ? VIEWING_TIMES.filter((slot) => isViewingSlotOpen(date, slot)) : [...VIEWING_TIMES]),
    [date],
  );

  useEffect(() => {
    if (time && !openTimes.includes(time as (typeof VIEWING_TIMES)[number])) {
      setTime("");
    }
  }, [openTimes, time]);

  const selectedIso = date && time ? viewingAtIso(date, time) : "";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setStatus("sending");
    setError("");
    const form = new FormData(formEl);
    const note = String(form.get("message") || "").trim();

    if (propertyId && (!date || !time)) {
      setError("Pick a day and a time.");
      setStatus("error");
      return;
    }

    const viewingAt = propertyId && date && time ? viewingAtIso(date, time) : undefined;
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        source,
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: note,
        viewingAt,
        viewingType: propertyId ? viewingType : undefined,
      }),
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not send enquiry.");
      setStatus("error");
      return;
    }
    setBookedSlot(formatViewingAt(viewingAt));
    formEl.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-ivory p-6 text-sm leading-7 text-ink-soft">
        {bookedSlot ? (
          <>
            Viewing requested for <span className="font-medium text-ink">{bookedSlot}</span> Dubai
            time. A specialist will confirm on WhatsApp shortly.
          </>
        ) : (
          "Thank you. A specialist will be in touch shortly — usually within a few hours."
        )}
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
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["in-person", "In person"],
                ["video", "Video tour"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setViewingType(value)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  viewingType === value
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-ivory text-ink hover:border-gold"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted">Day</p>
            <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]">
              {days.map((ymd) => {
                const { top, bottom } = viewingDayParts(ymd);
                return (
                  <button
                    key={ymd}
                    type="button"
                    onClick={() => setDate(ymd)}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-left transition ${
                      date === ymd
                        ? "border-ink bg-ink text-ivory"
                        : "border-line bg-ivory text-ink hover:border-gold"
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-wide opacity-80">{top}</span>
                    <span className="text-sm font-medium">{bottom}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted">Time · Dubai</p>
            <div className="grid grid-cols-3 gap-2">
              {VIEWING_TIMES.map((slot) => {
                const open = openTimes.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!open}
                    onClick={() => setTime(slot)}
                    className={`rounded-xl border px-2 py-2 text-sm tabular-nums transition disabled:cursor-not-allowed disabled:opacity-35 ${
                      time === slot
                        ? "border-ink bg-ink text-ivory"
                        : "border-line bg-ivory text-ink hover:border-gold"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      <textarea
        name="message"
        rows={propertyId ? 3 : 4}
        placeholder={
          propertyId ? "Anything we should know? Parking, gate access, kids..." : "How can we help?"
        }
        required={!propertyId}
        className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending" || Boolean(propertyId && !selectedIso)}
        className="btn-shine w-full rounded-xl bg-ink py-3 text-sm font-medium text-ivory transition hover:bg-ink-soft disabled:opacity-60"
      >
        {status === "sending"
          ? "Sending..."
          : propertyId
            ? selectedIso
              ? `Request ${formatViewingAt(selectedIso)}`
              : "Pick a day and time"
            : "Send message"}
      </button>
      {propertyId ? (
        <a
          href={whatsappHref(
            `Hello Aurelia — I would like to view ${propertyTitle ?? "this listing"} (${propertyId})${
              selectedIso ? ` on ${formatViewingAt(selectedIso)} Dubai time` : ""
            }.`,
          )}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-medium text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp this listing
        </a>
      ) : null}
    </form>
  );
}
