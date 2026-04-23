import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Install & API",
  description:
    "Install @solsentry/mcp for Claude Desktop, Cursor, Claude Code. Use the SolSentry SDK in TypeScript. Query the public REST API.",
};

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ padding: "80px 0 48px" }}>
          <div className="container">
            <span className="hero-eyebrow">Install · API · SDK</span>
            <h1 className="hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              Three ways to plug in.
            </h1>
            <p className="hero-sub">
              MCP server for AI agents. TypeScript SDK for backends. Plain REST for
              everything else. Same data. Same API. No login.
            </p>
          </div>
        </section>

        <section className="docs-section">
          <div className="container">
            <h2 className="section-title" id="mcp">1. MCP server</h2>
            <p style={{ color: "var(--fg-2)", marginBottom: 24, maxWidth: 720 }}>
              For Claude Desktop, Cursor, Claude Code, or any client that speaks the
              Model Context Protocol. One line install.
            </p>

            <h3 className="docs-h3">Claude Desktop</h3>
            <p style={{ color: "var(--fg-3)", fontSize: 14, marginBottom: 12 }}>
              Add to <code>claude_desktop_config.json</code>:
            </p>
            <pre className="docs-code">{`{
  "mcpServers": {
    "solsentry": {
      "command": "npx",
      "args": ["-y", "@solsentry/mcp"]
    }
  }
}`}</pre>

            <h3 className="docs-h3" style={{ marginTop: 32 }}>Cursor / Claude Code</h3>
            <p style={{ color: "var(--fg-3)", fontSize: 14, marginBottom: 12 }}>
              Add to <code>.mcp.json</code> at your project root:
            </p>
            <pre className="docs-code">{`{
  "mcpServers": {
    "solsentry": {
      "command": "npx",
      "args": ["-y", "@solsentry/mcp"]
    }
  }
}`}</pre>

            <h3 className="docs-h3" style={{ marginTop: 32 }}>Available tools</h3>
            <div className="docs-table">
              <div className="docs-row docs-head">
                <span>Tool</span>
                <span>Purpose</span>
              </div>
              <div className="docs-row">
                <code>check_operator</code>
                <span>Risk profile of a wallet as token deployer</span>
              </div>
              <div className="docs-row">
                <code>check_token</code>
                <span>Risk profile of a token mint</span>
              </div>
              <div className="docs-row">
                <code>get_top_operators</code>
                <span>Leaderboard of worst serial ruggers</span>
              </div>
              <div className="docs-row">
                <code>get_network_stats</code>
                <span>System-wide live stats</span>
              </div>
              <div className="docs-row">
                <code>explain_risk</code>
                <span>Plain-English risk summary for any address</span>
              </div>
            </div>
          </div>
        </section>

        <section className="docs-section" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <div className="container">
            <h2 className="section-title" id="sdk">2. TypeScript SDK</h2>
            <p style={{ color: "var(--fg-2)", marginBottom: 24, maxWidth: 720 }}>
              For trading bots, wallet warnings, dApp pre-sign checks, and any TS
              backend that needs threat intel without the MCP transport.
            </p>

            <pre className="docs-code">{`npm install @solsentry/mcp`}</pre>

            <pre className="docs-code" style={{ marginTop: 16 }}>{`import { SolSentryClient } from "@solsentry/mcp/client";

const sol = new SolSentryClient();

const op = await sol.get<{
  risk_level: string;
  confirmed_rugs: number;
}>("/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1");

if (op.risk_level === "CRITICAL") {
  console.warn(\`Serial rugger: \${op.confirmed_rugs} confirmed rugs\`);
}`}</pre>
          </div>
        </section>

        <section className="docs-section" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <div className="container">
            <h2 className="section-title" id="api">3. Public REST API</h2>
            <p style={{ color: "var(--fg-2)", marginBottom: 24, maxWidth: 720 }}>
              No install. Free for read-only endpoints. Live at{" "}
              <code style={{ color: "var(--brand-orange)" }}>api.solsentry.app</code>.
            </p>

            <h3 className="docs-h3">Examples</h3>
            <pre className="docs-code">{`# Network stats
curl https://api.solsentry.app/v1/stats

# Operator risk profile
curl https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1

# Top serial ruggers
curl "https://api.solsentry.app/v1/top-operators?limit=10"

# Token risk
curl https://api.solsentry.app/v1/token/<mint>

# Drain trace (post-rug SOL flow, 10 hops)
curl https://api.solsentry.app/v1/drain-trace/<wallet>`}</pre>

            <h3 className="docs-h3" style={{ marginTop: 32 }}>All endpoints</h3>
            <div className="docs-table">
              <div className="docs-row docs-head">
                <span>Endpoint</span>
                <span>Purpose</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/stats</code>
                <span>System-wide live stats</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/operator/&#123;wallet&#125;</code>
                <span>Operator risk profile</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/operator/&#123;wallet&#125;/timeline</code>
                <span>Operator deployment timeline</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/token/&#123;mint&#125;</code>
                <span>Token risk profile</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/top-operators</code>
                <span>Worst serial ruggers</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/alerts/recent</code>
                <span>Recent CRITICAL/HIGH alerts</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/resolutions/recent</code>
                <span>Recent rug confirmations</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/clusters</code>
                <span>Bot cluster registry</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/cluster/&#123;id&#125;</code>
                <span>Cluster detail</span>
              </div>
              <div className="docs-row">
                <code>GET /v1/drain-trace/&#123;wallet&#125;</code>
                <span>Post-rug SOL flow trace (10 hops)</span>
              </div>
              <div className="docs-row">
                <code>GET /health</code>
                <span>Liveness</span>
              </div>
            </div>
          </div>
        </section>

        <section className="docs-section" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <div className="container">
            <h2 className="section-title">Pricing</h2>
            <div className="pricing-grid">
              <div className="price-card">
                <div className="label">Free forever</div>
                <h3 className="docs-h3" style={{ marginTop: 8 }}>Read-only endpoints</h3>
                <ul className="price-list">
                  <li>operator, token, stats, top-operators</li>
                  <li>alerts/recent, resolutions/recent</li>
                  <li>clusters, cluster detail, health</li>
                  <li>No API key required</li>
                </ul>
              </div>
              <div className="price-card">
                <div className="label">Drain-trace (paid)</div>
                <h3 className="docs-h3" style={{ marginTop: 8 }}>Per-query via x402</h3>
                <ul className="price-list">
                  <li>10-hop SOL flow tracing</li>
                  <li>Mixer, bridge, CEX classification</li>
                  <li>Free for verified rug victims</li>
                  <li>x402 micro-payments — no signup</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
