"use client";

import { useState } from "react";
import Link from "next/link";

interface Node {
  address: string;
  type?: string;
  risk?: number;
  label?: string;
  isRoot?: boolean;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
  kind?: string;
}

interface Props {
  center: string;
  nodes: Node[];
  edges: Edge[];
}

const NODE_W = 168;
const NODE_H = 56;
const HGAP = 24;
const VGAP = 64;
const PADDING = 32;

function nodeStyle(node: Node, isRoot: boolean): { bg: string; border: string; color: string } {
  if (isRoot) {
    return {
      bg: "rgba(193, 125, 14, 0.12)",
      border: "var(--brand-amber)",
      color: "var(--brand-amber)",
    };
  }
  if (node.risk !== undefined) {
    if (node.risk >= 80)
      return {
        bg: "rgba(255, 68, 68, 0.10)",
        border: "var(--status-critical)",
        color: "var(--status-critical)",
      };
    if (node.risk >= 50)
      return {
        bg: "rgba(216, 149, 48, 0.08)",
        border: "var(--brand-amber-400)",
        color: "var(--brand-amber-400)",
      };
  }
  if (node.type === "cex" || node.type === "mixer")
    return {
      bg: "rgba(168, 85, 247, 0.08)",
      border: "var(--brand-purple)",
      color: "var(--brand-purple)",
    };
  return {
    bg: "var(--surface-2)",
    border: "var(--border-strong)",
    color: "var(--fg-2)",
  };
}

