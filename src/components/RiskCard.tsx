import type { Operator } from "@/lib/api";

interface Props {
  wallet: string;
  operator: Operator | null;
}

const LEVEL_COLOR: Record<string, string> = {
  CRITICAL: "var(--status-critical)",
  HIGH: "var(--status-warning)",
  MEDIUM: "var(--brand-orange)",
  LOW: "var(--brand-teal)",
  CLEAN: "var(--brand-teal)",
  UNKNOWN: "var(--fg-3)",
};

const LEVEL_LABEL: Record<string, string> = {
  CRITICAL: "Confirmed serial rugger",
  HIGH: "Multiple rugs on record",
  MEDIUM: "Some rugs on record",
  LOW: "1 rug on record",
  CLEAN: "Tracked, no confirmed rugs",
  UNKNOWN: "Not in database",
};

function fmt(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("en-US");
}

export function RiskCard({ wallet, operator }: Props) {
  if (!operator) {
    return (
      <div className="risk-card" style={{ borderColor: "var(--border)" }}>
        <div className="risk-banner" style={{ background: "var(--surface-2)" }}>
          <div>
            <div className="label" style={{ color: "var(--fg-3)" }}>Risk Level</div>
            <div className="risk-level" style={{ color: "var(--fg-3)" }}>
              UNAVAILABLE
            </div>
          </div>
          <div className="risk-meta">API request failed</div>
        </div>
        <div className="risk-body">
          <p style={{ color: "var(--fg-2)" }}>
            Could not load operator profile. The API at{" "}
            <code style={{ color: "var(--brand-orange)" }}>api.solsentry.app</code>{" "}
            may be temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  const level = (operator.risk_level || "UNKNOWN").toUpperCase();
  const color = LEVEL_COLOR[level] || LEVEL_COLOR.UNKNOWN;
  const label = LEVEL_LABEL[level] || LEVEL_LABEL.UNKNOWN;
  const known = operator.known === true;

  return (
    <div
      className="risk-card"
      style={{
        borderColor: level === "CRITICAL" ? "var(--status-critical)" : "var(--border)",
        boxShadow: level === "CRITICAL" ? "var(--shadow-glow-critical)" : undefined,
      }}
    >
      <div
        className="risk-banner"
        style={{
          background:
            level === "CRITICAL"
              ? "var(--status-critical-tint)"
              : level === "HIGH"
                ? "var(--status-warning-tint)"
                : "var(--brand-orange-tint)",
          borderBottomColor: color,
        }}
      >
        <div>
          <div className="label" style={{ color }}>Risk Level</div>
          <div className="risk-level" style={{ color }}>{level}</div>
        </div>
        <div className="risk-meta" style={{ color: "var(--fg-2)" }}>
          {label}
        </div>
      </div>

      {known ? (
        <div className="risk-grid">
          <div className="risk-cell">
            <div className="label">Confirmed Rugs</div>
            <div className="metric" style={{ color: "var(--status-critical)" }}>
              {fmt(operator.confirmed_rugs)}
            </div>
          </div>
          <div className="risk-cell">
            <div className="label">Total Tokens</div>
            <div className="metric">{fmt(operator.total_tokens)}</div>
          </div>
          <div className="risk-cell">
            <div className="label">Rug Rate</div>
            <div className="metric" style={{ color: "var(--brand-orange)" }}>
              {operator.rug_rate_pct != null ? `${operator.rug_rate_pct.toFixed(1)}%` : "—"}
            </div>
          </div>
        </div>
      ) : (
        <div className="risk-body">
          <p style={{ color: "var(--fg-2)" }}>
            This wallet is not in SolSentry&rsquo;s tracked operator database. It has not
            been observed deploying tokens during the monitored period.
          </p>
          <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 12 }}>
            Absence from the database is <strong>not</strong> proof of safety — it just
            means we have no on-chain history for it as a deployer.
          </p>
        </div>
      )}

      {operator.tags && operator.tags.length > 0 && (
        <div className="risk-tags">
          {operator.tags.map((tag) => (
            <span key={tag} className="risk-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="risk-footer">
        <code style={{ color: "var(--fg-3)", fontSize: 12 }}>
          GET /v1/operator/<span style={{ color: "var(--brand-orange)" }}>{wallet}</span>
        </code>
      </div>
    </div>
  );
}
