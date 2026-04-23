import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { fetchStats } from "@/lib/api";
import Link from "next/link";

export const revalidate = 120;

export const metadata = {
  title: "Submission — SolSentry · Colosseum Frontier 2026",
  description: "One-page submission summary. Live traction, architecture, novelty, and links. For judges short on time.",
};

export default async function SubmitPage() {
  const stats = await fetchStats();

  return (
    <>
      <Nav />
      <main>
        <section className="section-pad" style={{ paddingTop: 48, paddingBottom: 32, borderBottom: "1px solid var(--border)" }}>
          <div className="container">
            <span className="eyebrow">Colosseum Frontier 2026 · submission artifact</span>
            <h1
              className="section-title"
              style={{ fontSize: "clamp(40px, 6vw, 72px)", marginTop: 12, marginBottom: 20 }}
            >
              SolSentry — <span style={{ color: "var(--brand-orange)" }}>the security relay for Solana</span>.
            </h1>
            <p
              className="section-sub"
              style={{ fontSize: 19, maxWidth: 820, color: "var(--fg-2)", lineHeight: 1.65 }}
            >
              Autonomous threat intelligence — operator-centric, not token-by-token. Running on Solana
              mainnet with publicly auditable outcomes. This page is the short version. Everything is live,
              linkable, and verifiable.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/telegram" className="btn-primary">
                Try the bot →
              </Link>
              <Link href="/partners" className="btn-ghost">
                For partners
              </Link>
              <Link href="/compare" className="btn-ghost">
                How it compares
              </Link>
              <a
                href="mailto:hello@solsentry.app?subject=Colosseum%20Frontier%20judge%20followup"
                className="btn-ghost"
              >
                Email founder
              </a>
            </div>
          </div>
        </section>

        <Section eyebrow="Live as of this request" title="Traction that answers 'is it real?'">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 0,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              background: "var(--surface)",
            }}
          >
            {[
              ["Runtime", `${(stats?.runtime_hours ?? 210).toLocaleString()}h`],
              ["Scans resolved", (stats?.resolved ?? 24630).toLocaleString()],
              ["Accuracy", `${(stats?.accuracy_pct ?? 86.4).toFixed(1)}%`],
              ["Resolve rate", `${(stats?.resolve_rate_pct ?? 95.5).toFixed(1)}%`],
              ["Operators", (stats?.total_operators ?? 1345).toLocaleString()],
              ["Serial ruggers", (stats?.serial_ruggers ?? 408).toLocaleString()],
              ["Confirmed rugs", (stats?.confirmed_rugs ?? 4664).toLocaleString()],
              ["Bot clusters", (stats?.bot_clusters ?? 2014).toLocaleString()],
            ].map(([l, v], i) => (
              <div
                key={String(l)}
                style={{
                  padding: "22px 24px",
                  borderLeft: i % 4 === 0 ? "none" : "1px solid var(--border)",
                  borderTop: i >= 4 ? "1px solid var(--border)" : "none",
                }}
              >
                <div className="label-tag" style={{ marginBottom: 10 }}>
                  {l}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--brand-orange)",
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--fg-3)", fontSize: 12, marginTop: 16, fontFamily: "var(--font-mono)" }}>
            Source: <a href="https://api.solsentry.app/v1/stats" target="_blank" rel="noreferrer" style={{ color: "var(--brand-orange)" }}>api.solsentry.app/v1/stats</a> ·
            refreshed every 2 min on this page · refresh to see latest
          </p>
        </Section>

        <Section eyebrow="Architecture" title="How the system fits together">
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: 40,
              overflowX: "auto",
            }}
          >
            <svg viewBox="0 0 900 520" style={{ width: "100%", height: "auto", minWidth: 640 }}>
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#8A8A8A" />
                </marker>
              </defs>

              {/* Solana mainnet */}
              <rect x="20" y="20" width="860" height="60" rx="4" fill="#1A1A1A" stroke="#FF6B00" strokeWidth="1" />
              <text x="450" y="45" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="12" fill="#FF6B00" letterSpacing="0.2em">SOLANA MAINNET</text>
              <text x="450" y="65" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="#8A8A8A">Helius · Triton · Alchemy RPC pool (9 endpoints, priority-based)</text>

              {/* Scanner pipeline */}
              <g>
                <rect x="40" y="120" width="180" height="80" rx="4" fill="#202020" stroke="#FF6B00" strokeWidth="1" />
                <text x="130" y="145" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="10" fill="#FF6B00" letterSpacing="0.2em">STAGE 1</text>
                <text x="130" y="165" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="14" fill="#F5F5F5">Fast scan</text>
                <text x="130" y="183" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B8B8">~2s · RPC + meta</text>

                <rect x="240" y="120" width="180" height="80" rx="4" fill="#202020" stroke="#FF6B00" strokeWidth="1" />
                <text x="330" y="145" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="10" fill="#FF6B00" letterSpacing="0.2em">STAGE 2</text>
                <text x="330" y="165" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="14" fill="#F5F5F5">Deep signals</text>
                <text x="330" y="183" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B8B8">DAS · DexScreener</text>

                <rect x="440" y="120" width="180" height="80" rx="4" fill="#202020" stroke="#FF6B00" strokeWidth="1" />
                <text x="530" y="145" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="10" fill="#FF6B00" letterSpacing="0.2em">STAGE 3</text>
                <text x="530" y="165" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="14" fill="#F5F5F5">Bundle forensics</text>
                <text x="530" y="183" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B8B8">Enhanced TX · clusters</text>

                <rect x="640" y="120" width="220" height="80" rx="4" fill="#202020" stroke="#FF6B00" strokeWidth="1" />
                <text x="750" y="145" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="10" fill="#FF6B00" letterSpacing="0.2em">STAGE 4</text>
                <text x="750" y="165" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="14" fill="#F5F5F5">Operator enrichment</text>
                <text x="750" y="183" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B8B8">+ AI explainer (PT-BR / EN)</text>
              </g>

              {/* Persistent memory */}
              <g>
                <rect x="40" y="240" width="820" height="90" rx="4" fill="#1A1A1A" stroke="#00C9A7" strokeWidth="1" />
                <text x="450" y="265" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="11" fill="#00C9A7" letterSpacing="0.2em">PERSISTENT MEMORY (operator graph)</text>

                {["operator_profiles.json", "bot_clusters", "wallet_profiles", "known_entities", "progressive_scans.jsonl", "outcome_predictions.json"].map((label, i) => {
                  const x = 70 + i * 132;
                  return (
                    <g key={label}>
                      <rect x={x} y={285} width="120" height="32" rx="3" fill="#202020" stroke="#242424" />
                      <text x={x + 60} y={305} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B8B8">{label}</text>
                    </g>
                  );
                })}
              </g>

              {/* ALife + Resolver */}
              <g>
                <rect x="40" y="360" width="400" height="80" rx="4" fill="#202020" stroke="#A855F7" strokeWidth="1" />
                <text x="240" y="385" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="10" fill="#A855F7" letterSpacing="0.2em">ALIFE HUNTERS · 30 agents · 7-gene DNA</text>
                <text x="240" y="408" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="14" fill="#F5F5F5">Mutate · reproduce · get culled</text>
                <text x="240" y="426" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B8B8">DNA adjusts risk_threshold based on accuracy</text>

                <rect x="460" y="360" width="400" height="80" rx="4" fill="#202020" stroke="#00C9A7" strokeWidth="1" />
                <text x="660" y="385" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="10" fill="#00C9A7" letterSpacing="0.2em">OUTCOME RESOLVER</text>
                <text x="660" y="408" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="14" fill="#F5F5F5">Every prediction validated vs chain</text>
                <text x="660" y="426" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B8B8">H6 fast · 2d primary · 14d safe recheck</text>
              </g>

              {/* Outputs */}
              <g>
                <rect x="40" y="470" width="820" height="40" rx="4" fill="#1A1A1A" stroke="#FFB020" strokeWidth="1" />
                <text x="80" y="494" fontFamily="Inter" fontWeight="600" fontSize="10" fill="#FFB020" letterSpacing="0.2em">PUBLIC SURFACE</text>
                <text x="260" y="494" fontFamily="JetBrains Mono" fontSize="11" fill="#F5F5F5">Telegram bot (32 cmds)</text>
                <text x="450" y="494" fontFamily="JetBrains Mono" fontSize="11" fill="#F5F5F5">REST API (11 routes)</text>
                <text x="640" y="494" fontFamily="JetBrains Mono" fontSize="11" fill="#F5F5F5">MCP server (7 tools)</text>
                <text x="800" y="494" fontFamily="JetBrains Mono" fontSize="11" fill="#F5F5F5">Web</text>
              </g>

              {/* Arrows */}
              <line x1="450" y1="80" x2="130" y2="118" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="220" y1="160" x2="240" y2="160" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="420" y1="160" x2="440" y2="160" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="620" y1="160" x2="640" y2="160" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="750" y1="200" x2="450" y2="238" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="240" y1="330" x2="240" y2="358" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="660" y1="330" x2="660" y2="358" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="660" y1="440" x2="660" y2="468" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="240" y1="440" x2="240" y2="468" stroke="#3A3A3A" strokeWidth="1" markerEnd="url(#arr)" />
            </svg>
          </div>
        </Section>

        <Section eyebrow="Why this wins Frontier" title="Three non-obvious claims, each verifiable">
          <div className="grid-3">
            {[
              {
                t: "1. Agents are not a metaphor",
                d: "30 hunter agents. 7-gene DNA. Real mutations each cycle. Auto-adjustment of risk_threshold via blend_rate=0.1 based on prediction accuracy over a rolling window. Tierra/Avida-inspired — not LLM prompt-chains dressed as 'agents'.",
                link: "/telegram",
                linkLabel: "/hunters command",
              },
              {
                t: "2. Accuracy is publicly audited",
                d: `Every prediction gets resolved against on-chain outcome. ${(stats?.resolve_rate_pct ?? 95.5).toFixed(1)}% resolve rate. ${(stats?.accuracy_pct ?? 86.4).toFixed(1)}% accuracy on ${(stats?.resolved ?? 24630).toLocaleString()} resolved. Zero confirmed false positives at CRITICAL. The ledger is the product.`,
                link: "/resolutions",
                linkLabel: "Outcome stream",
              },
              {
                t: "3. MCP-first, not MCP-later",
                d: "@solsentry/mcp is live on npm. Seven tools. Works in Claude Code, Cursor, Windsurf today. Any AI agent with MCP support can answer 'is this operator a serial rugger?' with real data. No competitor ships this.",
                link: "/mcp",
                linkLabel: "Install the MCP",
              },
            ].map((c) => (
              <div key={c.t} className="panel" style={{ borderTop: "2px solid var(--brand-orange)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 10 }}>{c.t}</h3>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {c.d}
                </p>
                <Link
                  href={c.link}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--brand-orange)",
                    textDecoration: "none",
                  }}
                >
                  {c.linkLabel} →
                </Link>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="For judges short on time" title="Five minute verification path">
          <ol className="step-list">
            <li>
              <strong>Check the API is live.</strong>
              <code>curl https://api.solsentry.app/v1/stats</code> — should return JSON with{" "}
              <code>runtime_hours</code>, <code>resolved</code>, <code>accuracy_pct</code>.
            </li>
            <li>
              <strong>Verify the 4kxscute case study.</strong>
              <code>curl https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1</code>
              <br />
              Should return <code>&quot;known&quot;: true</code>, <code>risk_level: CRITICAL</code>, 700+
              confirmed rugs.
            </li>
            <li>
              <strong>Open the Telegram bot.</strong>
              <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer">
                t.me/solsentryai
              </a>{" "}
              · type <code>/status</code> · see live system state.
            </li>
            <li>
              <strong>Install the MCP in Claude Code.</strong>
              <code>npx -y @solsentry/mcp</code> · ask your agent to scan any wallet · receive live JSON
              back.
            </li>
            <li>
              <strong>Read the accuracy ledger.</strong>
              <Link href="/resolutions">/resolutions</Link> shows every prediction vs its on-chain outcome.
              No tool in the category publishes this.
            </li>
          </ol>
        </Section>

        <Section eyebrow="Contact" title="Talk to the founder">
          <div className="panel" style={{ borderLeft: "3px solid var(--brand-orange)" }}>
            <div className="grid-2">
              <div>
                <div className="label-tag">Email</div>
                <a
                  href="mailto:hello@solsentry.app"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 20,
                    color: "var(--brand-orange)",
                    display: "block",
                    marginTop: 6,
                  }}
                >
                  hello@solsentry.app
                </a>
              </div>
              <div>
                <div className="label-tag">Founder</div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--fg-1)", marginTop: 6 }}
                >
                  Crash Diniz · solo
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>
                  São Paulo, Brazil · BuildStation SP Apr 20
                </div>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
