"use client";

/**
 * TraceNetworkGraph — SolSentry P3 Network Experience
 *
 * High-density, delightful graph that combines:
 * - Structured trace/organograma layout (Haradrim Trace style)
 * - Rich wallet semantics from DrainOfTheDay (types, amounts, time, tags)
 * - Clean interactions so users can explore a lot of information without getting lost or bored.
 *
 * Tasks being executed in this file:
 * 1. Smart automatic layout (columns + vertical distribution)
 * 2. Beautiful flow edges
 * 3. Rich side panel (added in wrapper)
 * 4. Filters & modes (added in wrapper)
 */

import React, { memo, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type Node as RFNode,
  type Edge as RFEdge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ─────────────────────────────────────────────────────────────────────────
// Unified Types
// ─────────────────────────────────────────────────────────────────────────

export type WalletNodeType =
  | "operator"
  | "victim"
  | "split"
  | "hop"
  | "consolidation"
  | "cex"
  | "mixer"
  | "bridge"
  | "wallet";

export interface TraceWalletNode {
  id: string;
  address: string;
  label?: string;
  type: WalletNodeType;
  risk?: number;
  amount?: number;
  time?: string;
  tag?: string;
  column: number; // negative = inflow, 0 = center, positive = outflow
  metadata?: Record<string, unknown>;
  // React Flow's Node.data requires an index signature.
  [key: string]: unknown;
}

export interface TraceFlowEdge {
  id: string;
  source: string;
  target: string;
  amount?: number;
  kind?: string;
  classification?: string;
  timestamp?: number;
  // React Flow's Edge.data requires an index signature.
  [key: string]: unknown;
}

interface TraceNetworkGraphProps {
  centerWallet: string;
  nodes: TraceWalletNode[];
  edges: TraceFlowEdge[];
  height?: number;
  onNodeClick?: (node: TraceWalletNode) => void;
  onEdgeClick?: (edge: TraceFlowEdge) => void;
  mode?: "full" | "money-flow" | "relationships" | "deep-trace";
}

// ─────────────────────────────────────────────────────────────────────────
// Smart Layout Engine (column + vertical distribution)
// ─────────────────────────────────────────────────────────────────────────

function computeSmartLayout(nodes: TraceWalletNode[]): Record<string, { x: number; y: number }> {
  const layout: Record<string, { x: number; y: number }> = {};
  const columnGroups = new Map<number, TraceWalletNode[]>();

  nodes.forEach((node) => {
    if (!columnGroups.has(node.column)) columnGroups.set(node.column, []);
    columnGroups.get(node.column)!.push(node);
  });

  const sortedColumns = Array.from(columnGroups.keys()).sort((a, b) => a - b);
  const BASE_X = 300;
  const MIN_VERTICAL_SPACING = 85;
  const CENTER_Y = 340;

  sortedColumns.forEach((col) => {
    const group = columnGroups.get(col)!;
    const x = col * BASE_X;

    // Prioritize important nodes near the center vertically
    group.sort((a, b) => {
      const scoreA = a.type === "operator" || a.type === "victim" ? 100 : a.amount || 0;
      const scoreB = b.type === "operator" || b.type === "victim" ? 100 : b.amount || 0;
      return scoreB - scoreA;
    });

    const count = group.length;
    const totalHeight = (count - 1) * MIN_VERTICAL_SPACING;
    let startY = CENTER_Y - totalHeight / 2;

    // Spread branches more on outer columns
    const spread = Math.abs(col) > 1 ? 1.15 : 1.0;

    group.forEach((node, index) => {
      const y = startY + index * MIN_VERTICAL_SPACING * spread;
      layout[node.id] = { x, y };
    });
  });

  return layout;
}

// ─────────────────────────────────────────────────────────────────────────
// Rich Node (Drain semantics + clean trace card style)
// ─────────────────────────────────────────────────────────────────────────

const RichTraceNode = memo(function RichTraceNode({ data, selected }: NodeProps) {
  const node = data as unknown as TraceWalletNode;
  const isCenter = node.type === "operator" && node.column === 0;

  const borderColor = selected
    ? "#C17D0E"
    : node.type === "victim"
      ? "#ef4444"
      : node.type === "cex"
        ? "#22c55e"
        : node.type === "mixer" || node.type === "bridge"
          ? "#a855f7"
          : node.risk && node.risk >= 80
            ? "#ef4444"
            : node.risk && node.risk >= 50
              ? "#f59e0b"
              : "#2A251C";

  const accent = isCenter ? "#C17D0E" : borderColor;

  return (
    <div
      style={{
        width: 215,
        minHeight: 72,
        background: "rgba(16,14,10,0.96)",
        border: `1.5px solid ${borderColor}`,
        borderRadius: 6,
        padding: "8px 11px",
        fontFamily: "var(--font-mono, ui-monospace)",
        fontSize: 11,
        color: "#F2EDE4",
        boxShadow: selected ? `0 0 0 3px rgba(193,125,14,0.3)` : "none",
        transition: "all 100ms ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 11,
            color: accent,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {node.label || `${node.address.slice(0, 5)}…${node.address.slice(-4)}`}
        </div>
        <div style={{ fontSize: 9, color: "#5A5448", textTransform: "uppercase" }}>{node.type}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 12 }}>
        {node.amount !== undefined && (
          <div style={{ color: accent, fontWeight: 600 }}>{node.amount.toLocaleString()} SOL</div>
        )}
        {node.time && <div style={{ color: "#5A5448", fontSize: 10 }}>{node.time}</div>}
      </div>

      {node.tag && (
        <div
          style={{
            position: "absolute",
            top: -7,
            right: 8,
            background: accent,
            color: "#100E0A",
            fontSize: 9,
            fontWeight: 600,
            padding: "0 6px",
            borderRadius: 999,
          }}
        >
          {node.tag}
        </div>
      )}
    </div>
  );
});

const nodeTypes = { traceWallet: RichTraceNode };

// ─────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────

// Rich edge with nice flow animation (DrainOfTheDay inspired)
const RichTraceEdge = memo(function RichTraceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: any) {
  const edge = data as TraceFlowEdge;
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  const strokeWidth = Math.max(1.8, Math.min(7, (edge.amount ?? 800) / 1200));
  const isHighlighted = selected;

  return (
    <g className="trace-edge-group">
      <path
        id={id}
        d={`M ${sourceX} ${sourceY} Q ${(sourceX + targetX) / 2} ${sourceY - 28} ${targetX} ${targetY}`}
        fill="none"
        stroke={isHighlighted ? "#C17D0E" : "#3A2E1F"}
        strokeWidth={strokeWidth}
        opacity={isHighlighted ? 1 : 0.85}
        strokeDasharray={isHighlighted ? "12 6" : "none"}
        className={isHighlighted ? "trace-flow-animated" : ""}
      />

      {edge.amount && (
        <text
          x={midX}
          y={midY - 14}
          textAnchor="middle"
          fill={isHighlighted ? "#C17D0E" : "#8A7A5A"}
          fontSize={10}
          fontFamily="var(--font-mono, ui-monospace)"
          fontWeight={isHighlighted ? 600 : 400}
          style={{ pointerEvents: "none" }}
        >
          {edge.amount.toLocaleString()} SOL
        </text>
      )}
    </g>
  );
});

