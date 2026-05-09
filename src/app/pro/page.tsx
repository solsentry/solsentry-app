import { ProShell } from "@/components/ProShell";
import { Sparkbars } from "@/components/Sparkbars";
import {
  fetchStats,
  fetchAlertsRecent,
  fetchTopOperators,
  fetchClusters,
  fmtInt,
  fmtPct,
  fmtUnixAge,
} from "@/lib/api";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "Pro mode — SolSentry dashboard",
  description:
    "Pro dashboard: live operator intel, alerts, leaderboard, clusters, and brain skills. Inspired by SolScanner + Nansen.",
};

export default async function ProOverviewPage() {
  const [stats, alerts, operators, clustersResp] = await Promise.all([
    fetchStats(),
    fetchAlertsRecent(10),
    fetchTopOperators(5),
    fetchClusters(5),
  ]);

  const accuracyValues = (stats?.accuracy_trend_24h ?? []).map(
    (p) => Math.round(p.accuracy * 1000) / 10,
  );
  const scansValues = (stats?.scans_trend_24h ?? []).map((p) => p.scans);

  return (
    <ProShell>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--brand-amber)",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            PRO · OVERVIEW · refreshes every 30s
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg-1)",
            }}
          >
            Mainnet command center
          </h1>
          <p
            style={{
              color: "var(--fg-2)",
              marginTop: 8,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {stats
              ? `${fmtInt(stats.runtime_hours)}h continuous on Hetzner. ${fmtInt(stats.total_predictions)} scans · ${fmtPct(stats.accuracy_pct, 1)} accuracy on ${fmtPct(stats.resolve_rate_pct, 1)} resolved.`
              : "Loading live metrics…"}
          </p>
        </header>

        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <Metric label="Runtime" value={`${fmtInt(stats.runtime_hours)}h`} accent="amber" />
            <Metric label="Scans" value={fmtInt(stats.total_predictions)} />
            <Metric label="Accuracy" value={fmtPct(stats.accuracy_pct, 1)} />
            <Metric
              label="HIGH+ alerts"
              value={fmtInt(stats.high_risk_alerts)}
              accent="critical"
            />
            <Metric label="Operators" value={fmtInt(stats.total_operators)} />
            <Metric label="Bot clusters" value={fmtInt(stats.bot_clusters)} />
            <Metric label="Confirmed rugs" value={fmtInt(stats.confirmed_rugs)} />
            <Metric label="Wallets profiled" value={fmtInt(stats.wallet_profiles_tracked)} />
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Panel title="Accuracy · last 24h" subtitle="hourly resolved %">
            <Sparkbars values={accuracyValues} height={120} />
          </Panel>
          <Panel title="Scans · last 24h" subtitle="hourly throughput">
            <Sparkbars
              values={scansValues}
              height={120}
              color="var(--brand-teal)"
            />
          </Panel>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Panel
            title="Recent CRITICAL alerts"
            subtitle={`${alerts.length} live · click for full feed`}
            href="/live"
            cta="Live feed →"
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {alerts.slice(0, 8).map((a, i) => (
                <li
                  key={`${a.mint}-${i}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-soft)",
                    gap: 12,
                  }}
                >
                  <Link
                    href={`/token/${a.mint}`}
                    style={{
                      color: "var(--fg-2)",
                      textDecoration: "none",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.mint}
                  </Link>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      padding: "2px 6px",
                      borderRadius: 3,
                      color:
                        a.risk_level === "CRITICAL"
                          ? "var(--status-critical)"
                          : "var(--brand-amber)",
                      background:
                        a.risk_level === "CRITICAL"
                          ? "var(--status-critical-tint)"
                          : "var(--brand-amber-tint)",
                      letterSpacing: "0.06em",
                      fontWeight: 600,
                    }}
                  >
                    {a.risk_level}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      color: "var(--fg-3)",
                      width: 50,
                      textAlign: "right",
                    }}
                  >
                    {a.age_seconds ? fmtUnixAge(Date.now() / 1000 - a.age_seconds) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Top operators"
            subtitle="by confirmed rugs"
            href="/top-operators"
            cta="Full leaderboard →"
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {operators.slice(0, 5).map((op) => (
                <li
                  key={op.wallet}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-soft)",
                    gap: 8,
                  }}
                >
                  <Link
                    href={`/operator/${op.wallet}`}
                    style={{
                      color: "var(--fg-1)",
                      textDecoration: "none",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    #{op.rank} {op.wallet.slice(0, 10)}…
                  </Link>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "var(--status-critical)",
                    }}
                  >
                    {fmtInt(op.confirmed_rugs)} rugs
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "var(--brand-amber)",
                      width: 50,
                      textAlign: "right",
                    }}
                  >
                    {op.rug_rate_pct.toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Top bot clusters"
          subtitle={`${clustersResp.total_clusters.toLocaleString()} mapped`}
          href="/clusters"
          cta="All clusters →"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {clustersResp.clusters.slice(0, 5).map((c) => (
              <Link
                key={c.cluster_id}
                href={`/clusters/${c.cluster_id}`}
                style={{
                  padding: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  textDecoration: "none",
                  color: "var(--fg-1)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--fg-3)",
                    marginBottom: 4,
                  }}
                >
                  {c.cluster_id}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "var(--fg-1)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {c.size}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--fg-3)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  wallets · {fmtInt(c.associated_rugs ?? 0)} rugs
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </ProShell>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "amber" | "critical";
}) {
  const color =
    accent === "amber"
      ? "var(--brand-amber)"
      : accent === "critical"
        ? "var(--status-critical)"
        : "var(--fg-1)";
  return (
    <div
      style={{
        padding: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: "var(--fg-3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  href,
  cta,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 18,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--fg-1)",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--fg-3)",
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {href && cta && (
          <Link
            href={href}
            style={{
              fontSize: 12,
              color: "var(--brand-amber)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
            }}
          >
            {cta}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
