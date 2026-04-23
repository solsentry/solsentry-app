import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { fetchStats } from "@/lib/api";

export const revalidate = 120;

export const metadata = {
  title: "For judges, investors, and enterprise partners",
  description: "Traction, architecture, and integration paths for SolSentry. Built for Colosseum Frontier 2026. 240h+ continuous mainnet runtime. Zero false positives at HIGH+ risk. Enterprise-ready API.",
};

export default async function PartnersPage() {
  const stats = await fetchStats();

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="For judges · investors · enterprise"
          title={
            <>
              What <span style={{ color: "var(--brand-orange)" }}>Pyth</span> is to prices,<br />
              SolSentry is to operator risk.
            </>
          }
          sub={
            <>
              SolSentry is a solo-founded autonomous threat intelligence system for Solana. 210+ hours of
              continuous mainnet runtime, 24,000+ scans resolved, 86.4% accuracy with zero confirmed false
              positives at CRITICAL risk. Built for Colosseum Frontier 2026. Looking for enterprise
              partners, ecosystem integrators, and security teams.
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a href="mailto:hello@solsentry.app?subject=SolSentry%20partnership" className="btn-primary">
              Book a call →
            </a>
            <a href="/contact" className="btn-ghost">
              All contact channels
            </a>
            <a href="#traction" className="btn-ghost">
              See traction
            </a>
          </div>
        </PageHeader>

        <Section eyebrow="Live traction" title="The system is running as you read this" id="traction">
          <div className="grid-4">
            {[
              ["Mainnet runtime", `${(stats?.runtime_hours ?? 0).toLocaleString()}h`, "continuous uptime"],
              ["Scans resolved", (stats?.resolved ?? 0).toLocaleString(), "unique predictions validated"],
              ["Accuracy", `${(stats?.accuracy_pct ?? 0).toFixed(1)}%`, "was_correct, live feed"],
              ["Serial ruggers", (stats?.serial_ruggers ?? 0).toLocaleString(), "operators w/ multiple confirmed rugs"],
              ["Operators tracked", (stats?.total_operators ?? 0).toLocaleString(), "distinct deployer wallets"],
              ["Bot clusters mapped", (stats?.bot_clusters ?? 0).toLocaleString(), "coordinated wallet groups"],
              ["Confirmed rugs", (stats?.confirmed_rugs ?? 0).toLocaleString(), "validated by on-chain outcome"],
              ["HIGH_RISK alerts", (stats?.high_risk_alerts ?? 0).toLocaleString(), "emitted to Telegram"],
            ].map(([label, v, sub]) => (
              <div key={String(label)} className="panel">
                <div className="label-tag" style={{ marginBottom: 8 }}>
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--brand-orange)",
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {v}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>{sub}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Case study — 4kxscute"
          title="Flagged 19 minutes before rug pull #62"
          sub="March 12, 2026. Operator 4kxscute deployed token #62. SolSentry issued a HIGH RISK alert 4 seconds after deploy — because operator history already had 61 prior rugs. The rug executed 19 minutes later. Today that wallet has 834 deployments and 766 confirmed rugs (91.8%)."
        >
          <div className="grid-3">
            {[
              { t: "T+0:00", d: "Token deployed. pump.fun launch. Standard meme parameters." },
              { t: "T+0:04", d: "SolSentry scan complete. Dev wallet matched against operator_profiles. HIGH RISK alert fired." },
              { t: "T+0:23", d: "Rug executed. Liquidity removed. Lead time: 19 minutes. Prediction was correct." },
            ].map((c) => (
              <div key={c.t} className="panel" style={{ borderTop: "3px solid var(--brand-orange)" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--brand-orange)",
                    fontSize: 14,
                    marginBottom: 10,
                  }}
                >
                  {c.t}
                </div>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}>{c.d}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "var(--fg-3)", fontSize: 14, marginTop: 24, maxWidth: 720, lineHeight: 1.7 }}>
            Every competing scanner looked at the token. SolSentry looked at the operator. That is the
            difference, and the whole thesis of the product.
          </p>
        </Section>

        <Section
          eyebrow="For ecosystem partners"
          title="Three ways to integrate"
        >
          <div className="grid-3">
            {[
              {
                t: "Wallets + explorers",
                d: "Surface SolSentry risk scoring in the user's wallet UI or on an explorer address page. Single REST call, 50ms response. We provide UI embeds or raw JSON.",
                cta: "Wallet integration guide →",
              },
              {
                t: "DeFi protocols",
                d: "Gate risky counterparties. Route SOL flows away from known serial-rugger operator wallets. Example: LP pools refuse to accept new tokens with deployer.risk_level === 'CRITICAL'.",
                cta: "Protocol integration →",
              },
              {
                t: "AI agents",
                d: "Plug SolSentry into your Claude / GPT / custom agent via MCP. Seven tools covering the full surface. Works today — npm install, two lines of config.",
                cta: "Install MCP →",
              },
            ].map((c) => (
              <div key={c.t} className="panel panel-hover">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 10 }}>{c.t}</h3>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{c.d}</p>
                <a
                  href="mailto:hello@solsentry.app"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--brand-orange)",
                    textDecoration: "none",
                  }}
                >
                  {c.cta}
                </a>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="For investors"
          title="Thesis"
          sub="Three reasons this is the right time for operator-level intelligence on Solana."
        >
          <div className="grid-3">
            {[
              {
                t: "Market growing",
                d: "pump.fun alone launches 20,000+ tokens per day. >95% of rugs are reused operators. The deployer graph is the actual risk surface — tokens are the symptom.",
              },
              {
                t: "Blank competitive space",
                d: "RugCheck scans tokens. Solscan shows graphs on demand. Nansen labels smart money. Arkham tags entities. Nobody is shipping autonomous operator-centric intel with outcome-resolved accuracy.",
              },
              {
                t: "Proven founding unit-economics",
                d: "Solo-built in ~60 days. 24K+ scans on < $500/mo RPC + infra spend. MCP layer monetizes via x402 micropayments. Enterprise tier on top.",
              },
            ].map((c) => (
              <div key={c.t} className="panel">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>{c.t}</h3>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.55 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="For Colosseum judges"
          title="Frontier track — submission summary"
          sub="Frontier is the track for novel security & infrastructure primitives. SolSentry fits because it ships a persistent, adversarial, agent-based intelligence layer that works today."
        >
          <div className="grid-2">
            <div className="panel">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 12 }}>What we built</h3>
              <ul style={{ listStyle: "none", padding: 0, color: "var(--fg-2)", fontSize: 14, lineHeight: 1.8 }}>
                <li>→ Autonomous scanner — 24h loop, no human in the loop</li>
                <li>→ 30 ALife hunter agents with mutable 7-gene DNA</li>
                <li>→ Outcome resolver — predictions are publicly audited</li>
                <li>→ Operator graph — wallet-level persistent memory</li>
                <li>→ Telegram bot — 32 commands, live interface</li>
                <li>→ REST API + MCP server — public surface area</li>
                <li>→ Drain tracer — 10-hop forensic SOL flow</li>
                <li>→ Bot cluster fingerprinting — coordinated wallet groups</li>
              </ul>
            </div>
            <div className="panel">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 12 }}>What&rsquo;s novel</h3>
              <ul style={{ listStyle: "none", padding: 0, color: "var(--fg-2)", fontSize: 14, lineHeight: 1.8 }}>
                <li>→ ALife agents aren&rsquo;t a metaphor — they literally mutate and reproduce</li>
                <li>→ Outcome-resolved accuracy — every prediction audited</li>
                <li>→ MCP-first design — first-class AI agent integration</li>
                <li>→ PT-BR native — bilingual product, Brazilian founder</li>
                <li>→ Operator-centric — category nobody else is in</li>
                <li>→ x402 micro-payments — Solana-native revenue primitive</li>
                <li>→ Zero false positives at HIGH+ risk — publicly verifiable</li>
                <li>→ 240h+ runtime before the deadline — not vapor</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Talk to us"
          title="We respond fast"
        >
          <div className="panel" style={{ borderLeft: "3px solid var(--brand-orange)" }}>
            <div className="grid-2" style={{ gap: 24 }}>
              <div>
                <div className="label-tag">Email</div>
                <a
                  href="mailto:hello@solsentry.app"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
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
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    color: "var(--fg-1)",
                    marginTop: 6,
                  }}
                >
                  Crash Diniz · solo
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>
                  São Paulo · Brazil. BuildStation SP Apr 20.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
              <a
                href="https://x.com/solsentryai"
                target="_blank"
                rel="noreferrer"
                className="hover-chip"
                style={{ textDecoration: "none" }}
              >
                @solsentryai · X
              </a>
              <a
                href="https://t.me/solsentryai"
                target="_blank"
                rel="noreferrer"
                className="hover-chip"
                style={{ textDecoration: "none" }}
              >
                @solsentryai · Telegram
              </a>
              <a
                href="https://github.com/solsentry"
                target="_blank"
                rel="noreferrer"
                className="hover-chip"
                style={{ textDecoration: "none" }}
              >
                solsentry · GitHub
              </a>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
