"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { whatsappHref } from "@/lib/contact";
import { Heart, Menu, MessageCircle, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 border-b bg-ivory/85 backdrop-blur-md transition-all duration-300",
          scrolled ? "border-line/90 shadow-[0_8px_30px_rgba(28,25,22,0.06)]" : "border-transparent",
        )}
      />
      <div className="relative mx-auto flex min-h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-2xl tracking-tight text-ink transition hover:text-gold-hover">
          Aurelia
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link text-sm tracking-wide text-muted transition hover:text-ink",
                pathname === link.href && "is-active text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <a
            href={whatsappHref()}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-3.5 text-xs font-medium text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <Link
            href="/favorites"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:text-gold-hover hover:scale-105"
            aria-label="Favorites"
          >
            <Heart className="h-4 w-4" />
          </Link>
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className="rounded-full border border-gold px-3 py-2 text-xs uppercase tracking-[0.14em] text-gold-hover"
            >
              Studio
            </Link>
          ) : null}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[10rem] truncate text-sm text-ink-soft">{user.name}</span>
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex h-9 items-center rounded-full border border-line px-4 text-sm text-ink transition hover:border-ink"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-shine inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-sm text-ivory transition hover:bg-ink-soft"
            >
              <UserRound className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-ivory px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-ink"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" ? (
              <Link href="/admin" onClick={() => setOpen(false)} className="text-sm text-ink">
                Studio
              </Link>
            ) : null}
            <Link href="/favorites" onClick={() => setOpen(false)} className="text-sm text-ink">
              Favorites
            </Link>
            <a href={whatsappHref()} onClick={() => setOpen(false)} className="text-sm text-ink">
              WhatsApp a specialist
            </a>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void logout();
                }}
                className="text-left text-sm text-ink"
              >
                Log out
              </button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm text-ink">
                Sign in
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
