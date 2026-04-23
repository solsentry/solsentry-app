import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Telegram Bot — 32 commands, live",
  description: "SolSentry Telegram bot — /scan, /drain, /follow, /hunters. Paste a Solana wallet or mint, get operator history, risk scoring, drain trace, and ALife hunter assignment back in seconds.",
};

interface Cmd {
  cmd: string;
  args?: string;
  desc: string;
  tier?: "public" | "admin" | "new";
  pillar?: "PREVENT" | "TRACK" | "EXPLAIN" | "EVOLVE" | "ADMIN";
}

const COMMANDS: { group: string; items: Cmd[] }[] = [
  {
    group: "Scan & analyze",
    items: [
      { cmd: "/scan", args: "<addr>", desc: "Full token or wallet analysis. Risk score, flag list, operator history, holder distribution, bot cluster links. Returns in ~2s.", pillar: "PREVENT" },
      { cmd: "/drain", args: "<addr>", desc: "Trace SOL drain through up to 10 hops. Identifies bridges, DEXes, CEX endpoints, and final cash-out wallets.", pillar: "TRACK" },
      { cmd: "/crossref", desc: "Cross-reference watched wallets against the operator database. Surface hidden relationships.", pillar: "TRACK" },
      { cmd: "/whois", args: "<addr>", desc: "Look up wallet alias + operator profile if known. Fast context lookup.", pillar: "TRACK" },
    ],
  },
  {
    group: "Status & monitoring",
    items: [
      { cmd: "/status", desc: "System status — runtime, scans processed, accuracy, agent count, RPC pool health.", pillar: "PREVENT" },
      { cmd: "/alerts", desc: "Latest HIGH / CRITICAL risk alerts, newest first.", pillar: "PREVENT" },
      { cmd: "/report", desc: "Daily intelligence report — top operators flagged, rugs resolved, new serial deployers identified.", pillar: "EXPLAIN" },
      { cmd: "/watchlist", desc: "List wallets you have under active watch. Per-user state.", pillar: "TRACK" },
      { cmd: "/discover", desc: "Trigger an immediate discovery check against pump.fun / Raydium recent deploys.", pillar: "PREVENT" },
    ],
  },
  {
    group: "ALife hunters",
    items: [
      { cmd: "/hunters", desc: "Show all active hunter agents. Each hunter tracks a wallet and reports state changes.", pillar: "EVOLVE" },
      { cmd: "/hunter", args: "<id>", desc: "Hunter detail — DNA, generation, age, target wallet, observations count.", pillar: "EVOLVE" },
      { cmd: "/follow", args: "<addr>", desc: "Assign a hunter to a specific wallet. Hunter will report deploys, drains, bot cluster formation.", pillar: "EVOLVE" },
      { cmd: "/sentinels", desc: "Show sentinel watchdogs (long-lived guards over known high-value targets).", pillar: "EVOLVE" },
      { cmd: "/name", args: "<addr> <alias>", desc: "Name a wallet for future reference. Alias is private and per-user.", pillar: "EXPLAIN" },
    ],
  },
  {
    group: "Entities & KOLs",
    items: [
      { cmd: "/entity", args: "<addr>", desc: "Entity info — check if a wallet is a known CEX, mixer, bridge, or KOL.", pillar: "TRACK" },
      { cmd: "/entities", desc: "List summary of all known entity categories in SolSentry's database.", pillar: "TRACK" },
      { cmd: "/kols", desc: "List tracked KOL watchlist. Cross-references KOL → Operator links.", pillar: "TRACK", tier: "admin" },
      { cmd: "/kol", args: "<#>", desc: "KOL detail — associated operators, shill patterns, funding sources.", pillar: "TRACK", tier: "admin" },
    ],
  },
  {
    group: "Bulk & admin",
    items: [
      { cmd: "/import", desc: "Bulk import wallets from paste (up to 50 at once).", pillar: "PREVENT" },
      { cmd: "/kolimport", desc: "Bulk import KOL wallets with name:address pairs.", pillar: "TRACK", tier: "admin" },
      { cmd: "/kolname", args: "<addr> <name>", desc: "Rename a KOL in the watchlist.", pillar: "TRACK", tier: "admin" },
      { cmd: "/skip", args: "<addr> <cat> <label>", desc: "Add an address to known-entities (CEX, mixer, bridge, safe).", pillar: "TRACK", tier: "admin" },
      { cmd: "/unskip", args: "<addr>", desc: "Remove from known-entities.", tier: "admin", pillar: "TRACK" },
      { cmd: "/identity", desc: "Identity engine statistics — profiles built, graph edges, cross-wallet links.", tier: "admin", pillar: "TRACK" },
      { cmd: "/autodiscovery", desc: "Toggle auto-discovery loop on/off.", tier: "admin", pillar: "PREVENT" },
      { cmd: "/setdelay", args: "<secs>", desc: "Set discovery loop polling delay.", tier: "admin", pillar: "PREVENT" },
      { cmd: "/rpcstatus", desc: "RPC pool health — per-endpoint error rate, credits remaining.", tier: "admin", pillar: "PREVENT" },
      { cmd: "/rpcfixall", desc: "Re-enable all disabled RPC endpoints.", tier: "admin", pillar: "PREVENT" },
    ],
  },
  {
    group: "Genome & evolution",
    items: [
      { cmd: "/genome", desc: "Show all 7 genome parameters and their current values. Live view of the hunter DNA.", pillar: "EVOLVE", tier: "admin" },
      { cmd: "/setgene", args: "<name> <value>", desc: "Set a gene value. Overrides auto-adjustment for that parameter.", pillar: "EVOLVE", tier: "admin" },
    ],
  },
  {
    group: "Content",
    items: [
      { cmd: "/post", args: "<type>", desc: "Generate a ready-to-paste X/Twitter post from the latest data. Useful for daily updates.", pillar: "EXPLAIN" },
    ],
  },
];

