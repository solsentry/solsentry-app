"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

interface OperatorData {
  wallet: string;
  known: boolean;
  risk_level?: string;
  risk_score?: number;
  risk_label?: string;
  confirmed_rugs?: number;
  total_tokens?: number;
  rug_rate_pct?: number;
  tags?: string[];
}

const LEVEL_COLOR: Record<string, string> = {
  CRITICAL: "var(--status-critical)",
  HIGH: "var(--status-warning)",
  MEDIUM: "var(--brand-orange)",
  LOW: "var(--brand-teal)",
  CLEAN: "var(--brand-teal)",
  UNKNOWN: "var(--fg-3)",
};

export function MeProfile() {
  const { publicKey, connected } = useWallet();
  const [data, setData] = useState<OperatorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) {
      setData(null);
      setError(null);
      return;
    }

    const wallet = publicKey.toBase58();
    setLoading(true);
    setError(null);

    fetch(`https://api.solsentry.app/v1/operator/${wallet}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message ?? "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [connected, publicKey]);

  if (!connected || !publicKey) {
    return (
      <div className="me-card">
        <div className="me-icon">🔌</div>
        <h2>Connect a wallet</h2>
        <p>
          Use Phantom or Solflare to connect. SolSentry will check if your wallet
          appears in the operator database, and show your deployment history if so.
        </p>
        <p className="me-disclaimer">
          Read-only. SolSentry never asks you to sign anything. Your wallet is used
          only to look up the public address against our public database.
        </p>
        <div style={{ marginTop: 24 }}>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  const wallet = publicKey.toBase58();

  if (loading) {
    return (
      <div className="me-card">
        <div className="me-icon">⏳</div>
        <h2>Checking your profile…</h2>
        <p className="mono" style={{ color: "var(--brand-orange)", fontSize: 13 }}>
          {wallet}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="me-card">
        <div className="me-icon">⚠️</div>
        <h2>Could not load profile</h2>
        <p>{error}</p>
        <p className="mono" style={{ color: "var(--brand-orange)", fontSize: 13 }}>{wallet}</p>
      </div>
    );
  }

  if (!data) return null;

  const level = (data.risk_level || "UNKNOWN").toUpperCase();
  const color = LEVEL_COLOR[level] || LEVEL_COLOR.UNKNOWN;

  if (!data.known) {
    return (
      <div className="me-card me-card-clean">
        <div className="me-icon">✓</div>
        <h2 style={{ color: "var(--brand-teal)" }}>Not in operator database</h2>
        <p>
          This wallet has not been observed deploying tokens during SolSentry&rsquo;s
          monitored period. You will <strong>not</strong> trigger an automatic
          operator-history flag if you launch a token from it.
        </p>
        <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 12 }}>
          Note: per-token signals (mint authority, holder concentration, LP lock,
          bundle activity) are still evaluated independently. See{" "}
          <Link href="/docs">/docs</Link> for the full risk methodology.
        </p>
        <p className="mono" style={{ color: "var(--brand-orange)", fontSize: 13, marginTop: 16 }}>
          {wallet}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="me-card" style={{ borderColor: color, boxShadow: level === "CRITICAL" ? "var(--shadow-glow-critical)" : undefined }}>
        <div className="me-icon" style={{ color }}>
          {level === "CRITICAL" ? "🚨" : level === "HIGH" ? "⚠️" : "ℹ️"}
        </div>
        <h2 style={{ color }}>You are flagged: {level}</h2>
        <p>
          This wallet appears in SolSentry&rsquo;s operator database with{" "}
          <strong>{data.confirmed_rugs ?? 0}</strong> confirmed rug
          {(data.confirmed_rugs ?? 0) === 1 ? "" : "s"} across{" "}
          <strong>{data.total_tokens ?? 0}</strong> tracked deployment
          {(data.total_tokens ?? 0) === 1 ? "" : "s"}.
        </p>
        {data.risk_label && (
          <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 12 }}>
            Label: <code style={{ color: "var(--brand-orange)" }}>{data.risk_label}</code>
          </p>
        )}
        {data.tags && data.tags.length > 0 && (
          <div className="risk-tags" style={{ padding: "16px 0 0" }}>
            {data.tags.map((t) => (
              <span key={t} className="risk-tag">{t}</span>
            ))}
          </div>
        )}
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Link href={`/operator/${wallet}`} className="me-action">
            Full profile →
          </Link>
          <Link href={`/operator/${wallet}/timeline`} className="me-action">
            Timeline →
          </Link>
        </div>
      </div>

      {(data.confirmed_rugs ?? 0) === 0 && data.known && (
        <div className="me-card-secondary" style={{ marginTop: 16 }}>
          <p>
            <strong style={{ color: "var(--brand-teal)" }}>No rugs on record.</strong>{" "}
            Your wallet is tracked but has no confirmed rug deployments. Pre-launch
            checklist: see <Link href="/docs">/docs</Link>.
          </p>
        </div>
      )}

      {(data.confirmed_rugs ?? 0) > 0 && (
        <div className="me-card-secondary" style={{ marginTop: 16 }}>
          <p style={{ color: "var(--fg-2)" }}>
            <strong>If this is a false positive:</strong> Reach out at{" "}
            <a href="mailto:hello@solsentry.app">hello@solsentry.app</a> with proof
            of identity and context. We review false positives manually.
          </p>
        </div>
      )}
    </>
  );
}
