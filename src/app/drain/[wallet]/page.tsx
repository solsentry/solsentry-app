import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { SenaModal } from "@/components/SenaModal";
import { fetchDrainTrace, truncate, fmtUnixAge } from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  return {
    title: `Drain trace ${truncate(wallet, 6, 4)}`,
    description: `SOL flow trace for ${wallet}. Up to 10 hops with bridge / DEX / CEX classification.`,
  };
}

const CLASS_COLOR: Record<string, string> = {
  CEX: "var(--status-critical)",
  BRIDGE: "var(--status-warning)",
  MIXER: "var(--brand-purple)",
  DEX: "var(--brand-teal)",
  WALLET: "var(--fg-2)",
  UNKNOWN: "var(--fg-3)",
};

function classColor(classification?: string) {
  if (!classification) return CLASS_COLOR.UNKNOWN;
  const k = classification.toUpperCase();
  return CLASS_COLOR[k] || CLASS_COLOR.UNKNOWN;
}

export default async function DrainPage({ params }: PageProps) {
  const { wallet } = await params;
  const trace = await fetchDrainTrace(wallet);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Drain trace · 10-hop SOL flow"
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
                {wallet}
              </span>
              {trace
                ? trace.hop_count > 0
                  ? `${trace.hop_count} hops · ${trace.total_sol_drained.toFixed(2)} SOL`
                  : "No drain detected"
                : "Drain trace"}
            </>
          }
          sub={
            trace
              ? trace.reached_cex
                ? "Funds reached a known CEX. Cash-out path identified."
                : trace.reached_mixer
                  ? "Funds reached a mixing service."
                  : trace.hop_count > 0
                    ? "Funds tracked through DeFi but no terminal cash-out reached within the trace window."
                    : "No outbound SOL flow recorded for this wallet."
              : "Resolving SOL flow from the live API. This can take a few seconds for deep traces."
          }
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            {trace && (
              <SenaModal
                subject={{
                  kind: "drain",
                  wallet,
                  hopCount: trace.hop_count,
                  totalSolDrained: trace.total_sol_drained,
                  reachedCex: trace.reached_cex,
                  reachedMixer: trace.reached_mixer,
                }}
              />
            )}
            <a
              href={`https://api.solsentry.app/v1/drain-trace/${wallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
            <Link href={`/operator/${wallet}`} className="btn-ghost">
              Operator profile
            </Link>
          </div>
        </PageHeader>

        {!trace && (
          <Section eyebrow="API error" title="Could not load trace">
            <ApiError endpoint={`/v1/drain-trace/${wallet}`} />
          </Section>
        )}

        {trace && (
          <>
            <Section eyebrow="Trace metrics" title="Flow summary">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                <Metric label="Hops" value={String(trace.hop_count)} />
                <Metric
                  label="SOL drained"
                  value={trace.total_sol_drained.toFixed(2)}
                  accent={trace.total_sol_drained > 100 ? "warn" : undefined}
                />
                <Metric
                  label="Reached CEX"
                  value={trace.reached_cex ? "YES" : "no"}
                  accent={trace.reached_cex ? "critical" : undefined}
                />
                <Metric
                  label="Reached mixer"
                  value={trace.reached_mixer ? "YES" : "no"}
                  accent={trace.reached_mixer ? "critical" : undefined}
                />
                {trace.trace_time_ms != null && (
                  <Metric
                    label="Trace time"
                    value={`${trace.trace_time_ms}ms`}
                  />
                )}
              </div>
            </Section>

            {trace.hops && trace.hops.length > 0 && (
              <Section
                eyebrow={`${trace.hops.length} hops`}
                title="Hop-by-hop trace"
                sub="Vertical flow from origin downstream. Click any wallet to inspect its operator profile."
              >
                <div className="panel" style={{ padding: 0 }}>
                  {trace.hops.map((h, i) => (
                    <div
                      key={`${h.signature || i}-${i}`}
                      style={{
                        padding: "16px 24px",
                        borderBottom:
                          i < trace.hops.length - 1
                            ? "1px solid var(--border-soft)"
                            : "none",
                        display: "grid",
                        gridTemplateColumns: "60px 1fr 1fr 120px",
                        gap: 16,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--fg-3)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        HOP {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div
                          className="label-tag"
                          style={{ marginBottom: 4, fontSize: 9 }}
                        >
                          From
                        </div>
                        {h.from ? (
                          <AddrLink addr={h.from} head={6} tail={4} />
                        ) : (
                          <span style={{ color: "var(--fg-3)" }}>—</span>
                        )}
                      </div>
                      <div>
                        <div
                          className="label-tag"
                          style={{ marginBottom: 4, fontSize: 9 }}
                        >
                          To
                          {h.classification && (
                            <span
                              style={{
                                marginLeft: 8,
                                color: classColor(h.classification),
                                fontWeight: 600,
                              }}
                            >
                              · {h.classification.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {h.to ? (
                          <AddrLink addr={h.to} head={6} tail={4} />
                        ) : (
                          <span style={{ color: "var(--fg-3)" }}>—</span>
                        )}
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                          color: "var(--fg-1)",
                        }}
                      >
                        {h.amount_sol != null
                          ? `${h.amount_sol.toFixed(3)} SOL`
                          : "—"}
                        {h.timestamp && (
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--fg-3)",
                              marginTop: 2,
                            }}
                          >
                            {fmtUnixAge(h.timestamp)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {trace.endpoints && trace.endpoints.length > 0 && (
              <Section eyebrow="Endpoints" title="Where the SOL ended up">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 12,
                  }}
                >
                  {trace.endpoints.map((e, i) => (
                    <div
                      key={`${e.address}-${i}`}
                      className="panel"
                      style={{ padding: 16 }}
                    >
                      <div style={{ marginBottom: 8 }}>
                        {e.classification && (
                          <span
                            className="hover-chip"
                            style={{
                              fontSize: 10,
                              color: classColor(e.classification),
                              borderColor: classColor(e.classification),
                            }}
                          >
                            {e.classification.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {e.address && (
                        <div style={{ marginBottom: 8 }}>
                          <AddrLink addr={e.address} head={8} tail={5} />
                        </div>
                      )}
                      {e.amount_sol != null && (
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            color: "var(--fg-1)",
                          }}
                        >
                          {e.amount_sol.toFixed(3)} SOL
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "critical" | "warn";
}) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <div className="label-tag" style={{ marginBottom: 8 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "-0.02em",
          color:
            accent === "critical"
              ? "var(--status-critical)"
              : accent === "warn"
                ? "var(--status-warning)"
                : "var(--fg-1)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
