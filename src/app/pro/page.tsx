import { ProShell } from "@/components/ProShell";
import { ProTierCard } from "@/components/pro/ProTierCard";
import { TierMatrix } from "@/components/pro/TierMatrix";
import { ClusterPreview } from "@/components/pro/ClusterPreview";
import {
  fetchStats,
  fetchAlertsRecent,
  fetchTopOperators,
  fetchClusters,
  fmtInt,
  fmtPct,
  truncate,
  type Alert,
  type TopOperator,
} from "@/lib/api";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "Pro mode — SolSentry",
  description:
    "Pro mode: AI investigation playground, saved studies, watchlist, x402 credits. Operator-first power-user dashboard.",
};

export default async function ProOverviewPage() {
  const [stats, alerts, operators, clustersResp] = await Promise.all([
    fetchStats(),
    fetchAlertsRecent(20),
    fetchTopOperators(10),
    fetchClusters(8),
  ]);

  const criticalAlerts = alerts
    .filter((a) => a.risk_level === "CRITICAL")
    .slice(0, 20);

  return (
    <ProShell>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Header stats={stats} />
        <KpiStrip stats={stats} />
        <TierIntro />
        <TierPanels />
        <DataCanvas alerts={criticalAlerts} operators={operators} />
        <Section
          title="Cluster index"
          subtitle={`${(clustersResp.total_clusters ?? clustersResp.clusters.length).toLocaleString()} bot clusters mapped`}
        >
          <ClusterPreview clusters={clustersResp.clusters} />
        </Section>
        <Section
          title="Free · Pro · Sentinel"
          subtitle="Pricing locked Phase 5 — Pro and Sentinel tiers in private beta"
        >
          <TierMatrix />
        </Section>
        <FooterStrip />
      </div>
    </ProShell>
  );
}

function Header({
  stats,
}: {
  stats: Awaited<ReturnType<typeof fetchStats>>;
}) {
  return (
    <header style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--brand-amber)",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        PRO MODE · OVERVIEW · refresh 30s
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "-0.02em",
          margin: 0,
          color: "var(--fg-1)",
        }}
      >
        AI co-pilot · watchlist · unlimited scans
      </h1>
      <p
        style={{
          color: "var(--fg-2)",
          marginTop: 8,
          fontSize: 13,
          lineHeight: 1.6,
          maxWidth: 780,
        }}
      >
        {stats
          ? `${fmtInt(stats.runtime_hours)}h continuous mainnet · ${fmtInt(stats.total_predictions)} predictions · ${fmtPct(stats.accuracy_pct, 1)} aggregate accuracy on ${fmtPct(stats.resolve_rate_pct, 1)} resolved.`
          : "Loading live metrics…"}
      </p>
    </header>
  );
}

function KpiStrip({
  stats,
}: {
  stats: Awaited<ReturnType<typeof fetchStats>>;
}) {
  const items: { label: string; value: string; accent?: "amber" | "critical" }[] =
    stats
      ? [
          { label: "Operators", value: fmtInt(stats.total_operators) },
          {
            label: "Confirmed rugs",
            value: fmtInt(stats.confirmed_rugs),
            accent: "critical",
          },
          { label: "Predictions", value: fmtInt(stats.total_predictions) },
          {
            label: "CRITICAL precision",
            value: fmtPct(stats.accuracy_pct, 1),
            accent: "amber",
          },
          {
            label: "Resolve rate",
            value: fmtPct(stats.resolve_rate_pct, 1),
          },
          {
            label: "Mainnet hours",
            value: `${fmtInt(stats.runtime_hours)}h`,
            accent: "amber",
          },
        ]
      : Array.from({ length: 6 }, () => ({ label: "—", value: "—" }));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 10,
        marginBottom: 24,
      }}
    >
      {items.map((m) => (
        <div
          key={m.label}
          style={{
            padding: "12px 14px",
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
              marginBottom: 4,
            }}
          >
            {m.label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color:
                m.accent === "amber"
                  ? "var(--brand-amber)"
                  : m.accent === "critical"
                    ? "var(--status-critical)"
                    : "var(--fg-1)",
            }}
          >
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function TierIntro() {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "var(--brand-amber-tint)",
        border: "1px solid var(--brand-amber-line)",
        borderRadius: 8,
        marginBottom: 14,
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--brand-amber)",
          letterSpacing: "0.08em",
          fontWeight: 600,
        }}
      >
        WHAT IS PRO
      </span>
      <span style={{ fontSize: 13, color: "var(--fg-1)", flex: 1, minWidth: 260 }}>
        Free shows the verdict. Pro shows the work — chain of evidence, multi-wallet
        comparisons, persistent investigations, watchlist alerts, x402 credits.
      </span>
      <Link
        href="mailto:hello@solsentry.app?subject=Pro%20beta%20access"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--brand-amber)",
          textDecoration: "none",
          border: "1px solid var(--brand-amber-line)",
          padding: "6px 12px",
          borderRadius: 4,
          background: "var(--surface)",
        }}
      >
        Get notified →
      </Link>
    </div>
  );
}

