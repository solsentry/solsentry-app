// /lookup?addr=X — server component that disambiguates a base58 address
// (wallet vs token mint) and redirects to the right detail page.
//
// Mirrors the backend GET /lookup handler in
// integrations/mcp/http_api.py — duplicated client-side as a Next server
// component so the user lands on /operator/X or /token/X without an extra
// hop through the API. Falls back to /scan?addr=X when nothing is known.
//
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §3.1

import { redirect } from "next/navigation";
import { fetchOperator, fetchToken } from "@/lib/api";

const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ addr?: string }>;
}

export default async function LookupPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const addr = (params.addr ?? "").trim();

  if (!addr || !BASE58_RE.test(addr)) {
    // Invalid → home with a hint. Never 500.
    redirect("/?err=invalid_address");
  }

  // Parallel-fetch — safeFetch returns null on error so we never throw.
  const [op, tok] = await Promise.all([fetchOperator(addr), fetchToken(addr)]);

  const opKnown = !!op && op.known === true;
  const opRugs = op?.confirmed_rugs ?? 0;
  const tokKnown = !!tok && tok.known === true;

  let target: string;
  if (opKnown && tokKnown) {
    target = opRugs > 0 ? `/operator/${addr}` : `/token/${addr}`;
  } else if (opKnown) {
    target = `/operator/${addr}`;
  } else if (tokKnown) {
    target = `/token/${addr}`;
  } else {
    target = `/scan?addr=${encodeURIComponent(addr)}`;
  }

  redirect(target);
}
