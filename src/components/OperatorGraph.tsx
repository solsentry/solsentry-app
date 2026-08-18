"use client";

// OperatorGraph.tsx v3 — Haradrim trace-style visualization.
//
// Patterns adapted from Haradrim (github.com/mertimus/haradrim, MIT,
// Mert Mumtaz / Helius). Color tokens swapped to SolSentry v4 canonical Âmbar.
//
// Visual style: rectangular card nodes (3-line content) connected by bezier
// curves, on a dark warm surface. Matches haradrim.net/trace/<wallet> layout.

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BaseEdge,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  getBezierPath,
  type Edge as RFEdge,
  type EdgeProps,
  type Node as RFNode,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./OperatorGraph.css";
import type { OutputNode } from "@/workers/force-layout.worker";

interface InputNode {
  address: string;
  type?: string;
  risk?: number;
  label?: string;
  isRoot?: boolean;
}

interface InputEdge {
  from: string;
  to: string;
  weight?: number;
  kind?: string;
}

interface Props {
  center: string;
  nodes: InputNode[];
  edges: InputEdge[];
  height?: number;
}

type Tier = 0 | 1 | 2 | 3;

// Card dimensions — matches Haradrim TraceNode NODE_WIDTH = 200
const CARD_W = 200;
const CARD_H = 60;

// v4 canonical palette
const COLOR = {
  center: "#C17D0E", // brand-amber (operator)
  critical: "#DC2626", // status-critical
  high: "#D9962E", // amber-light
  cex: "#A988D9", // brand-purple
  mixer: "#A988D9",
  legit: "#2A7A7A", // brand-teal
  other: "rgba(242,237,228,0.45)",
};

