"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { DeepScanView } from "./DeepScanView";
import type { Lang, LandingCopy } from "@/lib/i18n-landing";
import type { ScanResult, ScanKind } from "@/lib/scan-resolver";

function formatAddr(a: string) {
  return a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a;
}

function displayVerdict(
  kind: ScanKind,
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

function buildNarrative(kind: ScanKind, d: any, lang: Lang): string {
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

export function ScanResultCard({
  r,
  used,
  copy,
  lang,
}: {
  r: ScanResult;
  used: number;
  copy: LandingCopy;
  lang: Lang;
}) {
  const d = r.data || {};
  const [showDeepScan, setShowDeepScan] = useState(false);
  const [marketFlags, setMarketFlags] = useState<string[]>([]);
  
  const isOp = r.kind === "operator";
  const isContract = r.kind === "contract";
  let verdict = displayVerdict(r.kind, d, copy);
  const pt = lang === "pt";
  const rugs = isOp ? (d.confirmed_rugs ?? "—") : "—";
  const tokens = isOp ? (d.total_tokens ?? "—") : "—";
  const rate = isOp && typeof d.rug_rate_pct === "number" ? `${d.rug_rate_pct.toFixed(1)}%` : "—";
  
  // Extract symbol for raw contract analysis (if present in extensions)
  let contractSymbol = null;
  if (isContract && d.kind === "mint") {
    const tm = d.extensions?.extensions?.find((e: any) => e.extension_name === 'tokenMetadata');
    if (tm?.detail?.symbol) contractSymbol = tm.detail.symbol;
    else if (d.known_label) contractSymbol = d.known_label;
  }
  
  const rawTags: string[] = isOp ? [...(d.tags || []), ...(d.patterns || [])] : d.flags || [];
  let dynamicTags = [...rawTags, ...marketFlags];
  const tags = Array.from(new Set(dynamicTags.map(String))).filter((t) => !/bundle/i.test(t));
  
  if (tags.length > 0 && verdict.label === copy.verdictNoMajorFlags) {
    verdict = { label: pt ? "ATENÇÃO (MERCADO)" : "MARKET CAUTION", color: "var(--brand-amber)" };
  }

  let narrative = r.narrative || buildNarrative(r.kind, d, lang);
  
  const hasLowLiq = tags.includes("LOW_LIQUIDITY");
  const hasConcentration = tags.some((t) => t.startsWith("CONCENTRATION"));
  const justLaunched = tags.includes("JUST_LAUNCHED");
  
  if (hasLowLiq || hasConcentration || justLaunched) {
    const marketNotes = pt 
      ? `Atenção: ${hasLowLiq ? "Baixa liquidez. " : ""}${hasConcentration ? "Alta concentração no Top 1. " : ""}${justLaunched ? "Recém-lançado (<1h)." : ""}` 
      : `Caution: ${hasLowLiq ? "Low liquidity. " : ""}${hasConcentration ? "High Top 1 concentration. " : ""}${justLaunched ? "Just launched (<1h)." : ""}`;
    narrative = `${narrative} ${marketNotes}`.trim();
  }

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
            {d.launch_platform && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{pt ? "PLATAFORMA" : "PLATFORM"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
                  {d.launch_platform.replace("_", ".")}
                </div>
              </div>
            )}
            {typeof d.has_mint_authority === "boolean" && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{pt ? "MINT AUTH" : "MINT AUTH"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: d.has_mint_authority ? "var(--status-warning)" : "var(--brand-teal)" }}>
                  {d.has_mint_authority ? (pt ? "SIM" : "YES") : (pt ? "NÃO" : "NO")}
                </div>
              </div>
            )}
            {typeof d.is_bundle === "boolean" && d.is_bundle && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{pt ? "LANÇAMENTO" : "LAUNCH"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--status-warning)" }}>
                  BOT CLUSTER
                </div>
              </div>
            )}
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardOperator}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  wordBreak: "break-all",
                  color: d.operator ? "inherit" : "var(--fg-3)"
                }}
              >
                {d.operator ? formatAddr(String(d.operator)) : (pt ? "NÃO RASTREADO" : "UNTRACKED")}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardDevWallet}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  wordBreak: "break-all",
                  color: d.dev_wallet ? "inherit" : "var(--fg-3)"
                }}
              >
                {d.dev_wallet ? formatAddr(String(d.dev_wallet)) : (pt ? "NÃO RASTREADO" : "UNTRACKED")}
              </div>
            </div>
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
            {contractSymbol && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardSymbol}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {contractSymbol}
                </div>
              </div>
            )}
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardRiskScore}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {typeof d.risk_score === "number" ? `${d.risk_score}/100` : "—"}
              </div>
            </div>
            {d.kind === "mint" && d.authorities && typeof d.authorities.mint_authority !== "undefined" && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{pt ? "MINT AUTH" : "MINT AUTH"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: d.authorities.mint_authority !== null ? "var(--status-warning)" : "var(--brand-teal)" }}>
                  {d.authorities.mint_authority !== null ? (pt ? "SIM" : "YES") : (pt ? "NÃO" : "NO")}
                </div>
              </div>
            )}
            {d.known_label && (
              <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardKnownAs}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {d.known_label}
                </div>
              </div>
            )}
            {d.kind === "mint" && (
              <>
                <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                  <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardOperator}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)", wordBreak: "break-all", color: "var(--fg-3)" }}>
                    {pt ? "NÃO RASTREADO" : "UNTRACKED"}
                  </div>
                </div>
                <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "8px 10px" }}>
                  <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{copy.cardDevWallet}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)", wordBreak: "break-all", color: "var(--fg-3)" }}>
                    {pt ? "NÃO RASTREADO" : "UNTRACKED"}
                  </div>
                </div>
              </>
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
      
      {/* DEEP SCAN BUTTON & VIEW */}
      {(r.kind === "token" || (isContract && d.kind === "mint")) && (
        <div style={{ marginBottom: 16 }}>
          {!showDeepScan ? (
            <button
              onClick={() => setShowDeepScan(true)}
              style={{
                width: "100%",
                padding: "10px",
                background: "var(--surface-3)",
                color: "var(--fg-1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-3)")}
            >
              {pt ? "🔍 Analisar Dados de Mercado e Holders (Deep Scan)" : "🔍 Analyze Market & Holders (Deep Scan)"}
            </button>
          ) : (
            <DeepScanView mint={r.addr} pt={pt} onMarketFlags={(f) => setMarketFlags((prev) => Array.from(new Set([...prev, ...f])))} />
          )}
        </div>
      )}

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
          
          {/* SECURITY PILLS (MA / FA) */}
          {r.kind === "token" && d.has_mint_authority === true && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: 4 }}>
              MA
            </span>
          )}
          {r.kind === "token" && d.has_freeze_authority === true && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: 4 }}>
              FA
            </span>
          )}
        </div>
      )}

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
      </div>
    </div>
  );
}
