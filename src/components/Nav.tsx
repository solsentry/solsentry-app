import Link from "next/link";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Alerts", href: "/alerts" },
  { label: "Top operators", href: "/top-operators" },
  { label: "Clusters", href: "/clusters" },
  { label: "MCP", href: "/mcp" },
  { label: "Telegram", href: "/telegram" },
];

export function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <img
            src="/logo-3d.webp"
            alt="SolSentry"
            width={28}
            height={28}
            style={{ display: "block", borderRadius: 4 }}
          />
          SolSentry
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <a
            href="https://api.solsentry.app/v1/stats"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
          >
            Live API ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
