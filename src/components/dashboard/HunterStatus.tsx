interface HunterStatusProps {
  count?: number;
  active?: boolean;
}

export function HunterStatus({ count = 0, active = true }: HunterStatusProps) {
  const c = active ? "var(--brand-teal)" : "var(--fg-3)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-body)",
        fontSize: 12,
      }}
      aria-label={`${count} hunters ${active ? "active" : "inactive"}`}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: c,
          boxShadow: active ? `0 0 0 4px ${c}22` : "none",
          animation: active ? "sol-pulse 1.6s ease-in-out infinite" : "none",
        }}
        aria-hidden
      />
      <span
        style={{
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          fontSize: 11,
        }}
      >
        Hunters
      </span>
      <span style={{ fontFamily: "var(--font-mono)", color: c, fontWeight: 500 }}>
        {count} active
      </span>
    </div>
  );
}
