import { STUDIO, whatsappHref } from "@/lib/contact";
import { MessageCircle, Phone } from "lucide-react";

export function TopBanner() {
  return (
    <div className="relative z-50 overflow-hidden border-b border-line bg-ivory-dark px-4 py-2 text-center text-[11px] tracking-wide text-ink sm:text-xs">
      <span className="banner-gold text-gold">دبي</span>
      <span className="mx-2 text-ink/25">·</span>
      Private viewings across Dubai — typically arranged within 24 hours
      <span className="mx-2 hidden text-ink/25 sm:inline">·</span>
      <a href={whatsappHref()} className="inline-flex items-center gap-1 text-gold hover:underline">
        WhatsApp {STUDIO.phoneDisplay}
      </a>
    </div>
  );
}

export function FloatingLeadBar() {
  return (
    <>
      <a
        href={whatsappHref()}
        className="pulse-ring fixed bottom-8 right-8 z-50 hidden h-14 w-14 items-center justify-center overflow-visible rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_rgba(37,211,102,0.45)] transition hover:scale-105 md:flex"
        aria-label="WhatsApp a specialist"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-ivory/95 p-3 backdrop-blur md:hidden">
        <a
          href={STUDIO.phoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-medium"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <a
          href={whatsappHref()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-medium text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
