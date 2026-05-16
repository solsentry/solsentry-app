import Link from "next/link";

export function ProTierCard({
  title,
  blurb,
  href,
  status,
  icon,
}: {
  title: string;
  blurb: string;
  href: string;
  status: "live" | "soon";
  icon: string;
}) {
  const isSoon = status === "soon";
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        textDecoration: "none",
        color: "var(--fg-1)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            color: "var(--brand-amber)",
            width: 22,
            textAlign: "center",
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            flex: 1,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 3,
            letterSpacing: "0.06em",
            fontWeight: 600,
            color: isSoon ? "var(--fg-3)" : "var(--brand-amber)",
            background: isSoon
              ? "var(--bg-elev-1)"
              : "var(--brand-amber-tint)",
            border: isSoon
              ? "1px solid var(--border-soft)"
              : "1px solid var(--brand-amber-line)",
          }}
        >
          {isSoon ? "SOON" : "LIVE"}
        </span>
      </div>
      <p
        style={{
          fontSize: 12,
          color: "var(--fg-2)",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {blurb}
      </p>
    </Link>
  );
}
