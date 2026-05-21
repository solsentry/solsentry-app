"use client";

// ComparisonMatrix — G2/Capterra-style dense matrix.
// Sticky left column (features) + sticky top row (competitors).
// Filters: all / our differentiators / paid-tier features.
// Mobile: card-per-competitor fallback.
// All cell verdicts are sourced from the JSON data file with per-cell source links.

import { useMemo, useState } from "react";
import matrix from "@/data/comparison-matrix.json";

type Verdict = "yes" | "partial" | "no";

type Competitor = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  accent?: boolean;
};

type Feature = {
  id: string;
  label: string;
  group: string;
  ours?: boolean;
};

type Cell = {
  v: Verdict;
  src: string;
  note?: string;
};

type FilterMode = "all" | "ours" | "paid";

const PAID_FEATURE_IDS = new Set([
  "enterprise_contract",
  "compliance_aml",
  "audit_services",
  "wallet_badge",
  "self_hostable",
]);

function verdictGlyph(v: Verdict): string {
  if (v === "yes") return "✓";
  if (v === "partial") return "◐";
  return "✗";
}

function verdictColor(v: Verdict): string {
  if (v === "yes") return "var(--brand-amber)";
  if (v === "partial") return "var(--fg-2)";
  return "var(--fg-4)";
}

function verdictLabel(v: Verdict): string {
  if (v === "yes") return "Full support";
  if (v === "partial") return "Partial / limited";
  return "Not supported";
}

