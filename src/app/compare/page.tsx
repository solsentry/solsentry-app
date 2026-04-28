import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Compare — SolSentry vs Range, Nansen, Arkham, RugCheck",
  description:
    "How SolSentry stacks up against the rest of the Solana + on-chain intelligence stack. Every tool in the category does part of this job. Only SolSentry ships all four pillars.",
};

type Cell = true | false | "soon";

const COMPETITORS = [
  "SolSentry",
  "RugCheck",
  "Solscan",
  "Nansen",
  "Arkham",
  "Range",
  "Webacy",
  "Bubblemaps",
];

const ROWS: { feature: string; group: string; values: Cell[] }[] = [
  // Token-level
  {
    group: "Token-level",
    feature: "Fast token risk score (< 2s)",
    values: [true, true, false, false, false, false, true, false],
  },
  {
    group: "Token-level",
    feature: "Holder concentration analysis",
    values: [true, true, true, true, false, false, false, true],
  },
  {
    group: "Token-level",
    feature: "Mint/freeze authority check",
    values: [true, true, true, false, false, false, true, false],
  },
  {
    group: "Token-level",
    feature: "Honeypot detection",
    values: [true, true, false, false, false, false, true, false],
  },
  // Wallet-level
  {
    group: "Wallet-level",
    feature: "Per-wallet risk scoring",
    values: [true, false, false, false, false, false, true, false],
  },
  {
    group: "Wallet-level",
    feature: "Wallet labels / tags",
    values: [true, false, false, true, true, false, false, false],
  },
  {
    group: "Wallet-level",
    feature: "Custom private labels",
    values: [true, false, false, true, true, false, false, false],
  },
  {
    group: "Wallet-level",
    feature: 'Self-check ("am I flagged?")',
    values: [true, false, false, false, false, false, false, false],
  },
  // Operator-level (the differentiator)
  {
    group: "Operator-level",
    feature: "Operator history tracking",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Operator-level",
    feature: "Serial-deployer detection",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Operator-level",
    feature: "Operator → cluster correlation",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Operator-level",
    feature: "KOL ↔ operator social graph",
    values: [true, false, false, false, false, false, false, false],
  },
  // Graph & forensics
  {
    group: "Graph & forensics",
    feature: "Bot cluster fingerprinting",
    values: [true, false, true, false, false, false, false, true],
  },
  {
    group: "Graph & forensics",
    feature: "Wallet cluster visualization",
    values: [true, false, true, false, true, false, false, true],
  },
  {
    group: "Graph & forensics",
    feature: "SOL drain tracing (10 hops)",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Graph & forensics",
    feature: "CEX / bridge / mixer classification",
    values: [true, false, false, true, true, true, false, false],
  },
  // Autonomous intel
  {
    group: "Autonomous intel",
    feature: "24/7 autonomous scanning",
    values: [true, false, false, false, false, true, false, false],
  },
  {
    group: "Autonomous intel",
    feature: "Agent-based architecture",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Autonomous intel",
    feature: "Outcome-resolved accuracy feed",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Autonomous intel",
    feature: "Evolutionary DNA on agents",
    values: [true, false, false, false, false, false, false, false],
  },
  // Interfaces
  {
    group: "Interfaces",
    feature: "Telegram bot interface",
    values: [true, true, false, false, false, false, false, false],
  },
  {
    group: "Interfaces",
    feature: "REST API (no key for reads)",
    values: [true, false, true, false, false, false, true, false],
  },
  {
    group: "Interfaces",
    feature: "MCP server for AI agents",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Interfaces",
    feature: "Natural-language query",
    values: ["soon", false, false, true, true, false, false, false],
  },
  // Ops
  {
    group: "Ops",
    feature: "240h+ live mainnet runtime",
    values: [true, true, true, true, true, true, true, true],
  },
  {
    group: "Ops",
    feature: "Public accuracy ledger",
    values: [true, false, false, false, false, false, false, false],
  },
  {
    group: "Ops",
    feature: "Bilingual (EN + PT-BR)",
    values: [true, false, false, false, false, false, false, false],
  },
];

function renderCell(v: Cell, isSelf: boolean) {
  if (v === true) {
    return (
      <span
        className={isSelf ? "yes" : "yes"}
        style={{ color: isSelf ? "var(--brand-orange)" : "var(--brand-teal)" }}
      >
        ✓
      </span>
    );
  }
  if (v === "soon") {
    return <span className="soon">soon</span>;
  }
  return <span className="no">—</span>;
}

