import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RiskBadge } from "@/components/RiskBadge";
import { ApiError } from "@/components/ApiError";
import {
  fetchAlertsRecent,
  fetchResolutionsRecent,
  fmtUnixAge,
  truncate,
} from "@/lib/api";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "Recent tokens — live alert feed by mint",
  description:
    "Recent tokens scanned by SolSentry. HIGH/CRITICAL alerts and resolved outcomes side by side.",
};

export default async function TokensPage() {
  const [alerts, resolutions] = await Promise.all([
    fetchAlertsRecent(30),
    fetchResolutionsRecent(30),
  ]);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Recent tokens · 30 alerts + 30 resolutions"
          title="Live mint stream"
          sub="The left column shows the latest HIGH+ alerts. The right column shows the latest resolved outcomes — what the scanner predicted vs what actually happened."
        />

        <Section eyebrow="Two-column live" title="Alerts vs resolutions">
          <div className="alerts-grid">
            <div className="alerts-col">
              <div
                className="label-tag"
                style={{ marginBottom: 12, color: "var(--status-warning)" }}
              >
                Latest HIGH+ alerts
              </div>
              {alerts.length === 0 ? (
                <ApiError
                  endpoint="/v1/alerts/recent?limit=30"
                  message="No alerts returned."
                />
              ) : (
                <div className="alerts-list">
                  {alerts.map((a, i) => (
                    <Link
                      key={`${a.mint}-${i}`}
                      href={`/token/${a.mint}`}
                      className="alert-item"
                    >
                      <div className="alert-head">
                        <RiskBadge level={a.risk_level} size="sm" />
                        <span className="alert-age">
                          {fmtUnixAge(a.predicted_at)}
                        </span>
                      </div>
                      <div className="alert-mint">
                        {truncate(a.mint, 10, 6)}
                      </div>
                      {a.symbol && (
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "var(--fg-3)",
                            textTransform: "uppercase",
                          }}
                        >
                          ${a.symbol}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="alerts-col">
              <div
                className="label-tag"
                style={{ marginBottom: 12, color: "var(--brand-teal)" }}
              >
                Latest resolutions
              </div>
              {resolutions.length === 0 ? (
                <ApiError
                  endpoint="/v1/resolutions/recent?limit=30"
                  message="No resolutions returned."
                />
              ) : (
                <div className="alerts-list">
                  {resolutions.map((r, i) => (
                    <Link
                      key={`${r.mint}-${i}`}
                      href={`/token/${r.mint}`}
                      className="alert-item"
                    >
                      <div className="alert-head">
                        <RiskBadge level={r.predicted_level} size="sm" />
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: r.was_correct
                              ? "var(--brand-teal)"
                              : "var(--status-warning)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {r.was_correct ? "✓ correct" : "✗ miss"}
                          {" · "}
                          {r.final_outcome}
                        </span>
                      </div>
                      <div className="alert-mint">
                        {truncate(r.mint, 10, 6)}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--fg-3)",
                        }}
                      >
                        predicted risk {r.predicted_risk} ·{" "}
                        {r.resolve_latency_hours != null
                          ? `${r.resolve_latency_hours.toFixed(1)}h to resolve`
                          : `resolved ${fmtUnixAge(r.resolved_at)}`}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
