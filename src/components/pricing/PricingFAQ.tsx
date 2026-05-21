// PricingFAQ — collapsible Q&A list for /pricing.
// Uses native <details> for zero-JS accessibility.

export interface FAQItem {
  q: string;
  a: string;
}

export interface PricingFAQProps {
  items: FAQItem[];
}

export function PricingFAQ({ items }: PricingFAQProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, i) => (
        <details
          key={i}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "var(--bg-elev-1)",
            padding: "14px 18px",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--fg-1)",
              listStyle: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>{item.q}</span>
            <span
              aria-hidden
              style={{ color: "var(--fg-3)", fontSize: 18, lineHeight: 1 }}
            >
              +
            </span>
          </summary>
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "var(--fg-2)",
              lineHeight: 1.6,
            }}
          >
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
