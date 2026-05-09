import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RiskBadge } from "@/components/RiskBadge";
import { ApiError } from "@/components/ApiError";
import { fetchClusters, fmtInt, fmtUnixAge } from "@/lib/api";
import Link from "next/link";
import { ProShell } from "@/components/ProShell";

export const revalidate = 120;

export const metadata = {
  title: "Bot clusters — coordinated wallet groups",
  description:
    "Solana bot cluster registry. Groups of wallets sharing funding sources, deployment patterns, or coordinated trading.",
};

export default async function ClustersPage() {
  const { clusters, total_clusters } = await fetchClusters(50);

  return (
    <ProShell>
      <main>
        <PageHeader
          eyebrow={`Bot cluster registry · ${total_clusters} total`}
          title="Coordinated wallet groups"
          sub="Clusters are sets of wallets identified as coordinated — through shared funding, identical bundle behaviour, or matching deployment fingerprints. Each cluster is a single adversary operating multiple wallets."
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href="https://api.solsentry.app/v1/clusters?limit=50"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
          </div>
        </PageHeader>

        <Section eyebrow={`${clusters.length} shown`} title="Active clusters">
          {clusters.length === 0 ? (
            <ApiError endpoint="/v1/clusters?limit=50" />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 16,
              }}
            >
              {clusters.map((c) => (
                <Link
                  key={c.cluster_id}
                  href={`/clusters/${encodeURIComponent(c.cluster_id)}`}
                  className="panel panel-hover"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      className="label-tag"
                      style={{ color: "var(--brand-amber)" }}
                    >
                      {c.cluster_id.slice(0, 16)}
                    </span>
                    {c.risk_level && <RiskBadge level={c.risk_level} size="sm" />}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Stat label="Wallets" value={fmtInt(c.size)} />
                    <Stat
                      label="Rugs"
                      value={fmtInt(c.associated_rugs)}
                      accent="critical"
                    />
                    <Stat label="Tokens" value={fmtInt(c.associated_tokens)} />
                    <Stat
                      label="Risk"
                      value={c.risk_score != null ? `${c.risk_score}` : "—"}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--fg-3)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    First seen {fmtUnixAge(c.first_seen)} · Last seen{" "}
                    {fmtUnixAge(c.last_seen)}
                  </div>
                  {c.funding_source_classification && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: "var(--brand-teal)",
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      via {c.funding_source_classification}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Section>
      </main>
    </ProShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "critical";
}) {
  return (
    <div>
      <div className="label-tag" style={{ marginBottom: 4, fontSize: 9 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 16,
          fontWeight: 600,
          color: accent === "critical" ? "var(--status-critical)" : "var(--fg-1)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
