import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { fetchStats, fmtInt, fmtPct } from "@/lib/api";
import Link from "next/link";
import { ProShell } from "@/components/ProShell";

export const revalidate = 60;

export const metadata = {
  title: "Wallet profiles — search and overview",
  description:
    "SolSentry tracks wallet behaviour across Solana. Look up any wallet by address, or browse the top operators leaderboard.",
};

export default async function WalletsPage() {
  const stats = await fetchStats();

  return (
    <ProShell>
      <main>
        <PageHeader
          eyebrow="Wallet profiles"
          title={
            <>
              Search any{" "}
              <span style={{ color: "var(--brand-amber)" }}>Solana wallet</span>
            </>
          }
          sub={
            stats
              ? `${fmtInt(stats.wallet_profiles_tracked)} wallets profiled. ${fmtInt(stats.wallets_with_confirmed_rugs)} flagged as rug-associated. ${fmtInt(stats.serial_ruggers)} serial deployers identified.`
              : "Resolving network counters from the live API."
          }
        />

        <Section eyebrow="Direct lookup" title="Paste a wallet address">
          <p
            style={{
              color: "var(--fg-2)",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 24,
              maxWidth: 720,
            }}
          >
            Wallet profiles live at <code>/operator/[wallet]</code>. Paste any
            Solana address into the URL to fetch its operator profile, deploy
            timeline, and connected wallets. Or use the live scan on the
            homepage.
          </p>

          <div className="grid-2">
            <Link
              href="/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1"
              className="panel panel-hover"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div
                className="label-tag"
                style={{ color: "var(--status-critical)", marginBottom: 8 }}
              >
                Sample · CRITICAL
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 8,
                  color: "var(--fg-1)",
                }}
              >
                4kxscute…5pH1
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                The infamous serial deployer. 1,059 confirmed rugs across 1,060
                tokens. 99.9% rug rate. Live since March 2026.
              </p>
            </Link>

            <Link
              href="/top-operators"
              className="panel panel-hover"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div
                className="label-tag"
                style={{ color: "var(--brand-amber)", marginBottom: 8 }}
              >
                Browse leaderboard
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 8,
                  color: "var(--fg-1)",
                }}
              >
                Top operators →
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                The 50 highest-risk operators by confirmed rug count. Each row
                links to the full operator profile.
              </p>
            </Link>
          </div>
        </Section>

        {stats && (
          <Section eyebrow="Network counters" title="Wallet stats">
            <div className="stats-grid">
              <Card label="Wallets profiled" value={fmtInt(stats.wallet_profiles_tracked)} />
              <Card
                label="Operators tracked"
                value={fmtInt(stats.total_operators)}
              />
              <Card
                label="Serial ruggers"
                value={fmtInt(stats.serial_ruggers)}
                accent="critical"
              />
              <Card
                label="Wallets with rugs"
                value={fmtInt(stats.wallets_with_confirmed_rugs)}
              />
              <Card label="Bot clusters" value={fmtInt(stats.bot_clusters)} />
              <Card
                label="Resolve rate"
                value={fmtPct(stats.resolve_rate_pct, 1)}
              />
            </div>
          </Section>
        )}

        <Section eyebrow="Other surfaces" title="Where else to look">
          <div className="grid-3">
            <Link
              href="/clusters"
              className="panel panel-hover"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div className="label-tag" style={{ color: "var(--brand-teal)", marginBottom: 8 }}>
                Bot clusters
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                Coordinated wallet groups identified by funding source and
                deployment fingerprint.
              </p>
            </Link>
            <Link
              href="/alerts"
              className="panel panel-hover"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div className="label-tag" style={{ color: "var(--status-warning)", marginBottom: 8 }}>
                Live alerts
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                Stream of HIGH and CRITICAL events as the scanner emits them.
                Refreshed every 30s.
              </p>
            </Link>
            <Link
              href="/dashboard"
              className="panel panel-hover"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div className="label-tag" style={{ color: "var(--brand-amber)", marginBottom: 8 }}>
                Dashboard
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                System health, runtime, accuracy, invariants. The control room
                view.
              </p>
            </Link>
          </div>
        </Section>
      </main>
    </ProShell>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "critical";
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div
        className="stat-value"
        style={{
          color: accent === "critical" ? "var(--status-critical)" : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
