"use client";

import { CurrencySwitch } from "@/components/currency/CurrencySwitch";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/components/providers/AuthProvider";
import { useBrowse } from "@/components/providers/BrowseProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { Heart, Menu, Moon, Sun, UserRound, X, Columns2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { compareIds, ready } = useBrowse();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="relative">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 border-b bg-ivory/85 backdrop-blur-md transition-all duration-300",
            scrolled ? "border-line/90 shadow-[0_8px_30px_rgba(28,25,22,0.06)]" : "border-transparent",
          )}
        />
        <div className="relative mx-auto flex min-h-[4.35rem] max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:min-h-[5rem] sm:gap-4 sm:px-6 sm:py-2 lg:min-h-[5.75rem] lg:px-8">
          <Link href="/" className="header-logo relative min-w-0 shrink-0" aria-label="Aurelia home">
            <BrandLogo size="sm" />
          </Link>

          <nav className="header-nav hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link text-sm tracking-wide text-muted transition hover:text-ink",
                  (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) &&
                    "is-active text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-tools hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href={whatsappHref()}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-3.5 text-xs font-medium text-white transition hover:opacity-90"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <CurrencySwitch />
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:text-gold-hover"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href={compareIds.length >= 2 ? `/compare?ids=${compareIds.join(",")}` : "/compare"}
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:text-gold-hover"
              aria-label="Compare homes"
            >
              <Columns2 className="h-4 w-4" />
              {ready && compareIds.length > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-ink">
                  {compareIds.length}
                </span>
              ) : null}
            </Link>
            <Link
              href="/favorites"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:text-gold-hover hover:scale-105"
              aria-label="Favorites"
            >
              <Heart className="h-4 w-4" />
            </Link>
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

          <div className="header-tools flex shrink-0 items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
              onClick={() => setOpen((value) => !value)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <nav className="header-menu relative z-10 max-h-[min(70dvh,32rem)] overflow-y-auto border-t border-line bg-ivory px-4 py-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-line py-3.5 text-base text-ink",
                  (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) &&
                    "font-medium text-gold-hover",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/favorites" onClick={() => setOpen(false)} className="border-b border-line py-3.5 text-base text-ink">
              Favorites
            </Link>
            <Link href="/compare" onClick={() => setOpen(false)} className="border-b border-line py-3.5 text-base text-ink">
              Compare homes
            </Link>
            <div className="border-b border-line py-3.5">
              <CurrencySwitch />
            </div>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="border-b border-line py-3.5 text-left text-base text-ink"
            >
              {theme === "dark" ? "Light theme" : "Dark theme"}
            </button>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void logout();
                }}
                className="py-3.5 text-left text-base text-ink"
              >
                Log out
              </button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="py-3.5 text-base text-ink">
                Sign in
              </Link>
            )}
            <a
              href={whatsappHref()}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-medium text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp a specialist
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

