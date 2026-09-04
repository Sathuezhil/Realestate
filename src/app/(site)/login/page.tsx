"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const { login } = useAuth();
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
    const result = await login(String(form.get("email")), String(form.get("password")));
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    const requested = searchParams.get("next");
    const dest =
      requested && requested !== "/favorites"
        ? requested
        : result.user?.role === "admin"
          ? "/admin"
          : "/favorites";
    router.push(dest);
    router.refresh();
  }

  return (
    <div className="grid min-h-[80vh] md:grid-cols-2">
      <div
        className="hidden bg-cover bg-center md:block"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80)",
        }}
      />
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Welcome back</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Sign in</h1>
        <p className="mt-3 text-sm text-muted">
          New here?{" "}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-ink underline">
            Create an account
          </Link>
        </p>
        {next.startsWith("/admin") ? (
          <p className="mt-4 rounded-xl bg-ivory-dark px-3 py-3 text-xs leading-5 text-ink-soft">
            Studio: <span className="text-ink">admin@aurelia.homes</span> / AureliaAdmin1!
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
            placeholder="Password"
            className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-gold"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-ink py-3 text-sm text-ivory disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
