import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { fetchDrainTrace, truncate } from "@/lib/api";
import { DrainSearchForm } from "@/components/DrainSearchForm";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ wallet: string }>;
}) {
  const { wallet } = await params;
  return {
    title: `Drain trace · ${truncate(wallet)}`,
    description: `Where the SOL went from ${wallet}. 10-hop fund-flow analysis.`,
  };
}

export default async function DrainTracePage({
  params,
}: {
  params: Promise<{ wallet: string }>;
}) {
  const { wallet } = await params;
  const trace = await fetchDrainTrace(wallet);

  if (!trace) notFound();

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Drain trace"
          title={
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 28 }}>
              {truncate(wallet, 12, 8)}
            </span>
          }
          sub={
            <>
              {trace.hop_count} hop{trace.hop_count === 1 ? "" : "s"} followed ·{" "}
              {trace.total_sol_drained.toFixed(3)} SOL traced · trace time{" "}
              {(trace.trace_time_ms ?? 0).toFixed(0)}ms
            </>
          }
        >
          <div style={{ marginTop: 16 }}>
            <DrainSearchForm />
          </div>
        </PageHeader>

        <Section>
          <div className="grid-4">
            <div className="panel">
              <div className="label-tag">Hops</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "var(--fg-1)",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {trace.hop_count}
              </div>
            </div>
            <div className="panel">
              <div className="label-tag">SOL drained</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "var(--brand-orange)",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {trace.total_sol_drained.toFixed(2)}
              </div>
            </div>
            <div className="panel">
              <div className="label-tag">Reached CEX</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 700,
                  color: trace.reached_cex
                    ? "var(--status-warning)"
                    : "var(--fg-3)",
                  letterSpacing: "-0.02em",
                }}
              >
                {trace.reached_cex ? "YES" : "NO"}
              </div>
            </div>
            <div className="panel">
              <div className="label-tag">Reached mixer</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 700,
                  color: trace.reached_mixer
                    ? "var(--status-critical)"
                    : "var(--fg-3)",
                  letterSpacing: "-0.02em",
                }}
              >
                {trace.reached_mixer ? "YES" : "NO"}
              </div>
            </div>
          </div>
        </Section>

        {trace.hops && trace.hops.length > 0 ? (
          <Section eyebrow="Hop-by-hop" title="Flow through the graph">
            <div className="panel" style={{ padding: 0 }}>
              {trace.hops.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px 20px",
                    borderBottom:
                      i === trace.hops.length - 1
                        ? "none"
                        : "1px solid var(--border-soft)",
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 1fr 100px",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--brand-orange)",
                      fontSize: 12,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div
                      className="label-tag"
                      style={{ fontSize: 9, marginBottom: 4 }}
                    >
                      From
                    </div>
                    <span
                      className="mono"
                      style={{ fontSize: 12, color: "var(--fg-2)" }}
                    >
                      {h.from ? truncate(h.from, 8, 6) : "—"}
                    </span>
                  </div>
                  <div>
                    <div
                      className="label-tag"
                      style={{ fontSize: 9, marginBottom: 4 }}
                    >
                      To{" "}
                      {h.classification && (
                        <span
                          style={{ color: "var(--brand-teal)", marginLeft: 8 }}
                        >
                          [{h.classification}]
                        </span>
                      )}
                    </div>
                    {h.to ? (
                      <Link
                        href={`/operator/${h.to}`}
                        className="mono"
                        style={{ fontSize: 12, color: "var(--brand-orange)" }}
                      >
                        {truncate(h.to, 8, 6)}
                      </Link>
                    ) : (
                      <span style={{ color: "var(--fg-3)" }}>—</span>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--fg-1)",
                      fontSize: 13,
                      textAlign: "right",
                    }}
                  >
                    {(h.amount_sol ?? 0).toFixed(3)} SOL
                  </span>
                </div>
              ))}
            </div>
          </Section>
        ) : (
          <Section>
            <div className="panel" style={{ textAlign: "center", padding: 48 }}>
              <p style={{ color: "var(--fg-2)" }}>
                No hops recorded for this wallet. Either it has not drained
                recently, or the trace could not resolve outgoing SOL flow. Try
                another address or check{" "}
                <Link href="/operator">the operator database</Link> instead.
              </p>
            </div>
          </Section>
        )}

        {trace.endpoints && trace.endpoints.length > 0 && (
          <Section eyebrow="Endpoints" title="Where the SOL finally landed">
            <div className="grid-2">
              {trace.endpoints.map((e, i) => (
                <div key={i} className="panel">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      className="mono"
                      style={{ color: "var(--brand-orange)", fontSize: 13 }}
                    >
                      {e.address ? truncate(e.address, 8, 6) : "—"}
                    </span>
                    {e.classification && (
                      <span
                        className="pillar-chip track"
                        style={{ fontSize: 9 }}
                      >
                        {e.classification}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--fg-1)",
                      fontSize: 16,
                    }}
                  >
                    {(e.amount_sol ?? 0).toFixed(3)} SOL
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </>
  );
}
