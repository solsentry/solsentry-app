import type { NetworkStats } from "@/lib/api";

function fmt(n: number | undefined, digits = 0): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: digits });
  return n.toFixed(digits);
}

export function StatsGrid({ stats }: { stats: NetworkStats | null }) {
  if (!stats) {
    return (
      <section className="stats">
        <div className="container">
          <div className="stats-header">
            <div>
              <span className="section-kicker">LIVE · api.solsentry.app</span>
              <h2 className="section-title">Network stats unavailable</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stats">
      <div className="container">
        <div className="stats-header">
          <div>
            <span className="section-kicker">LIVE · api.solsentry.app</span>
            <h2 className="section-title">Mainnet monitoring in real time</h2>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>
            Updated every 30 seconds · {fmt(stats.runtime_hours)}h uptime
          </span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Tokens scanned</div>
            <div className="stat-value">{fmt(stats.total_predictions)}</div>
            <div className="stat-meta">{fmt(stats.resolve_rate_pct, 1)}% outcome resolved</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Accuracy</div>
            <div className="stat-value">
              {fmt(stats.accuracy_pct, 1)}<span className="unit">%</span>
            </div>
            <div className="stat-meta">Zero false positives in CRITICAL</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Operators profiled</div>
            <div className="stat-value">{fmt(stats.total_operators)}</div>
            <div className="stat-meta">{fmt(stats.serial_ruggers)} serial ruggers</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Bot clusters</div>
            <div className="stat-value">{fmt(stats.bot_clusters)}</div>
            <div className="stat-meta">Coordinated bundle detection</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Confirmed rugs</div>
            <div className="stat-value" style={{ color: "var(--status-critical)" }}>
              {fmt(stats.confirmed_rugs)}
            </div>
            <div className="stat-meta">{fmt(stats.high_risk_alerts)} HIGH/CRITICAL alerts issued</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Wallets profiled</div>
            <div className="stat-value">{fmt(stats.wallet_profiles_tracked)}</div>
            <div className="stat-meta">{fmt(stats.wallets_with_confirmed_rugs)} flagged as rug-associated</div>
          </div>
        </div>
      </div>
    </section>
  );
}
