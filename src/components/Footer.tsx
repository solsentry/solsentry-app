import Link from "next/link";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Fun mode", href: "/fun" },
      { label: "MCP server", href: "/mcp" },
      { label: "Telegram bot", href: "/telegram" },
      { label: "Docs", href: "/docs" },
    ],
  },
  {
    title: "API",
    links: [
      { label: "Live stats", href: "https://api.solsentry.app/v1/stats" },
      {
        label: "Operator lookup",
        href: "https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
      },
      { label: "Health", href: "https://api.solsentry.app/health" },
    ],
  },
  {
    title: "Code",
    links: [
      { label: "GitHub · solsentry-app", href: "https://github.com/solsentry/solsentry-app" },
      { label: "GitHub · solsentry-mcp", href: "https://github.com/solsentry/solsentry-mcp" },
      { label: "NPM · @solsentry/mcp", href: "https://www.npmjs.com/package/@solsentry/mcp" },
    ],
  },
  {
    title: "Talk",
    links: [
      { label: "X · @solsentryai", href: "https://x.com/solsentryai" },
      { label: "Telegram · @solsentryai", href: "https://t.me/solsentryai" },
      { label: "Crash · @crashdiniz", href: "https://x.com/crashdiniz" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 80,
        padding: "56px 0 32px",
        background: "var(--bg-elev-1)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr repeat(4, 1fr)",
            gap: 32,
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "var(--brand-amber)",
                  borderRadius: 999,
                  display: "inline-block",
                }}
                aria-hidden
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--fg-1)",
                  letterSpacing: "-0.01em",
                }}
              >
                SolSentry
              </span>
            </div>
            <p
              style={{
                color: "var(--fg-2)",
                fontSize: 13,
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              Autonomous threat intelligence for Solana. RugCheck tells you a
              fire is burning. SolSentry tells you who lit it.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div
                className="label-tag"
                style={{ marginBottom: 14, color: "var(--brand-amber)" }}
              >
                {col.title}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("http") ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "var(--fg-2)",
                          fontSize: 13,
                          textDecoration: "none",
                        }}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        style={{
                          color: "var(--fg-2)",
                          fontSize: 13,
                          textDecoration: "none",
                        }}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            color: "var(--fg-3)",
            fontSize: 12,
          }}
        >
          <div>
            SolSentry · Built by{" "}
            <a
              href="https://x.com/crashdiniz"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "inherit",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Crash Diniz
            </a>{" "}
            · São Paulo · Colosseum Frontier 2026
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontFamily: "var(--font-mono)" }}>
              api.solsentry.app{" "}
              <span style={{ color: "var(--brand-teal)" }}>● live</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
