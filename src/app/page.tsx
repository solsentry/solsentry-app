// Landing page — v4 native React/Next.js implementation.
// Replaces the v3 iframe wrapper that pointed at /references/solsentry-fun.html.
//
// Server component. Fetches live stats + top operator from api.solsentry.app
// with revalidate windows tuned to the upstream cache. Passes serialized
// payloads to the client shell which owns lang/theme state.
//
// Spec: internal/codex/16_SITE_RESTRUCTURE_PLAN.md §2

import { fetchStats } from "@/lib/api";
import { Footer } from "@/components/Footer";
import { SiteTopbar } from "@/components/SiteTopbar";
import { LandingClient } from "@/components/landing/LandingClient";
import type { LiveStatsPayload } from "@/components/landing/LiveStatsBar";

export const revalidate = 60;

export const metadata = {
  title: "SolSentry — operator threat intelligence for Solana",
  description:
    "Paste a Solana wallet or token mint. Instant Easy mode (free) or full Pro/Dev investigation. Same intel layer, three experiences.",
  openGraph: {
    title: "SolSentry — operator threat intelligence for Solana",
    description: "RugCheck tells you a fire is burning. SolSentry tells you who lit it.",
    images: ["/og/og-default.png"],
  },
};

export default async function HomePage() {
  const stats = await fetchStats();

  const statsPayload: LiveStatsPayload = stats
    ? {
        ok: true,
        totalPredictions: stats.total_predictions,
        accuracyPct: stats.accuracy_pct,
        runtimeHours: stats.runtime_hours,
        operators: stats.total_operators,
        rugs: stats.confirmed_rugs,
      }
    : { ok: false };

  return (
    <>
      <SiteTopbar />
      <div style={{ paddingTop: "72px" }}>
        {" "}
        {/* compensa a altura da topbar fixa */}
        <LandingClient stats={statsPayload} hideChrome />
      </div>
      <Footer />
    </>
  );
}
