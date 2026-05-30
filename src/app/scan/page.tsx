// /scan?addr=X | ?symbol=Y — BUILD page (v1 placeholder).
//
// Reached when /lookup found nothing in our DB (unknown address) or when
// the AI search bar detects a short symbol. v1 ships a minimal verdict
// card — full DexScreener/RugCheck enrichment lands in a follow-up.
//
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §A "/scan/[token]"

import Link from "next/link";
import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { RiskBadge } from "@/components/RiskBadge";
import { AddrLink } from "@/components/AddrLink";
import { fetchToken } from "@/lib/api";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ addr?: string; symbol?: string }>;
}

function shortAddr(a: string): string {
  return a.length > 16 ? `${a.slice(0, 6)}…${a.slice(-6)}` : a;
}

export default async function ScanPage({ searchParams }: PageProps) {
  const { addr, symbol } = await searchParams;
  const target = addr ?? symbol ?? "";

  // One more enrichment pass when address provided.
  const tok = addr ? await fetchToken(addr) : null;

  const isUnknown = !tok || tok.known === false;
  const riskLevel = (tok?.risk_level ?? "UNKNOWN") as
    | "CRITICAL"
    | "HIGH"
    | "MEDIUM"
    | "LOW"
    | "UNKNOWN";
  const devWallet = tok?.dev_wallet ?? null;

  return (
    <>
      <SiteTopbar />
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "64px 24px 96px",
          color: "#fafafa",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            margin: "0 0 8px",
            fontFamily: "ui-sans-serif, system-ui",
          }}
        >
          {addr ? "Scanning" : symbol ? "Symbol search" : "Scan"}
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.55)",
            margin: "0 0 24px",
            fontFamily: "ui-monospace, monospace",
            wordBreak: "break-all",
          }}
        >
          {target ? shortAddr(target) : "no target"}
        </p>

        <section
          style={{
            background: "rgba(20,20,24,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 24,
          }}
        >
          {isUnknown ? (
            <>
              <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>
                Not in our index yet
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  margin: "0 0 16px",
                }}
              >
                We don&apos;t have on-chain history for this{" "}
                {addr ? "address" : "symbol"} yet. If a wallet recently
                launched a token, it shows up within a few minutes. Check
                live activity, or try again shortly.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/live"
                  style={{
                    fontSize: 13,
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "#f59e0b",
                    color: "#0a0a0a",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Live feed
                </Link>
                <Link
                  href="/dashboard"
                  style={{
                    fontSize: 13,
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fafafa",
                    textDecoration: "none",
                  }}
                >
                  Dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <RiskBadge level={riskLevel} />
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  verdict
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.75)",
                  margin: "0 0 16px",
                }}
              >
                Risk level <strong>{riskLevel}</strong>. Tracking active.
              </p>

              {devWallet && (
                <p style={{ fontSize: 13, margin: "0 0 8px" }}>
                  Deployer: <AddrLink addr={devWallet} />
                </p>
              )}

              {tok?.operator && devWallet && (
                <Link
                  href={`/operator/${devWallet}`}
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    fontSize: 13,
                    color: "#f59e0b",
                    textDecoration: "underline",
                  }}
                >
                  Open operator history →
                </Link>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