function TierPanels() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
        marginBottom: 28,
      }}
    >
      <ProTierCard
        icon="◈"
        title="Playground"
        href="/pro/playground"
        status="soon"
        blurb="Free-form prompt to Sena. Multi-wallet compare, drain-trace, dossier — chained tool calls with credit estimate before execute."
      />
      <ProTierCard
        icon="≡"
        title="Studies"
        href="/pro/studies"
        status="soon"
        blurb="Persistent saved investigations. Re-run on demand, attach notes, share with team."
      />
      <ProTierCard
        icon="⚠"
        title="Watchlist"
        href="/alerts"
        status="live"
        blurb="Pin operators, wallets, tokens. Push + Telegram + email alerts when risk changes or new deploys are detected."
      />
      <ProTierCard
        icon="$"
        title="Credits"
        href="/pro/credits"
        status="live"
        blurb="x402 balance, per-endpoint history, monthly bundles. CSV export for accounting."
      />
    </div>
  );
}

function DataCanvas({
  alerts,
  operators,
}: {
  alerts: Alert[];
  operators: TopOperator[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
    >
      <Section
        title="Recent CRITICAL detections"
        subtitle={
          alerts.length > 0
            ? `${alerts.length} live · click row for full token`
            : "No CRITICAL alerts in window"
        }
        href="/live"
        cta="Live feed →"
        flush
      >
        <AlertsTable alerts={alerts} />
      </Section>
      <Section
        title="Top serial operators"
        subtitle="ranked by confirmed rugs"
        href="/top-operators"
        cta="Leaderboard →"
        flush
      >
        <OperatorsTable operators={operators.slice(0, 10)} />
      </Section>
    </div>
  );
}

function AlertsTable({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) {
    return (
      <EmptyState
        line="No CRITICAL detections in current window."
        hint="Endpoint /v1/alerts is live but no rows match the filter right now."
      />
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        <thead>
          <tr style={{ color: "var(--fg-3)" }}>
            <Th>Age</Th>
            <Th align="left">Token</Th>
            <Th align="left">Operator</Th>
            <Th align="right">Risk</Th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, i) => (
            <tr
              key={`${a.mint}-${i}`}
              style={{
                background: i % 2 === 0 ? "transparent" : "var(--bg-elev-1)",
                borderTop: "1px solid var(--border-soft)",
              }}
            >
              <Td>{a.age_seconds != null ? fmtAge(a.age_seconds) : "—"}</Td>
              <Td align="left">
                <Link
                  href={`/token/${a.mint}`}
                  style={{
                    color: "var(--fg-1)",
                    textDecoration: "none",
                  }}
                >
                  {a.symbol ? (
                    <>
                      <span style={{ fontWeight: 600 }}>{a.symbol}</span>
                      <span style={{ color: "var(--fg-3)" }}>
                        {" "}
                        · {truncate(a.mint, 4, 4)}
                      </span>
                    </>
                  ) : (
                    truncate(a.mint, 6, 4)
                  )}
                </Link>
              </Td>
              <Td align="left">
                {a.dev_wallet ? (
                  <Link
                    href={`/operator/${a.dev_wallet}`}
                    style={{
                      color: a.dev_known ? "var(--status-critical)" : "var(--fg-2)",
                      textDecoration: "none",
                    }}
                  >
                    {truncate(a.dev_wallet, 4, 4)}
                    {a.dev_confirmed_rugs ? (
                      <span style={{ color: "var(--fg-3)" }}>
                        {" "}
                        · {fmtInt(a.dev_confirmed_rugs)}r
                      </span>
                    ) : null}
                  </Link>
                ) : (
                  <span style={{ color: "var(--fg-3)" }}>unknown</span>
                )}
              </Td>
              <Td align="right">
                <span
                  style={{
                    color:
                      a.risk_level === "CRITICAL"
                        ? "var(--status-critical)"
                        : "var(--brand-amber)",
                    fontWeight: 600,
                  }}
                >
                  {a.risk_score}
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OperatorsTable({ operators }: { operators: TopOperator[] }) {
  if (!operators.length) {
    return (
      <EmptyState
        line="Leaderboard temporarily empty."
        hint="Endpoint /v1/operators/top is live; refresh in a few seconds."
      />
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        <thead>
          <tr style={{ color: "var(--fg-3)" }}>
            <Th>#</Th>
            <Th align="left">Wallet</Th>
            <Th align="right">Rugs</Th>
            <Th align="right">Rate</Th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op, i) => (
            <tr
              key={op.wallet}
              style={{
                background: i % 2 === 0 ? "transparent" : "var(--bg-elev-1)",
                borderTop: "1px solid var(--border-soft)",
              }}
            >
              <Td>{op.rank}</Td>
              <Td align="left">
                <Link
                  href={`/operator/${op.wallet}`}
                  style={{
                    color: "var(--fg-1)",
                    textDecoration: "none",
                  }}
                >
                  {truncate(op.wallet, 4, 4)}
                </Link>
              </Td>
              <Td align="right">
                <span style={{ color: "var(--status-critical)" }}>
                  {fmtInt(op.confirmed_rugs)}
                </span>
              </Td>
              <Td align="right">
                <span style={{ color: "var(--brand-amber)", fontWeight: 600 }}>
                  {op.rug_rate_pct.toFixed(0)}%
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({
  title,
  subtitle,
  href,
  cta,
  children,
  flush,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section
      style={{
        padding: 18,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        marginBottom: flush ? 0 : 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
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
              whiteSpace: "nowrap",
            }}
          >
            {cta}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ line, hint }: { line: string; hint: string }) {
  return (
    <div
      style={{
        padding: "24px 12px",
        textAlign: "center",
        color: "var(--fg-3)",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
      }}
    >
      <div style={{ marginBottom: 6 }}>{line}</div>
      <div style={{ fontSize: 11, color: "var(--fg-3)", opacity: 0.7 }}>{hint}</div>
    </div>
  );
}

function FooterStrip() {
  return (
    <div
      style={{
        marginTop: 24,
        padding: "12px 16px",
        background: "var(--bg-elev-1)",
        border: "1px solid var(--border-soft)",
        borderRadius: 6,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--fg-3)",
      }}
    >
      <span>Anonymous session · upgrade to track quota</span>
      <div style={{ display: "flex", gap: 14 }}>
        <Link href="/docs" style={footerLink}>
          Docs
        </Link>
        <Link href="/api" style={footerLink}>
          API
        </Link>
        <Link href="/mcp" style={footerLink}>
          MCP
        </Link>
        <Link href="/architecture" style={footerLink}>
          Architecture
        </Link>
      </div>
    </div>
  );
}

const footerLink = {
  color: "var(--brand-amber)",
  textDecoration: "none",
} as const;

function Th({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "8px 10px",
        fontWeight: 600,
        fontSize: 10,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--fg-3)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <td
      style={{
        textAlign: align,
        padding: "8px 10px",
        color: "var(--fg-2)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </td>
  );
}

function fmtAge(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
