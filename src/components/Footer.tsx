"use client";

import Link from "next/link";

/**
 * Lean footer used across the entire site (was previously only on homepage).
 * Kept minimal on purpose — heavy upsell and marketing live in the top bar.
 */
export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 80,
        padding: "40px 0 32px",
        background: "var(--bg-elev-1)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 32,
            marginBottom: 32,
          }}
        >
          {/* API Transparency */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--brand-amber)",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              API
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <a
                href="https://api.solsentry.app/v1/stats"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                Live stats
              </a>
              <a
                href="https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                Operator example
              </a>
              <a
                href="https://api.solsentry.app/health"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                Health
              </a>
            </div>
          </div>

          {/* Code */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--brand-amber)",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              CODE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <a
                href="https://github.com/solsentry/solsentry-app"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                GitHub · solsentry-app
              </a>
              <a
                href="https://github.com/solsentry/solsentry-mcp"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                GitHub · solsentry-mcp
              </a>
              <a
                href="https://www.npmjs.com/package/@solsentry/mcp"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                NPM · @solsentry/mcp
              </a>
            </div>
          </div>

          {/* Talk */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--brand-amber)",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              TALK
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <a
                href="https://x.com/solsentryai"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                X · @solsentryai
              </a>
              <a
                href="https://t.me/solsentryai"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                Telegram · @solsentryai
              </a>
              <a
                href="https://x.com/crashdiniz"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-2)", textDecoration: "none" }}
              >
                Crash · @crashdiniz
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--brand-amber)",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              TOOLS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <Link href="/mcp" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                MCP Server
              </Link>
              <Link href="/telegram" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                Telegram Bot
              </Link>
              <Link href="/scan" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                Scan
              </Link>
            </div>
          </div>

          {/* Site */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--brand-amber)",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              SITE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <Link href="/about" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                About
              </Link>
              <Link href="/changelog" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                Changelog
              </Link>
              <Link href="/docs" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                Docs
              </Link>
              <Link href="/architecture" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                Architecture
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 12,
            color: "var(--fg-3)",
          }}
        >
          <div>
            SolSentry · Built by{" "}
            <a
              href="https://x.com/crashdiniz"
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit", borderBottom: "1px solid var(--border)" }}
            >
              Crash Diniz
            </a>{" "}
            · 2026
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            api.solsentry.app <span style={{ color: "var(--brand-teal)" }}>●</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
