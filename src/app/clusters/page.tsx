import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { fetchClusters, truncate, fmtUnixAge } from "@/lib/api";
import Link from "next/link";

export const revalidate = 120;

export const metadata = {
  title: "Bot clusters — coordinated wallet groups",
  description: "Coordinated bot clusters observed on Solana. Each cluster is a fingerprint: shared funding, sync-timed actions, cross-wallet launch coordination.",
};

function fmtAge(ts: number) {
  return fmtUnixAge(ts);
}

export default async function ClustersPage() {
  const { clusters, total_clusters } = await fetchClusters(40);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Bot clusters · coordinated wallet groups"
          title={
            <>
              {total_clusters.toLocaleString()} coordinated clusters.<br />
              <span style={{ color: "var(--brand-orange)" }}>Each one is a fingerprint.</span>
            </>
          }
          sub={
            <>
              When ten wallets funded by the same source launch a token within the same 30-second window and
              all buy in the first block, that&rsquo;s not ten users. It&rsquo;s one actor with ten addresses.
              SolSentry clusters them — then correlates cluster activity against deployer wallets so the next
              launch gets flagged automatically.
            </>
          }
        />

        <Section>
          <div className="list-row header">
            <span>#</span>
            <span>Cluster</span>
            <span>Size</span>
            <span>Rugs</span>
            <span>Last seen</span>
          </div>

          <div className="panel" style={{ padding: 0, marginTop: 0, borderRadius: "var(--radius-sm)" }}>
            {clusters.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--fg-3)" }}>
                API not reachable. Retry in a moment.
              </div>
            )}
            {clusters.map((c, i) => (
              <Link
                key={c.cluster_id}
                href={`/cluster/${c.cluster_id}`}
                className="list-row"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--fg-3)",
                  }}
                >
                  {String(i + 1).padStart(3, "0")}
                </span>
                <div>
                  <div
                    className="mono"
                    style={{
                      color: "var(--brand-orange)",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {c.cluster_id}
                  </div>
                  {c.shared_funding_source && (
                    <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 3 }}>
                      funded by{" "}
                      <span className="mono" style={{ color: "var(--fg-2)" }}>
                        {truncate(c.shared_funding_source)}
                      </span>
                      {c.funding_source_classification && (
                        <span style={{ marginLeft: 8, color: "var(--brand-teal)" }}>
                          [{c.funding_source_classification}]
                        </span>
                      )}
                    </div>
                  )}
                  {c.tags && c.tags.length > 0 && (
                    <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {c.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: 10,
                            color: "var(--fg-3)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-1)", fontSize: 13 }}>
                  {c.size}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color:
                      (c.associated_rugs ?? 0) > 5
                        ? "var(--status-critical)"
                        : (c.associated_rugs ?? 0) > 0
                        ? "var(--status-warning)"
                        : "var(--fg-2)",
                    fontSize: 13,
                  }}
                >
                  {c.associated_rugs ?? 0}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-3)", fontSize: 12 }}>
                  {fmtAge(c.last_seen)}
                </span>
              </Link>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="How clustering works"
          title="Three signals collapse to one cluster"
        >
          <div className="grid-3">
            {[
              {
                t: "Shared funding",
                d: "If ≥ 4 wallets received their first SOL from the same source within a narrow window, they're candidates. The funding source is classified (CEX, mixer, bridge, or unknown).",
              },
              {
                t: "Sync-timed actions",
                d: "Block-level timing. If a cluster of wallets all execute the same action (buy, transfer, swap) within 2 blocks of each other, repeatedly, the cluster score goes up.",
              },
              {
                t: "Cross-launch reuse",
                d: "Same wallets appearing across multiple deployments by the same or linked operators. The strongest fingerprint — and the hardest to hide.",
              },
            ].map((c) => (
              <div key={c.t} className="panel">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>{c.t}</h3>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.55 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
