import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "MCP server — SolSentry in your AI coding agent",
  description:
    "Install the SolSentry MCP server in Claude Code, Cursor, or any MCP-compatible agent. Operator lookups, drain traces, and bot cluster queries — directly in your editor.",
};

const TOOLS = [
  {
    name: "scan_wallet",
    args: "wallet: string",
    desc: "Lookup operator profile — known flag, risk level, confirmed rugs, total tokens, rug rate, tags.",
  },
  {
    name: "scan_token",
    args: "mint: string",
    desc: "Token analysis — risk, flags, dev wallet, bot cluster links, outcome if resolved.",
  },
  {
    name: "top_operators",
    args: "limit?: number",
    desc: "Ranked list of the highest-risk operators by confirmed rugs and rate.",
  },
  {
    name: "recent_alerts",
    args: "limit?: number",
    desc: "Latest HIGH and CRITICAL alerts with mint, dev, and flag list.",
  },
  {
    name: "recent_resolutions",
    args: "limit?: number",
    desc: "Outcome stream — which predictions were validated and which missed.",
  },
  {
    name: "drain_trace",
    args: "wallet: string",
    desc: "SOL flow trace, up to 10 hops, with bridge + CEX classifications.",
  },
  {
    name: "network_stats",
    args: "—",
    desc: "Global counters — total scans, accuracy, runtime, operators tracked, serial ruggers identified.",
  },
];

const CLAUDE_CONFIG = `{
  "mcpServers": {
    "solsentry": {
      "command": "npx",
      "args": ["-y", "@solsentry/mcp"]
    }
  }
}`;

const CURSOR_CONFIG = `{
  "mcp.servers": {
    "solsentry": {
      "command": "npx",
      "args": ["-y", "@solsentry/mcp"]
    }
  }
}`;

const EXAMPLE_PROMPT = `Ask your agent:

  "Use solsentry.scan_wallet to check
   4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1,
   then summarize the operator history."

The agent calls the tool, gets back JSON,
and writes you a human answer. No setup
beyond the MCP server install.`;

export default function MCPPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="MCP server · @solsentry/mcp v0.1.1"
          title={
            <>
              SolSentry in your{" "}
              <span style={{ color: "var(--brand-orange)" }}>AI agent</span>.
            </>
          }
          sub={
            <>
              Install once, query forever. Seven tools. Works in Claude Code,
              Cursor, Windsurf, Zed, or anything that speaks the Model Context
              Protocol. Your AI now knows every known Solana rug operator and
              can cite them by wallet.
            </>
          }
        >
          <div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
          >
            <a
              href="https://www.npmjs.com/package/@solsentry/mcp"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              npm install →
            </a>
            <a href="#install" className="btn-ghost">
              Setup guide
            </a>
            <a href="#tools" className="btn-ghost">
              Tool reference
            </a>
          </div>
        </PageHeader>

        <Section
          eyebrow="Install"
          title="One command. Two config lines."
          id="install"
        >
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                Claude Code / Claude Desktop
              </div>
              <p
                style={{
                  color: "var(--fg-2)",
                  fontSize: 14,
                  marginBottom: 10,
                  lineHeight: 1.6,
                }}
              >
                Add to{" "}
                <code style={{ color: "var(--brand-orange)" }}>
                  ~/.claude/claude_desktop_config.json
                </code>{" "}
                or your project&rsquo;s{" "}
                <code style={{ color: "var(--brand-orange)" }}>.mcp.json</code>:
              </p>
              <div className="code-block">{CLAUDE_CONFIG}</div>
            </div>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                Cursor
              </div>
              <p
                style={{
                  color: "var(--fg-2)",
                  fontSize: 14,
                  marginBottom: 10,
                  lineHeight: 1.6,
                }}
              >
                Add to{" "}
                <code style={{ color: "var(--brand-orange)" }}>
                  ~/.cursor/mcp.json
                </code>{" "}
                or workspace settings:
              </p>
              <div className="code-block">{CURSOR_CONFIG}</div>
            </div>
          </div>

          <div
            className="panel"
            style={{
              marginTop: 24,
              borderLeft: "3px solid var(--brand-orange)",
            }}
          >
            <div
              className="label-tag"
              style={{ color: "var(--brand-orange)", marginBottom: 10 }}
            >
              First use
            </div>
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--fg-2)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {EXAMPLE_PROMPT}
            </pre>
          </div>
        </Section>

        <Section
          eyebrow="7 tools · all public"
          title="What the MCP exposes"
          sub="Every tool hits the production API at api.solsentry.app. Data is live, not cached beyond 30 seconds. No API key required for public tools."
          id="tools"
        >
          {TOOLS.map((t) => (
            <div key={t.name} className="cmd-row">
              <div>
                <code>solsentry.{t.name}</code>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--fg-3)",
                    marginTop: 4,
                  }}
                >
                  ({t.args})
                </div>
              </div>
              <div className="desc">{t.desc}</div>
            </div>
          ))}
        </Section>

        <Section
          eyebrow="Why MCP matters"
          title="Your AI already has context. Give it intel."
          sub="Claude, ChatGPT, and Cursor now drive most dev workflows. MCP is how you plug live on-chain intelligence into them. SolSentry sits next to any general-purpose agent and answers the question it can't answer alone: who deployed this token, and what did they do last time?"
        >
          <div className="grid-3">
            {[
              {
                t: "For traders",
                d: "Paste a wallet in Claude, ask 'is this a serial rugger?', get back confirmed_rugs + rug_rate + recent alerts. No tab switching.",
              },
              {
                t: "For security researchers",
                d: "Ask your agent to trace a drain, then summarize the cash-out path and flag any known CEX endpoints. 10 hops, one call.",
              },
              {
                t: "For builders",
                d: "Embed SolSentry intel into code-gen workflows. Your agent validates operator risk before suggesting a swap path or listing integration.",
              },
            ].map((c) => (
              <div key={c.t} className="panel panel-hover">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  {c.t}
                </h3>
                <p
                  style={{
                    color: "var(--fg-2)",
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Troubleshooting" title="If the tool does not appear">
          <ol className="step-list">
            <li>
              <strong>Restart the agent</strong>
              MCP servers load at startup. Re-launch Claude Code / Cursor after
              editing the config.
            </li>
            <li>
              <strong>Verify Node is available</strong>
              <code>npx</code> needs Node 18+. Run{" "}
              <code>npx @solsentry/mcp --version</code> in a terminal to confirm
              the binary installs.
            </li>
            <li>
              <strong>Check the API is reachable</strong>
              <code>curl https://api.solsentry.app/health</code> should return{" "}
              <code>200 OK</code>. If not, the MCP will surface a network error
              on first tool call.
            </li>
            <li>
              <strong>Still stuck?</strong>
              Reach out —{" "}
              <a href="mailto:hello@solsentry.app">
                hello@solsentry.app
              </a> or{" "}
              <a
                href="https://t.me/solsentryai"
                target="_blank"
                rel="noreferrer"
              >
                @solsentryai
              </a>
              . MCP is early — bug reports are welcome.
            </li>
          </ol>
        </Section>
      </main>
      <Footer />
    </>
  );
}
