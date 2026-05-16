// /birdeye-radar — Trending Solana tokens + operator-graph safety verdict.
//
// SolSentry × Birdeye integration. Built for Birdeye Data BIP Sprint 4
// (deadline May 16 2026). Open source MIT.
//
// Flow: Birdeye returns the top trending tokens by volume/momentum.
// SolSentry layers on the operator-graph verdict — flagging tokens deployed
// by wallets we already classify as serial ruggers.
//
// The unique angle: Birdeye tells you WHICH tokens are pumping. SolSentry
// tells you WHICH of those are coming from a known rug operator. The
// combination is a "trending feed with safety scoring" no one else ships.

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Suspense } from "react";

export const revalidate = 60;

interface BirdeyeToken {
  rank: number;
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  liquidity?: number;
  volume24hUSD?: number;
  price?: number;
}

interface SolSentryVerdict {
  known: boolean;
  risk_level?: string;
  risk_score?: number;
  rug_rate_pct?: number;
  confirmed_rugs?: number;
  total_tokens?: number;
  tags?: string[];
}

interface RadarRow {
  birdeye: BirdeyeToken;
  solsentry?: SolSentryVerdict;
  solsentry_verdict: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
}

interface RadarResponse {
  generated_at?: string;
  count?: number;
  tokens?: RadarRow[];
  error?: string;
  hint?: string;
}

async function fetchRadar(limit: number): Promise<RadarResponse> {
  // Server-side fetch: use absolute URL on edge, relative on local
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? "" : "https://solsentry.app");
  const url = `${base}/api/birdeye/radar?limit=${limit}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return (await res.json()) as RadarResponse;
    }
    return (await res.json()) as RadarResponse;
  } catch (e) {
    return {
      error: "Network error reaching /api/birdeye/radar",
      hint: String(e),
    };
  }
}

function fmtNum(n: number | undefined, prefix = "$"): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`;
  return `${prefix}${n.toFixed(2)}`;
}

function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function verdictColor(v: RadarRow["solsentry_verdict"]): string {
  switch (v) {
    case "CRITICAL":
      return "var(--status-critical, #DC2626)";
    case "HIGH":
      return "var(--brand-amber, #C17D0E)";
    case "MEDIUM":
      return "rgba(217, 150, 46, 0.7)";
    case "LOW":
      return "var(--brand-teal, #2A7A7A)";
    default:
      return "rgba(242,237,228,0.35)";
  }
}

function verdictLabel(v: RadarRow["solsentry_verdict"]): string {
  if (v === "UNKNOWN") return "not flagged";
  return v.toLowerCase();
}

export async function generateMetadata() {
  return {
    title: "Birdeye Radar — Trending Solana tokens with SolSentry safety scoring",
    description:
      "Live trending feed from Birdeye, cross-referenced with SolSentry's operator-graph. See which trending tokens come from known serial rug operators — before you buy.",
    openGraph: {
      title: "Birdeye Radar · SolSentry",
      description:
        "Trending Solana tokens with operator-graph safety scoring. Built for Birdeye Data BIP Sprint 4.",
      images: ["/og/og-default.png"],
    },
  };
}

