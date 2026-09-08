import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import {
  TraceNetworkGraph,
  type TraceWalletNode,
  type TraceFlowEdge,
} from "@/components/TraceNetworkGraph";
import { fetchOperatorNetwork, truncate } from "@/lib/api";
import Link from "next/link";
import { InflowOutflowPanel } from "@/components/InflowOutflowPanel";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  return {
    title: `Network ${truncate(wallet, 6, 4)} — operator graph`,
    description: `Operator graph centered on ${wallet}. Connected wallets, edge classifications, hop distance.`,
  };
}

export default async function NetworkPage({ params }: PageProps) {
  const { wallet } = await params;
  const net = await fetchOperatorNetwork(wallet);

  return (
    <>
      <SiteTopbar />
      <main>
        <PageHeader
          eyebrow="Operator network · adjacency view"
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
              Connected wallets
            </>
          }
          sub={
            net
              ? `${net.nodes?.length ?? 0} nodes · ${net.edges?.length ?? 0} edges in the bounded graph centered on this operator.`
              : "Resolving operator graph from the live API."
          }
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href={`https://api.solsentry.app/v1/operator/${wallet}/network`}
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

        {!net && (
          <Section eyebrow="API error" title="Could not load network">
            <ApiError endpoint={`/v1/operator/${wallet}/network`} />
          </Section>
        )}

        {net && (
          <>
            {net.nodes && net.nodes.length > 0 && (
              <Section
                eyebrow="Live graph"
                title="Network Trace"
                sub="Organograma estruturado com nós ricos (fluxo de dinheiro + relacionamentos). Clique nos nós para ver detalhes completos."
              >
                <div style={{ marginBottom: 8, fontSize: 12, color: "var(--fg-3)" }}>
                  {net.nodes.length} nós · {(net.edges || []).length} conexões — Alta densidade de
                  informação, experiência premium
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 16 }}>
                  <TraceNetworkGraph
                    centerWallet={wallet}
                    nodes={net.nodes.map((n: any, i: number) => ({
                      id: n.address,
                      address: n.address,
                      label: truncate(n.address, 4, 4),
                      type: n.address === wallet ? "operator" : n.type || "wallet",
                      risk: n.risk,
                      column: n.address === wallet ? 0 : (i % 5) - 2,
                      tag: n.type,
                    }))}
                    edges={(net.edges || []).map((e: any, i: number) => ({
                      id: `e${i}`,
                      source: e.from || e.source,
                      target: e.to || e.target,
                      amount: e.weight ? Math.round(e.weight * 120) : undefined,
                      kind: e.kind,
                    }))}
                    height={620}
                  />
                  <InflowOutflowPanel wallet={wallet} />
                </div>
              </Section>
            )}
            {net.nodes && net.nodes.length > 0 && (
              <Section
                eyebrow={`${net.nodes.length} nodes`}
                title="Adjacency list"
                sub="Same data as above, in tabular form. Click a wallet to inspect its profile."
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 12,
                  }}
                >
                  {net.nodes.map((n) => (
                    <div key={n.address} className="panel" style={{ padding: 14 }}>
                      <div style={{ marginBottom: 8 }}>
                        <AddrLink addr={n.address} head={8} tail={5} />
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
                        {n.type && (
                          <span
                            style={{
                              padding: "2px 8px",
                              background: "var(--surface-2)",
                              borderRadius: 4,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {n.type}
                          </span>
                        )}
                        {n.risk !== undefined && (
                          <span
                            style={{
                              color:
                                n.risk > 80
                                  ? "var(--status-critical)"
                                  : n.risk > 50
                                    ? "var(--brand-amber)"
                                    : "var(--fg-2)",
                            }}
                          >
                            risk {n.risk}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {net.edges && net.edges.length > 0 && (
              <Section eyebrow={`${net.edges.length} edges`} title="Connections">
                <div className="panel" style={{ padding: 0 }}>
                  {net.edges.slice(0, 100).map((e, i) => (
                    <div
                      key={`${e.from}-${e.to}-${i}`}
                      style={{
                        padding: "12px 20px",
                        borderBottom:
                          i < Math.min(net.edges.length, 100) - 1
                            ? "1px solid var(--border-soft)"
                            : "none",
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        gap: 16,
                        alignItems: "center",
                        fontSize: 12,
                      }}
                    >
                      <AddrLink addr={e.from} head={6} tail={4} />
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--brand-amber)",
                          fontSize: 11,
                        }}
                      >
                        {e.kind || "→"}
                        {e.weight != null && (
                          <span style={{ color: "var(--fg-3)", marginLeft: 6 }}>({e.weight})</span>
                        )}
                      </span>
                      <AddrLink addr={e.to} head={6} tail={4} />
                    </div>
                  ))}
                </div>
                {net.edges.length > 100 && (
                  <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 16 }}>
                    Showing first 100 of {net.edges.length} edges.
                  </p>
                )}
              </Section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
