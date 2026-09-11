import { MortgageCalculator } from "@/components/tools/MortgageCalculator";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "Mortgage calculator" };

export default async function MortgagePage({
  searchParams,
}: {
  searchParams: Promise<{ price?: string }>;
}) {
  const { price } = await searchParams;
  const parsed = Number(price);
  const defaultPrice = Number.isFinite(parsed) && parsed > 0 ? parsed : 5_000_000;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Finance</p>
      <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl md:text-5xl">Monthly payment</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Price, down payment, rate, and term — an indicative Dubai mortgage. Banks set the final number.
      </p>
      <div className="mt-10 rounded-2xl border border-line bg-white p-6 md:p-8">
        <MortgageCalculator defaultPrice={defaultPrice} variant="page" />
      </div>
    </div>
  );
}
