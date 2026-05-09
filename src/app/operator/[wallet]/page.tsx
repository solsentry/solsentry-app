import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RiskBadge } from "@/components/RiskBadge";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { SenaModal } from "@/components/SenaModal";
import {
  fetchOperator,
  fetchOperatorTimeline,
  fetchOperatorNetwork,
  fmtInt,
  fmtPct,
  fmtUnixAge,
  truncate,
} from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

const SAMPLE_WALLET = "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1";

interface PageProps {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  return {
    title: `Operator ${truncate(wallet, 6, 4)} — risk profile`,
    description: `SolSentry operator profile for ${wallet}. Risk level, confirmed rugs, total tokens, deployment timeline.`,
  };
}

export default async function OperatorPage({ params }: PageProps) {
  const { wallet } = await params;

  const [op, timeline, network] = await Promise.all([
    fetchOperator(wallet),
    fetchOperatorTimeline(wallet),
    fetchOperatorNetwork(wallet),
  ]);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow={`Operator profile · ${wallet === SAMPLE_WALLET ? "sample · CRITICAL" : "live"}`}
          title={
            <>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6em",
                  color: "var(--brand-amber)",
                  display: "block",
                  wordBreak: "break-all",
                  letterSpacing: 0,
                  marginBottom: 8,
                }}
              >
                {wallet}
              </span>
              {op?.known
                ? "Known operator"
                : op
                  ? "Wallet not flagged"
                  : "Operator lookup"}
            </>
          }
          sub={
            op?.known
              ? `On-chain identity tracked. ${op.confirmed_rugs ?? 0} confirmed rugs across ${op.total_tokens ?? 0} tokens deployed.`
              : op
                ? "This wallet is not in the operator database. It may be a safe protocol address, or has not deployed a token in the monitored window."
                : "Resolving operator from the live API."
          }
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            {op && (
              <SenaModal
                subject={{
                  kind: "operator",
                  wallet,
                  riskLevel: op.risk_level,
                  riskScore: op.risk_score,
                  confirmedRugs: op.confirmed_rugs,
                  totalTokens: op.total_tokens,
                  rugRatePct: op.rug_rate_pct,
                  tags: op.tags,
                }}
              />
            )}
            <a
              href={`https://api.solsentry.app/v1/operator/${wallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
            <Link href={`/drain/${wallet}`} className="btn-ghost">
              Trace drain
            </Link>
            <a
              href={`https://solscan.io/account/${wallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Solscan ↗
            </a>
          </div>
        </PageHeader>

        {!op && (
          <Section eyebrow="API error" title="Could not load operator">
            <ApiError endpoint={`/v1/operator/${wallet}`} />
          </Section>
        )}

        {op && (
          <Section eyebrow="Risk summary" title="Threat profile">
            <div
              className="panel"
              style={{
                borderColor: op.known
                  ? op.risk_level === "CRITICAL"
                    ? "var(--status-critical)"
                    : "var(--brand-amber)"
                  : "var(--brand-teal)",
                padding: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 28px",
                  borderBottom: "1px solid var(--border)",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <RiskBadge level={op.risk_level} size="lg" />
                  <div>
                    <div className="label-tag" style={{ marginBottom: 4 }}>
                      Risk score
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 28,
                        color: "var(--fg-1)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {op.risk_score ?? "—"}
                      <span style={{ color: "var(--fg-3)", fontSize: 16 }}> / 100</span>
                    </div>
                  </div>
                </div>
                {op.risk_label && (
                  <span className="hover-chip" style={{ fontSize: 11 }}>
                    {op.risk_label}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
                <Cell label="Confirmed rugs" value={fmtInt(op.confirmed_rugs)} accent="critical" />
                <Cell label="Total tokens" value={fmtInt(op.total_tokens)} />
                <Cell
                  label="Rug rate"
                  value={fmtPct(op.rug_rate_pct, 1)}
                  accent={op.rug_rate_pct && op.rug_rate_pct > 80 ? "critical" : undefined}
                />
              </div>

              {(op.tags?.length || op.patterns?.length) && (
                <div
                  style={{
                    padding: "16px 28px",
                    borderTop: "1px solid var(--border-soft)",
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {(op.tags || []).map((t) => (
                    <span key={t} className="hover-chip" style={{ fontSize: 11 }}>
                      {t}
                    </span>
                  ))}
                  {(op.patterns || []).map((p) => (
                    <span
                      key={p}
                      className="hover-chip"
                      style={{ fontSize: 11, color: "var(--brand-teal)" }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}

        {timeline && timeline.tokens && timeline.tokens.length > 0 && (
          <Section
            eyebrow={`Timeline · ${timeline.tokens.length} tokens`}
            title="Deployment history"
            sub={`First seen ${fmtUnixAge(timeline.first_seen)} · Last seen ${fmtUnixAge(timeline.last_seen)} · ${fmtInt(timeline.confirmed_rugs_in_window)} confirmed rugs in window.`}
          >
            <div className="timeline">
              {timeline.tokens.slice(0, 50).map((tok) => (
                <Link
                  key={tok.mint}
                  href={`/token/${tok.mint}`}
                  className="timeline-item"
                >
                  <span className="timeline-time">{fmtUnixAge(tok.deployed_at)}</span>
                  <div className="timeline-body">
                    <span className="timeline-mint">{truncate(tok.mint, 10, 6)}</span>
                    <div className="timeline-meta">
                      {tok.symbol && <span className="timeline-symbol">{tok.symbol}</span>}
                      <span className="timeline-risk">{tok.risk_level}</span>
                      <span style={{ color: "var(--fg-3)" }}>
                        risk {tok.risk_score}
                      </span>
                      {tok.final_outcome && (
                        <span
                          style={{
                            color:
                              tok.final_outcome === "RUG"
                                ? "var(--status-critical)"
                                : "var(--brand-teal)",
                          }}
                        >
                          → {tok.final_outcome}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {timeline.tokens.length > 50 && (
              <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 16 }}>
                Showing first 50 of {timeline.tokens.length} tokens. Hit the full JSON for the complete list.
              </p>
            )}
          </Section>
        )}

        {network && network.nodes && network.nodes.length > 0 && (
          <Section
            eyebrow="Network teaser"
            title="Connected wallets"
            sub={`${network.nodes.length} nodes · ${network.edges?.length ?? 0} edges in the bounded operator graph.`}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {network.nodes.slice(0, 24).map((n) => (
                <div key={n.address} className="panel" style={{ padding: 14 }}>
                  <div style={{ marginBottom: 6 }}>
                    <AddrLink addr={n.address} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 11,
                      color: "var(--fg-3)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {n.type && <span>{n.type}</span>}
                    {n.risk !== undefined && <span>risk {n.risk}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href={`/network/${wallet}`} className="btn-ghost">
                Full network →
              </Link>
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "critical";
}) {
  return (
    <div
      style={{
        padding: "24px 28px",
        borderRight: "1px solid var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span className="label-tag">{label}</span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 32,
          color:
            accent === "critical" ? "var(--status-critical)" : "var(--fg-1)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}
