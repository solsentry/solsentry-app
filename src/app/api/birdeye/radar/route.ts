// /api/birdeye/radar — Server-side proxy combining Birdeye trending feed
// with SolSentry operator-graph safety scoring.
//
// Built for Birdeye Data BIP Sprint 4 (May 9-16 2026). The unique angle:
// Birdeye tells you WHICH tokens are trending. SolSentry tells you WHICH
// of those tokens come from operators we already flagged as serial ruggers.
//
// Open source MIT — github.com/solsentry/solsentry-app

import { NextResponse } from "next/server";

const BIRDEYE_BASE = "https://public-api.birdeye.so";
const SOLSENTRY_API = "https://api.solsentry.app";

// runtime: default Node.js (OpenNext Cloudflare doesn't support inline edge runtime)
export const revalidate = 60; // 1 min cache to be polite

interface BirdeyeToken {
  rank: number;
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  liquidity?: number;
  volume24hUSD?: number;
  price?: number;
  marketcap?: number;
  fdv?: number;
}

interface SolSentryVerdict {
  known: boolean;
  risk_level?: string;
  risk_score?: number;
  rug_rate_pct?: number;
  confirmed_rugs?: number;
  total_tokens?: number;
  tags?: string[];
  operator?: string | null;
}

interface RadarRow {
  birdeye: BirdeyeToken;
  solsentry?: SolSentryVerdict;
  solsentry_verdict: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
}

async function fetchBirdeyeTrending(limit: number, key: string): Promise<BirdeyeToken[]> {
  const url = `${BIRDEYE_BASE}/defi/token_trending?sort_by=rank&limit=${limit}`;
  try {
    const res = await fetch(url, {
      headers: { "X-API-KEY": key, "x-chain": "solana" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Birdeye HTTP ${res.status}`);
    const json = await res.json();
    return json?.data?.tokens ?? [];
  } catch (e) {
    console.error("birdeye trending failed", e);
    return [];
  }
}

async function fetchSolSentryToken(mint: string): Promise<SolSentryVerdict | null> {
  try {
    // /v1/token endpoint may not exist — fallback to operator if we have deployer
    const res = await fetch(`${SOLSENTRY_API}/v1/token/${mint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as SolSentryVerdict;
  } catch {
    return null;
  }
}

function deriveVerdict(s: SolSentryVerdict | null | undefined): RadarRow["solsentry_verdict"] {
  if (!s || !s.known) return "UNKNOWN";
  const lvl = s.risk_level?.toUpperCase();
  if (lvl === "CRITICAL") return "CRITICAL";
  if (lvl === "HIGH") return "HIGH";
  if (lvl === "MEDIUM") return "MEDIUM";
  return "LOW";
}

export async function GET(request: Request) {
  const apiKey = process.env.BIRDEYE_API_KEY;
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "BIRDEYE_API_KEY not configured on server.",
        hint: "Set env var on Cloudflare Pages dashboard or wrangler.toml vars.",
      },
      { status: 503 },
    );
  }

  const trending = await fetchBirdeyeTrending(limit, apiKey);
  if (trending.length === 0) {
    return NextResponse.json(
      { error: "Birdeye returned no tokens. API may be rate-limited or down." },
      { status: 502 },
    );
  }

  // Cross-reference each token with SolSentry — parallel
  const enriched: RadarRow[] = await Promise.all(
    trending.map(async (t) => {
      const verdict = await fetchSolSentryToken(t.address);
      return {
        birdeye: t,
        solsentry: verdict ?? undefined,
        solsentry_verdict: deriveVerdict(verdict),
      };
    }),
  );

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    source: {
      birdeye: "https://public-api.birdeye.so/defi/token_trending",
      solsentry: "https://api.solsentry.app/v1/token/{mint}",
    },
    count: enriched.length,
    tokens: enriched,
  });
}
