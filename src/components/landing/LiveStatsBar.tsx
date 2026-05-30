"use client";

// LiveStatsBar — KPI strip. Data is fetched server-side at the page level
// (revalidate ~60s) and passed in as a serialized prop. We do no client
// fetching here on purpose — RSC is the source of truth.
//
// Uptime unit policy (internal/codex/03_METRICS.md): >21 days → "Month N
// live"; >24h → "N days"; else "Nh".

import Link from "next/link";
import type { LandingCopy } from "@/lib/i18n-landing";

export interface LiveStatsPayload {
  ok: boolean;
  totalPredictions?: number;
  accuracyPct?: number;
  runtimeHours?: number;
  operators?: number;
  rugs?: number;
}

function fmtInt(n?: number): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

function fmtPct(n?: number): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}%`;
}

function fmtUptime(hours: number | undefined, lang: "en" | "pt"): string {
  if (hours == null) return "—";
  const days = hours / 24;
  if (days >= 21) {
    const monthN = Math.floor(days / 30) + 1;
    return lang === "pt" ? `Mês ${monthN} ao vivo` : `Month ${monthN} live`;
  }
  if (days >= 1) {
    const d = Math.floor(days);
    return lang === "pt" ? `${d} dias` : `${d} days`;
  }
  return `${Math.round(hours)}h`;
}

interface Props {
  copy: LandingCopy;
  lang: "en" | "pt";
  stats: LiveStatsPayload;
}

export function LiveStatsBar({ copy, lang, stats }: Props) {
  if (!stats.ok) {
    return (
      <section className="landing-stats landing-stats--offline" aria-live="polite">
        <p>{copy.statsOffline}</p>
      </section>
    );
  }

  const cells = [
    {
      label: copy.statsLabelScans,
      value: fmtInt(stats.totalPredictions),
      href: "https://api.solsentry.app/v1/stats",
    },
    {
      label: copy.statsLabelAccuracy,
      value: fmtPct(stats.accuracyPct),
      href: "https://api.solsentry.app/v1/stats",
    },
    {
      label: copy.statsLabelUptime,
      value: fmtUptime(stats.runtimeHours, lang),
      href: "https://api.solsentry.app/health",
    },
    {
      label: copy.statsLabelOperators,
      value: fmtInt(stats.operators),
      href: "https://api.solsentry.app/v1/top-operators",
    },
    {
      label: copy.statsLabelRugs,
      value: fmtInt(stats.rugs),
      href: "https://api.solsentry.app/v1/stats",
    },
  ];

  return (
    <section className="landing-stats" aria-label={copy.statsLabelScans}>
      <ul className="landing-stats__grid">
        {cells.map((c) => (
          <li key={c.label}>
            <a href={c.href} target="_blank" rel="noreferrer" className="landing-stats__cell">
              <span className="landing-stats__label">{c.label}</span>
              <span className="landing-stats__value">{c.value}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="landing-stats__footnote">
        {copy.statsFootnote}{" "}
        <Link href="/about" className="landing-link-inline">
          {copy.trustAbout}
        </Link>
      </p>
    </section>
  );
}
