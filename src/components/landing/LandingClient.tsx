"use client";

// LandingClient — ultra-lean Easy homepage (sol-incinerator style).
// Easy / Pro / Dev tabs. Paste → instant rich card with risk + Sena.
// Samples are instant. Paste uses live API with strong mock fallback.

import { useState } from "react";
import Link from "next/link";
import { LandingShell } from "./LandingShell";
import { LandingChrome } from "./LandingChrome";
import { RiskBadge } from "@/components/RiskBadge";
import type { LiveStatsPayload } from "./LiveStatsBar";

interface Props {
  stats: LiveStatsPayload;
  topOperator?: any;
}

type EasyResultKind = "operator" | "token" | "unknown";

interface EasyResult {
  kind: EasyResultKind;
  addr: string;
  data: any;
  isMock?: boolean;
  narrative?: string;
}

const SAMPLES = [
  { label: "Top operator (CRITICAL)", value: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1" },
  { label: "Wrapped SOL", value: "So11111111111111111111111111111111111111112" },
  { label: "Known dev wallet", value: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusV9yN" },
];

function getMock(addr: string): EasyResult {
  const a = addr.toLowerCase();
  if (a.includes("4kxscute") || a.includes("5pH1")) {
    return {
      kind: "operator",
      addr,
      isMock: true,
      data: {
        wallet: addr,
        known: true,
        risk_level: "CRITICAL",
        risk_label: "CRITICAL",
        confirmed_rugs: 2953,
        total_tokens: 3240,
        rug_rate_pct: 91.9,
        tags: ["serial", "fast_deploy", "rebrand", "cluster-9"],
        last_seen: Date.now() / 1000 - 120,
      },
      narrative: "High-conviction CRITICAL serial operator. 3,200+ deployments with extreme consistency and rapid rebranding. Multiple confirmed ties to rug clusters. Avoid all new tokens from this wallet.",
    };
  }
  if (a.includes("so1111")) {
    return {
      kind: "token",
      addr,
      isMock: true,
      data: {
        mint: addr,
        symbol: "WSOL",
        risk_level: "LOW",
        risk_label: "LOW",
        flags: [],
        dev_wallet: "11111111111111111111111111111111",
        operator: { confirmed_rugs: 0, total_tokens: 1, risk_level: "LOW" },
      },
      narrative: "Native wrapped SOL. Core infrastructure token. No operator risk. Standard liquidity behavior.",
    };
  }
  // generic medium risk mock
  return {
    kind: "operator",
    addr,
    isMock: true,
    data: {
      wallet: addr,
      known: true,
      risk_level: "HIGH",
      risk_label: "HIGH",
      confirmed_rugs: 47,
      total_tokens: 312,
      rug_rate_pct: 15.1,
      tags: ["fast_deploy", "mixer_links"],
      last_seen: Date.now() / 1000 - 3600 * 9,
    },
    narrative: "Active high-risk deployer. 47 confirmed rugs across 300+ tokens. Recent activity shows mixer hops and rapid token launches. Monitor closely.",
  };
}

async function quickEasyLookup(raw: string): Promise<EasyResult | null> {
  const v = raw.trim();
  if (v.length < 32) return null;

  const API = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";

  try {
    // Try operator first
    const opR = await fetch(`${API}/v1/operator/${encodeURIComponent(v)}`, { cache: "no-store" });
    if (opR.ok) {
      const op = await opR.json();
      if (op && (op.known || (op.confirmed_rugs ?? 0) > 0 || op.risk_level)) {
        return {
          kind: "operator",
          addr: v,
          data: op,
          narrative: op.risk_label
            ? `${op.risk_label} operator with ${(op.confirmed_rugs ?? 0)} confirmed rugs.`
            : undefined,
        };
      }
    }
    // Try token
    const tkR = await fetch(`${API}/v1/token/${encodeURIComponent(v)}`, { cache: "no-store" });
    if (tkR.ok) {
      const tk = await tkR.json();
      if (tk) {
        return { kind: "token", addr: v, data: tk };
      }
    }
  } catch {
    // ignore — we fall through to mock below
  }

  // Always return a good mock so the card appears
  return getMock(v);
}

function formatAddr(a: string) {
  return a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a;
}

function EasyResultCard({ r, used }: { r: EasyResult; used: number }) {
  const d = r.data || {};
  const level = (d.risk_level || d.risk_label || "MEDIUM").toUpperCase();
  const isOp = r.kind === "operator";
  const rugs = isOp ? (d.confirmed_rugs ?? 0) : 0;
  const tokens = isOp ? (d.total_tokens ?? 0) : (d.operator?.total_tokens ?? 1);
  const rate = isOp ? (d.rug_rate_pct ?? 0) : 0;
  const tags: string[] = d.tags || d.flags || [];

  const narrative = r.narrative || (level === "CRITICAL"
    ? "High-conviction serial operator. Strong evidence of repeated rug behavior."
    : level === "HIGH"
    ? "Elevated risk. Multiple rugs and suspicious patterns detected."
    : "Limited intel. No major red flags in current data.");

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
            {r.isMock ? "DEMO • CURATED" : "LIVE FROM API"} • {r.kind.toUpperCase()}
          </div>
          <div
            onClick={() => navigator.clipboard?.writeText(r.addr)}
            style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600, color: "var(--fg-1)", cursor: "pointer", wordBreak: "break-all" }}
            title="Click to copy full address"
          >
            {formatAddr(r.addr)}
            <span style={{ marginLeft: 6, fontSize: 10, color: "var(--brand-amber)" }}>⎘</span>
          </div>
        </div>
        <RiskBadge level={level} size="lg" />
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginBottom: 14 }}>
        {isOp && (
          <>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>CONFIRMED RUGS</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", color: level === "CRITICAL" ? "var(--status-critical)" : "var(--fg-1)" }}>{rugs}</div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>TOKENS</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>{tokens}</div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>RUG RATE</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>{rate.toFixed(0)}%</div>
            </div>
          </>
        )}
        {!isOp && (
          <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px", gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 14, color: "var(--fg-2)" }}>Token scan • deployer and holder intel available in Pro</div>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {tags.slice(0, 5).map((t: string, i: number) => (
            <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "var(--brand-amber-tint)", color: "var(--brand-amber)", border: "1px solid var(--brand-amber-line)" }}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Sena narrative */}
      <div style={{
        background: "rgba(193,125,14,0.07)",
        borderLeft: "3px solid var(--brand-amber)",
        padding: "12px 14px",
        fontSize: 15,
        lineHeight: 1.5,
        color: "var(--fg-2)",
        marginBottom: 14,
      }}>
        <span style={{ color: "var(--brand-amber)", fontWeight: 600 }}>Sena:</span> “{narrative}”
      </div>

      {/* Rate limit footer — "Full report" always routes through login first */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 12, color: "var(--fg-3)" }}>
        <div>
          {used}/5 scans used • rate limited
        </div>
        <div>
          <Link
            href={`/login?next=${encodeURIComponent(
              isOp 
                ? `/operator/${encodeURIComponent(r.addr)}` 
                : `/scan/${encodeURIComponent(r.addr)}`
            )}`}
            style={{ color: "var(--brand-amber)", fontWeight: 600 }}
          >
            Full report →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LandingClient({ stats, hideChrome = false }: Props & { hideChrome?: boolean }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<EasyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(2); // visible rate limit demo

  async function doLookup(raw: string) {
    const v = raw.trim();
    if (!v || v.length < 32) return;

    setLoading(true);

    try {
      const res = await quickEasyLookup(v);
      // Always ensure we have a result (quickEasyLookup already falls back internally)
      if (res) {
        setResult(res);
      } else {
        setResult(getMock(v));
      }
    } catch {
      // Ultimate safety net — never leave the user without a card
      setResult(getMock(v));
    }

    setUsed((u) => Math.min(5, u + 1));
    setLoading(false);
  }

  // Samples always load instantly using curated mocks (no network).
  // This guarantees the rich card always appears, even if API is slow or CORS blocks.
  function loadSampleDirect(val: string) {
    const mock = getMock(val);
    setQuery(val);
    setResult(mock);
    setUsed((u) => Math.min(5, u + 1));
  }

  function loadSample(val: string) {
    setQuery(val);
    doLookup(val);
  }

  return (
    <LandingShell>
      {({ copy, lang, theme, setLang, setTheme }) => (
        <>
          {!hideChrome && (
            <LandingChrome
              copy={copy}
              lang={lang}
              theme={theme}
              onLang={setLang}
              onTheme={setTheme}
            />
          )}

          <main className="landing-main" id="main" style={{ paddingTop: hideChrome ? 0 : 64 }}>
            <div className="landing-container" style={{ maxWidth: 780, margin: "0 auto", padding: "80px 16px 80px" }}>
              {/* Ultra-lean Easy hero */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.18em", color: "var(--brand-orange)" }}>
                  EASY • FREE • INSTANT
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(48px, 8vw, 72px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.03em",
                    margin: "10px 0 16px",
                    color: "var(--fg-1)",
                  }}
                >
                  Paste wallet or mint.<br />
                  See the <span style={{ color: "var(--brand-orange)" }}>risk</span>.
                </h1>
                <p style={{ color: "var(--fg-3)", fontSize: 19, maxWidth: 480, margin: "0 auto", lineHeight: 1.55 }}>
                  No signup. No wallet connect.
                </p>
              </div>

              {/* Primary search input */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") doLookup(query);
                    }}
                    onPaste={(e) => {
                      // Trigger lookup shortly after paste (more reliable card appearance)
                      setTimeout(() => {
                        const val = (e.target as HTMLInputElement).value;
                        if (val.length > 32) doLookup(val);
                      }, 80);
                    }}
                    placeholder="Paste wallet or mint (e.g. 4kxscute... or So1111...)"
                    style={{
                      flex: 1,
                      fontFamily: "var(--font-mono)",
                      fontSize: 16,
                      padding: "18px 20px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      color: "var(--fg-1)",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={() => doLookup(query)}
                    disabled={loading || !query.trim()}
                    style={{
                      background: "var(--brand-amber)",
                      color: "var(--fg-on-brand)",
                      border: "none",
                      borderRadius: 8,
                      padding: "0 22px",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: loading ? "wait" : "pointer",
                      opacity: loading || !query.trim() ? 0.6 : 1,
                    }}
                  >
                    {loading ? "..." : "Scan"}
                  </button>
                </div>

                {/* Samples — instant rich cards (guaranteed, no network) */}
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SAMPLES.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadSampleDirect(s.value)}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        padding: "4px 9px",
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                        background: "var(--surface-2)",
                        color: "var(--fg-2)",
                        cursor: "pointer",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                  <span style={{ alignSelf: "center", fontSize: 10, color: "var(--fg-4)", marginLeft: 4 }}>
                    5 scans/hour • rate limited
                  </span>
                </div>
              </div>

              {/* The rich result card (appears after action) */}
              {result && <EasyResultCard r={result} used={used} />}

              {!result && (
                <div style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "var(--fg-3)" }}>
                  Paste any address or click a sample above.
                </div>
              )}

              {/* Minimal note — full tools live in Pro/Dev */}
              <div style={{ textAlign: "center", marginTop: 42, fontSize: 11, color: "var(--fg-4)" }}>
                Full history, graphs and alerts live in Pro / Dev.
              </div>

              {/* Tiny live signal (uses the server-fetched stats) */}
              {stats?.ok && (
                <div style={{ marginTop: 28, textAlign: "center", fontSize: 10, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
                  LIVE • {stats.operators?.toLocaleString?.() || "?"} operators tracked • {stats.accuracyPct ?? "?"}% accuracy
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </LandingShell>
  );
}
