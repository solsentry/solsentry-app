const ROWS: { feature: string; free: string; pro: string; sentinel: string }[] = [
  { feature: "Public scans · verdicts", free: "Unlimited", pro: "Unlimited", sentinel: "Unlimited" },
  { feature: "Share URLs · public pages", free: "Yes", pro: "Yes", sentinel: "Yes" },
  { feature: "Telegram bot · MCP server", free: "Yes", pro: "Yes", sentinel: "Yes" },
  { feature: "AI playground (Sena)", free: "—", pro: "Yes", sentinel: "Yes" },
  { feature: "Saved investigation studies", free: "—", pro: "Unlimited", sentinel: "Unlimited" },
  { feature: "Watchlist + push alerts", free: "—", pro: "Yes", sentinel: "Yes" },
  { feature: "CSV / JSON exports", free: "—", pro: "Yes", sentinel: "Yes" },
  { feature: "x402 metered credits", free: "Pay-per-call", pro: "Bundled monthly", sentinel: "Volume rate" },
  { feature: "Real-time webhook feed", free: "—", pro: "—", sentinel: "Yes" },
  { feature: "Priority support · SLA", free: "—", pro: "Email", sentinel: "Dedicated" },
];

export function TierMatrix() {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--surface)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
        }}
      >
        <thead>
          <tr style={{ background: "var(--bg-elev-1)" }}>
            <Th align="left">Feature</Th>
            <Th>Free</Th>
            <Th highlight>Pro · Em breve</Th>
            <Th>Sentinel · Contact</Th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr
              key={r.feature}
              style={{
                background: i % 2 === 0 ? "transparent" : "var(--bg-elev-1)",
                borderTop: "1px solid var(--border-soft)",
              }}
            >
              <Td align="left" strong>{r.feature}</Td>
              <Td>{r.free}</Td>
              <Td highlight>{r.pro}</Td>
              <Td>{r.sentinel}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  align = "center",
  highlight,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  highlight?: boolean;
}) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "10px 12px",
        fontWeight: 600,
        fontSize: 10,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: highlight ? "var(--brand-amber)" : "var(--fg-3)",
        background: highlight ? "var(--brand-amber-tint)" : "transparent",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "center",
  strong,
  highlight,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  strong?: boolean;
  highlight?: boolean;
}) {
  return (
    <td
      style={{
        textAlign: align,
        padding: "9px 12px",
        color: strong ? "var(--fg-1)" : "var(--fg-2)",
        fontWeight: strong ? 600 : 400,
        background: highlight ? "var(--brand-amber-tint)" : "transparent",
        fontSize: 12,
      }}
    >
      {children}
    </td>
  );
}
