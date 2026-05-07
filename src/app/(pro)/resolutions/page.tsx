import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import {
  fetchResolutionsRecent,
  fetchStats,
  truncate,
  fmtUnixAge,
} from "@/lib/api";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "Resolutions — every prediction validated against outcome",
  description:
    "SolSentry doesn't just predict. It resolves. Every risk prediction gets confirmed or refuted against the real on-chain outcome within 2 days. This is the public outcome stream.",
};

export default async function ResolutionsPage() {
  const [resolutions, stats] = await Promise.all([
    fetchResolutionsRecent(40),
    fetchStats(),
  ]);

  const accuracy = stats?.accuracy_pct ?? 0;
  const resolveRate = stats?.resolve_rate_pct ?? 0;

  return (
    <>
      <main>
        <PageHeader
          eyebrow="Resolutions · outcome stream"
          title={
            <>
              Predictions meet{" "}
              <span style={{ color: "var(--brand-orange)" }}>reality</span>.
            </>
          }
          sub={
            <>
              Every scan gets a predicted risk. Every prediction gets resolved
              against on-chain outcome — did the token rug, or not? Zero
              confirmed false positives at CRITICAL risk so far. All misses are
              stealth-rug false negatives. This is the transparency layer
              competitors don&rsquo;t publish.
            </>
          }
        />

        <Section>
          <div className="grid-3">
            <div className="panel">
              <div className="label-tag" style={{ marginBottom: 8 }}>
                Accuracy
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "var(--brand-orange)",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {accuracy.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 6 }}>
                was_correct on resolved predictions
              </div>
            </div>
            <div className="panel">
              <div className="label-tag" style={{ marginBottom: 8 }}>
                Resolve rate
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "var(--brand-teal)",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {resolveRate.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 6 }}>
                predictions that reached final state
              </div>
            </div>
            <div className="panel">
              <div className="label-tag" style={{ marginBottom: 8 }}>
                Total resolved
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "var(--fg-1)",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {(stats?.resolved ?? 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 6 }}>
                unique predictions validated
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow="Latest resolutions" title="Prediction vs outcome">
          <div className="list-row header">
            <span>Risk</span>
            <span>Token</span>
            <span>Outcome</span>
            <span>Latency</span>
            <span>When</span>
          </div>
          <div className="panel" style={{ padding: 0 }}>
            {resolutions.length === 0 && (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "var(--fg-3)",
                }}
              >
                API not reachable. Try again shortly.
              </div>
            )}
            {resolutions.map((r, i) => {
              const level = (r.predicted_level || "UNKNOWN").toUpperCase();
              const correct = r.was_correct;
              return (
                <Link
                  key={r.mint + i}
                  href={`/token/${r.mint}`}
                  className="list-row"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span>
                    <span
                      className={`risk-badge ${level}`}
                      style={{ fontSize: 10 }}
                    >
                      {level}
                    </span>
                  </span>
                  <div>
                    <div
                      className="mono"
                      style={{ color: "var(--brand-orange)", fontSize: 13 }}
                    >
                      {truncate(r.mint, 8, 6)}
                    </div>
                    {r.symbol && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--fg-3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginTop: 2,
                        }}
                      >
                        {r.symbol}
                      </div>
                    )}
                  </div>
                  <span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: correct
                          ? "rgba(0,201,167,0.1)"
                          : "rgba(255,68,68,0.1)",
                        color: correct
                          ? "var(--brand-teal)"
                          : "var(--status-critical)",
                        border: `1px solid ${correct ? "var(--brand-teal)" : "var(--status-critical)"}`,
                      }}
                    >
                      {correct ? "✓" : "✗"} {r.final_outcome}
                    </span>
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--fg-2)",
                    }}
                  >
                    {r.resolve_latency_hours?.toFixed(1) ?? "—"}h
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-3)",
                    }}
                  >
                    {fmtUnixAge(r.resolved_at)}
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>

        <Section
          eyebrow="Why we publish this"
          title="Accuracy without transparency is a marketing claim"
        >
          <p
            style={{
              color: "var(--fg-2)",
              fontSize: 16,
              maxWidth: 760,
              lineHeight: 1.7,
            }}
          >
            Most risk-scoring systems publish a number — 95%, 98%,
            &quot;industry-leading&quot; — and never show the ledger. SolSentry
            ships the ledger.{" "}
            <strong style={{ color: "var(--fg-1)" }}>
              {stats?.resolved.toLocaleString() ?? "—"}
            </strong>{" "}
            resolutions means{" "}
            <strong style={{ color: "var(--fg-1)" }}>
              {stats?.resolved.toLocaleString() ?? "—"}
            </strong>{" "}
            chances to check our work. If we flag a token CRITICAL and it
            survives, the record stays — with the mint, the timestamp, the final
            outcome. Same goes the other way: if we miss a rug, the miss is
            public.
          </p>
          <p
            style={{
              color: "var(--fg-2)",
              fontSize: 16,
              maxWidth: 760,
              lineHeight: 1.7,
              marginTop: 16,
            }}
          >
            This is how accuracy is supposed to work. Anyone claiming
            &quot;95%&quot; without a resolve rate and an outcome feed is either
            not resolving predictions at all, or only counting the ones they got
            right.
          </p>
        </Section>
      </main>
    </>
  );
}
