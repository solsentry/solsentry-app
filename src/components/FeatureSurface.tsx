import Link from "next/link";

const FEATURES = [
  {
    title: "Fun mode",
    desc: "Paste a wallet — emoji + plain-English verdict in seconds. Three modes: Easy, Pro, Dev. Consumer-facing.",
    href: "/fun",
    pillar: "EXPLAIN",
    color: "var(--brand-white)",
  },
  {
    title: "Operator lookup",
    desc: "Paste any Solana wallet. Get confirmed rug count, deployment history, risk label, tags.",
    href: "/operator",
    pillar: "PREVENT",
    color: "var(--brand-orange)",
  },
  {
    title: "Token scan",
    desc: "Mint-level analysis. Risk flags, holder distribution, dev wallet, outcome if resolved.",
    href: "/token",
    pillar: "PREVENT",
    color: "var(--brand-orange)",
  },
  {
    title: "Drain tracer",
    desc: "Follow SOL through 10 hops. CEX + bridge + mixer classification on terminal endpoints.",
    href: "/drain",
    pillar: "TRACK",
    color: "var(--brand-teal)",
  },
  {
    title: "Bot clusters",
    desc: "Coordinated wallet groups mapped live. Each with its funding source and rug attribution.",
    href: "/clusters",
    pillar: "TRACK",
    color: "var(--brand-teal)",
  },
  {
    title: "Live alerts",
    desc: "HIGH + CRITICAL risk events, newest first. Same feed that fires on Telegram.",
    href: "/alerts",
    pillar: "PREVENT",
    color: "var(--brand-orange)",
  },
  {
    title: "Resolutions",
    desc: "Every prediction validated against on-chain outcome. The public accuracy ledger.",
    href: "/resolutions",
    pillar: "EXPLAIN",
    color: "var(--brand-white)",
  },
  {
    title: "Leaderboard",
    desc: "Top operators ranked by confirmed rugs. The worst actors on Solana, updated live.",
    href: "/leaderboard",
    pillar: "TRACK",
    color: "var(--brand-teal)",
  },
  {
    title: "Self-check",
    desc: "Connect your wallet and see if you're in the operator database. Read-only, no signing.",
    href: "/me",
    pillar: "PREVENT",
    color: "var(--brand-orange)",
  },
  {
    title: "Watchlist",
    desc: "Add any wallet. SolSentry polls status. Your list is stored locally, not on our server.",
    href: "/watchlist",
    pillar: "TRACK",
    color: "var(--brand-teal)",
  },
  {
    title: "Custom labels",
    desc: "Private wallet tags — like Nansen's Custom Labels, but free and local to your browser.",
    href: "/labels",
    pillar: "EXPLAIN",
    color: "var(--brand-white)",
  },
  {
    title: "Ask SolSentry",
    desc: "Natural-language query over live operator data. AI translates intent into API calls.",
    href: "/ask",
    pillar: "EXPLAIN",
    color: "var(--brand-white)",
  },
  {
    title: "Telegram bot",
    desc: "32 commands. /scan, /drain, /follow, /hunters. The fastest way to use the system.",
    href: "/telegram",
    pillar: "EVOLVE",
    color: "var(--brand-purple)",
  },
];

export function FeatureSurface() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">12 surfaces · one system</span>
          <h2 className="section-title">The full product, on one page.</h2>
          <p className="section-sub">
            Everything SolSentry does today, tapable. Every page below hits the
            same API at{" "}
            <code
              style={{
                color: "var(--brand-orange)",
                fontFamily: "var(--font-mono)",
              }}
            >
              api.solsentry.app
            </code>
            . The bot, the MCP server, and this site are all thin wrappers on
            the same intelligence layer.
          </p>
        </div>
        <div className="grid-auto">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="panel panel-hover"
              style={{
                textDecoration: "none",
                display: "block",
                borderTop: `2px solid ${f.color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    color: "var(--fg-1)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: f.color,
                  }}
                >
                  {f.pillar}
                </span>
              </div>
              <p
                style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.55 }}
              >
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
