"use client";

// OperatorTreeStatic.tsx — Hierarchical organograma with click-to-expand.
// Static layout (D3 tidy-tree), NOT a force graph.
// Ported from internal/marketing/brand/sds/v4/06_ia_completa/casen_viz_prototype.html

import { useMemo, useState, useCallback } from "react";
import { hierarchy, tree, type HierarchyPointNode } from "d3-hierarchy";
import type { TreeNode } from "@/lib/adapters/toTreeData";
import "./OperatorGraph.css";

interface Props {
  data: TreeNode;
  height?: number;
}

// v4 canonical palette
const COLOR: Record<TreeNode["type"], string> = {
  root: "#C17D0E",      // brand-amber
  operator: "#C17D0E",
  alert: "#DC2626",     // status-critical
  warning: "#D9962E",   // amber-light
  hub: "#A988D9",       // brand-purple
  legit: "#2A7A7A",     // brand-teal
  wallet: "rgba(242,237,228,0.45)",
};

const NODE_W = 220;
const NODE_H = 64;
const GAP_X = 60;
const GAP_Y = 16;

interface MutableTreeNode extends TreeNode {
  // mutable runtime state for click-to-expand:
  _expanded?: boolean;
}

function cloneTree(n: TreeNode): MutableTreeNode {
  return {
    ...n,
    _expanded: false,
    children: n.children?.map(cloneTree),
    collapsedChildren: n.collapsedChildren?.map(cloneTree),
  };
}

function shortAddr(addr: string, n = 4): string {
  if (!addr) return "?";
  if (addr.length <= n * 2 + 2) return addr;
  return `${addr.slice(0, n)}…${addr.slice(-n)}`;
}

