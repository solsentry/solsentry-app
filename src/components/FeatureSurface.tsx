import Link from "next/link";

type Feature = {
  title: string;
  desc: string;
  href: string;
  pillar: string;
  color: string;
  external?: boolean;
};

const FEATURES: Feature[] = [
  {
    title: "Fun mode",
    desc: "Paste a wallet — emoji + plain-English verdict in seconds. Three modes: Easy, Pro, Dev. Consumer-facing.",
    href: "/fun",
    pillar: "EXPLAIN",
    color: "var(--brand-cream)",
  },
  {
    title: "Telegram bot",
    desc: "32 commands. /scan, /drain, /follow, /hunters. The fastest way to use the system.",
    href: "/telegram",
    pillar: "EVOLVE",
    color: "var(--brand-purple)",
  },
  {
    title: "MCP server",
    desc: "npx @solsentry/mcp — zero-install threat intel for Claude, Cursor, Windsurf, custom agents.",
    href: "/mcp",
    pillar: "EVOLVE",
    color: "var(--brand-purple)",
  },
  {
    title: "Docs",
    desc: "Endpoints, examples, integration patterns. Everything you need to wire SolSentry into your stack.",
    href: "/docs",
    pillar: "EXPLAIN",
    color: "var(--brand-cream)",
  },
  {
    title: "Live stats",
    desc: "Total predictions, accuracy, runtime — JSON live, no auth. Updated continuously.",
    href: "https://api.solsentry.app/v1/stats",
    pillar: "EXPLAIN",
    color: "var(--brand-cream)",
    external: true,
  },
  {
    title: "Operator lookup",
    desc: "Live JSON — paste any wallet into the URL, get risk + rug count + tags. Try the 4kxscute case.",
    href: "https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
    pillar: "PREVENT",
    color: "var(--brand-amber)",
    external: true,
  },
  {
    title: "Drain trace",
    desc: "Follow SOL through 10 hops. CEX, bridge, mixer classification on terminal endpoints — JSON.",
    href: "https://api.solsentry.app/v1/drain-trace/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
    pillar: "TRACK",
    color: "var(--brand-teal)",
    external: true,
  },
  {
    title: "Top operators",
    desc: "Ranked CRITICAL operators by confirmed rugs. The worst actors on Solana, updated live.",
    href: "https://api.solsentry.app/v1/top-operators",
    pillar: "TRACK",
    color: "var(--brand-teal)",
    external: true,
  },
];

export function FeatureSurface() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">8 surfaces · one system</span>
          <h2 className="section-title">The full product, on one page.</h2>
          <p className="section-sub">
            Every surface below hits the same API at{" "}
            <code
              style={{
                color: "var(--brand-amber)",
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
          {FEATURES.map((f) => {
            const inner = (
              <>
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
                    {f.external && (
                      <span
                        style={{
                          color: "var(--fg-3)",
                          fontWeight: 400,
                          fontSize: 13,
                          marginLeft: 6,
                        }}
                      >
                        ↗
                      </span>
                    )}
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
                  style={{
                    color: "var(--fg-2)",
                    fontSize: 13,
                    lineHeight: 1.55,
                  }}
                >
                  {f.desc}
                </p>
              </>
            );

            const className = "panel panel-hover";
            const style = {
              textDecoration: "none",
              display: "block",
              borderTop: `2px solid ${f.color}`,
            } as const;

            return f.external ? (
              <a
                key={f.href}
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                style={style}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={f.href}
                href={f.href}
                className={className}
                style={style}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
