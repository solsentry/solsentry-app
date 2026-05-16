"use client";

// ActivityHeatmap.tsx — Nansen-style GitHub-contribution heatmap.
// 365 daily cells, color-graded by token deployment count.
//
// Source data: aggregates `OperatorTimeline.tokens[].deployed_at` (Unix seconds)
// into per-day bucket. No new backend endpoint needed.

import { useMemo } from "react";
import type { TimelineToken } from "@/lib/api";

interface Props {
  tokens: TimelineToken[];
  days?: number; // default 365
  className?: string;
}

interface DayBucket {
  date: string;       // YYYY-MM-DD
  ts: number;         // Unix seconds at day start
  count: number;
  rugs: number;
}

const DAY_S = 86400;

function startOfDayUTC(ts: number): number {
  return ts - (ts % DAY_S);
}

function formatDate(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// v4 amber gradient: surface → amber → critical red
function cellColor(count: number, maxCount: number): string {
  if (count === 0) return "var(--surface-2, rgba(242,237,228,0.04))";
  const ratio = Math.min(1, count / Math.max(maxCount, 1));
  if (ratio < 0.2) return "rgba(193, 125, 14, 0.25)"; // amber 25%
  if (ratio < 0.4) return "rgba(193, 125, 14, 0.45)"; // amber 45%
  if (ratio < 0.6) return "rgba(193, 125, 14, 0.65)"; // amber 65%
  if (ratio < 0.8) return "rgba(217, 150, 46, 0.85)"; // amber-light 85%
  return "rgba(220, 38, 38, 0.85)";                    // critical red 85%
}

export function ActivityHeatmap({ tokens, days = 365, className }: Props) {
  const { weeks, totalDeploys, totalRugs, maxCount, busiestDay } = useMemo(() => {
    if (!tokens || tokens.length === 0) {
      return {
        weeks: [] as DayBucket[][],
        totalDeploys: 0,
        totalRugs: 0,
        maxCount: 0,
        busiestDay: null as DayBucket | null,
      };
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const startSec = startOfDayUTC(nowSec - days * DAY_S);

    // Pre-fill 365 days with zero
    const byDay = new Map<number, DayBucket>();
    for (let d = 0; d < days; d++) {
      const ts = startSec + d * DAY_S;
      byDay.set(ts, {
        date: formatDate(ts),
        ts,
        count: 0,
        rugs: 0,
      });
    }

    // Aggregate tokens
    for (const t of tokens) {
      if (!t.deployed_at) continue;
      const dayTs = startOfDayUTC(t.deployed_at);
      const bucket = byDay.get(dayTs);
      if (!bucket) continue;
      bucket.count += 1;
      if (t.final_outcome === "rug" || t.final_outcome === "RUG") {
        bucket.rugs += 1;
      }
    }

    const allBuckets = Array.from(byDay.values()).sort((a, b) => a.ts - b.ts);
    const max = allBuckets.reduce((m, b) => Math.max(m, b.count), 0);
    const busiest = allBuckets.reduce(
      (best, b) => (b.count > (best?.count ?? -1) ? b : best),
      null as DayBucket | null,
    );

    // Group into weeks (columns of 7 cells each)
    const weeksArr: DayBucket[][] = [];
    const firstDay = new Date(allBuckets[0].ts * 1000).getUTCDay();
    let weekIdx = 0;
    if (!weeksArr[0]) weeksArr[0] = [];
    // Fill leading empty cells (so all weeks have 7 rows)
    for (let i = 0; i < firstDay; i++) {
      weeksArr[0].push({ date: "", ts: 0, count: -1, rugs: 0 });
    }
    for (const b of allBuckets) {
      if (!weeksArr[weekIdx]) weeksArr[weekIdx] = [];
      weeksArr[weekIdx].push(b);
      if (weeksArr[weekIdx].length === 7) {
        weekIdx++;
      }
    }

    const totDeploys = allBuckets.reduce((s, b) => s + b.count, 0);
    const totRugs = allBuckets.reduce((s, b) => s + b.rugs, 0);

    return {
      weeks: weeksArr,
      totalDeploys: totDeploys,
      totalRugs: totRugs,
      maxCount: max,
      busiestDay: busiest,
    };
  }, [tokens, days]);

  const CELL = 12;
  const GAP = 3;
  const PAD_LEFT = 28; // weekday labels
  const PAD_TOP = 18;  // month labels
  const W = PAD_LEFT + weeks.length * (CELL + GAP);
  const H = PAD_TOP + 7 * (CELL + GAP);

  if (!tokens || tokens.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: 24,
          background: "var(--surface, #100E0A)",
          border: "1px solid var(--border, #1E1B16)",
          borderRadius: 8,
          color: "var(--fg-2, rgba(242,237,228,0.55))",
          fontFamily: "var(--font-mono, ui-monospace)",
          fontSize: 12,
        }}
      >
        No deployment data in the last {days} days.
      </div>
    );
  }

  // Month labels: find first day of each month within the window
  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    for (const cell of week) {
      if (!cell.ts) continue;
      const d = new Date(cell.ts * 1000);
      const m = d.getUTCMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        monthLabels.push({
          x: PAD_LEFT + wi * (CELL + GAP),
          label: d.toLocaleDateString("en-US", { month: "short" }),
        });
        break;
      }
    }
  });

  return (
    <div
      className={className}
      style={{
        padding: 16,
        background: "var(--surface, #100E0A)",
        border: "1px solid var(--border, #1E1B16)",
        borderRadius: 8,
      }}
    >
      {/* Stats header */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 16,
          fontFamily: "var(--font-mono, ui-monospace)",
          fontSize: 11,
          color: "var(--fg-2, rgba(242,237,228,0.55))",
          flexWrap: "wrap",
        }}
      >
        <Stat label={`${days}d deployments`} value={totalDeploys.toLocaleString()} />
        <Stat label="confirmed rugs" value={totalRugs.toLocaleString()} accent="critical" />
        <Stat label="peak day" value={maxCount.toLocaleString()} accent="amber" />
        {busiestDay && busiestDay.count > 0 && (
          <Stat
            label="busiest"
            value={formatDateLabel(busiestDay.ts)}
            accent="amber"
          />
        )}
      </div>

      {/* SVG heatmap */}
      <div style={{ overflowX: "auto" }}>
        <svg
          width={W}
          height={H + 16}
          style={{ display: "block" }}
          role="img"
          aria-label={`Activity heatmap of ${totalDeploys} deployments over ${days} days`}
        >
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text
              key={i}
              x={m.x}
              y={12}
              fill="var(--fg-2, rgba(242,237,228,0.55))"
              style={{
                fontFamily: "var(--font-mono, ui-monospace)",
                fontSize: 9,
              }}
            >
              {m.label}
            </text>
          ))}

          {/* Weekday labels (M / W / F) */}
          {["", "Mon", "", "Wed", "", "Fri", ""].map((lbl, i) => (
            <text
              key={i}
              x={0}
              y={PAD_TOP + i * (CELL + GAP) + CELL - 2}
              fill="var(--fg-3, rgba(242,237,228,0.35))"
              style={{
                fontFamily: "var(--font-mono, ui-monospace)",
                fontSize: 8,
              }}
            >
              {lbl}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, wi) =>
            week.map((cell, ci) => {
              if (cell.count < 0) return null; // leading empty
              const x = PAD_LEFT + wi * (CELL + GAP);
              const y = PAD_TOP + ci * (CELL + GAP);
              const color = cellColor(cell.count, maxCount);
              const tooltip =
                cell.count > 0
                  ? `${formatDateLabel(cell.ts)}: ${cell.count} deploy${cell.count !== 1 ? "s" : ""}${cell.rugs > 0 ? ` · ${cell.rugs} rug${cell.rugs !== 1 ? "s" : ""}` : ""}`
                  : `${formatDateLabel(cell.ts)}: no activity`;
              return (
                <g key={`${wi}-${ci}`}>
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={2}
                    fill={color}
                    stroke={
                      cell.count > 0
                        ? "rgba(242,237,228,0.08)"
                        : "transparent"
                    }
                    strokeWidth={cell.count > 0 ? 0.5 : 0}
                  >
                    <title>{tooltip}</title>
                  </rect>
                </g>
              );
            }),
          )}
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-mono, ui-monospace)",
          fontSize: 10,
          color: "var(--fg-3, rgba(242,237,228,0.35))",
        }}
      >
        <span>less</span>
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            style={{
              width: CELL,
              height: CELL,
              borderRadius: 2,
              background: cellColor(
                step === 0 ? 0 : Math.ceil((step / 5) * maxCount),
                maxCount,
              ),
              border: step === 0 ? "1px dashed rgba(242,237,228,0.15)" : "none",
            }}
          />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "amber" | "critical";
}) {
  const color =
    accent === "critical"
      ? "var(--status-critical, #DC2626)"
      : accent === "amber"
        ? "var(--brand-amber, #C17D0E)"
        : "var(--fg-1, #F2EDE4)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--fg-3, rgba(242,237,228,0.35))",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </span>
    </div>
  );
}
