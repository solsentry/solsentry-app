// PricingCard — single tier card for /pricing.
// Linear-app inspired: clean borders, optional amber accent for highlighted tier.

import Link from "next/link";

export interface PricingFeature {
  label: string;
  included: boolean;
}

export interface PricingCardProps {
  tier: string;
  price: string;
  priceSuffix?: string;
  description: string;
  features: PricingFeature[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

export function PricingCard({
  tier,
  price,
  priceSuffix,
  description,
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
  badge,
}: PricingCardProps) {
  const borderStyle = highlighted ? "1px solid var(--brand-amber)" : "1px solid var(--border)";
  const bgStyle = highlighted
    ? "linear-gradient(180deg, var(--brand-amber-tint), transparent 60%), var(--bg-elev-1)"
    : "var(--bg-elev-1)";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        border: borderStyle,
        background: bgStyle,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minHeight: 520,
        boxShadow: highlighted
          ? "0 0 0 1px var(--brand-amber-line), 0 8px 32px rgba(193,125,14,0.08)"
          : "none",
      }}
    >
      {badge && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 24,
            background: "var(--brand-amber)",
            color: "var(--fg-on-brand)",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          {badge}
        </div>
      )}

      <div>
        <div
          style={{
            fontSize: 13,
            color: "var(--fg-3)",
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 8,
          }}
        >
          {tier}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "var(--fg-1)",
              fontFamily: "var(--font-mono, ui-monospace, monospace)",
            }}
          >
            {price}
          </span>
          {priceSuffix && <span style={{ fontSize: 14, color: "var(--fg-3)" }}>{priceSuffix}</span>}
        </div>
        <p
          style={{
            marginTop: 10,
            fontSize: 14,
            color: "var(--fg-2)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        {features.map((f, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 14,
              color: f.included ? "var(--fg-1)" : "var(--fg-4)",
              lineHeight: 1.5,
            }}
          >
            <span
              aria-hidden
              style={{
                color: f.included ? "var(--brand-amber)" : "var(--fg-4)",
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {f.included ? "✓" : "—"}
            </span>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        style={{
          display: "block",
          textAlign: "center",
          padding: "12px 18px",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          background: highlighted ? "var(--brand-amber)" : "transparent",
          color: highlighted ? "var(--fg-on-brand)" : "var(--fg-1)",
          border: highlighted ? "1px solid var(--brand-amber)" : "1px solid var(--border-strong)",
          transition: "background 0.15s",
        }}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