export function OperatorTreeStatic({ data, height = 600 }: Props) {
  // Internal mutable copy so we can toggle expansion without mutating prop
  const [root, setRoot] = useState<MutableTreeNode>(() => cloneTree(data));

  const toggle = useCallback((targetId: string) => {
    setRoot((prev) => {
      const mutate = (n: MutableTreeNode): MutableTreeNode => {
        if (n.id === targetId) {
          // Swap children ↔ collapsedChildren
          if (n.collapsedChildren && n.collapsedChildren.length) {
            return {
              ...n,
              children: [...(n.children ?? []), ...n.collapsedChildren],
              collapsedChildren: [],
              _expanded: true,
            };
          }
          if (n.children && n.children.length && n._expanded) {
            // Re-collapse: move children back to collapsedChildren
            return {
              ...n,
              children: [],
              collapsedChildren: n.children,
              _expanded: false,
            };
          }
          return n;
        }
        if (n.children) {
          return { ...n, children: n.children.map(mutate) };
        }
        return n;
      };
      return mutate(prev);
    });
  }, []);

  // Compute D3 tidy-tree layout
  const { positions, width, vbY, vbH } = useMemo(() => {
    const h = hierarchy<MutableTreeNode>(root, (d) => d.children);
    const layout = tree<MutableTreeNode>().nodeSize([
      NODE_H + GAP_Y,
      NODE_W + GAP_X,
    ]);
    layout(h);

    let minY = Infinity, maxY = -Infinity, maxX = 0;
    h.each((n) => {
      const p = n as HierarchyPointNode<MutableTreeNode>;
      if (p.x < minY) minY = p.x;
      if (p.x > maxY) maxY = p.x;
      if (p.y > maxX) maxX = p.y;
    });
    const w = maxX + NODE_W + 60;
    const totalH = maxY - minY + NODE_H + 60;
    return {
      positions: h,
      width: w,
      vbY: minY - 30,
      vbH: totalH,
    };
  }, [root]);

  const nodes: HierarchyPointNode<MutableTreeNode>[] = [];
  positions.each((n) => nodes.push(n as HierarchyPointNode<MutableTreeNode>));

  const links: HierarchyPointNode<MutableTreeNode>[][] = [];
  positions.links().forEach((l) => {
    links.push([
      l.source as HierarchyPointNode<MutableTreeNode>,
      l.target as HierarchyPointNode<MutableTreeNode>,
    ]);
  });

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "var(--surface, #100E0A)",
        border: "1px solid var(--border, #1E1B16)",
        borderRadius: 8,
        position: "relative",
        overflow: "auto",
      }}
    >
      <svg
        viewBox={`-30 ${vbY} ${width + 60} ${vbH}`}
        width={width + 60}
        height={vbH}
        style={{ display: "block", minHeight: height }}
      >
        {/* Links */}
        {links.map((pair, i) => {
          const [s, t] = pair;
          const sx = s.y + NODE_W;
          const sy = s.x + NODE_H / 2;
          const tx = t.y;
          const ty = t.x + NODE_H / 2;
          const mx = (sx + tx) / 2;
          const targetColor = COLOR[t.data.type];
          const isAlert = t.data.type === "alert" || t.data.type === "warning";
          return (
            <path
              key={i}
              d={`M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`}
              fill="none"
              stroke={isAlert ? targetColor : "rgba(242,237,228,0.25)"}
              strokeWidth={isAlert ? 1.6 : 1}
              opacity={0.7}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const d = n.data;
          const c = COLOR[d.type];
          const hasCollapsed =
            (d.collapsedChildren && d.collapsedChildren.length > 0) || false;
          const hasExpandedChildren =
            (d.children && d.children.length > 0 && d._expanded) || false;
          const isClickable = hasCollapsed || hasExpandedChildren;

          return (
            <g
              key={d.id}
              transform={`translate(${n.y},${n.x})`}
              style={{ cursor: isClickable ? "pointer" : "default" }}
              onClick={() => isClickable && toggle(d.id)}
            >
              {/* Card rect */}
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={4}
                fill="rgba(16,14,10,0.92)"
                stroke={c}
                strokeWidth={d.type === "root" ? 2 : 1}
              />
              {/* Line 1: name (bold) */}
              <text
                x={12}
                y={22}
                fill={d.type === "root" ? c : "var(--fg-1, #F2EDE4)"}
                style={{
                  fontFamily: "var(--font-mono, ui-monospace)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {d.name.length > 22 ? d.name.slice(0, 22) + "…" : d.name}
              </text>
              {/* Line 2: subtitle */}
              <text
                x={12}
                y={38}
                fill="var(--fg-2, rgba(242,237,228,0.55))"
                style={{
                  fontFamily: "var(--font-mono, ui-monospace)",
                  fontSize: 9,
                }}
              >
                {shortAddr(d.id, 4)} · {d.subtitle ?? "wallet"}
              </text>
              {/* Line 3: expand hint */}
              <text
                x={12}
                y={52}
                fill={c}
                style={{
                  fontFamily: "var(--font-mono, ui-monospace)",
                  fontSize: 9,
                  fontWeight: 600,
                }}
              >
                {hasCollapsed
                  ? `+ ${d.collapsedChildren!.length} hidden · click to expand`
                  : hasExpandedChildren
                    ? `− ${d.children!.length} shown · click to collapse`
                    : d.type === "root"
                      ? "operator (center)"
                      : ""}
              </text>

              {/* Expand/collapse chevron */}
              {isClickable && (
                <g transform={`translate(${NODE_W - 22}, ${NODE_H / 2})`}>
                  <circle r={9} fill={c} opacity={0.18} />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={c}
                    style={{
                      fontFamily: "var(--font-mono, ui-monospace)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {hasCollapsed ? "+" : "−"}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend + attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          fontFamily: "var(--font-mono, ui-monospace)",
          fontSize: 10,
          color: "var(--fg-2, rgba(242,237,228,0.55))",
          padding: "6px 10px",
          background: "rgba(16,14,10,0.8)",
          borderRadius: 4,
          backdropFilter: "blur(6px)",
        }}
      >
        <Legend color={COLOR.root} label="center" />
        <Legend color={COLOR.alert} label="risk ≥80" />
        <Legend color={COLOR.warning} label="risk ≥50" />
        <Legend color={COLOR.hub} label="cex/mixer" />
        <Legend color={COLOR.legit} label="safe" />
        <Legend color={COLOR.wallet} label="wallet" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          fontFamily: "var(--font-mono, ui-monospace)",
          fontSize: 9,
          color: "rgba(242,237,228,0.3)",
        }}
      >
        tidy-tree organograma · click cards with{" "}
        <span style={{ color: "var(--brand-amber, #C17D0E)" }}>+</span> to
        expand
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          width: 12,
          height: 3,
          background: color,
          display: "inline-block",
          borderRadius: 1,
        }}
      />
      <span>{label}</span>
    </span>
  );
}
