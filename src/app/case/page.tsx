import { ProShell } from "@/components/ProShell";
import Link from "next/link";

export const metadata = {
  title: "Case study — payer-anchored investigation trace",
  description:
    "How SolSentry detected and traced a coordinated grant misappropriation pattern: payer → cohort → laundering hubs → CEX exit. All identifiers anonymized.",
};

interface FlowNode {
  id: string;
  label: string;
  sub?: string;
  type: "root" | "cohort" | "hub" | "exit" | "actor";
  count?: string;
  amount?: string;
  highlight?: boolean;
}

const NODES: FlowNode[] = [
  // Tier 1 — payer
  {
    id: "payer",
    label: "Grant Payer",
    sub: "anchor wallet",
    type: "root",
    amount: "$2.5M+ in disbursements",
  },
  // Tier 2 — cohort
  {
    id: "cohort_a",
    label: "Recipient A",
    sub: "$245 grant band",
    type: "cohort",
  },
  {
    id: "cohort_b",
    label: "Recipient B",
    sub: "$245 grant band",
    type: "cohort",
  },
  {
    id: "cohort_c",
    label: "Recipient C",
    sub: "$255 grant band",
    type: "cohort",
  },
  {
    id: "cohort_d",
    label: "Recipient D",
    sub: "$245 grant band",
    type: "cohort",
  },
  {
    id: "cohort_e",
    label: "+92 more",
    sub: "same band cluster",
    type: "cohort",
    count: "96 of 118",
  },
  // Tier 3 — hubs
  {
    id: "hub_1",
    label: "Hub α",
    sub: "auto-router",
    type: "hub",
    highlight: true,
  },
  {
    id: "hub_2",
    label: "Hub β",
    sub: "auto-router",
    type: "hub",
  },
  {
    id: "hub_3",
    label: "Hub γ",
    sub: "auto-router",
    type: "hub",
  },
  {
    id: "hub_4",
    label: "Hub δ",
    sub: "auto-router",
    type: "hub",
  },
  // Tier 4 — exits
  {
    id: "exit_1",
    label: "CEX Hot Wallet",
    sub: "Exchange A · KYC'd",
    type: "exit",
    amount: "$25.4K cash-out",
  },
  {
    id: "exit_2",
    label: "DEX Bot",
    sub: "Aggregator · $4.3M flow",
    type: "exit",
  },
  {
    id: "actor_1",
    label: "Controlling Identity",
    sub: "wallet aged 2.3y · 1.5 sigs/day",
    type: "actor",
    highlight: true,
  },
];

const EDGES: [string, string][] = [
  ["payer", "cohort_a"],
  ["payer", "cohort_b"],
  ["payer", "cohort_c"],
  ["payer", "cohort_d"],
  ["payer", "cohort_e"],
  ["cohort_a", "hub_1"],
  ["cohort_b", "hub_1"],
  ["cohort_c", "hub_2"],
  ["cohort_d", "hub_3"],
  ["cohort_e", "hub_4"],
  ["hub_1", "exit_1"],
  ["hub_1", "exit_2"],
  ["hub_2", "exit_1"],
  ["hub_3", "exit_2"],
  ["hub_4", "exit_2"],
  ["exit_1", "actor_1"],
  ["exit_2", "actor_1"],
];

const TIER_Y: Record<FlowNode["type"], number> = {
  root: 60,
  cohort: 200,
  hub: 360,
  exit: 520,
  actor: 660,
};

const NODE_W = 180;
const NODE_H = 64;

function nodeStyleFor(t: FlowNode["type"], highlight?: boolean) {
  if (highlight) {
    return {
      bg: "rgba(255, 68, 68, 0.10)",
      border: "var(--status-critical)",
      color: "var(--status-critical)",
    };
  }
  switch (t) {
    case "root":
      return {
        bg: "rgba(193, 125, 14, 0.12)",
        border: "var(--brand-amber)",
        color: "var(--brand-amber)",
      };
    case "cohort":
      return {
        bg: "var(--surface-2)",
        border: "var(--border-strong)",
        color: "var(--fg-2)",
      };
    case "hub":
      return {
        bg: "rgba(216, 149, 48, 0.08)",
        border: "var(--brand-amber-400)",
        color: "var(--brand-amber-400)",
      };
    case "exit":
      return {
        bg: "rgba(168, 85, 247, 0.08)",
        border: "var(--brand-purple)",
        color: "var(--brand-purple)",
      };
    case "actor":
      return {
        bg: "rgba(255, 68, 68, 0.10)",
        border: "var(--status-critical)",
        color: "var(--status-critical)",
      };
  }
}

