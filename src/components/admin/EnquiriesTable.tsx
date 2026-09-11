"use client";

import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { formatViewingAt } from "@/lib/utils";
import { type Enquiry, type EnquiryStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export function EnquiriesTable({
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
        <p className="font-serif text-2xl">No enquiries yet</p>
        <p className="mt-2 text-sm text-muted">Viewing requests will land here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enquiries.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-serif text-xl text-ink">{item.name}</p>
              <p className="mt-1 text-sm text-muted">
                {item.email} · {item.phone}
              </p>
            </div>
            <span className={`admin-status admin-status-${item.status}`}>{item.status}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-ink-soft">{item.message}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-muted">
            {item.source === "property"
              ? titles[item.propertyId ?? ""] || `Listing ${item.propertyId ?? ""}`
              : item.source === "intake"
                ? `Buyer brief${item.community ? ` · ${item.community}` : ""}`
                : "Contact form"}
            {item.viewingAt ? ` · ${formatViewingAt(item.viewingAt)} Dubai` : ""}{" "}
            · {new Date(item.createdAt).toLocaleString("en-AE")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={waLink(item.phone)}
              className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-4 py-2 text-xs font-medium text-white"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            {(["new", "contacted", "closed"] as const).map((status) => (
              <button
                key={status}
                type="button"
                disabled={busy === item.id || item.status === status}
                onClick={() => void setStatus(item.id, status)}
                className="rounded-full border border-line px-3 py-2 text-xs capitalize disabled:bg-ivory disabled:opacity-100"
              >
                {status}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
