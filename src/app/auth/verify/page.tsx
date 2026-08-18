"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.solsentry.app";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Verifying your link…");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing token in URL.");
      return;
    }

    fetch(`${API_BASE}/v1/auth/magic-link/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        if (r.ok) {
          setStatus("ok");
          router.replace("/dashboard");
        } else {
          setStatus("error");
          setMessage("Link expired or invalid.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Couldn't reach the sign-in server. Try again.");
      });
  }, [params, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--fg-1)", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 32, textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, marginBottom: 12, color: "var(--fg-1)" }}>Sign in to SolSentry</h1>
        <p style={{ color: "var(--fg-3)", marginBottom: 24, fontSize: 14 }}>{message}</p>
        {status === "error" && (
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "var(--brand-amber)",
              color: "var(--fg-on-brand)",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Request new link
          </button>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--fg-3)" }}>
          Loading…
        </div>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