function laneXPositions(nodes: FlowNode[], type: FlowNode["type"], canvasW: number) {
  const lane = nodes.filter((n) => n.type === type);
  const total = lane.length;
  const totalW = total * NODE_W + (total - 1) * 24;
  const startX = (canvasW - totalW) / 2;
  return lane.map((n, i) => ({ id: n.id, x: startX + i * (NODE_W + 24) }));
}

export default function casePage() {
  const CANVAS_W = 1200;
  const CANVAS_H = 760;

  // Calculate positions per lane (centered)
  const lanePos = (["root", "cohort", "hub", "exit", "actor"] as const).flatMap((t) =>
    laneXPositions(NODES, t, CANVAS_W),
  );
  const xMap: Record<string, number> = {};
  lanePos.forEach((p) => {
    xMap[p.id] = p.x;
  });

  return (
    <ProShell>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <span
            className="eyebrow"
            style={{ color: "var(--brand-amber)" }}
          >
            Investigation case study · all identifiers anonymized
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--fg-1)",
              margin: "8px 0 12px",
            }}
          >
            Payer-anchored investigation trace
          </h1>
          <p
            style={{
              color: "var(--fg-2)",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            One payer wallet. <strong style={{ color: "var(--fg-1)" }}>96 grant recipients</strong> in
            the same dollar-amount band routing into{" "}
            <strong style={{ color: "var(--fg-1)" }}>4 laundering hubs</strong>. Convergence at 2 exit
            wallets. SolSentry's autonomous brain detected and traced the entire flow without manual
            intervention.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "6px 14px",
                background: "var(--brand-amber-tint)",
                border: "1px solid var(--brand-amber-line)",
                borderRadius: 999,
                color: "var(--brand-amber)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            >
              ~0 LLM tokens used
            </span>
            <span
              style={{
                padding: "6px 14px",
                background: "rgba(42, 122, 122, 0.12)",
                border: "1px solid rgba(42, 122, 122, 0.4)",
                borderRadius: 999,
                color: "var(--brand-teal)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            >
              brain/investigator + ring_detector
            </span>
            <span
              style={{
                padding: "6px 14px",
                background: "rgba(255, 68, 68, 0.10)",
                border: "1px solid rgba(255, 68, 68, 0.4)",
                borderRadius: 999,
                color: "var(--status-critical)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            >
              HIGH confidence
            </span>
          </div>
        </header>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "auto",
            marginBottom: 24,
          }}
        >
          <svg
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            width="100%"
            height="auto"
            style={{ display: "block", minWidth: 800 }}
          >
            <defs>
              <marker
                id="ar"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-strong)" />
              </marker>
            </defs>

            {/* Lane labels */}
            {[
              { type: "root" as const, label: "TIER 1 · PAYER" },
              { type: "cohort" as const, label: "TIER 2 · GRANT RECIPIENTS (96 in same band)" },
              { type: "hub" as const, label: "TIER 3 · LAUNDERING HUBS (auto-routed)" },
              { type: "exit" as const, label: "TIER 4 · EXITS (CEX + DEX bot)" },
              { type: "actor" as const, label: "TIER 5 · CONTROLLING IDENTITY" },
            ].map(({ type, label }) => (
              <text
                key={type}
                x={20}
                y={TIER_Y[type] + NODE_H / 2 + 4}
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--fg-3)"
                letterSpacing="0.12em"
              >
                {label}
              </text>
            ))}

            {/* Edges */}
            {EDGES.map(([from, to], i) => {
              const fromNode = NODES.find((n) => n.id === from);
              const toNode = NODES.find((n) => n.id === to);
              if (!fromNode || !toNode) return null;
              const x1 = xMap[from] + NODE_W / 2;
              const y1 = TIER_Y[fromNode.type] + NODE_H;
              const x2 = xMap[to] + NODE_W / 2;
              const y2 = TIER_Y[toNode.type];
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                  stroke="var(--border-strong)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.55"
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const s = nodeStyleFor(node.type, node.highlight);
              const x = xMap[node.id];
              const y = TIER_Y[node.type];
              return (
                <foreignObject
                  key={node.id}
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                >
                  <div
                    style={{
                      width: NODE_W,
                      height: NODE_H,
                      background: s.bg,
                      border: `${node.highlight || node.type === "root" ? 2 : 1}px solid ${s.border}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 2,
                      boxShadow: node.highlight || node.type === "root" ? `0 0 24px ${s.bg}` : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: s.color,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {node.label}
                    </div>
                    {node.sub && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "var(--fg-3)",
                        }}
                      >
                        {node.sub}
                      </div>
                    )}
                    {(node.amount || node.count) && (
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--fg-2)",
                          fontWeight: 600,
                        }}
                      >
                        {node.amount || node.count}
                      </div>
                    )}
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>

        {/* Findings panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            className="panel"
            style={{ borderColor: "var(--brand-amber)" }}
          >
            <div
              className="label-tag"
              style={{ marginBottom: 8, color: "var(--brand-amber)" }}
            >
              Pattern detected
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--fg-1)",
                marginBottom: 8,
              }}
            >
              Same-band cohort
            </h3>
            <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
              96 of 118 recipients fall into a tight [amount redacted] USD band. Statistically
              implausible without coordination. The brain's <code style={{ color: "var(--brand-amber)" }}>ring_detector</code>{" "}
              flagged it.
            </p>
          </div>

          <div className="panel">
            <div className="label-tag" style={{ marginBottom: 8 }}>
              Routing
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--fg-1)",
                marginBottom: 8,
              }}
            >
              4 hubs, auto-laundered
            </h3>
            <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
              Recipients sent funds within minutes to one of 4 hubs (α/β/γ/δ).
              Hubs auto-swapped USDG → USDC via Jupiter. Sub-second hops.
            </p>
          </div>

          <div className="panel">
            <div
              className="label-tag"
              style={{ marginBottom: 8, color: "var(--brand-purple)" }}
            >
              Convergence
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--fg-1)",
                marginBottom: 8,
              }}
            >
              2 exits · same identity
            </h3>
            <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
              Funds converged on a single CEX deposit address (KYC'd) and one DEX
              aggregator bot. Both exits link to the same 2.3-year-old wallet.
            </p>
          </div>

          <div
            className="panel"
            style={{ borderColor: "var(--status-critical)" }}
          >
            <div
              className="label-tag"
              style={{ marginBottom: 8, color: "var(--status-critical)" }}
            >
              Lead
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--fg-1)",
                marginBottom: 8,
              }}
            >
              Controlling identity
            </h3>
            <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
              2.3-year-old wallet, 1.5 signatures/day baseline, suddenly active on
              cash-out timing. High-confidence controlling-identity lead.
            </p>
          </div>
        </div>

        {/* Methodology */}
        <div
          className="panel"
          style={{ marginBottom: 24 }}
        >
          <div className="label-tag" style={{ marginBottom: 12 }}>
            How SolSentry detected this
          </div>
          <ol
            style={{
              listStyle: "decimal",
              paddingLeft: 24,
              color: "var(--fg-2)",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong style={{ color: "var(--fg-1)" }}>Payer anchor query.</strong>{" "}
              <code style={{ color: "var(--brand-amber)" }}>brain/investigator.py</code> received
              the payer wallet as the seed.
            </li>
            <li>
              <strong style={{ color: "var(--fg-1)" }}>Cohort discovery.</strong>{" "}
              Pulled all USDG/USDC outflows in the analysis window. Bucketed recipients by amount.
            </li>
            <li>
              <strong style={{ color: "var(--fg-1)" }}>Same-band ring detection.</strong>{" "}
              <code style={{ color: "var(--brand-amber)" }}>brain/ring_detector.py</code> flagged 96
              recipients in the [amount redacted] band — far above the statistical noise floor.
            </li>
            <li>
              <strong style={{ color: "var(--fg-1)" }}>Hop-2 trace.</strong>{" "}
              For each cohort wallet, traced the next-hop transfer. 96/96 routed through 4 hub
              wallets within minutes of receipt.
            </li>
            <li>
              <strong style={{ color: "var(--fg-1)" }}>CEX deposit convergence.</strong>{" "}
              <code style={{ color: "var(--brand-amber)" }}>intelligence/cex_deposit_tracer.py</code>{" "}
              found all 4 hubs converging on the same KYC'd CEX deposit address.
            </li>
            <li>
              <strong style={{ color: "var(--fg-1)" }}>Controlling-identity inference.</strong>{" "}
              The 2.3-year-old wallet sitting upstream of the CEX exit had a 1.5 sigs/day baseline
              that broke during the cash-out window — high-confidence operator lead.
            </li>
          </ol>
          <p
            style={{
              marginTop: 16,
              color: "var(--fg-3)",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              borderTop: "1px solid var(--border)",
              paddingTop: 12,
            }}
          >
            Total LLM cost: ~0 tokens. Time-to-evidence: under 30 seconds. The investigation runs
            entirely on the autonomous brain layer using on-chain data only.
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 32, marginBottom: 32 }}>
          <Link
            href="/architecture"
            style={{
              color: "var(--brand-amber)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              borderBottom: "1px solid var(--brand-amber-line)",
              paddingBottom: 2,
            }}
          >
            See full architecture →
          </Link>
        </div>
      </div>
    </ProShell>
  );
}
