"use client";

// Login page. Primary: Sign-In-With-Solana via wallet adapter.
// Secondary: email magic-link form (Phase 2.2, posts to /v1/auth/magic-link/request for now —
// will be wired to /v1/auth/email/request when that lands).
//
// Note: WalletModalProvider deep inside SolSentryWalletProvider uses
// useSearchParams, which trips Next 14 static prerender CSR-bailout.
// Wrap the whole tree in <Suspense> to satisfy that requirement.

import { Suspense, useState } from "react";
import { SolSentryWalletProvider } from "@/lib/wallet/SolSentryWalletProvider";
import { ConnectWalletButton } from "@/components/auth/ConnectWalletButton";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.solsentry.app";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/v1/auth/magic-link/request`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("Check your email — we'll be in touch.");
    } catch {
      setStatus("Could not submit. Try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="email-form">
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <button type="submit" disabled={busy}>
        {busy ? "Sending…" : "Continue with email"}
      </button>
      {status && <p className="status">{status}</p>}
      <style jsx>{`
        .email-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        label {
          font-size: 0.85rem;
          color: #a8a29e;
        }
        input {
          padding: 0.85rem 1rem;
          border-radius: 8px;
          border: 1px solid #44403c;
          background: #1c1917;
          color: #fafaf9;
          font-size: 1rem;
        }
        button {
          background: transparent;
          color: #fafaf9;
          border: 1px solid #44403c;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }
        button:hover {
          border-color: #d97706;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .status {
          color: #a8a29e;
          font-size: 0.85rem;
          margin: 0;
        }
      `}</style>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="login-shell">
          <div className="login-card">Loading…</div>
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  return (
    <SolSentryWalletProvider>
      <main className="login-shell">
        <div className="login-card">
          <h1>Sign in to SolSentry</h1>
          <p className="subtitle">
            Operator intelligence for Solana. Connect a wallet to authenticate
            with a single signed message — no password, no email required.
          </p>

          <section className="primary-block">
            <ConnectWalletButton />
          </section>

          <div className="divider">
            <span>or</span>
          </div>

          <section className="secondary-block">
            <EmailForm />
          </section>

          <footer className="legal">
            By signing in you agree to our terms of service. Your wallet
            signature is used only to prove ownership of the public key — no
            transaction is broadcast.
          </footer>
        </div>

        <style jsx>{`
          .login-shell {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 2rem;
            background: #100e0a;
            color: #fafaf9;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            background: #1c1917;
            border: 1px solid #292524;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 30px 80px -40px rgba(217, 119, 6, 0.15);
          }
          h1 {
            font-size: 1.5rem;
            margin: 0 0 0.5rem;
            font-weight: 600;
          }
          .subtitle {
            color: #a8a29e;
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 0 0 1.75rem;
          }
          .primary-block {
            margin-bottom: 1.5rem;
          }
          .divider {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 1.5rem 0;
            color: #57534e;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .divider::before,
          .divider::after {
            content: "";
            flex: 1;
            height: 1px;
            background: #292524;
          }
          .secondary-block {
            margin-bottom: 1.5rem;
          }
          .legal {
            font-size: 0.75rem;
            color: #57534e;
            line-height: 1.5;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #292524;
          }
        `}</style>
      </main>
    </SolSentryWalletProvider>
  );
}