const EXAMPLE_OUTPUT = `🚨 HIGH RISK — Serial operator detected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mint:  Bz4UpUmp...tRTwZv
Dev:   4kxscute...L5pH1  (known)
Risk:  100/100   CRITICAL

Operator history (live)
  · 834 deployments tracked
  · 766 confirmed rugs (91.8%)
  · Label: serial_rugger

Token-specific flags
  · MINT_AUTHORITY_ENABLED
  · TOP_HOLDER_OWNS_100%
  · VERY_FEW_HOLDERS (4)
  · COORD_BOT_CLUSTER (size 12)

Recommendation
  Avoid. Serial rug operator, active.
  19-min average time-to-rug.`;

export default function TelegramPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Telegram interface · 32 commands"
          title={<>Paste a wallet.<br /><span style={{ color: "var(--brand-orange)" }}>Get the intel back.</span></>}
          sub={
            <>
              SolSentry runs in Telegram first. Every command works on Solana mainnet today — 240h+ uptime,
              24,000+ scans resolved. The bot is the fastest way to use the system. Open{" "}
              <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer">
                @solsentryai
              </a>{" "}
              or tap a command below to jump straight to it.
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer" className="btn-primary">
              Open bot →
            </a>
            <a href="#commands" className="btn-ghost">
              All commands
            </a>
          </div>
        </PageHeader>

        <Section
          eyebrow="Live example"
          title="What a scan looks like"
          sub="Every /scan returns an operator-aware risk assessment — not just token signals. If the deployer is a known serial, you see it before the token has a single transaction."
        >
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div className="code-block" style={{ background: "#050505", lineHeight: 1.55, fontSize: 12 }}>
              {EXAMPLE_OUTPUT}
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 12 }}>
                How this alert is built
              </h3>
              <ol className="step-list" style={{ marginTop: 0 }}>
                <li>
                  <strong>Stage 1 — Fast scan</strong>
                  ~2s. RPC fetches mint authority, holder distribution, metadata. Known token mints are short-circuited.
                </li>
                <li>
                  <strong>Stage 2 — Deep signals</strong>
                  Holder engine (Helius DAS), DexScreener, InsightX, optional Nansen. Background, non-blocking.
                </li>
                <li>
                  <strong>Stage 3 — Bundle forensics</strong>
                  Helius Enhanced TX. Finds coordinated bot clusters mining the same launch.
                </li>
                <li>
                  <strong>Operator enrichment</strong>
                  Dev wallet matched against <code>operator_profiles.json</code>. Serial deployers add +15 to +25 points.
                </li>
                <li>
                  <strong>AI explainer</strong>
                  PT-BR and EN. Only fires on risk ≥ 50 (manual) or ≥ 80 (auto). Rate-limited to 10 calls/hr.
                </li>
              </ol>
            </div>
          </div>
        </Section>

        <Section eyebrow="Full command reference" title="32 commands, grouped by pillar" id="commands">
          {COMMANDS.map((group) => (
            <div key={group.group} style={{ marginBottom: 36 }}>
              <div
                className="label-tag"
                style={{
                  color: "var(--brand-orange)",
                  letterSpacing: "0.2em",
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 4,
                }}
              >
                {group.group}
              </div>
              {group.items.map((c) => (
                <div key={c.cmd} className="cmd-row">
                  <div>
                    <code>
                      {c.cmd}
                      {c.args ? " " + c.args : ""}
                    </code>
                    {c.tier === "admin" && <span className="cmd-meta admin">admin</span>}
                    {c.tier === "new" && <span className="cmd-meta new">new</span>}
                  </div>
                  <div className="desc">
                    {c.desc}
                    {c.pillar && c.pillar !== "ADMIN" && (
                      <span
                        className={`pillar-chip ${c.pillar.toLowerCase()}`}
                        style={{ marginLeft: 10, verticalAlign: "middle", fontSize: 9 }}
                      >
                        {c.pillar}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Section>

        <Section
          eyebrow="Forum mode"
          title="Dedicated channels per signal type"
          sub="In Telegram forum-enabled groups, SolSentry routes output to topic threads — commands, alerts, resolutions, hunter logs — so you never lose signal in noise."
        >
          <div className="grid-4">
            {[
              ["🚨 alerts", "HIGH + CRITICAL risk events. Noise-free."],
              ["🧬 hunters", "Agent births, mutations, deaths, reassignments."],
              ["✅ resolutions", "Outcomes — was_correct, final classification."],
              ["🛠️ commands", "Everything else. Your interactive workspace."],
            ].map(([title, desc]) => (
              <div key={title} className="panel panel-hover">
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 6, color: "var(--fg-1)" }}>
                  {title}
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Next steps"
          title="Use it now"
          sub="No signup, no wallet, no API key for public commands. Message the bot, get intel back."
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer" className="btn-primary">
              Open @solsentryai →
            </a>
            <a href="/mcp" className="btn-ghost">
              Prefer an AI agent? MCP →
            </a>
            <a href="/api" className="btn-ghost">
              Prefer raw JSON? REST API →
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
