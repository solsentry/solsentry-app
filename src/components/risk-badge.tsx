import { cn } from "@/lib/utils";
import { RiskLevel } from "@/lib/mock-data";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const riskConfig: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  CRITICAL: {
    bg: "bg-[#ef4444]/15",
    text: "text-[#ef4444]",
    label: "CRITICAL",
  },
  HIGH: {
    bg: "bg-[#f97316]/15",
    text: "text-primary",
    label: "HIGH",
  },
  MEDIUM: {
    bg: "bg-[#eab308]/15",
    text: "text-[#eab308]",
    label: "MEDIUM",
  },
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
        config.bg,
        config.text,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
