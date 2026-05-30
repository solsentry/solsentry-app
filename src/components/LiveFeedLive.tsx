"use client";

import { useEffect, useState } from "react";
import { LiveFeed, type FeedEvent } from "@/components/live-feed";

/* Client poller for LiveFeed. Hits /v1/alerts/recent every 10s (endpoint TTL
 * is also 10s) and maps Alert → FeedEvent. Decision: polling, not socket. */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface ApiAlert {
  mint: string;
  symbol?: string | null;
  risk_score: number;
  risk_level: string;
  predicted_at: number;
  dev_wallet?: string | null;
  dev_confirmed_rugs?: number;
  flags?: string[];
}

function toRisk(level: string): RiskLevel {
  const u = (level || "").toUpperCase();
  return u === "CRITICAL" || u === "HIGH" || u === "MEDIUM" || u === "LOW"
    ? (u as RiskLevel)
    : "MEDIUM";
}

function mapAlert(a: ApiAlert): FeedEvent {
  const metrics: { label: string; value: string | number }[] = [
    { label: "risk", value: Math.round(a.risk_score) },
  ];
  if (a.dev_confirmed_rugs && a.dev_confirmed_rugs > 0) {
    metrics.push({ label: "dev rugs", value: a.dev_confirmed_rugs });
  }
  return {
    id: a.mint,
    timestamp: new Date((a.predicted_at ?? 0) * 1000),
    riskLevel: toRisk(a.risk_level),
    wallet: a.dev_wallet || a.mint,
    eventType: "deploy",
    description: `${a.symbol || "token"} flagged ${toRisk(a.risk_level)}`,
    metrics,
  };
}

export function LiveFeedLive(props: { className?: string }) {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    let alive = true;
    async function pull() {
      try {
        const res = await fetch(`${API_URL}/v1/alerts/recent?limit=30`);
        if (!res.ok) return;
        const data = (await res.json()) as { alerts?: ApiAlert[] };
        if (alive && Array.isArray(data.alerts)) {
          setEvents(data.alerts.map(mapAlert));
        }
      } catch {
        /* keep last events on transient failure */
      }
    }
    pull();
    const id = setInterval(pull, 10_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return <LiveFeed className={props.className} events={events} />;
}
