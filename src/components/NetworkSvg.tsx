"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  address: string;
  type?: string;
  risk?: number;
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

interface Pos {
  x: number;
  y: number;
}

function nodeColor(node: Node, isCenter: boolean): string {
  if (isCenter) return "var(--brand-amber)";
  if (node.risk !== undefined) {
    if (node.risk >= 80) return "var(--status-critical)";
    if (node.risk >= 50) return "var(--brand-amber)";
  }
  if (node.type === "cex") return "var(--brand-purple)";
  if (node.type === "mixer") return "var(--brand-purple)";
  return "var(--brand-teal)";
}

export function NetworkSvg({ center, nodes, edges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      setSize({ w: Math.floor(e.contentRect.width), h: 560 });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const limitedNodes = nodes.slice(0, 80);
  const positions = layout(limitedNodes, edges, center, size.w, size.h);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        viewBox={`0 0 ${size.w} ${size.h}`}
        width="100%"
        height={size.h}
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(193, 125, 14, 0.5)" />
            <stop offset="100%" stopColor="rgba(193, 125, 14, 0)" />
          </radialGradient>
        </defs>
        {edges.slice(0, 200).map((e, i) => {
          const a = positions[e.from];
          const b = positions[e.to];
          if (!a || !b) return null;
          const active = hover && (hover === e.from || hover === e.to);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={active ? "var(--brand-amber)" : "var(--border-strong)"}
              strokeOpacity={active ? 0.8 : 0.4}
              strokeWidth={active ? 1.5 : 1}
            />
          );
        })}
        {limitedNodes.map((n) => {
          const p = positions[n.address];
          if (!p) return null;
          const isCenter = n.address === center;
          const r = isCenter ? 14 : n.risk && n.risk > 50 ? 8 : 6;
          const color = nodeColor(n, isCenter);
          return (
            <g
              key={n.address}
              onMouseEnter={() => setHover(n.address)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              {isCenter && (
                <circle cx={p.x} cy={p.y} r={32} fill="url(#centerGlow)" />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={color}
                stroke="var(--bg)"
                strokeWidth={2}
                opacity={hover && hover !== n.address ? 0.45 : 1}
              />
              {(isCenter || hover === n.address) && (
                <text
                  x={p.x}
                  y={p.y + r + 14}
                  textAnchor="middle"
                  fill="var(--fg-1)"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                >
                  {n.address.slice(0, 8)}…
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: "var(--fg-3)",
          background: "rgba(16, 14, 10, 0.6)",
          padding: "4px 8px",
          borderRadius: 4,
        }}
      >
        {limitedNodes.length} of {nodes.length} nodes · hover for label
      </div>
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          background: "rgba(16, 14, 10, 0.6)",
          padding: 8,
          borderRadius: 4,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Legend color="var(--brand-amber)" label="center" />
        <Legend color="var(--status-critical)" label="risk≥80" />
        <Legend color="var(--brand-amber)" label="risk≥50" />
        <Legend color="var(--brand-teal)" label="other" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
        }}
      />
      <span style={{ color: "var(--fg-2)" }}>{label}</span>
    </span>
  );
}

function layout(
  nodes: Node[],
  edges: Edge[],
  center: string,
  w: number,
  h: number,
): Record<string, Pos> {
  const pos: Record<string, Pos> = {};
  const cx = w / 2;
  const cy = h / 2;
  pos[center] = { x: cx, y: cy };

  // Identify hop-1 vs hop-2+ via simple BFS
  const adj: Record<string, Set<string>> = {};
  for (const e of edges) {
    if (!adj[e.from]) adj[e.from] = new Set();
    if (!adj[e.to]) adj[e.to] = new Set();
    adj[e.from].add(e.to);
    adj[e.to].add(e.from);
  }

  const hop1 = new Set<string>();
  const hop2 = new Set<string>();
  const direct = adj[center];
  if (direct) {
    direct.forEach((a) => hop1.add(a));
  }
  for (const n of nodes) {
    if (n.address === center || hop1.has(n.address)) continue;
    hop2.add(n.address);
  }

  const ring1 = Math.min(w, h) * 0.28;
  const ring2 = Math.min(w, h) * 0.45;

  const ring1List = [...hop1];
  ring1List.forEach((a, i) => {
    const angle = (i / Math.max(ring1List.length, 1)) * Math.PI * 2 - Math.PI / 2;
    pos[a] = {
      x: cx + Math.cos(angle) * ring1,
      y: cy + Math.sin(angle) * ring1,
    };
  });

  const ring2List = [...hop2];
  ring2List.forEach((a, i) => {
    const angle = (i / Math.max(ring2List.length, 1)) * Math.PI * 2 - Math.PI / 2 + 0.3;
    pos[a] = {
      x: cx + Math.cos(angle) * ring2,
      y: cy + Math.sin(angle) * ring2,
    };
  });

  // Any node not yet positioned: place randomly in inner area
  for (const n of nodes) {
    if (!pos[n.address]) {
      pos[n.address] = {
        x: cx + (Math.random() - 0.5) * w * 0.6,
        y: cy + (Math.random() - 0.5) * h * 0.6,
      };
    }
  }

  return pos;
}
