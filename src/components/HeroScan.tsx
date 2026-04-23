"use client";

import { useState } from "react";
import Link from "next/link";

interface OperatorResp {
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

const SAMPLES = [
  { label: "Top operator (CRITICAL)", wallet: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1" },
  { label: "Random unknown", wallet: "So11111111111111111111111111111111111111112" },
];

export function HeroScan() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<OperatorResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async (w: string) => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const res = await fetch(`https://api.solsentry.app/v1/operator/${w}`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = input.trim();
    if (w.length < 32) {
      setErr("Wallet too short — paste a full Solana address");
      return;
    }
    void run(w);
  };

  const level = (data?.risk_level || "UNKNOWN").toUpperCase();

  return (
    <div style={{ marginTop: 36, maxWidth: 760 }}>
      <form onSubmit={submit}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste any Solana wallet — get operator intel in 50ms"
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: "1 1 440px",
              background: "var(--surface)",
              border: "1px solid var(--brand-orange-line)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 18px",
              color: "var(--fg-1)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "scanning…" : "Scan →"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginRight: 4 }}>
          Try
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.wallet}
            type="button"
            onClick={() => {
              setInput(s.wallet);
              void run(s.wallet);
            }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg-2)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {err && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            border: "1px solid var(--status-critical)",
            background: "rgba(255,68,68,0.08)",
            borderRadius: "var(--radius-sm)",
            color: "var(--status-critical)",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
          }}
        >
          {err}
        </div>
      )}

      {data && (
        <div
          style={{
            marginTop: 20,
            background: "var(--surface)",
            border:
              level === "CRITICAL"
                ? "1px solid var(--status-critical)"
                : level === "HIGH"
                ? "1px solid var(--status-warning)"
                : "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: 20,
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.75,
            color: "var(--fg-1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "var(--brand-orange)", fontSize: 12, wordBreak: "break-all" }}>
              {data.wallet}
            </span>
            {data.known ? (
              <span className={`risk-badge ${level}`}>{level}</span>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--brand-teal)",
                  fontSize: 11,
                  padding: "2px 10px",
                  border: "1px solid var(--brand-teal)",
                  borderRadius: 4,
                  textTransform: "uppercase",
                }}
              >
                not flagged
              </span>
            )}
          </div>

          {data.known ? (
            <>
              <div style={{ color: "var(--fg-2)" }}>
                <span style={{ color: "var(--fg-3)" }}>confirmed_rugs</span>:{" "}
                <strong style={{ color: "var(--status-critical)" }}>{data.confirmed_rugs ?? 0}</strong> ·{" "}
                <span style={{ color: "var(--fg-3)" }}>total_tokens</span>:{" "}
                <strong style={{ color: "var(--fg-1)" }}>{data.total_tokens ?? 0}</strong> ·{" "}
                <span style={{ color: "var(--fg-3)" }}>rug_rate</span>:{" "}
                <strong style={{ color: "var(--brand-orange)" }}>{data.rug_rate_pct?.toFixed(1) ?? "—"}%</strong>
              </div>
              {data.risk_label && (
                <div style={{ marginTop: 6, color: "var(--fg-2)" }}>
                  <span style={{ color: "var(--fg-3)" }}>risk_label</span>:{" "}
                  <span style={{ color: "var(--brand-orange)" }}>{data.risk_label}</span>
                </div>
              )}
              {data.tags && data.tags.length > 0 && (
                <div style={{ marginTop: 6, color: "var(--fg-2)" }}>
                  <span style={{ color: "var(--fg-3)" }}>tags</span>:{" "}
                  {data.tags.map((t, i) => (
                    <span key={t}>
                      <span style={{ color: "var(--brand-teal)" }}>{t}</span>
                      {i < data.tags!.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={`/operator/${data.wallet}`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--brand-orange)",
                    textDecoration: "none",
                  }}
                >
                  Full profile →
                </Link>
                <Link
                  href={`/drain/${data.wallet}`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--brand-teal)",
                    textDecoration: "none",
                  }}
                >
                  Trace drain →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ color: "var(--fg-2)" }}>
              Not in the operator database. Either this wallet has not deployed a token during the monitored
              window, or it is a safe protocol address (e.g. wrapped SOL).
            </div>
          )}
        </div>
      )}
    </div>
  );
}
