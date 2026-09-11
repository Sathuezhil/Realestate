"use client";

import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { formatIntakeSummary } from "@/lib/intake";
import { formatPrice, formatViewingAt } from "@/lib/utils";
import { type Enquiry, type Property } from "@/types";
import { BarChart3, Building2, CalendarDays, Heart, Home, Inbox, Settings, Users } from "lucide-react";
import Link from "next/link";

export function DashboardClient({
  stats,
  recentEnquiries,
  recentListings,
}: {
  stats: {
    listings: number;
    available: number;
    sold: number;
    rented: number;
    enquiries: number;
    newEnquiries: number;
    users: number;
  };
  recentEnquiries: Enquiry[];
  recentListings: Property[];
}) {
  const cards = [
    { label: "Listings", value: stats.listings, icon: Building2 },
    { label: "Available", value: stats.available, icon: Home },
    { label: "New enquiries", value: stats.newEnquiries, icon: Inbox },
    { label: "Saved buyers", value: stats.users, icon: Heart },
  ];

  return (
    <div>
      <div className="mt-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="admin-stat rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{card.label}</p>
              <card.icon className="h-4 w-4 text-gold-hover" />
            </div>
            <p className="relative mt-3 font-serif text-4xl text-ink">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { href: "/admin/viewings", label: "Viewings", copy: "Private tours on listings", icon: CalendarDays },
          { href: "/admin/buyers", label: "Buyers", copy: "Registered accounts", icon: Users },
          { href: "/admin/reports", label: "Reports", copy: "Collection mix and leads", icon: BarChart3 },
          { href: "/admin/settings", label: "Settings", copy: "Desk and studio password", icon: Settings },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-gold"
          >
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-hover" />
            <span>
              <span className="block text-sm font-medium text-ink">{item.label}</span>
              <span className="mt-0.5 block text-xs text-muted">{item.copy}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs uppercase tracking-[0.14em] text-gold-hover">
              All leads
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-muted">No enquiries yet.</p>
          ) : (
            <ul className="space-y-4">
              {recentEnquiries.map((item) => (
                <li key={item.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.viewingAt ? (
                        <p className="mt-1 text-sm text-gold-hover">{formatViewingAt(item.viewingAt)}</p>
                      ) : item.source === "intake" ? (
                        <p className="mt-1 text-sm text-gold-hover">{formatIntakeSummary(item)}</p>
                      ) : null}
                      <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{item.message}</p>
                    </div>
                    <span className={`admin-status admin-status-${item.status}`}>{item.status}</span>
                  </div>
                  <a
                    href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-[#128C4A]"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Recent listings</h2>
            <Link href="/admin/listings" className="text-xs uppercase tracking-[0.14em] text-gold-hover">
              Manage
            </Link>
          </div>
          {recentListings.length === 0 ? (
            <p className="text-sm text-muted">No listings yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentListings.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/listings/${item.id}`}
                    className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-ivory"
                  >
                    <span
                      className="h-12 w-16 shrink-0 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.images[0]})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="text-sm text-muted">{item.location.area}</p>
                    </div>
                    <p className="text-sm text-ink">{formatPrice(item.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
