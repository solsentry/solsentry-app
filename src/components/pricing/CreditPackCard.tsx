// CreditPackCard — top-up pack mini card for /pricing.
// Shows USD amount, credits, and optional bonus badge.

export interface CreditPackCardProps {
  price: string;
  credits: string;
  bonusPct?: number;
}

export function CreditPackCard({
  price,
  credits,
  bonusPct,
}: CreditPackCardProps) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--bg-elev-1)",
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
      }}
    >
      {bonusPct ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "var(--brand-amber-tint)",
            color: "var(--brand-amber-400)",
            border: "1px solid var(--brand-amber-line)",
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          +{bonusPct}% bonus
        </div>
      ) : null}

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--fg-1)",
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
        }}
      >
        {price}
      </div>
      <div style={{ fontSize: 14, color: "var(--fg-2)" }}>
        <span
          style={{
            fontFamily: "var(--font-mono, ui-monospace, monospace)",
            color: "var(--fg-1)",
          }}
        >
          {credits}
        </span>{" "}
        credits
      </div>
    </div>
  );
}
