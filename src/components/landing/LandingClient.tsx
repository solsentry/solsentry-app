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

import { ScanResultCard } from "@/components/ScanResultCard";
import { quickEasyLookup, getUnknown, type ScanResult } from "@/lib/scan-resolver";
import { BetaAccessModal } from "@/components/BetaAccessModal";

interface Props {
  stats: LiveStatsPayload;
  topOperator?: any;
}

export function LandingClient({ stats, hideChrome = false }: Props & { hideChrome?: boolean }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
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
                    disabled={true}
                    placeholder="Scanner disabled during teaser phase..."
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
                      opacity: 0.5,
                      cursor: "not-allowed",
                    }}
                  />
                  <button
                    disabled={true}
                    style={{
                      background: "var(--surface-hover)",
                      color: "var(--fg-3)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "0 22px",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "not-allowed",
                      opacity: 0.5,
                    }}
                  >
                    V1 Soon
                  </button>
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
                  gap: 12,
                  marginBottom: 24,
                  fontSize: 13,
                  color: "var(--fg-3)",
                }}
              >
                <BetaAccessModal
                  triggerClassName="rounded-lg bg-[rgba(217,119,6,0.15)] px-6 py-3 font-semibold text-[var(--brand-amber)] transition-colors hover:bg-[rgba(217,119,6,0.25)] border border-[var(--brand-amber)]/20"
                >
                  Request Beta Access ↗
                </BetaAccessModal>
                <span style={{ color: "var(--fg-4)" }}>·</span>
                <span>{copy.betaFollow}:</span>
                <a
                  href="https://x.com/solsentryai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--fg-2)", fontWeight: 500, textDecoration: "none" }}
                >
                  @solsentryai
                </a>
              </div>

              {/* The rich result card (appears after action) */}
              {result && <ScanResultCard r={result} used={used} copy={copy} lang={lang} />}

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
