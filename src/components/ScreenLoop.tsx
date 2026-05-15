"use client";

import { useEffect, useState, useRef } from "react";

interface Stats {
  total_predictions?: number;
  accuracy_pct?: number;
  total_operators?: number;
  serial_ruggers?: number;
  bot_clusters?: number;
  confirmed_rugs?: number;
  high_risk_alerts?: number;
  runtime_hours?: number;
}

interface Alert {
  mint: string;
  symbol?: string | null;
  risk_score?: number;
  risk_level?: string;
  predicted_at?: number;
  age_seconds?: number;
  dev_wallet?: string;
}

interface Operator {
  wallet: string;
  confirmed_rugs?: number;
  total_tokens?: number;
  rug_rate_pct?: number;
  risk_level?: string;
  tags?: string[];
}

const PANELS = ["bignumber", "fourkx", "alerts", "leaderboard", "stats"] as const;
type Panel = (typeof PANELS)[number];

const ROTATE_MS = 8000; // 8s per panel

function fmtN(n: number | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

function shortAddr(a: string): string {
  if (!a) return "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function ScreenLoop() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ops, setOps] = useState<Operator[]>([]);
  const [panel, setPanel] = useState<Panel>("bignumber");
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Fetch live data
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const [s, a, o] = await Promise.all([
          fetch("https://api.solsentry.app/v1/stats").then((r) => r.json()),
          fetch("https://api.solsentry.app/v1/alerts/recent?limit=20").then((r) => r.json()),
          fetch("https://api.solsentry.app/v1/top-operators?limit=10").then((r) => r.json()),
        ]);
        if (cancelled) return;
        setStats(s);
        setAlerts(Array.isArray(a) ? a : a.alerts ?? []);
        setOps(Array.isArray(o) ? o : o.operators ?? []);
      } catch {
        /* ignore */
      }
    }
    fetchAll();
    const id = window.setInterval(fetchAll, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  // Panel rotation
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setPanel((p) => {
        const i = PANELS.indexOf(p);
        return PANELS[(i + 1) % PANELS.length];
      });
    }, ROTATE_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  // Soft tick for animations
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(ellipse 1200px 800px at 20% 20%, rgba(193,125,14,0.06), transparent 60%), radial-gradient(ellipse 800px 600px at 80% 80%, rgba(168,85,247,0.04), transparent 60%), var(--bg)",
        color: "var(--fg-1)",
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}
    >
      <style>{`
        @keyframes pulse-amber {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes count-glow {
          0%, 100% { text-shadow: 0 0 24px rgba(193,125,14,0.3); }
          50% { text-shadow: 0 0 48px rgba(193,125,14,0.6); }
        }
        @keyframes scroll-up {
          from { transform: translateY(100%); }
          to { transform: translateY(-100%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .panel-fade { animation: slide-up 600ms ease-out; }
      `}</style>

      {/* Header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="/logo-3d.webp"
            alt=""
            width={36}
            height={36}
            style={{ borderRadius: 6 }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "-0.02em",
              }}
            >
              SolSentry
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--fg-3)",
              }}
            >
              live · api.solsentry.app
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--brand-teal)",
            }}
          >
            ●{" "}
            <span style={{ animation: "blink 2s infinite" }}>monitoring</span>
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--fg-3)",
            }}
          >
            {stats?.runtime_hours
              ? `${Math.floor(stats.runtime_hours / 24)}d ${Math.floor(stats.runtime_hours % 24)}h`
              : "—"}{" "}
            uptime
          </span>
        </div>
      </div>

      {/* Panel content */}
      <div
        style={{
          position: "absolute",
          inset: "100px 40px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {panel === "bignumber" && <BigNumberPanel stats={stats} />}
        {panel === "fourkx" && <FourkxPanel ops={ops} />}
        {panel === "alerts" && <AlertsPanel alerts={alerts} />}
        {panel === "leaderboard" && <LeaderboardPanel ops={ops} />}
        {panel === "stats" && <StatsPanel stats={stats} />}
      </div>

      {/* Footer dots indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {PANELS.map((p) => (
          <span
            key={p}
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background:
                p === panel ? "var(--brand-amber)" : "var(--border-strong)",
              transition: "background 200ms",
            }}
          />
        ))}
      </div>

      {/* Hidden tick for re-renders */}
      <span style={{ display: "none" }}>{tick}</span>
    </div>
  );
}

function BigNumberPanel({ stats }: { stats: Stats | null }) {
  return (
    <div className="panel-fade" style={{ textAlign: "center", maxWidth: "100%" }}>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.3em",
          color: "var(--brand-amber)",
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        Solana threat intelligence · live
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "min(220px, 22vw)",
          letterSpacing: "-0.04em",
          color: "var(--brand-amber)",
          lineHeight: 0.95,
          animation: "count-glow 3s ease-in-out infinite",
        }}
      >
        {fmtN(stats?.total_predictions)}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 32,
          color: "var(--fg-1)",
          letterSpacing: "-0.01em",
          marginTop: 16,
        }}
      >
        tokens scanned · {stats?.accuracy_pct?.toFixed(1) ?? "—"}% accuracy
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 18,
          color: "var(--fg-2)",
          marginTop: 12,
        }}
      >
        96.6% CRITICAL precision · {fmtN(stats?.confirmed_rugs)} confirmed rugs
      </div>
    </div>
  );
}

