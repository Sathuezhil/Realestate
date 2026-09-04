import { STUDIO, whatsappHref } from "@/lib/contact";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl">Aurelia</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-ivory/70">
            Private apartments, villas, and offices across Dubai. We arrange the viewing, the files,
            and the conversation with the other side.
          </p>
          <a
            href={whatsappHref()}
            className="mt-5 inline-flex rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
          >
            WhatsApp the studio
          </a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
            <Link href="/listings">All listings</Link>
            <Link href="/listings?type=villa">Villas</Link>
            <Link href="/listings?type=apartment">Apartments</Link>
            <Link href="/listings?type=office">Offices</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Speak to us</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
            <a href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a>
            <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
            <p>Boulevard Plaza, Downtown Dubai</p>
            <Link href="/contact">Visit the studio</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} Aurelia Estates · Dubai
      </div>
    </footer>
  );
}