function shortAddr(addr: string | undefined | null): string {
  if (!addr) return "?";
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function nodeColor(node: InputNode, isCenter: boolean): string {
  if (isCenter) return COLOR.center;
  if (node.risk !== undefined && node.risk >= 80) return COLOR.critical;
  if (node.risk !== undefined && node.risk >= 50) return COLOR.high;
  if (node.type === "cex" || node.type === "mixer") return COLOR.cex;
  return COLOR.other;
}

function nodeKindLabel(node: InputNode, isCenter: boolean): string {
  if (isCenter) return "Operator · center";
  if (node.type === "cex") return "CEX";
  if (node.type === "mixer") return "Mixer";
  if (node.type === "program") return "Program";
  if (node.type === "token") return "Token";
  if (node.risk !== undefined && node.risk >= 80) return "CRITICAL · wallet";
  if (node.risk !== undefined && node.risk >= 50) return "HIGH · wallet";
  return "Wallet";
}

// ─────────────────────────────────────────────────────────────────────────
// Rectangular card node
// ─────────────────────────────────────────────────────────────────────────

interface OperatorNodeData {
  address: string;
  label: string;
  kindLabel: string;
  metric: string;
  color: string;
  tier: Tier;
  glowRgb: string;
  active: boolean;
  [key: string]: unknown;
}

const OperatorNode = memo(function OperatorNode({ data }: NodeProps) {
  const d = data as OperatorNodeData;
  const tierClass =
    d.tier === 0
      ? "op-card-center"
      : d.tier === 1
        ? "op-card-tier1"
        : d.tier === 2
          ? "op-card-tier2"
          : "op-card-tier3";

  // Border style matches Haradrim TraceNode: 2px on seed, 1px others, uniform.
  const borderW = d.tier === 0 ? 2 : 1;
  const accentColor = d.color;

  return (
    <div
      className={`op-card ${tierClass}`}
      style={
        {
          width: CARD_W,
          minHeight: CARD_H,
          background: "rgba(16,14,10,0.92)",
          border: `${borderW}px solid ${accentColor}`,
          borderRadius: 4,
          padding: "7px 10px",
          fontFamily: "var(--font-mono, ui-monospace)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          cursor: "grab",
          position: "relative",
          backdropFilter: "blur(4px)",
          "--whale-rgb": d.glowRgb,
        } as React.CSSProperties
      }
    >
      {/* Line 1: bold label (matches Haradrim font-bold 10px) */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: d.tier === 0 ? accentColor : "var(--fg-1, #F2EDE4)",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {d.label}
      </div>
      {/* Line 2: address shortcode (matches Haradrim text-[9px] muted) */}
      <div
        style={{
          fontSize: 9,
          color: "var(--fg-2, rgba(242,237,228,0.55))",
          lineHeight: 1.2,
        }}
      >
        {shortAddr(d.address)} · {d.kindLabel}
      </div>
      {/* Line 3: metric (matches Haradrim text-[9px] foreground/70) */}
      <div
        style={{
          fontSize: 9,
          color: "rgba(242,237,228,0.7)",
          lineHeight: 1.2,
        }}
      >
        {d.metric}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
});

const nodeTypes = { operator: OperatorNode };

// ─────────────────────────────────────────────────────────────────────────
// Bezier ConnectionEdge with hover tooltip
// ─────────────────────────────────────────────────────────────────────────

interface ConnectionEdgeData {
  thickness: number;
  opacity: number;
  weight: number;
  label?: string;
  [key: string]: unknown;
}

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "rgba(16,14,10,0.95)",
  border: "1px solid rgba(242,237,228,0.15)",
  borderRadius: 4,
  padding: "6px 10px",
  fontFamily: "var(--font-mono, ui-monospace)",
  fontSize: 10,
  color: "var(--fg-1, #F2EDE4)",
  textAlign: "center",
  whiteSpace: "nowrap",
  pointerEvents: "none",
};

const ConnectionEdge = memo(function ConnectionEdge({
  id,
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  data,
}: EdgeProps) {
  const d = (data ?? { thickness: 1, opacity: 0.4, weight: 1 }) as ConnectionEdgeData;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  return (
    <g
      className="connection-edge-group connection-edge-reveal"
      style={
        {
          "--edge-opacity": d.opacity,
          "--edge-thickness": d.thickness,
        } as React.CSSProperties
      }
    >
      {/* Invisible hit area */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={22}
        pointerEvents="all"
        style={{ cursor: "default" }}
      />
      {/* Visible bezier */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "#C17D0E",
          strokeWidth: d.thickness,
          opacity: d.opacity,
          fill: "none",
        }}
      />
      {/* Tooltip */}
      <foreignObject
        x={labelX - 90}
        y={labelY - 30}
        width={180}
        height={56}
        className="conn-edge-tooltip"
        style={{ overflow: "visible" }}
      >
        <div style={TOOLTIP_STYLE}>
          <div>{d.label ?? `weight ${d.weight}`}</div>
          <div style={{ color: "rgba(242,237,228,0.55)", marginTop: 2, fontSize: 9 }}>
            {shortAddr(source as string)} → {shortAddr(target as string)}
          </div>
        </div>
      </foreignObject>
    </g>
  );
});

const edgeTypes = { connection: ConnectionEdge };

// ─────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────

export function OperatorGraph({ center, nodes, edges, height = 600 }: Props) {
  const [layout, setLayout] = useState<Record<string, { x: number; y: number }>>({});
  const [busy, setBusy] = useState(true);
  const [hover, setHover] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Degree per node (for tier ranking + metric display)
  const degree = useMemo(() => {
    const d: Record<string, number> = {};
    for (const e of edges) {
      d[e.from] = (d[e.from] ?? 0) + 1;
      d[e.to] = (d[e.to] ?? 0) + 1;
    }
    return d;
  }, [edges]);

  // Tier assignment
  const tiers = useMemo(() => {
    const sorted = nodes
      .filter((n) => n.address !== center)
      .map((n) => ({ addr: n.address, deg: degree[n.address] ?? 0 }))
      .sort((a, b) => b.deg - a.deg);
    const t: Record<string, Tier> = { [center]: 0 };
    sorted.forEach((s, i) => {
      if (i < 5) t[s.addr] = 1;
      else if (i < 15) t[s.addr] = 2;
      else t[s.addr] = 3;
    });
    return t;
  }, [nodes, center, degree]);

  // Hub positions per tier — wider rings because cards are bigger than circles
  const hubs = useMemo(() => {
    const out: Record<string, { x: number; y: number }> = {};
    out[center] = { x: 0, y: 0 };
    const tier1 = nodes.filter((n) => tiers[n.address] === 1);
    const tier2 = nodes.filter((n) => tiers[n.address] === 2);
    const tier3 = nodes.filter((n) => tiers[n.address] === 3);
    // Wider rings for 200px cards (vs original 140px)
    const R1 = 380,
      R2 = 680,
      R3 = 960;
    tier1.forEach((n, i) => {
      const t = (i / Math.max(tier1.length, 1)) * Math.PI * 2;
      out[n.address] = { x: Math.cos(t) * R1, y: Math.sin(t) * R1 };
    });
    tier2.forEach((n, i) => {
      const t = (i / Math.max(tier2.length, 1)) * Math.PI * 2 + 0.3;
      out[n.address] = { x: Math.cos(t) * R2, y: Math.sin(t) * R2 };
    });
    tier3.forEach((n, i) => {
      const t = (i / Math.max(tier3.length, 1)) * Math.PI * 2 + 0.6;
      out[n.address] = { x: Math.cos(t) * R3, y: Math.sin(t) * R3 };
    });
    return out;
  }, [center, nodes, tiers]);

  // Force layout via worker — bigger collide radius for rectangular cards
  useEffect(() => {
    setBusy(true);
    const worker = new Worker(new URL("../workers/force-layout.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    const inputNodes = nodes.map((n) => ({
      id: n.address,
      // size used by collide radius (size * 0.55 + 15 in worker)
      // For 200×60 cards we want radius ~ 130 → size ≈ 210
      size: 210,
      hubX: hubs[n.address]?.x ?? 0,
      hubY: hubs[n.address]?.y ?? 0,
    }));
    const inputLinks = edges
      .filter(
        (e) => inputNodes.some((n) => n.id === e.from) && inputNodes.some((n) => n.id === e.to),
      )
      .map((e) => ({ source: e.from, target: e.to }));

    worker.onmessage = (ev: MessageEvent<{ type: "done"; nodes: OutputNode[] }>) => {
      if (ev.data.type !== "done") return;
      const map: Record<string, { x: number; y: number }> = {};
      for (const n of ev.data.nodes) map[n.id] = { x: n.x, y: n.y };
      setLayout(map);
      setBusy(false);
    };

    worker.postMessage({ type: "run", nodes: inputNodes, links: inputLinks });

    return () => {
      worker.terminate();
    };
  }, [nodes, edges, hubs]);

  // ReactFlow nodes
  const rfNodes: RFNode[] = useMemo(() => {
    return nodes.map((n) => {
      const isCenter = n.address === center;
      const tier = tiers[n.address] ?? 3;
      const pos = layout[n.address] ?? hubs[n.address] ?? { x: 0, y: 0 };
      const color = nodeColor(n, isCenter);
      const active = hover === n.address;
      const deg = degree[n.address] ?? 0;

      // glow color matches node accent
      const hex = color.startsWith("#") ? color.replace("#", "") : "C17D0E";
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const glowRgb = `rgba(${r}, ${g}, ${b}, 0.5)`;

      const metric =
        deg > 0
          ? `${deg} connection${deg !== 1 ? "s" : ""}`
          : isCenter
            ? "center node"
            : "no edges";

      const data: OperatorNodeData = {
        address: n.address,
        label: n.label ?? shortAddr(n.address),
        kindLabel: nodeKindLabel(n, isCenter),
        metric,
        color,
        tier,
        glowRgb,
        active,
      };
      return {
        id: n.address,
        type: "operator",
        // Subtract half card dims so xy is the CENTER (matches the force layout output)
        position: { x: pos.x - CARD_W / 2, y: pos.y - CARD_H / 2 },
        draggable: true,
        data,
      } as RFNode;
    });
  }, [nodes, center, layout, hubs, hover, tiers, degree]);

  // ReactFlow edges
  const rfEdges: RFEdge[] = useMemo(() => {
    let maxW = 1;
    for (const e of edges) maxW = Math.max(maxW, e.weight ?? 1);

    return edges.slice(0, 400).map((e, i) => {
      const w = e.weight ?? 1;
      const thickness = 1 + (w / maxW) * 2.5;
      const degAvg = ((degree[e.from] ?? 0) + (degree[e.to] ?? 0)) / 2;
      const opacity = 0.25 + Math.min(0.55, degAvg * 0.04);
      const data: ConnectionEdgeData = {
        thickness,
        opacity,
        weight: w,
        label: e.kind ?? (w > 1 ? `weight ${w}` : undefined),
      };
      return {
        id: `e${i}-${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        type: "connection",
        data,
      } as RFEdge;
    });
  }, [edges, degree]);

  const onNodeMouseEnter = useCallback((_: unknown, node: RFNode) => {
    setHover(node.id);
  }, []);
  const onNodeMouseLeave = useCallback(() => setHover(null), []);

  return (
    <div
      className="operator-graph-container"
      style={{
        width: "100%",
        height,
        background: "var(--surface, #100E0A)",
        border: "1px solid var(--border, #1E1B16)",
        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {busy && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            padding: "4px 10px",
            background: "rgba(242,237,228,0.08)",
            border: "1px solid var(--border, #1E1B16)",
            borderRadius: 4,
            color: "var(--fg-2, rgba(242,237,228,0.55))",
            fontFamily: "var(--font-mono, ui-monospace)",
            fontSize: 11,
          }}
        >
          ⟳ computing layout
        </div>
      )}

      {hover && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 10,
            padding: "6px 10px",
            background: "rgba(16,14,10,0.9)",
            border: "1px solid var(--border, #1E1B16)",
            borderRadius: 4,
            color: "var(--fg-1, #F2EDE4)",
            fontFamily: "var(--font-mono, ui-monospace)",
            fontSize: 11,
          }}
        >
          {shortAddr(hover)}
          {degree[hover] !== undefined && (
            <span
              style={{
                marginLeft: 8,
                color: "var(--fg-2, rgba(242,237,228,0.55))",
              }}
            >
              · {degree[hover]} connections
            </span>
          )}
          <div style={{ marginTop: 4, color: "var(--brand-amber)", fontSize: 9 }}>Click node to copy address</div>
        </div>
      )}

      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeClick={(_, node) => {
          navigator.clipboard.writeText(node.id);
        }}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.1}
        maxZoom={2.5}
        defaultEdgeOptions={{ type: "connection" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(242,237,228,0.04)"
          gap={28}
          size={1}
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
          style={{
            background: "var(--surface-2, #1E1B16)",
            border: "1px solid var(--border, #1E1B16)",
            borderRadius: 4,
          }}
        />
      </ReactFlow>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          zIndex: 10,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          fontFamily: "var(--font-mono, ui-monospace)",
          fontSize: 10,
          color: "var(--fg-2, rgba(242,237,228,0.55))",
          padding: "6px 10px",
          background: "rgba(16,14,10,0.7)",
          borderRadius: 4,
          backdropFilter: "blur(6px)",
        }}
      >
        <LegendBar color={COLOR.center} label="center" />
        <LegendBar color={COLOR.critical} label="risk ≥80" />
        <LegendBar color={COLOR.high} label="risk ≥50" />
        <LegendBar color={COLOR.cex} label="cex/mixer" />
        <LegendBar color={COLOR.other} label="other" />
      </div>

      {/* Attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 60,
          zIndex: 10,
          fontFamily: "var(--font-mono, ui-monospace)",
          fontSize: 9,
          color: "rgba(242,237,228,0.3)",
        }}
      >
        graph patterns from{" "}
        <a
          href="https://github.com/mertimus/haradrim"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          haradrim
        </a>{" "}
        (MIT)
      </div>
    </div>
  );
}

function LegendBar({ color, label }: { color: string; label: string }) {
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