export default async function BirdeyeRadarPage() {
  const data = await fetchRadar(20);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Built for Birdeye Data BIP Sprint 4 · open source MIT"
          title="Birdeye Radar"
          sub="Trending Solana tokens, layered with SolSentry's operator-graph verdict. Birdeye tells you which tokens are pumping — SolSentry tells you which come from known serial rug operators. The combination is a safety-scored trending feed."
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href="https://github.com/solsentry/solsentry-app/blob/main/src/app/birdeye-radar/page.tsx"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              View source ↗
            </a>
            <a
              href="https://bds.birdeye.so"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Birdeye Data ↗
            </a>
            <a
              href="https://api.solsentry.app/v1/stats"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              SolSentry API ↗
            </a>
          </div>
        </PageHeader>

        {data.error && (
          <Section eyebrow="API status" title="Service warmup">
            <div className="panel" style={{ padding: 24 }}>
              <p style={{ color: "var(--fg-2)" }}>
                <strong>{data.error}</strong>
              </p>
              {data.hint && (
                <p
                  style={{
                    color: "var(--fg-3)",
                    fontFamily: "var(--font-mono, ui-monospace)",
                    fontSize: 12,
                    marginTop: 8,
                  }}
                >
                  {data.hint}
                </p>
              )}
              <p style={{ color: "var(--fg-2)", marginTop: 12 }}>
                Refresh in a few seconds. If the issue persists, the BIRDEYE_API_KEY
                env var may need configuration on the deployment.
              </p>
            </div>
          </Section>
        )}

        {data.tokens && data.tokens.length > 0 && (
          <Section
            eyebrow={`Live · refreshes every 60s · ${data.count} tokens`}
            title="Trending feed · safety-scored"
            sub={`Generated ${data.generated_at?.slice(0, 19)} UTC. Each token is queried against SolSentry's operator profiles to surface known serial-rug deployers before they catch new buyers.`}
          >
            <div
              className="panel"
              style={{
                padding: 0,
                overflow: "hidden",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "var(--font-mono, ui-monospace)",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--surface-2, rgba(242,237,228,0.03))",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <Th>#</Th>
                      <Th>Token</Th>
                      <Th>Liquidity</Th>
                      <Th>Vol 24h</Th>
                      <Th>SolSentry verdict</Th>
                      <Th>Operator track</Th>
                      <Th align="right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tokens.map((row) => (
                      <tr
                        key={row.birdeye.address}
                        style={{
                          borderBottom: "1px solid var(--border-soft, rgba(242,237,228,0.04))",
                        }}
                      >
                        <Td>{row.birdeye.rank}</Td>
                        <Td>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 8 }}
                          >
                            {row.birdeye.logoURI && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={row.birdeye.logoURI}
                                alt={row.birdeye.symbol}
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <div>
                              <div
                                style={{ fontWeight: 600, color: "var(--fg-1)" }}
                              >
                                {row.birdeye.symbol}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "var(--fg-3)",
                                }}
                              >
                                {shortAddr(row.birdeye.address)}
                              </div>
                            </div>
                          </div>
                        </Td>
                        <Td>{fmtNum(row.birdeye.liquidity)}</Td>
                        <Td>{fmtNum(row.birdeye.volume24hUSD)}</Td>
                        <Td>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              background: `${verdictColor(row.solsentry_verdict)}22`,
                              color: verdictColor(row.solsentry_verdict),
                              border: `1px solid ${verdictColor(row.solsentry_verdict)}`,
                            }}
                          >
                            {verdictLabel(row.solsentry_verdict)}
                          </span>
                        </Td>
                        <Td>
                          {row.solsentry?.confirmed_rugs != null ? (
                            <span style={{ color: "var(--fg-2)" }}>
                              {row.solsentry.confirmed_rugs}/{row.solsentry.total_tokens}{" "}
                              <span style={{ color: "var(--fg-3)" }}>rugs</span>
                            </span>
                          ) : (
                            <span style={{ color: "var(--fg-3)" }}>—</span>
                          )}
                        </Td>
                        <Td align="right">
                          <a
                            href={`/token/${row.birdeye.address}`}
                            className="btn-ghost"
                            style={{ fontSize: 11, padding: "4px 10px" }}
                          >
                            Scan →
                          </a>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        )}

        <Section eyebrow="Methodology" title="How this works">
          <div className="panel" style={{ padding: 24, lineHeight: 1.6 }}>
            <p style={{ color: "var(--fg-2)" }}>
              <strong>Birdeye Data</strong> provides the trending list (
              <code>/defi/token_trending</code>) — ranked by momentum across
              liquidity and 24-hour volume.
            </p>
            <p style={{ color: "var(--fg-2)", marginTop: 12 }}>
              <strong>SolSentry</strong> cross-references each token mint against
              its operator-graph database (<code>/v1/token/{"{mint}"}</code> →{" "}
              <code>/v1/operator/{"{deployer}"}</code>). If the deployer wallet has
              prior confirmed rugs, the token inherits a CRITICAL or HIGH verdict.
            </p>
            <p style={{ color: "var(--fg-2)", marginTop: 12 }}>
              <strong>Why this matters:</strong> a token that just hit Birdeye's
              trending list and was deployed by a wallet with 500+ prior rugs
              is statistically a setup for the next coordinated exit. The combined
              signal is the difference between &quot;new pump&quot; and
              &quot;new pump from a known rug operator.&quot;
            </p>
            <p style={{ color: "var(--fg-3)", fontSize: 12, marginTop: 16 }}>
              Open source: this page&apos;s code lives at{" "}
              <a
                href="https://github.com/solsentry/solsentry-app/tree/main/src/app/birdeye-radar"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--brand-amber)" }}
              >
                solsentry/solsentry-app
              </a>
              . Fork and adapt — the Birdeye API key is the only secret needed.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      style={{
        textAlign: align ?? "left",
        padding: "10px 12px",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--fg-3)",
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      style={{
        textAlign: align ?? "left",
        padding: "12px",
        color: "var(--fg-1)",
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}
