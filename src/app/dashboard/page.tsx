import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { ApiError } from "@/components/ApiError";
import {
  fetchStats,
  fetchInvariants,
  fetchAlertsRecent,
  fmtInt,
  fmtPct,
} from "@/lib/api";
import Link from "next/link";
import { ProShell } from "@/components/ProShell";

export const revalidate = 30;

export const metadata = {
  title: "Live ops dashboard",
  description:
    "Live operational metrics for the SolSentry mainnet scanner. Accuracy, runtime, alert volume, invariants check.",
};

export default async function DashboardPage() {
  const [stats, invariants, alerts] = await Promise.all([
    fetchStats(),
    fetchInvariants(),
    fetchAlertsRecent(10),
  ]);

  return (
    <ProShell>
      <main>
        <PageHeader
          eyebrow="Live ops · refreshes every 30s"
          title={
            <>
              Mainnet scanner{" "}
              <span style={{ color: "var(--brand-amber)" }}>health</span>
            </>
          }
          sub={
            stats
              ? `${fmtInt(stats.runtime_hours)}h continuous on Hetzner. ${fmtInt(stats.total_predictions)} scans processed. ${fmtPct(stats.accuracy_pct, 1)} accuracy on ${fmtPct(stats.resolve_rate_pct, 1)} resolved.`
              : "Resolving live metrics from the API."
          }
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href="https://api.solsentry.app/v1/stats"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              /v1/stats ↗
            </a>
            <a
              href="https://api.solsentry.app/health/invariants"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              /health/invariants ↗
            </a>
          </div>
        </PageHeader>

        <Section eyebrow="Network" title="Core counters">
          {!stats ? (
            <ApiError endpoint="/v1/stats" />
          ) : (
            <div className="stats-grid">
              <Card label="Runtime" value={`${fmtInt(stats.runtime_hours)}h`} meta="continuous mainnet" accent="amber" />
              <Card
                label="Tokens scanned"
                value={fmtInt(stats.total_predictions)}
                meta={`${fmtPct(stats.resolve_rate_pct, 1)} resolved`}
              />
              <Card
                label="Accuracy"
                value={fmtPct(stats.accuracy_pct, 1)}
                meta="zero false positives at CRITICAL"
              />
              <Card
                label="HIGH+ alerts"
                value={fmtInt(stats.high_risk_alerts)}
                meta={`${fmtInt(stats.confirmed_rugs)} confirmed rugs`}
                accent="critical"
              />
              <Card
                label="Operators"
                value={fmtInt(stats.total_operators)}
                meta={`${fmtInt(stats.serial_ruggers)} serial ruggers`}
              />
              <Card
                label="Bot clusters"
                value={fmtInt(stats.bot_clusters)}
                meta="coordinated wallet groups"
              />
              <Card
                label="Wallets profiled"
                value={fmtInt(stats.wallet_profiles_tracked)}
                meta={`${fmtInt(stats.wallets_with_confirmed_rugs)} flagged`}
              />
              <Card
                label="Pending"
                value={fmtInt(stats.pending)}
                meta={`${fmtInt(stats.resolved)} resolved total`}
              />
            </div>
          )}
        </Section>

        <Section eyebrow="System health" title="Invariants check">
          {!invariants ? (
            <ApiError endpoint="/health/invariants" />
          ) : (
            <div
              className="panel"
              style={{
                borderColor: invariants.ok
                  ? "var(--brand-teal)"
                  : "var(--status-critical)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span
                  className="status-dot"
                  style={{
                    background: invariants.ok
                      ? "var(--brand-teal)"
                      : "var(--status-critical)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: invariants.ok
                      ? "var(--brand-teal)"
                      : "var(--status-critical)",
                  }}
                >
                  {invariants.ok ? "ALL INVARIANTS PASSING" : "INVARIANT VIOLATION"}
                </span>
              </div>
              {invariants.failures && invariants.failures.length > 0 && (
                <ul
                  style={{
                    paddingLeft: 20,
                    color: "var(--status-critical)",
                    fontSize: 13,
                    lineHeight: 1.7,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {invariants.failures.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
              {invariants.checks && (
                <details style={{ marginTop: 12 }}>
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "var(--fg-3)",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Show check details
                  </summary>
                  <pre
                    style={{
                      marginTop: 8,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-2)",
                      background: "var(--surface-2)",
                      padding: 12,
                      borderRadius: 4,
                      overflowX: "auto",
                      maxHeight: 280,
                    }}
                  >
                    {JSON.stringify(invariants.checks, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </Section>

        {alerts.length > 0 && (
          <Section eyebrow="Live feed · last 10" title="Recent alerts">
            <div className="alerts-list">
              {alerts.map((a, i) => (
                <Link
                  key={`${a.mint}-${i}`}
                  href={`/token/${a.mint}`}
                  className="alert-item"
                >
                  <div className="alert-head">
                    <span
                      className={`risk-badge ${a.risk_level}`}
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {a.risk_level}
                    </span>
                    <span className="alert-age">risk {a.risk_score}</span>
                  </div>
                  <div className="alert-mint">{a.mint}</div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href="/alerts" className="btn-ghost">
                Full alert feed →
              </Link>
            </div>
          </Section>
        )}
      </main>
    </ProShell>
  );
}

function Card({
  label,
  value,
  meta,
  accent,
}: {
  label: string;
  value: string;
  meta?: string;
  accent?: "amber" | "critical";
}) {
  const color =
    accent === "amber"
      ? "var(--brand-amber)"
      : accent === "critical"
        ? "var(--status-critical)"
        : "var(--fg-1)";
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      {meta && <div className="stat-meta">{meta}</div>}
    </div>
  );
}
