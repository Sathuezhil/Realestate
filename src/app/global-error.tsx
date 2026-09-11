"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f6f1e8", color: "#1c1916", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <img src="/logo.png" alt="Aurelia Estates" style={{ height: 128, width: "auto", margin: "0 auto" }} />
          <h1 style={{ fontSize: 36, margin: "12px 0" }}>This page could not load</h1>
          <p style={{ color: "#6b655e" }}>A server error occurred. Reload to try again.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 24,
              border: 0,
              borderRadius: 999,
              background: "#1c1916",
              color: "#f6f1e8",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
