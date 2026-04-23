import Link from "next/link";
import { WalletConnectButton } from "./WalletConnectButton";

const PRODUCT_LINKS = [
  { label: "Fun mode", sub: "Is this wallet safe?", href: "/fun" },
  { label: "Operator lookup", sub: "Paste a wallet, get the history", href: "/operator" },
  { label: "Token lookup", sub: "Scan any mint", href: "/token" },
  { label: "Drain tracer", sub: "Follow SOL 10 hops", href: "/drain" },
  { label: "Bot clusters", sub: "Coordinated wallet groups", href: "/clusters" },
  { label: "Self-check", sub: "Am I flagged?", href: "/me" },
];

const DATA_LINKS = [
  { label: "Alerts feed", sub: "HIGH + CRITICAL live", href: "/alerts" },
  { label: "Resolutions", sub: "Outcome-resolved predictions", href: "/resolutions" },
  { label: "Leaderboard", sub: "Top operators by confirmed rugs", href: "/leaderboard" },
];

const DEV_LINKS = [
  { label: "REST API", sub: "11 endpoints, no key", href: "/api" },
  { label: "MCP server", sub: "For Claude / Cursor / Windsurf", href: "/mcp" },
  { label: "Telegram bot", sub: "32 commands", href: "/telegram" },
  { label: "Ask SolSentry", sub: "Natural language query", href: "/ask" },
];

const WORKSPACE_LINKS = [
  { label: "Watchlist", sub: "Track wallets locally", href: "/watchlist" },
  { label: "Labels", sub: "Private wallet tags", href: "/labels" },
];

const LEARN_LINKS = [
  { label: "Docs", sub: "Integration guide", href: "/docs" },
  { label: "Glossary", sub: "Flags + pillars", href: "/glossary" },
  { label: "Compare", sub: "vs Range, Nansen, Arkham", href: "/compare" },
  { label: "Roadmap", sub: "What ships next", href: "/roadmap" },
];

function Dropdown({ title, links }: { title: string; links: { label: string; sub: string; href: string }[] }) {
  return (
    <span className="nav-dd">
      <span className="nav-dd-trigger">{title}</span>
      <div className="nav-dd-panel">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="nav-dd-item">
            {l.label}
            <span className="nav-dd-item-sub">{l.sub}</span>
          </Link>
        ))}
      </div>
    </span>
  );
}

export function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <img src="/logo-shield.svg" alt="" width={22} height={22} style={{ display: "block" }} />
          SolSentry
        </Link>
        <div className="nav-links">
          <Dropdown title="Product" links={PRODUCT_LINKS} />
          <Dropdown title="Data" links={DATA_LINKS} />
          <Dropdown title="Developers" links={DEV_LINKS} />
          <Dropdown title="Workspace" links={WORKSPACE_LINKS} />
          <Dropdown title="Learn" links={LEARN_LINKS} />
          <Link href="/partners">Partners</Link>
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
}
