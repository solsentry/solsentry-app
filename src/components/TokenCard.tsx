import type { Token } from "@/lib/api";

interface Props {
  mint: string;
  token: Token | null;
}

const LEVEL_COLOR: Record<string, string> = {
  CRITICAL: "var(--status-critical)",
  HIGH: "var(--status-warning)",
  MEDIUM: "var(--brand-orange)",
  LOW: "var(--brand-teal)",
  CLEAN: "var(--brand-teal)",
  UNKNOWN: "var(--fg-3)",
};

const OUTCOME_LABEL: Record<string, string> = {
  confirmed_scam: "Confirmed rug",
  confirmed_safe: "Confirmed safe",
  pending: "Pending outcome",
  volume_dead: "Volume-dead",
};

export function TokenCard({ mint, token }: Props) {
  if (!token) {
    return (
      <div className="risk-card" style={{ borderColor: "var(--border)" }}>
        <div className="risk-banner" style={{ background: "var(--surface-2)" }}>
          <div>
            <div className="label" style={{ color: "var(--fg-3)" }}>Risk Level</div>
            <div className="risk-level" style={{ color: "var(--fg-3)" }}>UNAVAILABLE</div>
          </div>
          <div className="risk-meta">API request failed</div>
        </div>
        <div className="risk-body">
          <p style={{ color: "var(--fg-2)" }}>
            Could not load token profile. The API may be temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  const level = (token.risk_level || "UNKNOWN").toUpperCase();
  const color = LEVEL_COLOR[level] || LEVEL_COLOR.UNKNOWN;
  const outcomeLabel = OUTCOME_LABEL[token.final_outcome ?? ""] ?? "—";

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
          {outcomeLabel}
        </div>
      </div>

      {token.known ? (
        <div className="risk-grid">
          <div className="risk-cell">
            <div className="label">Risk score</div>
            <div className="metric" style={{ color }}>
              {token.risk_score ?? "—"}<span style={{ color: "var(--fg-3)", fontSize: 16, marginLeft: 4 }}>/100</span>
            </div>
          </div>
          <div className="risk-cell">
            <div className="label">Symbol</div>
            <div className="metric">{token.symbol ?? "—"}</div>
          </div>
          <div className="risk-cell">
            <div className="label">Bundle</div>
            <div className="metric" style={{ color: token.is_bundle ? "var(--status-critical)" : "var(--brand-teal)" }}>
              {token.is_bundle ? "YES" : "NO"}
            </div>
          </div>
        </div>
      ) : (
        <div className="risk-body">
          <p style={{ color: "var(--fg-2)" }}>
            This token is not in SolSentry&rsquo;s tracked database. It has not yet
            been observed by the scanner.
          </p>
          <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 12 }}>
            Absence is <strong>not</strong> proof of safety — the scanner may not
            have seen this mint yet.
          </p>
        </div>
      )}

      {token.flags && token.flags.length > 0 && (
        <div className="risk-tags">
          {token.flags.map((f, i) => (
            <span key={i} className="risk-tag">{f}</span>
          ))}
        </div>
      )}

      <div className="risk-footer">
        <code style={{ color: "var(--fg-3)", fontSize: 12 }}>
          GET /v1/token/<span style={{ color: "var(--brand-orange)" }}>{mint}</span>
        </code>
      </div>
    </div>
  );
}