function FourkxPanel({ ops }: { ops: Operator[] }) {
  const fourkx =
    ops.find((o) => o.wallet?.startsWith("4kxscute")) ?? ops[0];
  if (!fourkx) return <div style={{ color: "var(--fg-3)" }}>loading…</div>;
  return (
    <div className="panel-fade" style={{ textAlign: "center", maxWidth: "100%" }}>
      <div
        style={{
          padding: "8px 20px",
          background: "rgba(255,68,68,0.12)",
          border: "1px solid var(--status-critical)",
          color: "var(--status-critical)",
          borderRadius: 999,
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 28,
          animation: "pulse-amber 2s ease-in-out infinite",
        }}
      >
        ● CRITICAL · ATIVO HOJE
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--fg-3)",
          fontSize: 14,
          marginBottom: 16,
          letterSpacing: "0.04em",
        }}
      >
        4kxscute · operator
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "min(180px, 18vw)",
          letterSpacing: "-0.04em",
          color: "var(--brand-amber)",
          lineHeight: 0.95,
          animation: "count-glow 3s ease-in-out infinite",
        }}
      >
        {fmtN(fourkx.confirmed_rugs)}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 28,
          color: "var(--fg-1)",
          marginTop: 16,
        }}
      >
        rugs em {fmtN(fourkx.total_tokens)} tokens · {fourkx.rug_rate_pct?.toFixed(1)}% rug rate
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 22,
          color: "var(--fg-2)",
          marginTop: 28,
          maxWidth: 800,
          marginInline: "auto",
        }}
      >
        Não flagou o token. Flagou o operador. Essa é a diferença.
      </div>
    </div>
  );
}

function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="panel-fade" style={{ width: "100%", maxWidth: 1200 }}>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.3em",
          color: "var(--brand-amber)",
          textTransform: "uppercase",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Live alerts · HIGH + CRITICAL
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxHeight: "70vh",
          overflow: "hidden",
        }}
      >
        {alerts.slice(0, 8).map((a, i) => {
          const isCritical = a.risk_level === "CRITICAL";
          return (
            <div
              key={a.mint + i}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 1fr 100px",
                gap: 16,
                padding: "16px 24px",
                background: "var(--surface)",
                border: `1px solid ${isCritical ? "var(--status-critical)" : "var(--brand-amber-line)"}`,
                borderRadius: 10,
                alignItems: "center",
                animation: `slide-up 400ms ease-out ${i * 60}ms backwards`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: isCritical ? "var(--status-critical)" : "var(--brand-amber)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {a.risk_level}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--fg-1)",
                }}
              >
                {a.symbol || shortAddr(a.mint)}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--fg-3)",
                }}
              >
                dev: {a.dev_wallet ? shortAddr(a.dev_wallet) : "—"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: isCritical ? "var(--status-critical)" : "var(--brand-amber)",
                  textAlign: "right",
                }}
              >
                {a.risk_score ?? "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardPanel({ ops }: { ops: Operator[] }) {
  return (
    <div className="panel-fade" style={{ width: "100%", maxWidth: 1100 }}>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.3em",
          color: "var(--brand-amber)",
          textTransform: "uppercase",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        The Solana rug hall of fame
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        {ops.slice(0, 8).map((o, i) => (
          <div
            key={o.wallet + i}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 180px 140px 100px",
              gap: 16,
              padding: "14px 24px",
              background:
                i === 0
                  ? "rgba(255,68,68,0.06)"
                  : i < 3
                    ? "var(--surface)"
                    : "transparent",
              border: `1px solid ${i === 0 ? "var(--status-critical)" : "var(--border)"}`,
              borderRadius: 10,
              alignItems: "center",
              animation: `slide-up 400ms ease-out ${i * 50}ms backwards`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 28,
                color:
                  i === 0
                    ? "var(--status-critical)"
                    : i < 3
                      ? "var(--brand-amber)"
                      : "var(--fg-3)",
                letterSpacing: "-0.02em",
              }}
            >
              #{i + 1}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                color: "var(--fg-1)",
              }}
            >
              {shortAddr(o.wallet)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
                color: "var(--status-critical)",
              }}
            >
              {fmtN(o.confirmed_rugs)} rugs
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--fg-2)",
              }}
            >
              {fmtN(o.total_tokens)} tokens
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--brand-amber)",
                textAlign: "right",
              }}
            >
              {o.rug_rate_pct?.toFixed(0) ?? "—"}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsPanel({ stats }: { stats: Stats | null }) {
  const cards = [
    {
      label: "Operators tracked",
      value: stats?.total_operators,
      color: "var(--brand-amber)",
    },
    {
      label: "Serial ruggers",
      value: stats?.serial_ruggers,
      color: "var(--status-critical)",
    },
    {
      label: "Bot clusters",
      value: stats?.bot_clusters,
      color: "var(--brand-purple)",
    },
    {
      label: "Confirmed rugs",
      value: stats?.confirmed_rugs,
      color: "var(--status-critical)",
    },
    {
      label: "HIGH+CRITICAL alerts",
      value: stats?.high_risk_alerts,
      color: "var(--brand-amber)",
    },
    {
      label: "Tokens scanned",
      value: stats?.total_predictions,
      color: "var(--brand-teal)",
    },
  ];
  return (
    <div className="panel-fade" style={{ width: "100%", maxWidth: 1200 }}>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.3em",
          color: "var(--brand-amber)",
          textTransform: "uppercase",
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        Network scoreboard
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {cards.map((c, i) => (
          <div
            key={c.label}
            style={{
              padding: "32px 24px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              textAlign: "center",
              animation: `slide-up 500ms ease-out ${i * 80}ms backwards`,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "min(72px, 6vw)",
                letterSpacing: "-0.03em",
                color: c.color,
                lineHeight: 1,
                marginBottom: 12,
              }}
            >
              {fmtN(c.value)}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--fg-3)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
