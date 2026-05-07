import Link from "next/link";
import {
  fetchStats,
  fetchAlertsRecent,
  fetchTopOperators,
  fetchHuntersActive,
  fmtInt,
  fmtPct,
  truncate,
} from "@/lib/api";
import { MetricStrip } from "@/components/dashboard/MetricStrip";
import { HunterStatus } from "@/components/dashboard/HunterStatus";

export const metadata = { title: "Pro Dashboard" };
export const revalidate = 30;

export default async function ProDashboard() {
  const [stats, alerts, top, hunters] = await Promise.all([
    fetchStats().catch(() => null),
    fetchAlertsRecent(8).catch(() => []),
    fetchTopOperators(5).catch(() => []),
    fetchHuntersActive().catch(() => null),
  ]);

  const metrics = stats
    ? [
        {
          label: "Tokens scanned",
          value: fmtInt(stats.total_predictions),
          tone: "default" as const,
        },
        {
          label: "Accuracy",
          value: stats.accuracy_pct.toFixed(1),
          suffix: "%",
          tone: "teal" as const,
        },
        {
          label: "Operators mapped",
          value: fmtInt(stats.total_operators),
          tone: "default" as const,
        },
        {
          label: "Serial deployers",
          value: fmtInt(stats.serial_ruggers),
          tone: "critical" as const,
        },
        {
          label: "Continuous runtime",
          value: stats.runtime_hours.toFixed(0),
          suffix: "h",
          tone: "default" as const,
        },
      ]
    : [];

  return (
    <>
      {/* Hero */}
      <header
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Pro Dashboard
          </h1>
          <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 4 }}>
            Live operator intelligence · autonomous Hunter agents · 24/7 mainnet
          </p>
        </div>
        <HunterStatus
          count={hunters?.count_total ?? 0}
          active={(hunters?.count_total ?? 0) > 0}
        />
      </header>

      {/* Metrics */}
      {metrics.length > 0 && <MetricStrip metrics={metrics} />}

      {/* Quick actions */}
      <section aria-labelledby="qa-heading">
        <h2 id="qa-heading" style={sectionTitleStyle}>
          Quick actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <QuickAction
            href="/operator"
            color="var(--brand-orange)"
            title="Operator lookup"
            sub="Paste a wallet, see the rug history"
          />
          <QuickAction
            href="/token"
            color="var(--brand-teal)"
            title="Token check"
            sub="Risk score for any mint"
          />
          <QuickAction
            href="/drain"
            color="var(--brand-purple)"
            title="Drain trace"
            sub="Follow SOL up to 10 hops"
          />
          <QuickAction
            href="/clusters"
            color="#ffffff"
            title="Bot clusters"
            sub="Coordinated wallet groups"
          />
        </div>
      </section>

      {/* Two-column: alerts + top operators */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 20,
        }}
        className="solsentry-pro-twocol"
      >
        <Panel title="Recent CRITICAL alerts" subtitle="Live · /v1/alerts/recent">
          {alerts.length === 0 ? (
            <EmptyState text="No alerts yet — system warm-up." />
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {alerts.slice(0, 8).map((a) => (
                <li
                  key={a.mint}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-soft)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    gap: 12,
                  }}
                >
                  <Link
                    href={`/token/${a.mint}`}
                    style={{
                      color: "var(--brand-orange)",
                      textDecoration: "none",
                    }}
                  >
                    {a.symbol || truncate(a.mint, 6, 6)}
                  </Link>
                  <span style={{ color: "var(--fg-3)" }}>{a.risk_level}</span>
                  <span style={{ color: "var(--fg-2)" }}>
                    {a.risk_score}/100
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Top operators" subtitle="By confirmed rugs · /v1/top-operators">
          {top.length === 0 ? (
            <EmptyState text="Operator graph populating…" />
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {top.map((o) => (
                <li
                  key={o.wallet}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-soft)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    gap: 12,
                  }}
                >
                  <Link
                    href={`/operator/${o.wallet}`}
                    style={{
                      color: "var(--brand-orange)",
                      textDecoration: "none",
                    }}
                  >
                    {truncate(o.wallet, 6, 6)}
                  </Link>
                  <span style={{ color: "var(--status-critical)" }}>
                    {fmtInt(o.confirmed_rugs)} rugs
                  </span>
                  <span style={{ color: "var(--fg-3)" }}>
                    {fmtPct(o.rug_rate_pct, 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .solsentry-pro-twocol {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

function QuickAction({
  href,
  color,
  title,
  sub,
}: {
  href: string;
  color: string;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${color}`,
        borderRadius: 6,
        padding: 18,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--fg-1)",
        }}
      >
        {title}
      </div>
      <div style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 4 }}>
        {sub}
      </div>
    </Link>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: 20,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h3 style={panelTitleStyle}>{title}</h3>
        {subtitle && (
          <span style={{ color: "var(--fg-4)", fontSize: 11, fontFamily: "var(--font-mono)" }}>
            {subtitle}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p style={{ color: "var(--fg-3)", fontSize: 13, fontStyle: "italic", margin: 0 }}>
      {text}
    </p>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 11,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--fg-3)",
  margin: "0 0 12px 0",
};

const panelTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 11,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--fg-3)",
  margin: 0,
};
