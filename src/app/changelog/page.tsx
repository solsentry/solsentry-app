// /changelog — server wrapper: keeps EN metadata (SEO) + revalidate, then
// renders the bilingual client body (PT/EN from saved pref or
// navigator.language; see useLang / B8.4a).
//
// Content source: internal/marketing/social/CHANGELOG_PUBLIC.md (curated,
// gate-checked). NOTE: no noindex — this page is intentionally public.

import { ChangelogClient } from "./ChangelogClient";

export const metadata = {
  title: "SolSentry — Changelog",
  description:
    "SolSentry build history: operator graph, ALife brain, public API, classifier improvements, and more — since day one (February 2026).",
  openGraph: {
    title: "SolSentry — Changelog",
    description:
      "Build history of the Solana operator threat intelligence platform. Free API, MCP server, ALife agents — auditable per-mint.",
    images: ["/og/og-default.png"],
  },
};

export const revalidate = 60;

export default async function ChangelogPage() {
  return <ChangelogClient />;
}