export default function ComparePage() {
  const groups = Array.from(new Set(ROWS.map((r) => r.group)));

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Competitive matrix"
          title={
            <>
              Everyone does{" "}
              <span style={{ color: "var(--brand-orange)" }}>part</span> of
              this.
              <br />
              Only SolSentry ships all four pillars.
            </>
          }
          sub="Comparison across eight platforms — RugCheck, Solscan, Nansen, Arkham, Range, Webacy, Bubblemaps, and SolSentry. Built from public documentation and direct testing. If a mark is wrong, email us and we'll fix it."
        />

        <Section>
          <div style={{ overflowX: "auto" }}>
            <table className="compare-table" style={{ minWidth: 880 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", paddingLeft: 20 }}>
                    Capability
                  </th>
                  {COMPETITORS.map((c) => (
                    <th key={c} className={c === "SolSentry" ? "self" : ""}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <>
                    <tr key={g + "-header"}>
                      <td
                        colSpan={COMPETITORS.length + 1}
                        style={{
                          background: "var(--surface-2)",
                          textAlign: "left",
                          paddingLeft: 20,
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          fontSize: 11,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--brand-orange)",
                        }}
                      >
                        {g}
                      </td>
                    </tr>
                    {ROWS.filter((r) => r.group === g).map((r) => (
                      <tr key={r.feature}>
                        <td className="feat">{r.feature}</td>
                        {r.values.map((v, i) => {
                          const isSelf = COMPETITORS[i] === "SolSentry";
                          return (
                            <td key={i} className={isSelf ? "self" : ""}>
                              {renderCell(v, isSelf)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section eyebrow="Reading the matrix" title="Where SolSentry sits">
          <div className="grid-3">
            <div
              className="panel"
              style={{ borderTop: "3px solid var(--brand-orange)" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                vs token scanners
              </h3>
              <p
                style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}
              >
                RugCheck and Solsniffer do token-level risk well. SolSentry does
                it plus operator-level context. Same input, more signal —
                because the deployer&rsquo;s last 60 tokens inform this one.
              </p>
            </div>
            <div
              className="panel"
              style={{ borderTop: "3px solid var(--brand-teal)" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                vs analytics platforms
              </h3>
              <p
                style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}
              >
                Nansen, Arkham, Bubblemaps show you the graph. You have to ask.
                SolSentry builds the graph while you sleep, and messages you
                when it finds something. Autonomous, not query-driven.
              </p>
            </div>
            <div
              className="panel"
              style={{ borderTop: "3px solid var(--brand-purple)" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                vs risk APIs
              </h3>
              <p
                style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}
              >
                Range, Webacy, Blockaid offer risk APIs for protocols. SolSentry
                offers one too — but designed around operator-history as the
                primary signal, not transaction heuristics. Different thesis,
                complementary use.
              </p>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="The honest thing"
          title="What SolSentry does not do"
          sub="We are not trying to replace everything. Here are the places we deliberately defer to other tools."
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              color: "var(--fg-2)",
              fontSize: 15,
              lineHeight: 1.9,
              maxWidth: 720,
            }}
          >
            <li>
              →{" "}
              <strong style={{ color: "var(--fg-1)" }}>
                Cross-chain tracking
              </strong>{" "}
              — Range, Chainalysis, and Elliptic are built for that. We are
              Solana-native and stay that way.
            </li>
            <li>
              →{" "}
              <strong style={{ color: "var(--fg-1)" }}>
                Portfolio tracking
              </strong>{" "}
              — Nansen, Zerion, DeBank. Not our surface.
            </li>
            <li>
              →{" "}
              <strong style={{ color: "var(--fg-1)" }}>
                Smart-money trader copying
              </strong>{" "}
              — Nansen owns this.
            </li>
            <li>
              →{" "}
              <strong style={{ color: "var(--fg-1)" }}>
                Community scam reporting
              </strong>{" "}
              — Chainabuse is the right venue for multi-chain public reports.
            </li>
            <li>
              →{" "}
              <strong style={{ color: "var(--fg-1)" }}>
                Contract code audits
              </strong>{" "}
              — Sec3, OtterSec, Neodyme. Audits happen before deploy. We watch
              what happens after.
            </li>
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}
