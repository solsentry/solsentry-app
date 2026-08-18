"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";

interface Suggestion {
  id: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}

interface AISuggestionsCardProps {
  loggedIn?: boolean;
}

const DESIGN = {
  bg: "#0a0a0a",
  surface: "#1a1a1a",
  border: "#262626",
  amber: "#f59e0b",
  text: "#fafafa",
  muted: "#a3a3a3",
};

export function AISuggestionsCard({ loggedIn = false }: AISuggestionsCardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("just now");

  // High-quality mocks following the exact spec
  const suggestions: Suggestion[] = loggedIn
    ? [
        {
          id: 1,
          icon: <span>⚠️</span>,
          title: "New serial rugger detected",
          subtitle: "4kxscute... just launched 3 new tokens in the last 40m",
          href: "/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
        },
        {
          id: 2,
          icon: <span>🔗</span>,
          title: "Wallet you're watching connected to flagged op",
          subtitle: "7vKXtg... funded 2 tokens from a known CRITICAL cluster",
          href: "/operator/7vKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        },
        {
          id: 3,
          icon: <span>📈</span>,
          title: "Trojan bot accumulating $RUGX",
          subtitle: "Large position building in the last 18 minutes",
          href: "/lookup?addr=4kxsCuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
        },
      ]
    : [
        {
          id: 1,
          icon: <span>⚠️</span>,
          title: "New CRITICAL operator active",
          subtitle: "Same deployer behind 2,953 previous rugs launched again",
          href: "/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
        },
        {
          id: 2,
          icon: <span>👁️</span>,
          title: "High volume on low-liquidity mint",
          subtitle: "Unusual activity detected on a brand new token",
          href: "/live",
        },
      ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated("just now");
      setRefreshing(false);
    }, 800);
  };

  return (
    <div
      style={{
        background: DESIGN.surface,
        border: `1px solid ${DESIGN.border}`,
        borderRadius: 12,
        padding: 16,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Sparkles size={16} color={DESIGN.amber} />
        <span style={{ fontWeight: 600, fontSize: 14 }}>AI Suggestions</span>
        <span
          style={{
            fontSize: 10,
            background: "rgba(245,158,11,0.1)",
            color: DESIGN.amber,
            padding: "1px 6px",
            borderRadius: 999,
            marginLeft: 4,
          }}
        >
          powered by Sentinel
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {suggestions.map((s, index) => (
          <a
            key={s.id}
            href={s.href}
            style={{
              display: "block",
              padding: "10px 4px",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
              borderTop: index > 0 ? `1px solid ${DESIGN.border}` : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderLeft = `2px solid ${DESIGN.amber}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderLeft = "2px solid transparent";
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ marginTop: 2, fontSize: 14 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: DESIGN.muted, marginTop: 2, lineHeight: 1.3 }}>
                  {s.subtitle}
                </div>
              </div>
              <ArrowRight size={16} style={{ opacity: 0.5, marginTop: 2 }} />
            </div>
          </a>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: `1px solid ${DESIGN.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
        }}
      >
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            background: "transparent",
            border: "none",
            color: DESIGN.amber,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            padding: 0,
          }}
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          Refresh suggestions
        </button>

        <span style={{ color: DESIGN.muted }}>{lastUpdated}</span>
      </div>

      {!loggedIn && (
        <div style={{ marginTop: 10, fontSize: 11, color: DESIGN.muted }}>
          Log in for personalized suggestions based on your watchlist.
        </div>
      )}
    </div>
  );
}
