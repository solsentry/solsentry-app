interface Metric {
  label: string;
  value: string;
  suffix?: string;
  tone?: "default" | "teal" | "critical";
}

const TONE_COLORS: Record<NonNullable<Metric["tone"]>, string> = {
  default: "var(--fg-1)",
  teal: "var(--brand-teal)",
  critical: "var(--status-critical)",
};

interface MetricStripProps {
  metrics: Metric[];
}

export function MetricStrip({ metrics }: MetricStripProps) {
  if (metrics.length === 0) return null;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
        gap: 12,
      }}
    >
      {metrics.map((m) => {
        const color = TONE_COLORS[m.tone ?? "default"];
        return (
          <div
            key={m.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: 18,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--fg-3)",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color,
                fontVariantNumeric: "tabular-nums",
                marginTop: 8,
              }}
            >
              {m.value}
              {m.suffix && (
                <span style={{ color: "var(--brand-orange)" }}>{m.suffix}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
