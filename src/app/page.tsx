// Landing page — v4 native React/Next.js implementation.
// Replaces the v3 iframe wrapper that pointed at /references/solsentry-fun.html.
//
// Server component. Fetches live stats + top operator from api.solsentry.app
// with revalidate windows tuned to the upstream cache. Passes serialized
// payloads to the client shell which owns lang/theme state.
//
// Spec: internal/codex/16_SITE_RESTRUCTURE_PLAN.md §2

import { fetchStats, fetchTopOperators } from "@/lib/api";
import { Footer } from "@/components/Footer";
import { LandingClient } from "@/components/landing/LandingClient";
import type { LiveStatsPayload } from "@/components/landing/LiveStatsBar";
import type { TopOperatorPayload } from "@/components/landing/OperatorOfDay";

export const revalidate = 60;

export const metadata = {
  title: "SolSentry — operator threat intelligence for Solana",
  description:
    "Paste a Solana wallet or token mint. SolSentry tells you who's behind it — every token that operator deployed, every confirmed rug, every cluster.",
  openGraph: {
    title: "SolSentry — operator threat intelligence for Solana",
    description:
      "RugCheck tells you a fire is burning. SolSentry tells you who lit it.",
    images: ["/og/og-default.png"],
  },
};

const FALLBACK_TOP_OP = "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1";

export default async function HomePage() {
  // Both fetches go through safeFetch — they return null instead of throwing.
  // We run them in parallel; either can be null without taking the page down.
  const [stats, topOps] = await Promise.all([
    fetchStats(),
    fetchTopOperators(1),
  ]);

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

  const top = topOps[0];
  const opPayload: TopOperatorPayload = top
    ? {
        ok: true,
        wallet: top.wallet,
        confirmedRugs: top.confirmed_rugs,
        totalTokens: top.total_tokens,
        rugRatePct: top.rug_rate_pct,
        tags: top.tags,
      }
    : {
        ok: true,
        wallet: FALLBACK_TOP_OP,
        isFallback: true,
      };

  return (
    <>
      <LandingClient stats={statsPayload} topOperator={opPayload} />
      <Footer />
    </>
  );
}
