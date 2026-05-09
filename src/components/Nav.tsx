import Link from "next/link";

const NAV_LINKS = [
  { label: "Fun mode", href: "/fun" },
  { label: "MCP", href: "/mcp" },
  { label: "Telegram", href: "/telegram" },
  { label: "Docs", href: "/docs" },
];

export function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <img
            src="/logo-shield.svg"
            alt=""
            width={22}
            height={22}
            style={{ display: "block" }}
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
