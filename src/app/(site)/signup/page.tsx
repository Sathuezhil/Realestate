"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignupForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/favorites";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const message = await register(
      String(form.get("name")),
      String(form.get("email")),
      String(form.get("password")),
    );
    setPending(false);
    if (message) {
      setError(message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="grid min-h-[80vh] md:grid-cols-2">
      <div
        className="hidden bg-cover bg-center md:block"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80)",
        }}
      />
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Join Aurelia</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Create an account</h1>
        <p className="mt-3 text-sm text-muted">
          Already have one?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-ink underline">
            Sign in
          </Link>
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            name="name"
            required
            placeholder="Full name"
            className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-gold"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-gold"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-gold"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-ink py-3 text-sm text-ivory disabled:opacity-60"
          >
            {pending ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
