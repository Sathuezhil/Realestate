import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { STUDIO, whatsappHref } from "@/lib/contact";
import { Phone } from "lucide-react";

export function TopBanner() {
  return (
    <div className="relative z-50 border-b border-line bg-ivory-dark px-3 py-2 text-[11px] tracking-wide text-ink sm:px-4 sm:text-xs">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-2 sm:gap-y-0">
        <span className="inline-flex max-w-full items-center gap-2">
          <span className="banner-gold text-gold">دبي</span>
          <span className="text-ink/25">·</span>
          <span className="sm:hidden">Private viewings · within 24 hours</span>
          <span className="hidden sm:inline">
            Private viewings across Dubai — typically arranged within 24 hours
          </span>
        </span>
        <span className="hidden text-ink/25 sm:inline">·</span>
        <a href={whatsappHref()} className="inline-flex items-center gap-1 text-gold hover:underline">
          <WhatsAppIcon className="h-3 w-3" />
          WhatsApp {STUDIO.phoneDisplay}
        </a>
      </div>
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
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <div className="mobile-lead-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-ivory/95 px-3 pt-3 backdrop-blur md:hidden">
        <a
          href={STUDIO.phoneHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <a
          href={whatsappHref()}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-medium text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
