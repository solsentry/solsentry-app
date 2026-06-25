"use client";

// LandingClient — ultra-lean Easy homepage (sol-incinerator style).
// Easy / Pro / Dev tabs. Paste → instant rich card with risk + Sena.
// Paste uses live API. Unknown addresses stay neutral; no public mock fallback.

import { useState } from "react";
import Link from "next/link";
import { LandingShell } from "./LandingShell";
import { LandingChrome } from "./LandingChrome";
import type { LiveStatsPayload } from "./LiveStatsBar";
import type { Lang, LandingCopy } from "@/lib/i18n-landing";

interface Props {
  stats: LiveStatsPayload;
  topOperator?: any;
}

type EasyResultKind = "operator" | "token" | "contract" | "unknown";

interface EasyResult {
  kind: EasyResultKind;
  addr: string;
  data: any;
  narrative?: string;
}

// Sample chips. Labels resolve from the i18n dict (labelKey) so the homepage
// is fully bilingual; values stay verbatim.
const SAMPLES: { labelKey: keyof LandingCopy; value: string }[] = [
  { labelKey: "sampleOperator", value: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1" },
  { labelKey: "sampleToken", value: "So11111111111111111111111111111111111111112" },
  { labelKey: "sampleDevWallet", value: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusV9yN" },
];

function getUnknown(addr: string): EasyResult {
  // Narrative is built localized in the card (buildNarrative) — leave unset.
  return {
    kind: "unknown",
    addr,
    data: {
      known: false,
      risk_level: "UNKNOWN",
      tags: [],
    },
  };
}

async function quickEasyLookup(raw: string): Promise<EasyResult | null> {
  const v = raw.trim();
  if (v.length < 32) return null;

  const API = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";
  const get = async (path: string) => {
    const r = await fetch(`${API}${path}`, { cache: "no-store" });
    return r.ok ? r.json() : null;
  };

  // Mirrors the Telegram /scan routing: an address is base58 32-44 chars and
  // could be a wallet OR a mint, so we probe in order and keep the first hit.
  try {
    // 1. Operator (wallet). Tie-break toward operator when it has confirmed rugs.
    const op = await get(`/v1/operator/${encodeURIComponent(v)}`);
    if (op && (op.known || (op.confirmed_rugs ?? 0) > 0)) {
      return { kind: "operator", addr: v, data: op };
    }

    // 2. Token (tracked mint) — only when actually known to us.
    const tk = await get(`/v1/token/${encodeURIComponent(v)}`);
    if (tk && tk.known === true) {
      return { kind: "token", addr: v, data: tk };
    }

    // 3. Contract analysis — live RPC verdict (catalog + known-entity +
    //    Token-2022 scan) for ANY address. This is what turns an untracked
    //    mint/wallet from "unknown" into a real, auditable result.
    const ca = await get(`/v1/contract-analysis/${encodeURIComponent(v)}`);
    if (ca && !ca.error) {
      return { kind: "contract", addr: v, data: ca };
    }
  } catch {
    return getUnknown(v);
  }

  return getUnknown(v);
}

function formatAddr(a: string) {
  return a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a;
}

// Map a backend risk level / contract verdict to a display badge. Never
// surfaces the banned "LOW"/"SAFE" tier words as a headline (19_ANTI §2 /
// reaudit #7) — low-risk results render as a neutral "no flags" verdict.
// Tier words (CRITICAL/HIGH/MEDIUM/DANGEROUS/CAUTION) stay verbatim in both
// languages — they are canonical risk labels. Only the neutral "no flags"
// states localize through `copy`.
function displayVerdict(
  kind: EasyResultKind,
  d: any,
  copy: LandingCopy,
): { label: string; color: string } {
  const C = {
    danger: "var(--status-critical)",
    warn: "var(--status-warning)",
    amber: "var(--brand-amber)",
    ok: "var(--brand-teal)",
    neutral: "var(--fg-3)",
  };
  if (kind === "contract") {
    switch (String(d.verdict || "unknown").toLowerCase()) {
      case "dangerous":
        return { label: "DANGEROUS", color: C.danger };
      case "caution":
        return { label: "CAUTION", color: C.amber };
      case "safe":
        return { label: copy.verdictNoRiskFlags, color: C.ok };
      default:
        return { label: copy.verdictInconclusive, color: C.neutral };
    }
  }
  if (kind === "unknown") return { label: copy.verdictNotIndex, color: C.neutral };
  switch (String(d.risk_level || "UNKNOWN").toUpperCase()) {
    case "CRITICAL":
      return { label: "CRITICAL", color: C.danger };
    case "HIGH":
      return { label: "HIGH", color: C.warn };
    case "MEDIUM":
      return { label: "MEDIUM", color: C.amber };
    case "LOW":
    case "SAFE":
    case "CLEAN":
      return { label: copy.verdictNoMajorFlags, color: C.ok };
    default:
      return { label: copy.verdictNotFlagged, color: C.neutral };
  }
}

function buildNarrative(kind: EasyResultKind, d: any, lang: Lang): string {
  const pt = lang === "pt";
  if (kind === "operator") {
    const lbl = d.risk_label && d.risk_label !== "unknown" ? `${d.risk_label} ` : "";
    const rugs = d.confirmed_rugs ?? 0;
    const toks = d.total_tokens ?? "?";
    if (pt) {
      const rate =
        typeof d.rug_rate_pct === "number" ? ` — taxa de rug de ${d.rug_rate_pct.toFixed(1)}%` : "";
      return `Operador ${lbl}rastreado: ${rugs} rugs confirmados em ${toks} tokens${rate}.`;
    }
    const rate =
      typeof d.rug_rate_pct === "number" ? ` — ${d.rug_rate_pct.toFixed(1)}% rug rate` : "";
    return `Tracked ${lbl}operator: ${rugs} confirmed rugs across ${toks} tokens${rate}.`;
  }
  if (kind === "token") {
    const lvl = String(d.risk_level || "").toUpperCase();
    if (lvl === "CRITICAL" || lvl === "HIGH")
      return pt
        ? "Token rastreado sinalizado com risco elevado — auditável por mint em /v1/predictions."
        : "Tracked token flagged with elevated risk — auditable per-mint at /v1/predictions.";
    if (d.final_outcome === "confirmed_safe")
      return pt
        ? "Token rastreado, resolvido sem rug no registro. Não é garantia de segurança."
        : "Tracked token, resolved with no rug outcome on record. Not a safety guarantee.";
    return pt
      ? "Token rastreado — veredito ao vivo do store de predições, auditável por mint."
      : "Tracked token — live verdict from the prediction store, auditable per-mint.";
  }
  if (kind === "contract") {
    const what =
      d.kind === "wallet"
        ? pt
          ? "wallet"
          : "wallet"
        : d.kind === "program"
          ? pt
            ? "programa"
            : "program"
          : "mint";
    const named = d.known_label
      ? pt
        ? ` Reconhecido como ${d.known_label}.`
        : ` Recognized as ${d.known_label}.`
      : "";
    switch (String(d.verdict || "unknown").toLowerCase()) {
      case "dangerous":
        return pt
          ? `Análise ao vivo do ${what}: perigoso interagir.${named}`
          : `Live ${what} analysis: dangerous to interact with.${named}`;
      case "caution":
        return pt
          ? `Análise ao vivo do ${what}: prossiga com cautela.${named}`
          : `Live ${what} analysis: proceed with caution.${named}`;
      case "safe":
        return pt
          ? `Análise ao vivo do ${what}: nenhuma flag de risco encontrada.${named} Não é garantia de segurança — verifique liquidez e holders.`
          : `Live ${what} analysis: no risk flags found.${named} Not a safety guarantee — verify liquidity and holders.`;
      default:
        return pt
          ? `Análise ao vivo do ${what} ainda não retornou sinal claro.${named}`
          : `Live ${what} analysis returned no clear signal yet.${named}`;
    }
  }
  return pt
    ? "Este endereço não está na base rastreada. Isto não é um veredito de segurança."
    : "This address is not in the tracked database. This is not a safety verdict.";
}

function EasyResultCard({
  r,
  used,
  copy,
  lang,
}: {
  r: EasyResult;
  used: number;
  copy: LandingCopy;
  lang: Lang;
}) {
  const d = r.data || {};
  const isOp = r.kind === "operator";
  const isContract = r.kind === "contract";
  const verdict = displayVerdict(r.kind, d, copy);
  const rugs = isOp ? (d.confirmed_rugs ?? "—") : "—";
  const tokens = isOp ? (d.total_tokens ?? "—") : "—";
  const rate = isOp && typeof d.rug_rate_pct === "number" ? `${d.rug_rate_pct.toFixed(1)}%` : "—";
  // Surface only descriptive tags/flags; merge operator behavioural patterns;
  // drop "bundle" wording (→ bot-cluster).
  const rawTags: string[] = isOp ? [...(d.tags || []), ...(d.patterns || [])] : d.flags || [];
  const tags = Array.from(new Set(rawTags.map(String))).filter((t) => !/bundle/i.test(t));

  const narrative = r.narrative || buildNarrative(r.kind, d, lang);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
            }}
          >
            {copy.cardLiveFrom} • {r.kind.toUpperCase()}
          </div>
          <div
            onClick={() => navigator.clipboard?.writeText(r.addr)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--fg-1)",
              cursor: "pointer",
              wordBreak: "break-all",
            }}
            title="Click to copy full address"
          >
            {formatAddr(r.addr)}
            <span style={{ marginLeft: 6, fontSize: 10, color: "var(--brand-amber)" }}>⎘</span>
          </div>
        </div>
        <span
          style={{
            display: "inline-block",
            padding: "8px 18px",
            background: "var(--surface-2)",
            border: `1px solid ${verdict.color}`,
            borderRadius: 4,
            color: verdict.color,
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {verdict.label}
        </span>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {isOp && (
          <>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardConfirmedRugs}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color:
                    verdict.color === "var(--status-critical)"
                      ? "var(--status-critical)"
                      : "var(--fg-1)",
                }}
              >
                {rugs}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardTokens}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {tokens}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardRugRate}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {rate}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardRiskScore}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {typeof d.risk_score === "number" ? `${d.risk_score}/100` : "—"}
              </div>
            </div>
            {typeof d.pending === "number" && d.pending > 0 && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardPending}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {d.pending}
                </div>
              </div>
            )}
          </>
        )}
        {r.kind === "token" && (
          <>
            {d.symbol && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardSymbol}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {d.symbol}
                </div>
              </div>
            )}
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardRiskScore}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {typeof d.risk_score === "number" ? `${d.risk_score}/100` : "—"}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardOutcome}</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {d.final_outcome === "confirmed_scam"
                  ? copy.outcomeRug
                  : d.final_outcome === "confirmed_safe"
                    ? copy.outcomeNoRug
                    : copy.outcomePending}
              </div>
            </div>
            {d.operator && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardOperator}</div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    wordBreak: "break-all",
                  }}
                >
                  {formatAddr(String(d.operator))}
                </div>
              </div>
            )}
            {d.dev_wallet && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardDevWallet}</div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    wordBreak: "break-all",
                  }}
                >
                  {formatAddr(String(d.dev_wallet))}
                </div>
              </div>
            )}
          </>
        )}
        {isContract && (
          <>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardType}</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {String(d.kind || "unknown").toUpperCase()}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardRiskScore}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {typeof d.risk_score === "number" ? `${d.risk_score}/100` : "—"}
              </div>
            </div>
            {d.known_label && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardKnownAs}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {d.known_label}
                </div>
              </div>
            )}
          </>
        )}
        {r.kind === "unknown" && (
          <div
            style={{
              background: "var(--surface-2)",
              borderRadius: 6,
              padding: "8px 10px",
              gridColumn: "1 / -1",
            }}
          >
            <div style={{ fontSize: 14, color: "var(--fg-2)" }}>{copy.cardUnknownBody}</div>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {tags.slice(0, 5).map((t: string, i: number) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 999,
                background: "var(--brand-amber-tint)",
                color: "var(--brand-amber)",
                border: "1px solid var(--brand-amber-line)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Sena narrative */}
      <div
        style={{
          background: "rgba(193,125,14,0.07)",
          borderLeft: "3px solid var(--brand-amber)",
          padding: "12px 14px",
          fontSize: 15,
          lineHeight: 1.5,
          color: "var(--fg-2)",
          marginBottom: 14,
        }}
      >
        <span style={{ color: "var(--brand-amber)", fontWeight: 600 }}>Sena:</span> “{narrative}”
      </div>

      {/* Rate limit footer */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          fontSize: 12,
          color: "var(--fg-3)",
        }}
      >
        <div>
          {used}/5 {copy.cardScansUsed} • {copy.cardRateLimited}
        </div>
        <div>
          <Link
            href={`/scan?addr=${encodeURIComponent(r.addr)}`}
            style={{ color: "var(--brand-amber)", fontWeight: 600 }}
          >
            {copy.cardFullReport}
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
  const [used, setUsed] = useState(0);

  async function doLookup(raw: string) {
    const v = raw.trim();
    if (!v || v.length < 32) return;

    setLoading(true);

    try {
      const res = await quickEasyLookup(v);
      setResult(res ?? getUnknown(v));
    } catch {
      setResult(getUnknown(v));
    }

    setUsed((u) => Math.min(5, u + 1));
    setLoading(false);
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
            <div
              className="landing-container"
              style={{ maxWidth: 780, margin: "0 auto", padding: "80px 16px 80px" }}
            >
              {/* Ultra-lean Easy hero */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    color: "var(--brand-orange)",
                  }}
                >
                  {copy.easyEyebrow}
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
                  {copy.easyTitleA}
                  <br />
                  {copy.easyTitleB}
                  <span style={{ color: "var(--brand-orange)" }}>{copy.easyTitleEm}</span>.
                </h1>
                <p
                  style={{
                    color: "var(--fg-3)",
                    fontSize: 19,
                    maxWidth: 480,
                    margin: "0 auto",
                    lineHeight: 1.55,
                  }}
                >
                  {copy.easySub}
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
                    placeholder={copy.easyPlaceholder}
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
                    {loading ? "..." : copy.easyScanCta}
                  </button>
                </div>

                {/* Samples use the same live lookup path as pasted addresses. */}
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SAMPLES.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadSample(s.value)}
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
                      {copy[s.labelKey]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Closed-beta note + follow links — centered, directly below the
                  scanner bar (relocated here from the old /changelog banner). */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 24,
                  fontSize: 12,
                  color: "var(--fg-3)",
                }}
              >
                <span style={{ color: "var(--brand-amber)", fontWeight: 600 }}>
                  {copy.betaNote}
                </span>
                <span style={{ color: "var(--fg-4)" }}>·</span>
                <span>{copy.betaFollow}:</span>
                <a
                  href="https://x.com/solsentryai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--brand-amber)", fontWeight: 600, textDecoration: "none" }}
                >
                  @solsentryai
                </a>
                <a
                  href="https://x.com/crashdiniz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--brand-amber)", fontWeight: 600, textDecoration: "none" }}
                >
                  @crashdiniz
                </a>
              </div>

              {/* The rich result card (appears after action) */}
              {result && <EasyResultCard r={result} used={used} copy={copy} lang={lang} />}

              {!result && (
                <div
                  style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "var(--fg-3)" }}
                >
                  {copy.easyEmptyHint}
                </div>
              )}

              {/* Minimal note — full tools live in Pro/Dev */}
              <div
                style={{ textAlign: "center", marginTop: 42, fontSize: 11, color: "var(--fg-4)" }}
              >
                {copy.easyProDev}
              </div>

              {/* Tiny live signal (uses the server-fetched stats) */}
              {stats?.ok && (
                <div
                  style={{
                    marginTop: 28,
                    textAlign: "center",
                    fontSize: 10,
                    color: "var(--fg-4)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  LIVE • {stats.totalPredictions?.toLocaleString?.() || "?"}{" "}
                  {lang === "pt" ? "predições" : "predictions"} • {stats.accuracyPct ?? "?"}%{" "}
                  {lang === "pt" ? "acurácia" : "accuracy"} • {stats.criticalPrecisionPct ?? "?"}%
                  CRITICAL precision — auditable per-mint
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </LandingShell>
  );
}
