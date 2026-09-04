"use client";

import { STUDIO } from "@/lib/contact";
import { useState } from "react";

export function SettingsForm({ name, email }: { name: string; email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setPending(true);
    const response = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Could not update password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setMessage("Studio password updated.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
        <h2 className="font-serif text-2xl">Desk</h2>
        <p className="mt-1 text-sm text-muted">Shown on the public site and WhatsApp buttons.</p>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Studio</dt>
            <dd className="mt-1 text-ink">{STUDIO.name}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Signed in as</dt>
            <dd className="mt-1 text-ink">
              {name}
              <span className="mt-0.5 block text-xs text-muted">{email}</span>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Phone</dt>
            <dd className="mt-1 text-ink">{STUDIO.phoneDisplay}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">WhatsApp</dt>
            <dd className="mt-1 text-ink">+{STUDIO.whatsapp}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Email</dt>
            <dd className="mt-1 text-ink">{STUDIO.email}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
        <h2 className="font-serif text-2xl">Password</h2>
        <p className="mt-1 text-sm text-muted">Change the password for this studio login.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-gold"
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-gold"
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-gold"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {message ? <p className="text-sm text-[#146c3a]">{message}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-ivory disabled:opacity-60"
          >
            {pending ? "Saving..." : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}
