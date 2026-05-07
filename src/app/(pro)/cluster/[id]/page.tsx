import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { fetchCluster, truncate, fmtUnixAge } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Cluster ${id} — bot cluster detail`,
    description: `SolSentry cluster detail — wallets, funding source, associated rugs, tags.`,
  };
}

export default async function ClusterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cluster = await fetchCluster(id);

  if (!cluster) notFound();

  const riskLevel = (cluster.risk_level || "UNKNOWN").toUpperCase();

  return (
    <>
      <main>
        <PageHeader
          eyebrow={`Cluster · ${cluster.size} wallets`}
          title={
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 36 }}>
              {cluster.cluster_id}
            </span>
          }
          sub={`Coordinated wallet group first observed ${fmtUnixAge(cluster.first_seen)}. Last activity ${fmtUnixAge(cluster.last_seen)}.`}
        >
          <div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
          >
            <span
              className={`risk-badge ${riskLevel}`}
              style={{ padding: "6px 14px", fontSize: 13 }}
            >
              {riskLevel}
            </span>
            <Link href="/clusters" className="btn-ghost">
              ← All clusters
            </Link>
          </div>
        </PageHeader>

        <Section>
          <div className="grid-4">
            {[
              ["Wallets", cluster.size],
              ["Associated rugs", cluster.associated_rugs ?? 0],
              ["Associated tokens", cluster.associated_tokens ?? 0],
              ["Risk score", cluster.risk_score ?? "—"],
            ].map(([l, v]) => (
              <div key={String(l)} className="panel">
                <div className="label-tag" style={{ marginBottom: 8 }}>
                  {l}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--fg-1)",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {cluster.shared_funding_source && (
          <Section
            eyebrow="Funding source"
            title="Where the cluster's SOL came from"
          >
            <div className="panel">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="mono"
                  style={{ color: "var(--brand-orange)", fontSize: 15 }}
                >
                  {cluster.shared_funding_source}
                </span>
                {cluster.funding_source_classification && (
                  <span className="pillar-chip track">
                    {cluster.funding_source_classification}
                  </span>
                )}
              </div>
              <p
                style={{
                  color: "var(--fg-2)",
                  fontSize: 14,
                  marginTop: 12,
                  lineHeight: 1.6,
                }}
              >
                A shared funding source is the strongest evidence that a cluster
                is one actor, not many. The classification indicates whether the
                source is a known CEX (retail), a mixer (privacy or laundering),
                a bridge (cross-chain), or unknown (potentially another operator
                wallet).
              </p>
            </div>
          </Section>
        )}

        {cluster.sample_wallets && cluster.sample_wallets.length > 0 && (
          <Section
            eyebrow="Sample wallets"
            title="A selection from this cluster"
            sub={`Showing ${cluster.sample_wallets.length} of ${cluster.size}. Click any wallet for its operator profile.`}
          >
            <div className="grid-2">
              {cluster.sample_wallets.map((w) => (
                <Link
                  key={w}
                  href={`/operator/${w}`}
                  className="panel panel-hover"
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className="mono"
                    style={{ color: "var(--brand-orange)", fontSize: 13 }}
                  >
                    {truncate(w, 8, 6)}
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {cluster.operators && cluster.operators.length > 0 && (
          <Section
            eyebrow="Linked operators"
            title="Deployers this cluster has mined for"
          >
            <div className="grid-2">
              {cluster.operators.map((op) => (
                <Link
                  key={op}
                  href={`/operator/${op}`}
                  className="panel panel-hover"
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className="mono"
                    style={{ color: "var(--brand-orange)", fontSize: 13 }}
                  >
                    {truncate(op, 8, 6)}
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {cluster.tags && cluster.tags.length > 0 && (
          <Section eyebrow="Tags" title="Classifiers on this cluster">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {cluster.tags.map((t) => (
                <span key={t} className="hover-chip">
                  {t}
                </span>
              ))}
            </div>
          </Section>
        )}
      </main>
    </>
  );
}
