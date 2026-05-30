"use client";

import { RISK_COLORS, RiskLevel } from "@/lib/cluster-data";

const riskLevels: { level: RiskLevel; label: string }[] = [
  { level: "CRITICAL", label: "Critical" },
  { level: "HIGH", label: "High" },
  { level: "MEDIUM", label: "Medium" },
  { level: "LOW", label: "Low" },
  { level: "SAFE", label: "Safe" },
];

export function RiskLegend() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {riskLevels.map(({ level, label }) => (
        <div key={level} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS[level] }} />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
