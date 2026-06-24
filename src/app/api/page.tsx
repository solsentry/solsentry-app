// /api — server wrapper: keeps EN metadata (SEO) + revalidate + live
// /v1/stats fetch (runtime panel), then renders the bilingual client body
// (PT/EN resolved from saved pref or navigator.language; see useLang / B8.4a).
//
// 14 documented endpoints (B8.6: removed the duplicate /health group; the
// headline count is derived from the list in ApiClient — never hardcoded).

import { fetchStats } from "@/lib/api";
import { ApiClient } from "./ApiClient";

export const revalidate = 60;

export const metadata = {
  title: "API reference — SolSentry REST + MCP",
  description:
    "Complete REST API for SolSentry. 14 documented endpoints covering operators, tokens, alerts, resolutions, bot clusters, drain traces, and network stats. Free public tier. No API key for read endpoints.",
};

export default async function ApiPage() {
  const stats = await fetchStats();
  return <ApiClient stats={stats} />;
}
