import { type AuthUser, type Property } from "@/types";
import Link from "next/link";

export function BuyersTable({
  buyers,
  properties,
}: {
  buyers: AuthUser[];
  properties: Property[];
}) {
  const titles = Object.fromEntries(properties.map((item) => [item.id, item.title]));

  if (buyers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="font-serif text-2xl">No registered buyers yet</p>
        <p className="mt-2 text-sm text-muted">Accounts created on the public site will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-ivory/70 text-[11px] uppercase tracking-[0.16em] text-muted">
          <tr>
            <th className="px-5 py-3.5 font-medium">Buyer</th>
            <th className="px-4 py-3.5 font-medium">Saved</th>
            <th className="px-5 py-3.5 font-medium">Shortlist</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer) => (
            <tr key={buyer.id} className="border-t border-line align-top">
              <td className="px-5 py-4">
                <p className="font-medium text-ink">{buyer.name}</p>
                <p className="mt-0.5 text-xs text-muted">{buyer.email}</p>
              </td>
              <td className="px-4 py-4">
                <span className="admin-status admin-status-available">{buyer.favoriteIds.length}</span>
              </td>
              <td className="px-5 py-4">
                {buyer.favoriteIds.length === 0 ? (
                  <p className="text-xs text-muted">No homes saved</p>
                ) : (
                  <ul className="space-y-1">
                    {buyer.favoriteIds.map((id) => (
                      <li key={id}>
                        {titles[id] ? (
                          <Link href={`/listings/${id}`} className="text-ink-soft hover:text-ink hover:underline">
                            {titles[id]}
                          </Link>
                        ) : (
                          <span className="text-xs text-muted">Removed listing</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