export function ComparisonMatrix() {
  const competitors = matrix.competitors as Competitor[];
  const features = matrix.features as Feature[];
  const grid = matrix.grid as Record<string, Record<string, Cell>>;

  const [filter, setFilter] = useState<FilterMode>("all");

  const visibleFeatures = useMemo(() => {
    if (filter === "ours") return features.filter((f) => f.ours);
    if (filter === "paid") return features.filter((f) => PAID_FEATURE_IDS.has(f.id));
    return features;
  }, [filter, features]);

  return (
    <div>
      <div style={filterRow}>
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")} count={features.length}>
          All features
        </FilterButton>
        <FilterButton
          active={filter === "ours"}
          onClick={() => setFilter("ours")}
          count={features.filter((f) => f.ours).length}
        >
          Our differentiators
        </FilterButton>
        <FilterButton
          active={filter === "paid"}
          onClick={() => setFilter("paid")}
          count={features.filter((f) => PAID_FEATURE_IDS.has(f.id)).length}
        >
          Enterprise / paid tier
        </FilterButton>
        <div style={legendStyle}>
          <span style={{ color: "var(--brand-amber)" }}>✓</span> full
          <span style={{ color: "var(--fg-2)", marginLeft: 12 }}>◐</span> partial
          <span style={{ color: "var(--fg-4)", marginLeft: 12 }}>✗</span> none
        </div>
      </div>

      {/* Desktop: dense matrix table */}
      <div className="comparison-desktop" style={tableWrap}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thFeature, ...thStickyTopLeft }}>Feature</th>
              {competitors.map((c) => (
                <th
                  key={c.id}
                  style={{
                    ...thCompetitor,
                    ...(c.accent ? thAccent : null),
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "var(--fg-3)", marginTop: 2 }}>{c.tagline}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleFeatures.map((f, idx) => (
              <tr key={f.id} style={idx % 2 === 0 ? rowAlt : undefined}>
                <td style={tdFeature}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{f.label}</span>
                    {f.ours && (
                      <span title="SolSentry differentiator" style={starBadge}>
                        ★
                      </span>
                    )}
                  </div>
                  <div style={groupTag}>{f.group}</div>
                </td>
                {competitors.map((c) => {
                  const cell = grid[f.id]?.[c.id];
                  if (!cell) {
                    return (
                      <td key={c.id} style={tdCell}>
                        <span style={{ color: "var(--fg-4)" }}>—</span>
                      </td>
                    );
                  }
                  const tooltip = `${verdictLabel(cell.v)}${cell.note ? " — " + cell.note : ""} (source: ${cell.src})`;
                  return (
                    <td
                      key={c.id}
                      style={{
                        ...tdCell,
                        ...(c.accent ? tdAccent : null),
                      }}
                    >
                      <a
                        href={cell.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={tooltip}
                        style={{
                          color: verdictColor(cell.v),
                          fontSize: 16,
                          textDecoration: "none",
                          fontFamily: "var(--font-mono)",
                          cursor: "help",
                        }}
                      >
                        {verdictGlyph(cell.v)}
                      </a>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card per competitor */}
      <div className="comparison-mobile" style={mobileWrap}>
        {competitors.map((c) => (
          <div key={c.id} style={{ ...mobileCard, ...(c.accent ? mobileCardAccent : null) }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 8 }}>{c.tagline}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {visibleFeatures.map((f) => {
                const cell = grid[f.id]?.[c.id];
                if (!cell) return null;
                return (
                  <li
                    key={f.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px solid var(--border-soft)",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--fg-2)" }}>{f.label}</span>
                    <a
                      href={cell.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={cell.note || verdictLabel(cell.v)}
                      style={{
                        color: verdictColor(cell.v),
                        textDecoration: "none",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {verdictGlyph(cell.v)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <style>{`
        .comparison-desktop { display: block; }
        .comparison-mobile { display: none; }
        @media (max-width: 880px) {
          .comparison-desktop { display: none; }
          .comparison-mobile { display: grid; }
        }
      `}</style>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "var(--brand-amber-tint)" : "transparent",
        border: `1px solid ${active ? "var(--brand-amber)" : "var(--border)"}`,
        color: active ? "var(--brand-amber)" : "var(--fg-2)",
        padding: "6px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        cursor: "pointer",
        borderRadius: 2,
      }}
    >
      {children} <span style={{ opacity: 0.6 }}>({count})</span>
    </button>
  );
}

/* ---------- styles ---------- */

const filterRow: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  marginBottom: 16,
  flexWrap: "wrap",
};

const legendStyle: React.CSSProperties = {
  marginLeft: "auto",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "var(--fg-3)",
};

const tableWrap: React.CSSProperties = {
  overflowX: "auto",
  border: "1px solid var(--border)",
  maxHeight: "75vh",
  position: "relative",
};

const tableStyle: React.CSSProperties = {
  borderCollapse: "separate",
  borderSpacing: 0,
  width: "100%",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
};

const thFeature: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  background: "var(--bg-elev-1)",
  borderBottom: "1px solid var(--border-strong)",
  borderRight: "1px solid var(--border)",
  position: "sticky",
  left: 0,
  zIndex: 3,
  minWidth: 260,
  fontWeight: 500,
  color: "var(--fg-2)",
};

const thStickyTopLeft: React.CSSProperties = {
  top: 0,
  zIndex: 4,
};

const thCompetitor: React.CSSProperties = {
  padding: "8px 10px",
  background: "var(--bg-elev-1)",
  borderBottom: "1px solid var(--border-strong)",
  borderRight: "1px solid var(--border-soft)",
  position: "sticky",
  top: 0,
  zIndex: 2,
  minWidth: 96,
  textAlign: "center" as const,
  color: "var(--fg-1)",
};

const thAccent: React.CSSProperties = {
  background: "var(--brand-amber-tint)",
  borderBottom: "2px solid var(--brand-amber)",
  color: "var(--brand-amber)",
};

const tdFeature: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid var(--border-soft)",
  borderRight: "1px solid var(--border)",
  position: "sticky",
  left: 0,
  background: "var(--bg)",
  zIndex: 1,
  color: "var(--fg-1)",
};

const tdCell: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "center" as const,
  borderBottom: "1px solid var(--border-soft)",
  borderRight: "1px solid var(--border-soft)",
};

const tdAccent: React.CSSProperties = {
  background: "var(--brand-amber-tint)",
};

const rowAlt: React.CSSProperties = {
  background: "rgba(255,255,255,0.012)",
};

const starBadge: React.CSSProperties = {
  color: "var(--brand-amber)",
  fontSize: 11,
};

const groupTag: React.CSSProperties = {
  fontSize: 9,
  color: "var(--fg-4)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginTop: 2,
};

const mobileWrap: React.CSSProperties = {
  gridTemplateColumns: "1fr",
  gap: 12,
};

const mobileCard: React.CSSProperties = {
  border: "1px solid var(--border)",
  padding: 14,
  background: "var(--bg-elev-1)",
};

const mobileCardAccent: React.CSSProperties = {
  borderColor: "var(--brand-amber)",
  background: "var(--brand-amber-tint)",
};
