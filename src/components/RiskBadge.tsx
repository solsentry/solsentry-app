interface Props {
  level?: string | null;
  size?: "sm" | "md" | "lg";
}

const COLORS: Record<
  string,
  { bg: string; border: string; fg: string; label: string }
> = {
  CRITICAL: {
    bg: "rgba(255,68,68,0.12)",
    border: "var(--status-critical)",
    fg: "var(--status-critical)",
    label: "CRITICAL",
  },
  HIGH: {
    bg: "rgba(216,149,48,0.12)",
    border: "var(--status-warning)",
    fg: "var(--status-warning)",
    label: "HIGH",
  },
  MEDIUM: {
    bg: "rgba(193,125,14,0.12)",
    border: "var(--brand-amber-line)",
    fg: "var(--brand-amber)",
    label: "MEDIUM",
  },
  LOW: {
    bg: "rgba(42,122,122,0.12)",
    border: "var(--brand-teal)",
    fg: "var(--brand-teal)",
    label: "LOW",
  },
  CLEAN: {
    bg: "rgba(42,122,122,0.10)",
    border: "var(--brand-teal)",
    fg: "var(--brand-teal)",
    label: "CLEAN",
  },
  SAFE: {
    bg: "rgba(42,122,122,0.10)",
    border: "var(--brand-teal)",
    fg: "var(--brand-teal)",
    label: "SAFE",
  },
  UNKNOWN: {
    bg: "var(--surface-2)",
    border: "var(--border)",
    fg: "var(--fg-3)",
    label: "UNKNOWN",
  },
};

export function RiskBadge({ level, size = "md" }: Props) {
  const key = (level || "UNKNOWN").toUpperCase();
  const c = COLORS[key] || COLORS.UNKNOWN;

  const sizes = {
    sm: { padding: "3px 10px", font: 11 },
    md: { padding: "5px 14px", font: 12 },
    lg: { padding: "8px 18px", font: 14 },
  } as const;
  const s = sizes[size];

  return (
    <span
      style={{
        display: "inline-block",
        padding: s.padding,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 4,
        color: c.fg,
        fontFamily: "var(--font-mono)",
        fontSize: s.font,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {c.label}
    </span>
  );
}
