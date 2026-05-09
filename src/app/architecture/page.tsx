import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Architecture — how SolSentry works",
  description:
    "From new token deploy to operator graph: the SolSentry pipeline visualised. Scanner, hunter, ALife brain, outputs.",
};

interface NodeProps {
  title: string;
  desc: string;
  accent?: "amber" | "teal" | "purple" | "critical";
  children?: React.ReactNode;
}

function FlowNode({ title, desc, accent, children }: NodeProps) {
  const color =
    accent === "amber"
      ? "var(--brand-amber)"
      : accent === "teal"
        ? "var(--brand-teal)"
        : accent === "purple"
          ? "var(--brand-purple)"
          : accent === "critical"
            ? "var(--status-critical)"
            : "var(--border)";

  return (
    <div
      className="panel"
      style={{
        borderColor: color,
        borderTop: `3px solid ${color}`,
        padding: 20,
      }}
    >
      <div
        className="label-tag"
        style={{ color, marginBottom: 8, fontSize: 10 }}
      >
        {title}
      </div>
      <p
        style={{
          color: "var(--fg-2)",
          fontSize: 13,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {desc}
      </p>
      {children}
    </div>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <div
      style={{
        textAlign: "center",
        color: "var(--brand-amber)",
        fontFamily: "var(--font-mono)",
        fontSize: 18,
        margin: down ? "8px 0" : "0 8px",
        opacity: 0.6,
      }}
    >
      {down ? "↓" : "→"}
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="System architecture · v2.3.21"
          title={
            <>
              From{" "}
              <span style={{ color: "var(--brand-amber)" }}>new token</span> to{" "}
              <span style={{ color: "var(--brand-teal)" }}>operator graph</span>
            </>
          }
          sub="Every Solana token deploy enters the pipeline. Stage 1 returns a verdict in under 3 seconds. Stage 2-3 enrich asynchronously. The autonomous brain adjusts thresholds without human input."
        />

        <Section eyebrow="Pipeline" title="Scan → Resolve → Learn">
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <FlowNode
              title="01 · Ingest"
              desc="WebSocket subscription to pump.fun, Raydium, Jupiter program logs. Every new mint event triggers a scan job within 200ms."
              accent="amber"
            />
            <Arrow down />
            <FlowNode
              title="02 · Stage 1 — Fast scan"
              desc="getAccountInfo + DAS metadata. Skips known tokens (SOL/USDC/USD1/DRIFT). 3s timeout. Returns risk verdict."
              accent="amber"
            />
            <Arrow down />
            <FlowNode
              title="03 · Stage 2 — Deep enrichment"
              desc="HolderEngine via Helius DAS · InsightX (5 keys, 60s cooldown) · DexScreener for symbol · Nansen on demand. Background, async."
              accent="amber"
            />
            <Arrow down />
            <FlowNode
              title="04 · Stage 3 — Forensics"
              desc="Bundle forensics via Helius Enhanced Tx. First-funder index. CEX-deposit tracer. Privacy-protocol detection."
              accent="amber"
            />
            <Arrow down />
            <FlowNode
              title="05 · Operator graph"
              desc="Profile dev_wallet. Cross-reference against 1.7K+ existing operators. Apply serial boost if confirmed_rugs > 0. Update bot cluster index."
              accent="teal"
            />
            <Arrow down />
            <FlowNode
              title="06 · Hunter spawn (risk ≥ 95)"
              desc="ALife agent assigned to track the operator wallet. Monitors deploys, drains, and bot cluster formation in real time."
              accent="purple"
            />
            <Arrow down />
            <FlowNode
              title="07 · Outcome resolver"
              desc="H6 fast-track for HIGH+ initial signals. 2-day primary window. 14-day safe recheck. Volume-dead immediate. Updates was_correct."
              accent="teal"
            />
            <Arrow down />
            <FlowNode
              title="08 · Autonomous brain"
              desc="Every 20 ticks: meta_learning auto-adjusts DNA blend. Every 200 ticks: anomaly_seeker sweeps the graph. Weekly: retract_engine re-evaluates 100 operators."
              accent="purple"
            />
            <Arrow down />
            <FlowNode
              title="09 · Outputs"
              desc="Telegram bot · MCP server (npx @solsentry/mcp) · REST API (api.solsentry.app/v1) · x402 paid endpoints. Same intelligence, four surfaces."
              accent="critical"
            />
          </div>
        </Section>

        <Section
          eyebrow="Key surfaces"
          title="Where the data goes"
          sub="Same intelligence layer, four ways to consume it."
        >
          <div className="grid-auto">
            <div className="panel panel-hover">
              <div className="label-tag" style={{ color: "var(--brand-amber)", marginBottom: 8 }}>
                Telegram bot
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                32 commands. /scan, /drain, /follow, /hunters. Real-time alert
                stream for any wallet on your watchlist.
              </p>
            </div>
            <div className="panel panel-hover">
              <div className="label-tag" style={{ color: "var(--brand-teal)", marginBottom: 8 }}>
                MCP server
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                7 tools exposed via Model Context Protocol. Drop into Claude
                Code, Cursor, Windsurf. Operator lookups directly in your editor.
              </p>
            </div>
            <div className="panel panel-hover">
              <div className="label-tag" style={{ color: "var(--brand-purple)", marginBottom: 8 }}>
                REST API
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                11 endpoints, no auth required. /v1/operator, /v1/token,
                /v1/drain-trace, /v1/clusters. Cached at 30-300s.
              </p>
            </div>
            <div className="panel panel-hover">
              <div className="label-tag" style={{ color: "var(--status-warning)", marginBottom: 8 }}>
                x402 paid
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
                Heavy operations behind x402 micropayments. Drain trace, full
                operator network, dossier export. First threat-intel API on the
                x402 leaderboard.
              </p>
            </div>
          </div>
        </Section>

        <Section eyebrow="Stack" title="What it runs on">
          <div className="docs-table" style={{ maxWidth: 720 }}>
            <Row k="Runtime" v="Python 3 · single VPS · Hetzner Falkenstein" />
            <Row k="RPC pool" v="23 endpoints · Helius×9 · Alchemy×8 · QuickNode×4 · Chainstack×2" />
            <Row k="Storage" v="JSON / JSONL atomic writes · in-memory frozenset indices" />
            <Row k="Live channel" v="WebSocket (Helius enhanced)" />
            <Row k="Tests" v="844 passing · pytest · in-process" />
            <Row k="Deployments" v="261 commits · zero downtime restarts" />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="docs-row">
      <code>{k}</code>
      <span>{v}</span>
    </div>
  );
}
