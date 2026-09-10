"use client";

import { formatIntakeSummary } from "@/lib/intake";
import { type Enquiry, type EnquiryStatus } from "@/types";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function waLink(item: Enquiry) {
  const brief = formatIntakeSummary(item);
  const text = brief
    ? `Hello ${item.name} — Aurelia shortlist for ${brief}. I'll send three homes today.`
    : `Hello ${item.name} — following up on your Aurelia buyer brief.`;
  return `https://wa.me/${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function IntakeBoard({ intakes }: { intakes: Enquiry[] }) {
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

  if (intakes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
        <p className="font-serif text-2xl">No buyer briefs yet</p>
        <p className="mt-2 text-sm text-muted">Homepage and contact intake forms land here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {intakes.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-serif text-2xl text-ink">{item.name}</p>
              <p className="mt-1 text-sm text-muted">
                {item.phone} · {item.email}
              </p>
            </div>
            <span className={`admin-status admin-status-${item.status}`}>{item.status}</span>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Community</dt>
              <dd className="mt-1 font-medium text-ink">{item.community || "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Budget</dt>
              <dd className="mt-1 font-medium text-ink">{item.budget || "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Beds</dt>
              <dd className="mt-1 font-medium text-ink">{item.bedrooms || "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Timeline</dt>
              <dd className="mt-1 font-medium text-ink">{item.timeline || "—"}</dd>
            </div>
          </dl>
          {item.message ? <p className="mt-4 text-sm leading-6 text-ink-soft">{item.message}</p> : null}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={waLink(item)}
              className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-4 py-2 text-xs font-medium text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp shortlist
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
