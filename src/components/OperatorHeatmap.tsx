"use client";

/* OperatorHeatmap — v0 #07, rewired to SolSentry AMBER tokens (bg-background,
 * bg-card, border-border, text-muted-foreground, text-primary). Risk palette
 * (red/amber/yellow/green/teal) kept intentionally — it's the semantic risk ramp.
 *
 * DATA STATUS: mock. The hour×day deploy/rug matrix has no API source —
 * /v1/top-operators exposes only totals (rug_rate, confirmed_rugs, total_tokens),
 * not temporal activity. Real wiring needs a backend endpoint, e.g.
 * GET /v1/operator/{wallet}/activity-heatmap → { days: [{ hours: [{deploys,rugs}] }] }.
 * Until then this renders synthetic patterns (bot/human/mixed) for design only. */

import { useState, useMemo } from "react";
import { Activity, Clock, ChevronDown, ChevronRight, Download } from "lucide-react";

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
type SortBy = "activity" | "rugRate" | "recency";

interface DayData {
  deploys: number;
  rugs: number;
  peakHour: number;
  hours: { deploys: number; rugs: number }[];
}

interface Operator {
  wallet: string;
  riskLevel: RiskLevel;
  days: DayData[];
  totalDeploys: number;
  totalRugs: number;
  rugRate: number;
  lastActive: Date;
  isBotFarm?: boolean;
}

const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; glow: string }> = {
  CRITICAL: {
    bg: "bg-red-500",
    text: "text-red-400",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
  },
  HIGH: {
    bg: "bg-amber-500",
    text: "text-amber-400",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.4)]",
  },
  MEDIUM: {
    bg: "bg-yellow-500",
    text: "text-yellow-400",
    glow: "shadow-[0_0_12px_rgba(234,179,8,0.3)]",
  },
  LOW: {
    bg: "bg-green-500",
    text: "text-green-400",
    glow: "shadow-[0_0_12px_rgba(34,197,94,0.3)]",
  },
  SAFE: {
    bg: "bg-teal-500",
    text: "text-teal-400",
    glow: "shadow-[0_0_12px_rgba(20,184,166,0.3)]",
  },
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function generateMockOperators(): Operator[] {
  const now = new Date();

  const createDays = (pattern: "bot" | "human" | "mixed" | "low"): DayData[] => {
    return Array.from({ length: 7 }, (_, dayIdx) => {
      const hours = Array.from({ length: 24 }, (_, hour) => {
        let deploys = 0;
        let rugs = 0;

        if (pattern === "bot") {
          deploys = Math.floor(Math.random() * 8) + 3;
          rugs = Math.floor(deploys * (0.85 + Math.random() * 0.1));
        } else if (pattern === "human") {
          const isSleep = hour >= 2 && hour <= 8;
          const isWeekend = dayIdx >= 5;
          deploys = isSleep
            ? 0
            : isWeekend
              ? Math.floor(Math.random() * 3)
              : Math.floor(Math.random() * 6) + 1;
          rugs = Math.floor(deploys * (0.6 + Math.random() * 0.2));
        } else if (pattern === "mixed") {
          const isActive = hour >= 10 && hour <= 22;
          deploys = isActive ? Math.floor(Math.random() * 4) + 1 : Math.random() < 0.2 ? 1 : 0;
          rugs = Math.floor(deploys * (0.65 + Math.random() * 0.2));
        } else {
          deploys = Math.random() < 0.15 ? Math.floor(Math.random() * 2) + 1 : 0;
          rugs = Math.random() < 0.5 ? deploys : 0;
        }

        return { deploys, rugs };
      });

      const totalDeploys = hours.reduce((s, h) => s + h.deploys, 0);
      const totalRugs = hours.reduce((s, h) => s + h.rugs, 0);
      const peakHour = hours.reduce(
        (max, h, i, arr) => (h.deploys > arr[max].deploys ? i : max),
        0,
      );

      return { deploys: totalDeploys, rugs: totalRugs, peakHour, hours };
    });
  };

  const operators: Operator[] = [
    {
      wallet: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
      riskLevel: "CRITICAL",
      days: createDays("bot"),
      totalDeploys: 3212,
      totalRugs: 2953,
      rugRate: 91.9,
      lastActive: new Date(now.getTime() - 1000 * 60 * 5),
      isBotFarm: true,
    },
    {
      wallet: "7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp9xRtGhUvYz3nE",
      riskLevel: "HIGH",
      days: createDays("human"),
      totalDeploys: 847,
      totalRugs: 662,
      rugRate: 78.2,
      lastActive: new Date(now.getTime() - 1000 * 60 * 45),
    },
    {
      wallet: "9xRtGhUvYz3nE7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp",
      riskLevel: "CRITICAL",
      days: createDays("bot"),
      totalDeploys: 2156,
      totalRugs: 1906,
      rugRate: 88.4,
      lastActive: new Date(now.getTime() - 1000 * 60 * 12),
      isBotFarm: true,
    },
    {
      wallet: "2wWfJdCbnM4sKp9xRtGhUvYz3nE7mPzKLxeNHr8vT5Yq",
      riskLevel: "HIGH",
      days: createDays("mixed"),
      totalDeploys: 523,
      totalRugs: 377,
      rugRate: 72.1,
      lastActive: new Date(now.getTime() - 1000 * 60 * 30),
    },
    {
      wallet: "3nE7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp9xRtGhUvYz",
      riskLevel: "MEDIUM",
      days: createDays("low"),
      totalDeploys: 89,
      totalRugs: 40,
      rugRate: 45.2,
      lastActive: new Date(now.getTime() - 1000 * 60 * 60 * 3),
    },
    {
      wallet: "8vT5Yq2wWfJdCbnM4sKp9xRtGhUvYz3nE7mPzKLxeNHr",
      riskLevel: "CRITICAL",
      days: createDays("bot"),
      totalDeploys: 1876,
      totalRugs: 1765,
      rugRate: 94.1,
      lastActive: new Date(now.getTime() - 1000 * 60 * 8),
      isBotFarm: true,
    },
    {
      wallet: "z3nE7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp9xRtGhUvY",
      riskLevel: "LOW",
      days: createDays("low"),
      totalDeploys: 47,
      totalRugs: 11,
      rugRate: 23.4,
      lastActive: new Date(now.getTime() - 1000 * 60 * 60 * 12),
    },
  ];

  return operators;
}

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

// Get intensity level 0-4 based on deploys
function getIntensity(deploys: number, maxDeploys: number): number {
  if (deploys === 0) return 0;
  const ratio = deploys / maxDeploys;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

// Get cell color based on activity intensity (mapped to risk colors)
function getCellColorByIntensity(deploys: number, maxDeploys: number): string {
  if (deploys === 0) return "bg-card";

  const ratio = deploys / maxDeploys;

  // Map intensity to risk colors: green (low) -> yellow -> amber -> red (high)
  if (ratio < 0.25) return "bg-green-500"; // LOW activity
  if (ratio < 0.5) return "bg-yellow-400"; // MEDIUM activity
  if (ratio < 0.75) return "bg-amber-500"; // HIGH activity
  return "bg-red-500"; // CRITICAL activity
}

export default function OperatorHeatmap() {
  return null;
}
