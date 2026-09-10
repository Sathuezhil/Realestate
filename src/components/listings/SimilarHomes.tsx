import { PropertyCard } from "@/components/listings/PropertyCard";
import { Reveal } from "@/components/motion/Reveal";
import { type Property } from "@/types";

export function SimilarHomes({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-12">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Similar homes</p>
        <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">You may also want to see</h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Same community or type, close in beds and budget.
        </p>
      </Reveal>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {properties.map((property, index) => (
          <Reveal key={property.id} delay={index * 70}>
            <PropertyCard property={property} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
