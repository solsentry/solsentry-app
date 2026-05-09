import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RiskBadge } from "@/components/RiskBadge";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { fetchCluster, fmtInt, fmtUnixAge } from "@/lib/api";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Cluster ${id.slice(0, 16)} — bot group profile`,
    description: `Bot cluster ${id} on SolSentry. Member wallets, associated rugs, funding source.`,
  };
}

export default async function ClusterPage({ params }: PageProps) {
  const { id } = await params;
  const cluster = await fetchCluster(id);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Bot cluster"
          title={
            <>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.45em",
                  color: "var(--brand-amber)",
                  display: "block",
                  wordBreak: "break-all",
                  letterSpacing: 0,
                  marginBottom: 8,
                }}
              >
                {id}
              </span>
              {cluster
                ? `${cluster.size} coordinated wallets`
                : "Cluster lookup"}
            </>
          }
          sub={
            cluster
              ? `${fmtInt(cluster.associated_rugs)} confirmed rugs across ${fmtInt(cluster.associated_tokens)} tokens. First seen ${fmtUnixAge(cluster.first_seen)}.`
              : "Resolving cluster from the live API."
          }
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href={`https://api.solsentry.app/v1/cluster/${encodeURIComponent(id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
          </div>
        </PageHeader>

        {!cluster && (
          <Section eyebrow="API error" title="Could not load cluster">
            <ApiError endpoint={`/v1/cluster/${id}`} />
          </Section>
        )}

        {cluster && (
          <>
            <Section eyebrow="Cluster summary" title="Risk profile">
              <div
                className="panel"
                style={{
                  borderColor:
                    cluster.risk_level === "CRITICAL"
                      ? "var(--status-critical)"
                      : "var(--border)",
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "20px 28px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {cluster.risk_level && (
                      <RiskBadge level={cluster.risk_level} size="lg" />
                    )}
                    {cluster.risk_score != null && (
                      <div>
                        <div className="label-tag" style={{ marginBottom: 4 }}>
                          Risk score
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: 28,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {cluster.risk_score}
                          <span style={{ color: "var(--fg-3)", fontSize: 16 }}>
                            {" "}/ 100
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
                >
                  <Cell label="Wallets" value={fmtInt(cluster.size)} />
                  <Cell
                    label="Rugs"
                    value={fmtInt(cluster.associated_rugs)}
                    accent="critical"
                  />
                  <Cell label="Tokens" value={fmtInt(cluster.associated_tokens)} />
                  <Cell
                    label="Funding"
                    value={cluster.funding_source_classification || "unknown"}
                  />
                </div>

                {cluster.tags && cluster.tags.length > 0 && (
                  <div
                    style={{
                      padding: "16px 28px",
                      borderTop: "1px solid var(--border-soft)",
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {cluster.tags.map((t) => (
                      <span key={t} className="hover-chip" style={{ fontSize: 11 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {cluster.shared_funding_source && (
                <div className="panel" style={{ marginTop: 24 }}>
                  <div className="label-tag" style={{ marginBottom: 8 }}>
                    Shared funding source
                  </div>
                  <AddrLink addr={cluster.shared_funding_source} head={10} tail={6} />
                </div>
              )}
            </Section>

            {((cluster.sample_wallets && cluster.sample_wallets.length > 0) ||
              (cluster.operators && cluster.operators.length > 0)) && (
              <Section
                eyebrow="Members"
                title={`${cluster.size} wallets in this cluster`}
                sub="Sample of wallets identified as part of the same bot group. Click any to inspect its operator profile."
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 12,
                  }}
                >
                  {(cluster.sample_wallets || cluster.operators || [])
                    .slice(0, 60)
                    .map((w) => (
                      <div key={w} className="panel" style={{ padding: 14 }}>
                        <AddrLink addr={w} head={8} tail={5} />
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

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "critical";
}) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderRight: "1px solid var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span className="label-tag" style={{ fontSize: 9 }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 24,
          color:
            accent === "critical" ? "var(--status-critical)" : "var(--fg-1)",
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}
