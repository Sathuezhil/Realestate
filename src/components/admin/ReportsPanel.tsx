import { propertyTypeLabel, statusLabel } from "@/lib/utils";
import { type Enquiry, type Property } from "@/types";

function tally(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function BarGroup({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number }[];
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
      <h2 className="font-serif text-2xl">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nothing to chart yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <p className="text-sm text-ink">{row.label}</p>
                <p className="text-xs text-muted">{row.value}</p>
              </div>
              <div className="admin-bar">
                <span style={{ width: `${Math.max(6, (row.value / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ReportsPanel({
  properties,
  enquiries,
}: {
  properties: Property[];
  enquiries: Enquiry[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BarGroup title="By community" rows={tally(properties.map((item) => item.location.area))} />
      <BarGroup
        title="By type"
        rows={tally(properties.map((item) => propertyTypeLabel(item.propertyType)))}
      />
      <BarGroup title="Listing status" rows={tally(properties.map((item) => statusLabel(item.status)))} />
      <BarGroup
        title="Lead source"
        rows={tally(
          enquiries.map((item) =>
            item.source === "property" ? "Listing viewing" : item.source === "intake" ? "Buyer brief" : "Contact form",
          ),
        )}
      />
    </div>
  );
}
