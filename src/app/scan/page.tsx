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
      <main className="max-w-3xl mx-auto pt-16 pb-24 px-6 text-foreground">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {addr ? "Deep Scan" : symbol ? "Symbol Radar" : "Scanner"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground/60 font-mono break-all mb-8">
          Target: {target || "None"}
        </p>

        <section className="relative overflow-hidden bg-background/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          {isUnknown ? (
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 bg-white/5">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium mb-2">Target not in index</h2>
              <p className="text-sm text-muted-foreground/70 max-w-md">
                We don&apos;t have on-chain history for this {addr ? "address" : "symbol"} yet. If a
                wallet recently launched a token, it shows up within a few minutes. Check live
                activity, or try again shortly.
              </p>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <RiskBadge level={riskLevel} />
                <span className="text-sm text-muted-foreground/60 uppercase tracking-widest font-medium">
                  Live Verdict
                </span>
              </div>
              
              <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-foreground/80">
                  Risk level <strong className="text-foreground">{riskLevel}</strong>. Active telemetry engaged.
                </p>
              </div>

              {devWallet && (
                <div className="space-y-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground/60 mr-2">Deployer:</span>
                    <AddrLink addr={devWallet} />
                  </div>
                  {tok?.operator && (
                    <Link
                      href={`/scan?addr=${devWallet}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-[#d97706] transition-colors mt-2"
                    >
                      Open operator graph
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
