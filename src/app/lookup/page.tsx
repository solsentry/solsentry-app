// /lookup?addr=X — closed-beta entry for the token card.
//
// The home search sends every base58 address here. Only TOKEN MINTS are open:
//   mint            → 307 /token/X
//   wallet/unknown  → NO redirect to /operator (wallet surfaces are still closed);
//                     render a plain "wallet lookups are not open yet" message
//   invalid input   → plain message (never 500)
//
// Mint detection (a wallet is NOT told apart by /v1/token: the API live-scans any
// address and answers UNKNOWN):
//   1. /v1/token/X already knows it (tier != UNKNOWN, or has a symbol)
//   2. otherwise Solana RPC getAccountInfo: parsed account type "mint" (SPL / Token-2022)
// Operator lookups (/v1/operator) are deliberately NOT called here.

import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { BASE58_RE } from "@/lib/token-card";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lookup", robots: { index: false, follow: false } };

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";
const SOLANA_RPC = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

interface PageProps {
  searchParams: Promise<{ addr?: string | string[] }>;
}

type Verdict = "token" | "not_token" | "unverifiable";

async function tokenKnownToApi(addr: string): Promise<boolean> {
  try {
    const r = await fetch(`${API}/v1/token/${encodeURIComponent(addr)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) return false;
    const t = await r.json();
    // NB: launch_platform is "unknown" even for plain wallets → not a usable signal.
    return !!t && t.known !== false && (t.risk_level !== "UNKNOWN" || !!t.symbol);
  } catch {
    return false;
  }
}

async function isMintOnChain(addr: string): Promise<"yes" | "no" | "error"> {
  try {
    const r = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [addr, { encoding: "jsonParsed" }],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) return "error";
    const j = await r.json();
    if (j?.error || !j?.result) return "error";
    return j.result.value?.data?.parsed?.type === "mint" ? "yes" : "no";
  } catch {
    return "error";
  }
}

async function classify(addr: string): Promise<Verdict> {
  if (await tokenKnownToApi(addr)) return "token";
  const onchain = await isMintOnChain(addr);
  if (onchain === "yes") return "token";
  if (onchain === "no") return "not_token";
  return "unverifiable";
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <>
      <SiteTopbar hideClosedLinks />
      <main style={{ padding: "60px 0 40px" }}>
        <section className="wrap" style={{ padding: "0 24px" }}>
          <div className="panel" style={{ padding: 24, maxWidth: 640 }} data-testid="lookup-message">
            <div
              style={{
                fontSize: 10,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: "var(--brand-amber)",
                marginBottom: 8,
              }}
            >
              Beta — token lookups only
            </div>
            <h1 style={{ fontSize: 20, margin: "0 0 10px", color: "var(--fg-1)" }}>{title}</h1>
            <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>
              {body}
            </p>
            <Link href="/" className="btn-ghost" style={{ fontSize: 13, padding: "6px 12px" }}>
              ← Back to search
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default async function LookupPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.addr) ? params.addr[0] : params.addr;
  const addr = (raw ?? "").trim();

  if (!addr || !BASE58_RE.test(addr)) {
    return (
      <Message
        title="That doesn't look like a Solana address"
        body="Paste a token mint address (base58, 32–44 characters)."
      />
    );
  }

  const verdict = await classify(addr);

  if (verdict === "token") {
    redirect(`/token/${addr}`);
  }

  if (verdict === "unverifiable") {
    return (
      <Message
        title="Couldn't check this address right now"
        body="We couldn't confirm whether this is a token mint (network timeout). Try again in a minute, or paste a token mint directly."
      />
    );
  }

  return (
    <Message
      title="Wallet lookups are not open yet"
      body="This address is not a token mint. Wallet lookups are not open yet; paste a token mint."
    />
  );
}
