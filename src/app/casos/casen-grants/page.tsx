import { ProShell } from "@/components/ProShell";
import Link from "next/link";

export const metadata = {
  title: "Case study — payer-anchored grant fraud trace",
  description:
    "How SolSentry detected and traced a coordinated grant misappropriation pattern: payer → cohort → laundering hubs → CEX exit. All identifiers anonymized.",
};

interface FlowNode {
  id: string;
  label: string;
  sub?: string;
  type: "root" | "cohort" | "legit" | "hub" | "exit" | "actor";
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
  // Tier 2 — legit recipients (control contrast)
  {
    id: "legit_pool",
    label: "22 legitimate payments",
    sub: "varied amounts · independent destinations",
    type: "legit",
    count: "22 of 118",
  },
  // Tier 2 — same-band cohort (suspicious)
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

interface FlowEdge {
  from: string;
  to: string;
  weight?: number;
  kind?: "legit" | "alert";
}

const EDGES: FlowEdge[] = [
  { from: "payer", to: "legit_pool", weight: 1.5, kind: "legit" },
  { from: "payer", to: "cohort_a", weight: 2, kind: "alert" },
  { from: "payer", to: "cohort_b", weight: 2, kind: "alert" },
  { from: "payer", to: "cohort_c", weight: 2, kind: "alert" },
  { from: "payer", to: "cohort_d", weight: 2, kind: "alert" },
  { from: "payer", to: "cohort_e", weight: 5, kind: "alert" },
  { from: "cohort_a", to: "hub_1", weight: 2, kind: "alert" },
  { from: "cohort_b", to: "hub_1", weight: 2, kind: "alert" },
  { from: "cohort_c", to: "hub_2", weight: 2, kind: "alert" },
  { from: "cohort_d", to: "hub_3", weight: 2, kind: "alert" },
  { from: "cohort_e", to: "hub_4", weight: 5, kind: "alert" },
  { from: "hub_1", to: "exit_1", weight: 3, kind: "alert" },
  { from: "hub_1", to: "exit_2", weight: 3, kind: "alert" },
  { from: "hub_2", to: "exit_1", weight: 2, kind: "alert" },
  { from: "hub_3", to: "exit_2", weight: 2, kind: "alert" },
  { from: "hub_4", to: "exit_2", weight: 5, kind: "alert" },
  { from: "exit_1", to: "actor_1", weight: 4, kind: "alert" },
  { from: "exit_2", to: "actor_1", weight: 5, kind: "alert" },
];

const TIER_Y: Record<FlowNode["type"], number> = {
  root: 60,
  legit: 200,
  cohort: 200,
  hub: 360,
  exit: 520,
  actor: 660,
};

const NODE_W = 180;
const NODE_H = 64;

// Palette mirrors internal/marketing/brand/sds/v4/06_ia_completa/casen_viz_prototype.html
function nodeStyleFor(t: FlowNode["type"], highlight?: boolean) {
  if (highlight) {
    return {
      bg: "rgba(229, 87, 87, 0.18)",
      border: "#e55757",
      color: "#ff8a8a",
      shadow: "0 0 28px rgba(229, 87, 87, 0.45)",
    };
  }
  switch (t) {
    case "root":
      return {
        bg: "rgba(111, 163, 216, 0.14)",
        border: "#6fa3d8",
        color: "#9bc1e8",
        shadow: "0 0 24px rgba(111, 163, 216, 0.25)",
      };
    case "legit":
      return {
        bg: "rgba(108, 174, 110, 0.14)",
        border: "#6cae6e",
        color: "#90c992",
        shadow: "none",
      };
    case "cohort":
      return {
        bg: "rgba(229, 87, 87, 0.10)",
        border: "#e55757",
        color: "#f0a4a4",
        shadow: "none",
      };
    case "hub":
      return {
        bg: "rgba(217, 122, 31, 0.20)",
        border: "#f4a460",
        color: "#f4a460",
        shadow: "0 0 18px rgba(244, 164, 96, 0.20)",
      };
    case "exit":
      return {
        bg: "rgba(169, 136, 217, 0.16)",
        border: "#a988d9",
        color: "#c2a8e6",
        shadow: "none",
      };
    case "actor":
      return {
        bg: "rgba(229, 87, 87, 0.20)",
        border: "#e55757",
        color: "#ff8a8a",
        shadow: "0 0 28px rgba(229, 87, 87, 0.45)",
      };
  }
}

function laneXPositions(
  nodes: FlowNode[],
  type: FlowNode["type"],
  canvasW: number,
  align: "left" | "center" | "right" = "center",
  margin = 80,
) {
  const lane = nodes.filter((n) => n.type === type);
  const total = lane.length;
  const totalW = total * NODE_W + (total - 1) * 24;
  let startX: number;
  if (align === "left") startX = margin;
  else if (align === "right") startX = canvasW - totalW - margin;
  else startX = (canvasW - totalW) / 2;
  return lane.map((n, i) => ({ id: n.id, x: startX + i * (NODE_W + 24) }));
}

export default function CasenPage() {
  const CANVAS_W = 1280;
  const CANVAS_H = 760;

  // Calculate positions per lane.
  // Tier 2 splits into LEGIT (left side, green pool) and COHORT (right side, red ring)
  // to mirror the casen_viz_prototype contrast: legitimate vs same-band cluster.
  const lanePos = [
    ...laneXPositions(NODES, "root", CANVAS_W, "center"),
    ...laneXPositions(NODES, "legit", CANVAS_W, "left", 60),
    ...laneXPositions(NODES, "cohort", CANVAS_W, "right", 60),
    ...laneXPositions(NODES, "hub", CANVAS_W, "center"),
    ...laneXPositions(NODES, "exit", CANVAS_W, "center"),
    ...laneXPositions(NODES, "actor", CANVAS_W, "center"),
  ];
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
            Payer-anchored grant fraud trace
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

        {/* Legend matches tabela/2.png + casen_viz_prototype palette */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 12,
            padding: "10px 14px",
            background: "rgba(22, 19, 16, 0.6)",
            border: "1px solid #2a2520",
            borderRadius: 8,
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: "#8a8275",
            letterSpacing: "0.06em",
          }}
        >
          {[
            { color: "#6fa3d8", label: "PAYER" },
            { color: "#6cae6e", label: "LEGIT (22)" },
            { color: "#e55757", label: "DIVERSION (96)" },
            { color: "#f4a460", label: "HUB" },
            { color: "#a988d9", label: "EXIT" },
            { color: "#ff5e3a", label: "CONTROLLING ID" },
          ].map((l) => (
            <span
              key={l.label}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: l.color,
                  boxShadow: `0 0 8px ${l.color}`,
                }}
              />
              {l.label}
            </span>
          ))}
        </div>

        <div
          style={{
            background: "#0e0c0a",
            border: "1px solid #2a2520",
            borderRadius: 8,
            overflow: "auto",
            marginBottom: 24,
          }}
        >
          <svg
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            width="100%"
            height="auto"
            style={{ display: "block", minWidth: 900, background: "#0e0c0a" }}
          >
            <defs>
              <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f4a460" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#e55757" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6cae6e" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#6cae6e" stopOpacity="0.30" />
              </linearGradient>
            </defs>

            {/* Lane labels */}
            {[
              { type: "root" as const, label: "TIER 1 · PAYER" },
              { type: "cohort" as const, label: "TIER 2 · 22 LEGIT  ◇  96 SAME-BAND COHORT" },
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
                fill="#8a8275"
                letterSpacing="0.14em"
              >
                {label}
              </text>
            ))}

            {/* Edges (sankey-style: stroke width proportional to weight, color by kind) */}
            {EDGES.map((edge, i) => {
              const fromNode = NODES.find((n) => n.id === edge.from);
              const toNode = NODES.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const x1 = xMap[edge.from] + NODE_W / 2;
              const y1 = TIER_Y[fromNode.type] + NODE_H;
              const x2 = xMap[edge.to] + NODE_W / 2;
              const y2 = TIER_Y[toNode.type];
              const isLegit = edge.kind === "legit";
              const stroke = isLegit ? "url(#legitGrad)" : "url(#alertGrad)";
              const width = Math.max(2, (edge.weight ?? 1) * 1.6);
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                  stroke={stroke}
                  strokeWidth={width}
                  strokeLinecap="round"
                  fill="none"
                  opacity={isLegit ? 0.55 : 0.7}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const s = nodeStyleFor(node.type, node.highlight);
              const x = xMap[node.id];
              const y = TIER_Y[node.type];
              const isAccent =
                node.highlight || node.type === "root" || node.type === "actor";
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
                      border: `${isAccent ? 2 : 1.5}px solid ${s.border}`,
                      borderRadius: 6,
                      padding: "8px 12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 2,
                      boxShadow: s.shadow,
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: s.color,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                    >
                      {node.label}
                    </div>
                    {node.sub && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "#8a8275",
                          lineHeight: 1.3,
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
                          color: "#f4a460",
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
              96 of 118 recipients fall into a tight $245-$255 USD band. Statistically
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
              recipients in the $245-$255 band — far above the statistical noise floor.
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
