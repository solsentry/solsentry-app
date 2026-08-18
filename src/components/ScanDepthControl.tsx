"use client";

import { useState } from "react";
import { Zap, Target, ShieldAlert } from "lucide-react";

export type ScanDepth = "quick" | "deep" | "max";

export function ScanDepthControl() {
  const [depth, setDepth] = useState<ScanDepth>("quick");

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "16px",
      marginTop: "16px",
      marginBottom: "16px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)", margin: 0 }}>Scan Depth</h3>
        <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>
          {depth === "quick" ? "~1 cred" : depth === "deep" ? "~5 creds" : "~12 creds"}
        </span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        <button
          type="button"
          onClick={() => setDepth("quick")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "8px",
            background: depth === "quick" ? "var(--brand-amber-tint)" : "var(--bg)",
            border: `1px solid ${depth === "quick" ? "var(--brand-amber-line)" : "var(--border)"}`,
            color: depth === "quick" ? "var(--brand-amber)" : "var(--fg-2)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <Zap size={18} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>Quick</span>
        </button>

        <button
          type="button"
          onClick={() => setDepth("deep")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "8px",
            background: depth === "deep" ? "rgba(20, 184, 166, 0.1)" : "var(--bg)",
            border: `1px solid ${depth === "deep" ? "rgba(20, 184, 166, 0.3)" : "var(--border)"}`,
            color: depth === "deep" ? "var(--status-success)" : "var(--fg-2)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <Target size={18} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>Deep</span>
        </button>

        <button
          type="button"
          onClick={() => setDepth("max")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "8px",
            background: depth === "max" ? "rgba(239, 68, 68, 0.1)" : "var(--bg)",
            border: `1px solid ${depth === "max" ? "rgba(239, 68, 68, 0.3)" : "var(--border)"}`,
            color: depth === "max" ? "var(--status-critical)" : "var(--fg-2)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <ShieldAlert size={18} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>Max</span>
        </button>
      </div>

      <div style={{ marginTop: "16px", fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>
        {depth === "quick" && "Checks local cache and immediate metadata. Good for known tokens."}
        {depth === "deep" && "Traces funding sources and simulates transactions. Finds 80% of obfuscated rugs."}
        {depth === "max" && "Full multi-hop Jito bundle analysis and KOL mapping. Can take up to 45s."}
      </div>
    </div>
  );
}
