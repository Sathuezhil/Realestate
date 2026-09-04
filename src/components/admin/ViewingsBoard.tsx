"use client";

import { type Enquiry, type EnquiryStatus } from "@/types";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const columns: { status: EnquiryStatus; label: string; hint: string }[] = [
  { status: "new", label: "Requested", hint: "Waiting on the desk" },
  { status: "contacted", label: "Confirmed", hint: "WhatsApp sent" },
  { status: "closed", label: "Completed", hint: "Tour done or dropped" },
];

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export function ViewingsBoard({
  enquiries,
  titles = {},
}: {
  enquiries: Enquiry[];
  titles?: Record<string, string>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: EnquiryStatus) {
    setBusy(id);
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  if (enquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="font-serif text-2xl">No viewings yet</p>
        <p className="mt-2 text-sm text-muted">Private tours requested on listings will sit here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => {
        const items = enquiries.filter((item) => item.status === column.status);
        return (
          <section key={column.status} className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-4 flex items-baseline justify-between px-1">
              <div>
                <h2 className="font-serif text-xl">{column.label}</h2>
                <p className="text-xs text-muted">{column.hint}</p>
              </div>
              <span className="text-sm text-ink-soft">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-3 py-8 text-center text-xs text-muted">
                  Empty
                </p>
              ) : (
                items.map((item) => (
                  <article key={item.id} className="rounded-xl border border-line bg-ivory/60 p-4">
                    <p className="font-medium text-ink">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {titles[item.propertyId ?? ""] || "Listing request"}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{item.message}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted">
                      {new Date(item.createdAt).toLocaleString("en-AE")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <a
                        href={waLink(item.phone)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-medium text-white"
                      >
                        <MessageCircle className="h-3 w-3" />
                        WhatsApp
                      </a>
                      {columns
                        .filter((next) => next.status !== item.status)
                        .map((next) => (
                          <button
                            key={next.status}
                            type="button"
                            disabled={busy === item.id}
                            onClick={() => void setStatus(item.id, next.status)}
                            className="rounded-full border border-line bg-white px-2.5 py-1.5 text-[11px] capitalize disabled:opacity-50"
                          >
                            {next.label}
                          </button>
                        ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
