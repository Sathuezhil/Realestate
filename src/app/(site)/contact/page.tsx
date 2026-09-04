import { EnquiryForm } from "@/components/property/EnquiryForm";
import { Mail, MapPin, Phone } from "lucide-react";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Contact</p>
      <h1 className="mt-2 font-serif text-5xl text-ink">
        Talk to the <span className="gold-shimmer">studio</span>
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Viewing requests, off-market homes, or a question about a listing — send a note and we will
        reply within a day.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6 md:p-8">
          <EnquiryForm source="contact" />
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-ink p-8 text-ivory">
            <p className="font-serif text-3xl">Aurelia studio</p>
            <p className="mt-4 inline-flex items-start gap-3 text-sm text-ivory/80">
              <MapPin className="mt-0.5 h-4 w-4" />
              Office 1204, Boulevard Plaza, Downtown Dubai
            </p>
            <p className="mt-3 inline-flex items-center gap-3 text-sm text-ivory/80">
              <Phone className="h-4 w-4" />
              +971 4 450 1200
            </p>
            <p className="mt-3 inline-flex items-center gap-3 text-sm text-ivory/80">
              <Mail className="h-4 w-4" />
              hello@aurelia.homes
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              title="Studio map"
              className="h-72 w-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=55.26%2C25.19%2C55.29%2C25.21&layer=mapnik&marker=25.1972%2C55.2744"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
