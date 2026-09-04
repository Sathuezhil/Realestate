"use client";

import { formatPrice, propertyTypeLabel } from "@/lib/utils";
import { type Property } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ListingsTable({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function onDelete(id: string, title: string) {
    if (!window.confirm(`Remove “${title}” from the collection?`)) return;
    setBusy(id);
    const response = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    setBusy(null);
    if (response.ok) router.refresh();
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="font-serif text-2xl">No listings yet</p>
        <p className="mt-2 text-sm text-muted">Publish the first home to the Dubai collection.</p>
        <Link href="/admin/listings/new" className="mt-5 inline-flex rounded-full bg-ink px-5 py-2 text-sm text-ivory">
          New listing
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-ivory/70 text-[11px] uppercase tracking-[0.16em] text-muted">
          <tr>
            <th className="px-5 py-3.5 font-medium">Home</th>
            <th className="px-4 py-3.5 font-medium">Type</th>
            <th className="px-4 py-3.5 font-medium">Price</th>
            <th className="px-4 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium text-right"> </th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id} className="border-t border-line transition hover:bg-ivory/50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-12 w-[4.25rem] shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${property.images[0]})` }}
                  />
                  <div>
                    <p className="font-medium text-ink">{property.title}</p>
                    <p className="text-xs text-muted">{property.location.area}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-ink-soft">{propertyTypeLabel(property.propertyType)}</td>
              <td className="px-4 py-3">{formatPrice(property.price)}</td>
              <td className="px-4 py-3">
                <span className={`admin-status admin-status-${property.status}`}>
                  {property.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <Link href={`/listings/${property.id}`} className="mr-3 text-ink-soft hover:text-ink">
                  View
                </Link>
                <Link href={`/admin/listings/${property.id}`} className="mr-3 text-gold-hover hover:underline">
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={busy === property.id}
                  onClick={() => void onDelete(property.id, property.title)}
                  className="text-red-700/80 hover:text-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
