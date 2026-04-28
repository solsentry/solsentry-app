"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Skull,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Coins,
  TrendingUp,
} from "lucide-react";

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
  {
    label: "Top operator (CRITICAL)",
    wallet: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
  },
  {
    label: "Random unknown",
    wallet: "So11111111111111111111111111111111111111112",
  },
];

const RISK_ICON: Record<string, { icon: typeof Skull; color: string }> = {
  CRITICAL: { icon: Skull, color: "var(--status-critical)" },
  HIGH: { icon: ShieldAlert, color: "var(--status-warning)" },
  MEDIUM: { icon: AlertTriangle, color: "var(--brand-orange)" },
  LOW: { icon: ShieldCheck, color: "var(--brand-teal)" },
  CLEAN: { icon: ShieldCheck, color: "var(--brand-teal)" },
  UNKNOWN: { icon: Activity, color: "var(--fg-3)" },
};

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
  const rc = RISK_ICON[level] || RISK_ICON.UNKNOWN;
  const Icon = rc.icon;

  return (
    <div style={{ marginTop: 36, maxWidth: 760 }}>
      <form onSubmit={submit}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 440px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--fg-3)",
                pointerEvents: "none",
              }}
            />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste any Solana wallet — live scan in 50ms"
              spellCheck={false}
              autoComplete="off"
              style={{
                width: "100%",
                background: "var(--surface)",
                border: "1px solid var(--brand-orange-line)",
                borderRadius: "var(--radius-sm)",
                padding: "14px 18px 14px 42px",
                color: "var(--fg-1)",
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="spin" />
                <span>scanning…</span>
              </>
            ) : (
              <>
                <Search size={14} />
                <span>Scan</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--fg-3)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
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

      <AnimatePresence mode="wait">
        {err && (
          <motion.div
            key="err"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
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
          </motion.div>
        )}

        {data && (
          <motion.div
            key={data.wallet}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              marginTop: 20,
              background: "var(--surface)",
              border: `1px solid ${data.known ? rc.color : "var(--brand-teal)"}`,
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
            }}
          >
            {/* Risk banner */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                background: data.known
                  ? `${rc.color === "var(--status-critical)" ? "rgba(255,68,68,0.08)" : rc.color === "var(--status-warning)" ? "rgba(255,176,32,0.08)" : "rgba(255,107,0,0.06)"}`
                  : "rgba(0,201,167,0.06)",
                borderBottom: `1px solid ${data.known ? rc.color : "var(--brand-teal)"}`,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    background: data.known
                      ? rc.color === "var(--status-critical)"
                        ? "rgba(255,68,68,0.15)"
                        : "rgba(255,107,0,0.15)"
                      : "rgba(0,201,167,0.15)",
                    border: `1px solid ${data.known ? rc.color : "var(--brand-teal)"}`,
                  }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: data.known ? rc.color : "var(--brand-teal)",
                    }}
                  />
                </div>
                <div>
                  <div
                    className="label-tag"
                    style={{
                      color: data.known ? rc.color : "var(--brand-teal)",
                      marginBottom: 3,
                    }}
                  >
                    Risk level
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 20,
                      letterSpacing: "-0.01em",
                      color: data.known ? rc.color : "var(--brand-teal)",
                    }}
                  >
                    {data.known ? level : "NOT FLAGGED"}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="label-tag" style={{ marginBottom: 3 }}>
                  Operator
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--fg-1)",
                  }}
                >
                  {data.wallet.slice(0, 8)}…{data.wallet.slice(-6)}
                </div>
              </div>
            </div>

            {/* Metrics */}
            {data.known ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <MetricCell
                  icon={
                    <Skull
                      size={14}
                      style={{ color: "var(--status-critical)" }}
                    />
                  }
                  label="Confirmed rugs"
                  value={data.confirmed_rugs ?? 0}
                />
                <MetricCell
                  icon={
                    <Coins size={14} style={{ color: "var(--brand-orange)" }} />
                  }
                  label="Total tokens"
                  value={data.total_tokens ?? 0}
                />
                <MetricCell
                  icon={
                    <TrendingUp
                      size={14}
                      style={{ color: "var(--status-warning)" }}
                    />
                  }
                  label="Rug rate"
                  value={
                    data.rug_rate_pct != null
                      ? `${data.rug_rate_pct.toFixed(1)}%`
                      : "—"
                  }
                />
              </div>
            ) : (
              <div
                style={{
                  padding: "18px 20px",
                  color: "var(--fg-2)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                Not in the operator database. Either this wallet has not
                deployed a token during the monitored window, or it is a safe
                protocol address.
              </div>
            )}

            {/* Tags + actions */}
            {data.known && (
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid var(--border-soft)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {data.risk_label && (
                    <span
                      className="hover-chip"
                      style={{ fontSize: 10, padding: "3px 10px" }}
                    >
                      {data.risk_label}
                    </span>
                  )}
                  {(data.tags || []).slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="hover-chip"
                      style={{
                        fontSize: 10,
                        padding: "3px 10px",
                        color: "var(--brand-teal)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <Link
                    href={`/operator/${data.wallet}`}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 11,
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
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--brand-teal)",
                      textDecoration: "none",
                    }}
                  >
                    Trace drain →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        padding: "18px 16px",
        borderRight: "1px solid var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        textAlign: "center",
      }}
    >
      {icon}
      <span className="label-tag" style={{ fontSize: 9 }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fontSize: 18,
          color: "var(--fg-1)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}
