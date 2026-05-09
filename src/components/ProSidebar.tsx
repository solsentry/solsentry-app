"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRO_LINKS: { label: string; href: string; icon: string }[] = [
  { label: "Overview", href: "/pro", icon: "◎" },
  { label: "Live feed", href: "/live", icon: "●" },
  { label: "Alerts", href: "/alerts", icon: "⚠" },
  { label: "Leaderboard", href: "/top-operators", icon: "▲" },
  { label: "Bot clusters", href: "/clusters", icon: "◆" },
  { label: "Tokens", href: "/tokens", icon: "◇" },
  { label: "Wallets", href: "/wallets", icon: "○" },
  { label: "KOL trackers", href: "/kols", icon: "★" },
  { label: "Brain skills", href: "/skills", icon: "✦" },
  { label: "x402 ledger", href: "/x402", icon: "$" },
  { label: "Architecture", href: "/architecture", icon: "⌗" },
  { label: "Docs", href: "/docs", icon: "≡" },
  { label: "Settings", href: "/notifications", icon: "⚙" },
];

export function ProSidebar() {
  const pathname = usePathname();
  return (
    <aside
      style={{
        position: "sticky",
        top: 0,
        alignSelf: "start",
        width: 220,
        flexShrink: 0,
        height: "100vh",
        overflowY: "auto",
        borderRight: "1px solid var(--border)",
        background: "var(--bg-elev-1)",
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "var(--fg-1)",
          textDecoration: "none",
          padding: "0 8px",
        }}
      >
        <img
          src="/logo-3d.webp"
          alt=""
          width={24}
          height={24}
          style={{ display: "block", borderRadius: 4 }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "-0.01em",
          }}
        >
          SolSentry
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--brand-amber)",
            border: "1px solid var(--brand-amber-line)",
            background: "var(--brand-amber-tint)",
            padding: "2px 6px",
            borderRadius: 4,
            letterSpacing: "0.04em",
          }}
        >
          PRO
        </span>
      </Link>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {PRO_LINKS.map((l) => {
          const active =
            pathname === l.href ||
            (l.href !== "/pro" && pathname?.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                fontSize: 13,
                color: active ? "var(--brand-amber)" : "var(--fg-2)",
                background: active ? "var(--brand-amber-tint)" : "transparent",
                border: active
                  ? "1px solid var(--brand-amber-line)"
                  : "1px solid transparent",
                borderRadius: 6,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontWeight: active ? 600 : 400,
                transition: "background 120ms",
              }}
            >
              <span
                style={{
                  width: 16,
                  textAlign: "center",
                  color: active ? "var(--brand-amber)" : "var(--fg-3)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {l.icon}
              </span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "auto",
          padding: "12px 10px",
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--fg-3)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <div style={{ marginBottom: 4 }}>
          api.solsentry.app{" "}
          <span style={{ color: "var(--brand-teal)" }}>● live</span>
        </div>
        <Link
          href="/about"
          style={{ color: "var(--fg-3)", textDecoration: "none" }}
        >
          About →
        </Link>
      </div>
    </aside>
  );
}
