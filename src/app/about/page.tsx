// /about — server wrapper: keeps EN metadata (SEO) + revalidate + live
// /v1/stats fetch, then renders the bilingual client body (PT/EN resolved
// from saved pref or navigator.language; see useLang / B8.4a).
//
// Spec: internal/codex/16_SITE_RESTRUCTURE_PLAN.md §3

import { fetchStats } from "@/lib/api";
import { AboutClient } from "./AboutClient";

export const revalidate = 60;

export const metadata = {
  title: "About SolSentry — operator threat intelligence for Solana",
  description:
    "Solo-built, free, open-core operator-graph threat intelligence for Solana. Live mainnet since April 2026.",
  openGraph: {
    title: "About SolSentry",
    description: "Solo-built, free, open-core operator-graph threat intelligence for Solana.",
    images: ["/og/og-default.png"],
  },
};

export default async function AboutPage() {
  const stats = await fetchStats();
  return <AboutClient stats={stats} />;
}
