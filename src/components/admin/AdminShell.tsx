"use client";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listings", icon: Building2 },
  { href: "/admin/viewings", label: "Viewings", icon: CalendarDays },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/buyers", label: "Buyers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

function pageMeta(pathname: string) {
  if (pathname.startsWith("/admin/listings/new")) {
    return { title: "New listing", eyebrow: "Collection", copy: "Publish a home to the Dubai collection." };
  }
  if (pathname.startsWith("/admin/listings/") && pathname !== "/admin/listings") {
    return { title: "Edit listing", eyebrow: "Collection", copy: "Update price, photos, and availability." };
  }
  if (pathname.startsWith("/admin/listings")) {
    return { title: "Listings", eyebrow: "Collection", copy: "Every home currently on Aurelia." };
  }
  if (pathname.startsWith("/admin/viewings")) {
    return { title: "Viewings", eyebrow: "Diary", copy: "Private viewings requested on listings." };
  }
  if (pathname.startsWith("/admin/buyers")) {
    return { title: "Buyers", eyebrow: "Clients", copy: "Intake briefs and registered accounts." };
  }
  if (pathname.startsWith("/admin/reports")) {
    return { title: "Reports", eyebrow: "Studio", copy: "How the collection and leads are sitting today." };
  }
  if (pathname.startsWith("/admin/settings")) {
    return { title: "Settings", eyebrow: "Studio", copy: "Desk details and your studio password." };
  }
  if (pathname.startsWith("/admin/enquiries")) {
    return { title: "Enquiries", eyebrow: "Leads", copy: "Reply on WhatsApp, then close the loop." };
  }
  return { title: "Overview", eyebrow: "Studio", copy: "Dubai desks, viewings, and the private list." };
}

export function AdminShell({
  children,
  name,
  newLeads = 0,
  newViewings = 0,
  hello,
  today,
}: {
  children: React.ReactNode;
  name: string;
  newLeads?: number;
  newViewings?: number;
  hello: string;
  today: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const meta = pageMeta(pathname);
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="admin-app flex min-h-0 flex-1 text-ivory">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-gradient-to-b from-[#241f1b] to-ink md:flex">
        <div className="px-5 py-6">
          <Link href="/admin" className="block" aria-label="Aurelia studio">
            <BrandLogo size="md" />
          </Link>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map((link) => {
            const active =
              pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active ? "bg-gold/15 text-ivory" : "text-ivory/65 hover:bg-white/5 hover:text-ivory",
                )}
              >
                {active ? <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gold" /> : null}
                <link.icon className={cn("h-4 w-4", active ? "text-gold" : "")} />
                {link.label}
                {link.href === "/admin/enquiries" && newLeads > 0 ? (
                  <span className="ml-auto rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-medium text-ink">
                    {newLeads}
                  </span>
                ) : null}
                {link.href === "/admin/viewings" && newViewings > 0 ? (
                  <span className="ml-auto rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-medium text-ink">
                    {newViewings}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto shrink-0 px-3 pb-6 pt-4">
          <Link
            href="/admin/settings"
            className={cn(
              "inline-flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition",
              pathname.startsWith("/admin/settings")
                ? "border-white/20 bg-gold/15 text-ivory"
                : "border-white/15 text-ivory/70 hover:border-white/25 hover:bg-white/5 hover:text-ivory",
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="mt-5 px-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Desk</p>
            <p className="mt-1 truncate text-sm text-ivory/80">Boulevard Plaza</p>
            <p className="text-xs text-ivory/45">Downtown Dubai</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-ivory text-ink md:ml-64">
        <div className="admin-top-strip flex items-center justify-between px-4 py-2 sm:px-8">
          <p>
            <span className="text-gold">دبي</span>
            <span className="mx-2 text-ivory/30">·</span>
            Aurelia studio · Downtown Dubai
          </p>
          <p className="hidden text-ivory/55 sm:block">
            {hello} · {today}
          </p>
        </div>

        <header className="admin-topbar">
          <div className="flex flex-wrap items-center gap-4 px-4 py-3.5 sm:px-8">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-hover">{meta.eyebrow}</p>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3">
                <h1 className="font-serif text-2xl text-ink sm:text-[1.75rem]">{meta.title}</h1>
              </div>
              <p className="mt-0.5 hidden text-sm text-muted sm:block">{meta.copy}</p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/enquiries"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-gold"
                aria-label="Enquiries"
              >
                <Bell className="h-4 w-4" />
                {newLeads > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#25D366] ring-2 ring-ivory" />
                ) : null}
              </Link>
              <Link
                href="/"
                className="hidden h-10 items-center gap-2 rounded-full border border-line bg-white px-3 text-xs text-ink sm:inline-flex"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View site
              </Link>
              <Link
                href="/admin/listings/new"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-medium text-ivory transition hover:bg-ink-soft"
              >
                <Plus className="h-3.5 w-3.5" />
                New listing
              </Link>
              <div className="ml-1 hidden items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 sm:flex">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold font-serif text-sm text-ink">
                  {initial}
                </span>
                <span className="max-w-[8rem] truncate text-xs">{name}</span>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-ink"
                aria-label="Log out"
                onClick={async () => {
                  await logout();
                  router.push("/login?next=/admin");
                }}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-line px-4 py-2 md:hidden">
          {[...links, { href: "/admin/settings", label: "Settings" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs",
                pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
                  ? "bg-ink text-ivory"
                  : "text-ink-soft",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 bg-ivory p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
