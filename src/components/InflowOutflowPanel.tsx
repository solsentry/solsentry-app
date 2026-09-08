"use client";

import { useState } from "react";
import { AddrLink } from "./AddrLink";

interface Counterparty {
  address: string;
  direction: "in" | "out";
  asset: string;
  volume: number;
  txCount: number;
}

const MOCK_DATA: Counterparty[] = [
  { address: "5Q544fKrCoeuSWeuXJ3wYxyH1m7dGk6vW22BvQ7u1eFw", direction: "in", asset: "SOL", volume: 1540.5, txCount: 12 },
  { address: "RaydiumAuthorityV4...", direction: "out", asset: "USDC", volume: 45000, txCount: 3 },
  { address: "7ZqRsTcKx...", direction: "in", asset: "SOL", volume: 12.4, txCount: 1 },
  { address: "Aa1Bb2Cc3...", direction: "out", asset: "SOL", volume: 800, txCount: 45 },
  { address: "JUP5cG...", direction: "out", asset: "USDC", volume: 120000, txCount: 150 },
];

export function InflowOutflowPanel({ wallet }: { wallet: string }) {
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");
  const [hideDust, setHideDust] = useState(true);

  const filtered = MOCK_DATA.filter((cp) => {
    if (filter !== "all" && cp.direction !== filter) return false;
    if (hideDust && cp.volume < 10) return false;
    return true;
  });

  return (
    <div className="panel" style={{ display: "flex", flexDirection: "column", height: "100%", maxHeight: 620 }}>
      <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--fg-1)" }}>
          Counterparty Flows
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--fg-3)" }}>
          {filtered.length} flows · Last 30 days
        </p>
      </div>

      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn-ghost" onClick={() => setFilter("all")} style={{ opacity: filter === "all" ? 1 : 0.5 }}>All</button>
        <button className="btn-ghost" onClick={() => setFilter("in")} style={{ opacity: filter === "in" ? 1 : 0.5 }}>Inflow</button>
        <button className="btn-ghost" onClick={() => setFilter("out")} style={{ opacity: filter === "out" ? 1 : 0.5 }}>Outflow</button>
        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--fg-2)", cursor: "pointer", marginLeft: "auto" }}>
          <input type="checkbox" checked={hideDust} onChange={(e) => setHideDust(e.target.checked)} />
          Hide dust
        </label>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((cp, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", background: "var(--surface-2)", borderRadius: 6 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: cp.direction === "in" ? "var(--brand-teal)" : "var(--status-warning)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                    {cp.direction}
                  </span>
                  <AddrLink addr={cp.address} head={4} tail={4} />
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>
                  {cp.txCount} txs
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-1)" }}>
                  {cp.volume.toLocaleString()} {cp.asset}
                </span>
                <button className="btn-ghost" style={{ padding: "2px 6px", fontSize: 10 }}>
                  + Add to graph
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--fg-3)", fontSize: 12 }}>
              No flows matching filters.
            </div>
          )}
        </div>
      </div>
      
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <button className="btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
          + Add Top 20 to Graph
        </button>
      </div>
    </div>
  );
}
