import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Glossary — every flag, every pillar, every label",
  description: "The full SolSentry vocabulary. Risk flag meanings, pillar definitions, risk level thresholds, and the taxonomy of operator / cluster / entity / token categories.",
};

const FLAGS: { group: string; items: { name: string; desc: string }[] }[] = [
  {
    group: "Authority flags",
    items: [
      { name: "MINT_AUTHORITY_ENABLED", desc: "The token mint authority is still active. The deployer can mint infinite supply. Should be revoked on legitimate launches." },
      { name: "FREEZE_AUTHORITY_ENABLED", desc: "The freeze authority is still active. The deployer can freeze any holder's account. Should be revoked or set to None." },
      { name: "UPDATE_AUTHORITY_ACTIVE", desc: "Metadata update authority is present on a Token-2022 mint. Name / symbol / URI can still change." },
    ],
  },
  {
    group: "Holder distribution",
    items: [
      { name: "TOP_HOLDER_OWNS_100%", desc: "The largest single holder owns the full supply. Zero distribution. Classic rug setup." },
      { name: "TOP_10_OWN_90%+", desc: "The top 10 holders control more than 90% of supply. Functional single-party control." },
      { name: "VERY_FEW_HOLDERS", desc: "Fewer than ~20 unique holders after a launch. Normal holders would already be more numerous at this point." },
      { name: "DEV_HOLDS_MAJORITY", desc: "Deployer wallet holds more than 50% of supply." },
    ],
  },
  {
    group: "Launch patterns",
    items: [
      { name: "COORD_BOT_CLUSTER", desc: "A coordinated bot cluster was detected buying in the same block or tight window. Size indicates cluster membership count." },
      { name: "SYNC_TIMED_BUYS", desc: "Multiple wallets bought within 2 blocks of each other. Suspicious but not conclusive." },
      { name: "INSIDER_FUNDING", desc: "Deployer funded the buying wallets from the same source within recent memory. Self-fund + self-buy." },
      { name: "PUMP_FUN_GRADUATED", desc: "Token graduated from pump.fun to Raydium. Neutral on its own — relevant only in combination with other flags." },
    ],
  },
  {
    group: "Operator signals",
    items: [
      { name: "SERIAL_DEPLOYER", desc: "Dev wallet has 3+ prior token deployments. Score boost +15." },
      { name: "CONFIRMED_RUG_OPERATOR", desc: "Dev wallet has at least one prior confirmed rug. Score boost +25." },
      { name: "SERIAL_RUGGER", desc: "Dev wallet has 5+ confirmed rugs. Risk level CRITICAL regardless of token signals." },
      { name: "KOL_AFFILIATED", desc: "Deployer wallet is funded by or shares funding with a tracked KOL." },
    ],
  },
  {
    group: "Drain signals",
    items: [
      { name: "REACHED_CEX", desc: "A drain trace from this wallet reached a known CEX deposit address. Cash-out attempt." },
      { name: "REACHED_MIXER", desc: "A drain trace reached a known mixer. Privacy laundering attempt." },
      { name: "BRIDGE_TO_EVM", desc: "SOL bridged out to an EVM chain within the drain path." },
      { name: "RAPID_DRAIN", desc: "Full wallet drain within 10 blocks of liquidity addition. Hot-and-quick rug pattern." },
    ],
  },
];

const RISK_LEVELS = [
  { level: "CRITICAL", range: "90–100", color: "var(--status-critical)", desc: "Actively dangerous. Serial rugger with confirmed history, or token with multiple critical flags. Do not interact." },
  { level: "HIGH", range: "70–89", color: "var(--status-warning)", desc: "Significant risk. Some combination of authority + holder + cluster flags. Likely rug or heavy manipulation." },
  { level: "MEDIUM", range: "40–69", color: "var(--brand-orange)", desc: "Caution zone. Flags present but not decisive. Could go either way. Worth watching." },
  { level: "LOW", range: "10–39", color: "var(--brand-teal)", desc: "Mostly clean. Minor or inconclusive flags. Usually safe." },
  { level: "CLEAN", range: "0–9", color: "var(--brand-teal)", desc: "No flags. Token passes all automated checks." },
];

