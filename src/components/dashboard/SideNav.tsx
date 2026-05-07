"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type PillarKey = "prevent" | "track" | "explain" | "evolve";

interface PillarItem {
  key: PillarKey;
  label: string;
  color: string;
  href: string;
  iconPath: string;
  matches: string[];
}

const PILLARS: PillarItem[] = [
  {
    key: "prevent",
    label: "PREVENT",
    color: "var(--brand-orange)",
    href: "/alerts",
    matches: ["/alerts", "/dashboard"],
    iconPath: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  },
  {
    key: "track",
    label: "TRACK",
    color: "var(--brand-teal)",
    href: "/drain",
    matches: ["/drain", "/operator", "/watchlist"],
    iconPath: "M3 7h13M3 7l4-4M3 7l4 4M21 17H8M21 17l-4-4M21 17l-4 4",
  },
  {
    key: "explain",
    label: "EXPLAIN",
    color: "#ffffff",
    href: "/ask",
    matches: ["/ask", "/docs", "/glossary"],
    iconPath: "M4 17l6-6-6-6M12 19h8",
  },
  {
    key: "evolve",
    label: "EVOLVE",
    color: "var(--brand-purple)",
    href: "/resolutions",
    matches: ["/resolutions", "/leaderboard", "/clusters"],
    iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
];

interface SecondaryGroup {
  label: string;
  links: { label: string; href: string }[];
}

const SECONDARY_GROUPS: SecondaryGroup[] = [
  {
    label: "Inspect",
    links: [
      { label: "Operator", href: "/operator" },
      { label: "Token", href: "/token" },
      { label: "Self-check", href: "/me" },
    ],
  },
  {
    label: "Investigate",
    links: [
      { label: "Clusters", href: "/clusters" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    label: "Personal",
    links: [
      { label: "Watchlist", href: "/watchlist" },
      { label: "Labels", href: "/labels" },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Glossary", href: "/glossary" },
      { label: "Compare", href: "/compare" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
];

interface SideNavProps {
  /** Active hunters count for the footer badge. */
  hunterCount?: number;
  /** Show the pulsing "Mainnet" indicator. Default true. */
  online?: boolean;
}

export function SideNav({ hunterCount, online = true }: SideNavProps) {
  const pathname = usePathname() || "/";

  return (
    <aside
      className="solsentry-sidenav"
      aria-label="SolSentry Pro navigation"
      style={{
        width: 220,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minHeight: "calc(100vh - 56px)",
      }}
    >
      <div>
        <div style={groupHeaderStyle}>Pillars</div>
        {PILLARS.map((p) => {
          const active = p.matches.some((m) => pathname.startsWith(m));
          return (
            <Link
              key={p.key}
              href={p.href}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 4,
                border: "none",
                background: active ? "var(--surface-3)" : "transparent",
                borderLeft: active ? `2px solid ${p.color}` : "2px solid transparent",
                color: active ? "var(--fg-1)" : "var(--fg-2)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textAlign: "left",
                marginBottom: 2,
                textDecoration: "none",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={p.color}
                strokeWidth="2"
                aria-hidden
              >
                <path d={p.iconPath} />
              </svg>
              {p.label}
            </Link>
          );
        })}
      </div>

      {SECONDARY_GROUPS.map((g) => (
        <div key={g.label}>
          <div style={groupHeaderStyle}>{g.label}</div>
          {g.links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  width: "100%",
                  display: "block",
                  textAlign: "left",
                  padding: "7px 10px",
                  border: "none",
                  background: active ? "var(--surface-2)" : "transparent",
                  color: active ? "var(--fg-1)" : "var(--fg-2)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  borderRadius: 4,
                  textDecoration: "none",
                  marginBottom: 1,
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      ))}

      {/* Live status footer */}
      <div
        style={{
          marginTop: "auto",
          padding: 12,
          border: "1px solid var(--border)",
          borderRadius: 4,
          background: "var(--bg)",
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
            marginBottom: 6,
          }}
        >
          Live
        </div>
        <div style={liveRowStyle}>
          <span>Mainnet</span>
          <span
            style={{
              color: online ? "var(--brand-teal)" : "var(--fg-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: online ? "var(--brand-teal)" : "var(--fg-3)",
                animation: online ? "sol-pulse 1.6s ease-in-out infinite" : "none",
              }}
              aria-hidden
            />
            {online ? "online" : "offline"}
          </span>
        </div>
        {hunterCount !== undefined && (
          <div style={liveRowStyle}>
            <span>Hunters</span>
            <span style={{ color: "var(--brand-teal)" }}>{hunterCount} active</span>
          </div>
        )}
      </div>
    </aside>
  );
}

const groupHeaderStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--fg-4)",
  padding: "0 8px 8px",
};

const liveRowStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "var(--fg-2)",
  display: "flex",
  justifyContent: "space-between",
  marginTop: 4,
};
