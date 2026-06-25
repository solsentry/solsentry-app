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
import { quickEasyLookup } from "@/lib/scan-resolver";

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

  const res = await quickEasyLookup(addr);

  let target: string;
  if (res?.kind === "operator") {
    target = `/operator/${addr}`;
  } else if (res?.kind === "token" || res?.kind === "contract") {
    target = `/token/${addr}`;
  } else {
    target = `/scan?addr=${encodeURIComponent(addr)}`;
  }

  redirect(target);
}