function shortAddr(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function NetworkFlowchart({ center, nodes, edges }: Props) {
  const [showAll, setShowAll] = useState(false);

  // Layout: root at top, children below in a single row,
  // grandchildren in further rows. Limit width per row.
  const root = nodes.find((n) => n.address === center) ?? nodes[0];
  const others = nodes.filter((n) => n.address !== root?.address);

  // Group by adjacency from root
  const childrenSet = new Set<string>();
  edges.forEach((e) => {
    if (e.from === root?.address) childrenSet.add(e.to);
    if (e.to === root?.address) childrenSet.add(e.from);
  });

  const children = others.filter((n) => childrenSet.has(n.address));
  const grandchildren = others.filter((n) => !childrenSet.has(n.address));

  const MAX_PER_ROW = showAll ? 200 : 12;
  const childrenShow = children.slice(0, MAX_PER_ROW);
  const grandShow = grandchildren.slice(0, MAX_PER_ROW);
  const childrenHidden = children.length - childrenShow.length;
  const grandHidden = grandchildren.length - grandShow.length;

  // Calculate row widths
  const rowWidth = (count: number) =>
    count * NODE_W + (count - 1) * HGAP;
  const widthChildren = rowWidth(childrenShow.length);
  const widthGrand = rowWidth(grandShow.length);
  const totalWidth = Math.max(widthChildren, widthGrand, NODE_W) + PADDING * 2;

  // Y positions
  const yRoot = PADDING;
  const yChildren = yRoot + NODE_H + VGAP;
  const yGrand = yChildren + NODE_H + VGAP;
  const totalHeight = (grandShow.length > 0 ? yGrand + NODE_H : yChildren + NODE_H) + PADDING;

  // X position helpers
  const rowStartX = (count: number) => (totalWidth - rowWidth(count)) / 2;

  const xRoot = (totalWidth - NODE_W) / 2;
  const childPositions = childrenShow.map((_, i) => rowStartX(childrenShow.length) + i * (NODE_W + HGAP));
  const grandPositions = grandShow.map((_, i) => rowStartX(grandShow.length) + i * (NODE_W + HGAP));

  if (!root) return null;

  const rootStyle = nodeStyle(root, true);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "auto",
        position: "relative",
      }}
    >
      <div style={{ padding: 14, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>
          Flowchart · {nodes.length} nodes · {edges.length} edges
        </div>
        {(childrenHidden > 0 || grandHidden > 0) && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            style={{
              fontSize: 12,
              padding: "6px 12px",
              background: "var(--brand-amber-tint)",
              border: "1px solid var(--brand-amber-line)",
              borderRadius: 6,
              color: "var(--brand-amber)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            {showAll ? "Show less" : `Show all (${nodes.length})`}
          </button>
        )}
      </div>

      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        width={totalWidth}
        style={{ display: "block", margin: "0 auto", minWidth: "100%" }}
      >
        <defs>
          <marker
            id="arrow"
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

        {/* Edges from root to children */}
        {childrenShow.map((c, i) => {
          const x1 = xRoot + NODE_W / 2;
          const y1 = yRoot + NODE_H;
          const x2 = childPositions[i] + NODE_W / 2;
          const y2 = yChildren;
          return (
            <path
              key={`re-${c.address}`}
              d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
              stroke="var(--border-strong)"
              strokeWidth="1.4"
              fill="none"
              opacity="0.6"
            />
          );
        })}

        {/* Edges from children to grandchildren (only if there are grand) */}
        {grandShow.map((g, gi) => {
          // Connect to first child in row (visual approximation)
          const childIdx = Math.min(gi, childrenShow.length - 1);
          if (childrenShow.length === 0) return null;
          const x1 = childPositions[childIdx] + NODE_W / 2;
          const y1 = yChildren + NODE_H;
          const x2 = grandPositions[gi] + NODE_W / 2;
          const y2 = yGrand;
          return (
            <path
              key={`cg-${g.address}`}
              d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
              stroke="var(--border-strong)"
              strokeWidth="1.2"
              fill="none"
              opacity="0.4"
            />
          );
        })}

        {/* Root node */}
        <foreignObject x={xRoot} y={yRoot} width={NODE_W} height={NODE_H}>
          <Link href={`/operator/${root.address}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                width: NODE_W,
                height: NODE_H,
                background: rootStyle.bg,
                border: `2px solid ${rootStyle.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
                boxShadow: `0 0 24px ${rootStyle.bg}`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  color: rootStyle.color,
                  textTransform: "uppercase",
                }}
              >
                ROOT · {root.type || "operator"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--fg-1)",
                }}
              >
                {root.label || shortAddr(root.address)}
              </div>
            </div>
          </Link>
        </foreignObject>

        {/* Children nodes */}
        {childrenShow.map((c, i) => {
          const s = nodeStyle(c, false);
          const target =
            c.type === "token" ? `/token/${c.address}` : `/operator/${c.address}`;
          return (
            <foreignObject
              key={c.address}
              x={childPositions[i]}
              y={yChildren}
              width={NODE_W}
              height={NODE_H}
            >
              <Link href={target} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    width: NODE_W,
                    height: NODE_H,
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      color: s.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {c.type || "node"} {c.risk !== undefined ? `· ${c.risk}` : ""}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-1)",
                    }}
                  >
                    {c.label || shortAddr(c.address)}
                  </div>
                </div>
              </Link>
            </foreignObject>
          );
        })}

        {/* Grandchildren */}
        {grandShow.map((g, i) => {
          const s = nodeStyle(g, false);
          const target =
            g.type === "token" ? `/token/${g.address}` : `/operator/${g.address}`;
          return (
            <foreignObject
              key={g.address}
              x={grandPositions[i]}
              y={yGrand}
              width={NODE_W}
              height={NODE_H}
            >
              <Link href={target} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    width: NODE_W,
                    height: NODE_H,
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      color: s.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {g.type || "node"}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-1)",
                    }}
                  >
                    {g.label || shortAddr(g.address)}
                  </div>
                </div>
              </Link>
            </foreignObject>
          );
        })}
      </svg>

      {(childrenHidden > 0 || grandHidden > 0) && !showAll && (
        <div style={{ padding: 14, borderTop: "1px solid var(--border)", color: "var(--fg-3)", fontSize: 12, fontFamily: "var(--font-mono)", textAlign: "center" }}>
          + {childrenHidden + grandHidden} more nodes hidden
        </div>
      )}
    </div>
  );
}
