"use client";

import { useState } from "react";
import { NetworkSvg } from "./NetworkSvg";
import { NetworkFlowchart } from "./NetworkFlowchart";

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

type View = "circular" | "flowchart";

export function GraphSwitcher({ center, nodes, edges }: Props) {
  const [view, setView] = useState<View>("circular");

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 12,
          padding: 4,
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          width: "fit-content",
        }}
      >
        {(["circular", "flowchart"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            style={{
              padding: "8px 14px",
              background: view === v ? "var(--brand-amber)" : "transparent",
              color:
                view === v ? "var(--fg-on-brand)" : "var(--fg-2)",
              border: "none",
              borderRadius: 6,
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {v === "circular" ? "● Circular" : "▦ Flowchart"}
          </button>
        ))}
      </div>

      {view === "circular" ? (
        <NetworkSvg center={center} nodes={nodes} edges={edges} />
      ) : (
        <NetworkFlowchart center={center} nodes={nodes} edges={edges} />
      )}
    </div>
  );
}