const PILLARS = [
  { name: "PREVENT", color: "var(--brand-orange)", desc: "Fast pre-flight and at-deploy risk scoring. The first 2 seconds. Stops interaction before it starts." },
  { name: "TRACK", color: "var(--brand-teal)", desc: "Ongoing graph maintenance. Operator profiles, bot clusters, KOL links, drain paths. The memory of the system." },
  { name: "EXPLAIN", color: "var(--brand-white)", desc: "Human-readable output. AI-powered PT-BR and EN alerts. The why, not just the what." },
  { name: "EVOLVE", color: "var(--brand-purple)", desc: "ALife agents with mutable DNA. They compete on prediction accuracy. Bad agents die, good ones reproduce." },
];

export default function GlossaryPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Glossary · every flag + pillar"
          title={
            <>
              The full <span style={{ color: "var(--brand-orange)" }}>vocabulary</span>.
            </>
          }
          sub="SolSentry communicates in flags and risk levels. This page defines every term. If you see a code in an alert or API response that is not here, email hello@solsentry.app and we will document it."
        />

        <Section eyebrow="The four pillars" title="Mental model for everything SolSentry does">
          <div className="grid-4">
            {PILLARS.map((p) => (
              <div key={p.name} className="pillar-card" style={{ "--pillar-color": p.color } as React.CSSProperties}>
                <div style={{ color: p.color, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11, letterSpacing: "0.2em", marginBottom: 10 }}>
                  {p.name}
                </div>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Risk levels" title="Scoring thresholds">
          <div className="panel" style={{ padding: 0 }}>
            {RISK_LEVELS.map((l, i) => (
              <div
                key={l.level}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 100px 1fr",
                  gap: 16,
                  padding: "18px 24px",
                  borderBottom: i === RISK_LEVELS.length - 1 ? "none" : "1px solid var(--border-soft)",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: l.color,
                    padding: "4px 10px",
                    border: `1px solid ${l.color}`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {l.level}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-1)", fontSize: 14 }}>
                  {l.range}
                </span>
                <span style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.55 }}>{l.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Risk flags" title="Every code you'll see">
          {FLAGS.map((g) => (
            <div key={g.group} style={{ marginBottom: 32 }}>
              <div
                className="label-tag"
                style={{
                  color: "var(--brand-orange)",
                  letterSpacing: "0.2em",
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 16,
                }}
              >
                {g.group}
              </div>
              <div className="grid-2">
                {g.items.map((f) => (
                  <div key={f.name} className="gloss-card">
                    <code>{f.name}</code>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section eyebrow="Entity categories" title="Taxonomy of known addresses">
          <div className="grid-2">
            {[
              { t: "cex_deposit", d: "Known centralized-exchange deposit address. Cash-out destination." },
              { t: "cex_hot_wallet", d: "Known CEX operational hot wallet." },
              { t: "mixer", d: "Known mixer / tumbler. Laundering signal." },
              { t: "bridge_lock", d: "Cross-chain bridge lock contract." },
              { t: "known_operator", d: "Wallet matched to an existing operator_profile record." },
              { t: "kol_wallet", d: "Wallet belonging to a tracked KOL." },
              { t: "safe_protocol", d: "Verified contract / protocol wallet. Safe interaction." },
              { t: "unknown", d: "Not classified. Default state for new wallets." },
            ].map((e) => (
              <div key={e.t} className="gloss-card">
                <code>{e.t}</code>
                <p>{e.d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Notation"
          title="How flags compose"
          sub="Flags are additive. A token with three flags gets three score contributions. Risk score caps at 100."
        >
          <div className="code-block">
            {`# Example composition
#
# Token mint:  SomeTokenMint...
# Dev wallet:  4kxscute... (known operator)
#
# Base score:   0
#   + MINT_AUTHORITY_ENABLED          +20
#   + TOP_HOLDER_OWNS_100%            +25
#   + VERY_FEW_HOLDERS (4 holders)    +15
#   + CONFIRMED_RUG_OPERATOR          +25
#   + COORD_BOT_CLUSTER (size 12)     +20
# -----------------------------------
# Total (capped):  100 / 100     CRITICAL`}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
