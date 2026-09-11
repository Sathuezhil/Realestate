import { BrandLogo } from "@/components/layout/BrandLogo";
import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { STUDIO, whatsappHref } from "@/lib/contact";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ivory-dark text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <BrandLogo size="md" />
          <p className="mt-3 max-w-md text-sm leading-7 text-ink-soft">
            Private apartments, villas, and offices across Dubai. We arrange the viewing, the files,
            and the conversation with the other side.
          </p>
          <a
            href={whatsappHref()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp the studio
          </a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-hover">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-ink-soft">
            <Link href="/listings">All listings</Link>
            <Link href="/communities">Communities</Link>
            <Link href="/mortgage">Mortgage calculator</Link>
            <Link href="/compare">Compare homes</Link>
            <Link href="/listings?type=villa">Villas</Link>
            <Link href="/listings?type=apartment">Apartments</Link>
            <Link href="/listings?type=office">Offices</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-hover">Speak to us</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-ink-soft">
            <a href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a>
            <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
            <p>Boulevard Plaza, Downtown Dubai</p>
            <Link href="/contact">Visit the studio</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Aurelia Estates · Dubai
      </div>
    </footer>
  );
}
