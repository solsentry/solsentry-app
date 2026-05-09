import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RiskBadge } from "@/components/RiskBadge";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { fetchToken, truncate } from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { mint } = await params;
  return {
    title: `Token ${truncate(mint, 6, 4)} — risk card`,
    description: `SolSentry token risk card for ${mint}. Risk score, flag list, deploying operator, and outcome.`,
  };
}

export default async function TokenPage({ params }: PageProps) {
  const { mint } = await params;
  const tok = await fetchToken(mint);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Token risk card"
          title={
            <>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55em",
                  color: "var(--brand-amber)",
                  display: "block",
                  wordBreak: "break-all",
                  letterSpacing: 0,
                  marginBottom: 8,
                }}
              >
                {mint}
              </span>
              {tok?.known
                ? tok.symbol
                  ? `${tok.symbol}`
                  : "Token analysis"
                : "Token not in database"}
            </>
          }
          sub={
            tok?.known
              ? `Risk ${tok.risk_score ?? "—"} / 100 · ${tok.flags?.length ?? 0} flags raised by the scanner.`
              : tok
                ? "This mint has not been scanned, or the scan has not yet resolved. Check back in a few minutes."
                : "Resolving token from the live API."
          }
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href={`https://api.solsentry.app/v1/token/${mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
            <a
              href={`https://solscan.io/token/${mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Solscan ↗
            </a>
            <a
              href={`https://dexscreener.com/solana/${mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              DexScreener ↗
            </a>
          </div>
        </PageHeader>

        {!tok && (
          <Section eyebrow="API error" title="Could not load token">
            <ApiError endpoint={`/v1/token/${mint}`} />
          </Section>
        )}

        {tok && tok.known && (
          <>
            <Section eyebrow="Risk profile" title="Scanner verdict">
              <div
                className="panel"
                style={{
                  borderColor:
                    tok.risk_level === "CRITICAL"
                      ? "var(--status-critical)"
                      : tok.risk_level === "HIGH"
                        ? "var(--status-warning)"
                        : "var(--border)",
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "24px 28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border)",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <RiskBadge level={tok.risk_level} size="lg" />
                    <div>
                      <div className="label-tag" style={{ marginBottom: 4 }}>
                        Risk score
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 32,
                          color: "var(--fg-1)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1,
                        }}
                      >
                        {tok.risk_score ?? "—"}
                        <span style={{ color: "var(--fg-3)", fontSize: 18 }}>
                          {" "}/ 100
                        </span>
                      </div>
                    </div>
                  </div>
                  {tok.final_outcome && (
                    <div style={{ textAlign: "right" }}>
                      <div className="label-tag" style={{ marginBottom: 4 }}>
                        Outcome
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 18,
                          color:
                            tok.final_outcome === "RUG"
                              ? "var(--status-critical)"
                              : "var(--brand-teal)",
                        }}
                      >
                        {tok.final_outcome}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ padding: "20px 28px" }}>
                  <div
                    className="label-tag"
                    style={{ marginBottom: 12 }}
                  >
                    Flags raised
                  </div>
                  {tok.flags && tok.flags.length > 0 ? (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {tok.flags.map((f) => (
                        <span
                          key={f}
                          className="hover-chip"
                          style={{
                            fontSize: 11,
                            color: "var(--brand-amber)",
                            borderColor: "var(--brand-amber-line)",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "var(--fg-3)", fontSize: 13 }}>
                      No flags raised.
                    </p>
                  )}
                  {tok.is_bundle && (
                    <p
                      style={{
                        marginTop: 12,
                        color: "var(--status-warning)",
                        fontSize: 13,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Bundle launch detected — multiple buyers funded from a
                      shared source.
                    </p>
                  )}
                </div>
              </div>
            </Section>

            {(tok.dev_wallet || tok.operator) && (
              <Section eyebrow="Operator" title="Who deployed this">
                <div className="panel">
                  <div
                    className="label-tag"
                    style={{ marginBottom: 8 }}
                  >
                    Dev wallet
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    {tok.dev_wallet ? (
                      <AddrLink addr={tok.dev_wallet} head={10} tail={6} />
                    ) : (
                      <span style={{ color: "var(--fg-3)" }}>
                        Not yet resolved
                      </span>
                    )}
                  </div>
                  {tok.operator && tok.operator !== tok.dev_wallet && (
                    <>
                      <div
                        className="label-tag"
                        style={{ marginBottom: 8 }}
                      >
                        Operator ID
                      </div>
                      <div>
                        <AddrLink addr={tok.operator} head={10} tail={6} />
                      </div>
                    </>
                  )}
                  {tok.dev_wallet && (
                    <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <Link
                        href={`/operator/${tok.dev_wallet}`}
                        className="btn-primary"
                      >
                        Operator profile →
                      </Link>
                      <Link
                        href={`/drain/${tok.dev_wallet}`}
                        className="btn-ghost"
                      >
                        Trace drain
                      </Link>
                    </div>
                  )}
                </div>
              </Section>
            )}
          </>
        )}

        {tok && !tok.known && (
          <Section eyebrow="No data" title="Not yet scanned">
            <div className="panel">
              <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}>
                The scanner has not produced a risk record for this mint. This
                can mean one of three things:
              </p>
              <ul
                style={{
                  marginTop: 12,
                  paddingLeft: 20,
                  color: "var(--fg-2)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                <li>Token was deployed before the monitored window started.</li>
                <li>Stage 1 scan is still running (typical wait: 2–10s).</li>
                <li>Mint address is invalid or off-curve.</li>
              </ul>
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </>
  );
}
