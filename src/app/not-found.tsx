export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-gold-hover">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">This listing has moved on</h1>
      <p className="mt-3 text-ink-soft">The page you are looking for is not available.</p>
      <a href="/listings" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm text-ivory">
        Back to listings
      </a>
    </div>
  );
}
