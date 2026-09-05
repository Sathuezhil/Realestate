"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-gold-hover">Something went wrong</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">This page could not finish loading</h1>
      <p className="mt-3 text-ink-soft">Try again, or go back to the listings.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-ink px-5 py-2.5 text-sm text-ivory"
        >
          Try again
        </button>
        <a href="/listings" className="rounded-full border border-line px-5 py-2.5 text-sm text-ink">
          Back to listings
        </a>
      </div>
    </div>
  );
}
