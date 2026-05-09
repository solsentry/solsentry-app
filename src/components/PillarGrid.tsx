import Link from "next/link";

const PILLARS = [
  {
    label: "PREVENT",
    color: "var(--brand-amber)",
    title: "Fast scanner",
    desc: "Risk score on every new Solana deploy in under 2 seconds. Holders, authorities, concentration, serial-deployer match.",
    link: "/fun",
    linkLabel: "Open Fun mode",
    external: false,
  },
  {
    label: "TRACK",
    color: "var(--brand-teal)",
    title: "Drain + cluster graph",
    desc: "10-hop SOL flow tracking through bridges and DEXes. Operator-to-cluster social graph cross-referenced on every scan.",
    link: "https://api.solsentry.app/v1/drain-trace/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
    linkLabel: "Trace live ↗",
    external: true,
  },
  {
    label: "EXPLAIN",
    color: "var(--brand-cream)",
    title: "AI-powered explainer",
    desc: "Alerts written in plain language — PT-BR or EN. Why the score, which flags fired, what the operator did last time. Provider-agnostic.",
    link: "/telegram",
    linkLabel: "Try on Telegram",
    external: false,
  },
  {
    label: "EVOLVE",
    color: "var(--brand-purple)",
    title: "ALife hunter agents",
    desc: "Hunters with 7-gene DNA. They mutate, reproduce, and get culled based on prediction accuracy. Inspired by Tierra and Avida.",
    link: "/mcp",
    linkLabel: "MCP integration",
    external: false,
  },
];

export function PillarGrid() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Four pillars</span>
          <h2 className="section-title">
            Operator-level intelligence,
            <br />
            not token-by-token detection.
          </h2>
          <p className="section-sub">
            Every major surface of SolSentry leans on this color-coded mental
            model. Pick a pillar to see how it shows up in the product.
          </p>
        </div>
        <div className="grid-2">
          {PILLARS.map((p) => (
            <div
              key={p.label}
              className="pillar-card"
              style={{ "--pillar-color": p.color } as React.CSSProperties}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: p.color,
                  marginBottom: 12,
                }}
              >
                {p.label}
              </div>
              <h3>{p.title}</h3>
              <p
                style={{
                  color: "var(--fg-2)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {p.desc}
              </p>
              {p.external ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: p.color,
                    textDecoration: "none",
                  }}
                >
                  {p.linkLabel}
                </a>
              ) : (
                <Link
                  href={p.link}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: p.color,
                    textDecoration: "none",
                  }}
                >
                  {p.linkLabel} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