const edgeTypes = {
  traceFlow: RichTraceEdge,
};

export function TraceNetworkGraph({
  centerWallet,
  nodes,
  edges,
  height = 620,
  onNodeClick,
  onEdgeClick,
  mode = "full",
}: TraceNetworkGraphProps) {
  const [selectedNode, setSelectedNode] = React.useState<TraceWalletNode | null>(null);
  const [currentMode, setCurrentMode] = React.useState<
    "full" | "money-flow" | "relationships" | "deep-trace"
  >(mode);

  // Simple filtering based on mode
  const filteredNodes = useMemo(() => {
    if (currentMode === "money-flow") {
      return nodes.filter((n) =>
        ["victim", "split", "hop", "consolidation", "cex"].includes(n.type),
      );
    }
    if (currentMode === "relationships") {
      return nodes.filter((n) => n.type === "operator" || n.type === "wallet");
    }
    return nodes;
  }, [nodes, currentMode]);

  const filteredEdges = useMemo(() => {
    const allowedIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter((e) => allowedIds.has(e.source) && allowedIds.has(e.target));
  }, [edges, filteredNodes]);

  const positions = useMemo(() => computeSmartLayout(filteredNodes), [filteredNodes]);

  const rfNodes: RFNode[] = useMemo(() => {
    return filteredNodes.map((node) => ({
      id: node.id,
      type: "traceWallet",
      position: positions[node.id] || { x: node.column * 280, y: 0 },
      data: node,
    }));
  }, [filteredNodes, positions]);

  const rfEdges: RFEdge[] = useMemo(() => {
    return filteredEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "traceFlow",
      data: edge,
      animated: true,
    }));
  }, [filteredEdges]);

  const handleNodeClick = useCallback(
    (node: TraceWalletNode) => {
      setSelectedNode(node);
      if (onNodeClick) onNodeClick(node);
    },
    [onNodeClick],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height, width: "100%" }}>
      {/* Simple mode switcher */}
      <div
        style={{
          padding: "8px 12px",
          background: "#1a1a1a",
          borderBottom: "1px solid #2A251C",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {(["full", "money-flow", "relationships", "deep-trace"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCurrentMode(m)}
            style={{
              background: currentMode === m ? "#C17D0E" : "#2A251C",
              color: currentMode === m ? "#100E0A" : "#F2EDE4",
              border: "none",
              padding: "4px 10px",
              borderRadius: 4,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {m === "full" && "Completo"}
            {m === "money-flow" && "Só Fluxo de Dinheiro"}
            {m === "relationships" && "Só Relacionamentos"}
            {m === "deep-trace" && "Trace Profundo"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative", background: "#100E0A" }}>
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={2.5}
            onNodeClick={(_, node) => {
              const original = filteredNodes.find((n) => n.id === node.id);
              if (original) handleNodeClick(original);
            }}
            onEdgeClick={(_, edge) => {
              const original = filteredEdges.find((e) => e.id === edge.id);
              if (original && onEdgeClick) onEdgeClick(original);
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#2A251C" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Side panel */}
        {selectedNode && (
          <div
            style={{
              width: 340,
              background: "#1a1a1a",
              borderLeft: "1px solid #2A251C",
              padding: 16,
              overflowY: "auto",
              fontSize: 13,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <strong style={{ color: "#C17D0E" }}>Detalhes do Nó</strong>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f59e0b",
                  fontSize: 18,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                wordBreak: "break-all",
                background: "#111",
                padding: 8,
                borderRadius: 4,
                marginBottom: 12,
              }}
            >
              {selectedNode.address}
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888" }}>Tipo</span>
                <strong style={{ textTransform: "uppercase" }}>{selectedNode.type}</strong>
              </div>
              {selectedNode.risk !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Risco</span>
                  <strong style={{ color: selectedNode.risk > 70 ? "#ef4444" : "#f59e0b" }}>
                    {selectedNode.risk}
                  </strong>
                </div>
              )}
              {selectedNode.amount !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Valor movido</span>
                  <strong style={{ color: "#C17D0E" }}>{selectedNode.amount} SOL</strong>
                </div>
              )}
              {selectedNode.time && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Última atividade</span>
                  <span>{selectedNode.time}</span>
                </div>
              )}
              {selectedNode.tag && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Tag</span>
                  <span style={{ color: "#f59e0b" }}>{selectedNode.tag}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>AÇÕES RÁPIDAS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <a
                  href={`/operator/${selectedNode.address}`}
                  style={{ color: "#C17D0E", fontSize: 13, textDecoration: "none" }}
                >
                  → Ver perfil completo do operador
                </a>
                <a
                  href={`/drain/${selectedNode.address}`}
                  style={{ color: "#C17D0E", fontSize: 13, textDecoration: "none" }}
                >
                  → Ver trace de dinheiro (drain)
                </a>
                <button
                  onClick={() => alert("Adicionado à watchlist (mock por enquanto)")}
                  style={{
                    background: "transparent",
                    border: "1px solid #C17D0E",
                    color: "#C17D0E",
                    padding: "6px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                    marginTop: 4,
                    textAlign: "left",
                  }}
                >
                  + Adicionar à Watchlist
                </button>
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                paddingTop: 12,
                borderTop: "1px solid #2A251C",
                fontSize: 11,
                color: "#555",
              }}
            >
              Clique em outros nós para explorar conexões. Mais dados (timeline completa, export,
              histórico de risco) em breve.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
