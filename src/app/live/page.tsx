"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProShell } from "@/components/ProShell";

interface LiveAlert {
  mint: string;
  symbol?: string | null;
  risk_score: number;
  risk_level: string;
  predicted_at: number;
  age_seconds?: number;
  dev_wallet?: string | null;
  dev_known?: boolean;
  dev_confirmed_rugs?: number;
  flags?: string[];
}

const SOUND_KEY = "solsentry:sound";
const NOTIFY_KEY = "solsentry:browser-notify";
const THRESHOLD_KEY = "solsentry:threshold";

function playBeep() {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const beep = (when: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + when);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + when + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + when);
      osc.stop(ctx.currentTime + when + 0.2);
    };
    beep(0, 880);
    beep(0.22, 1320);
    setTimeout(() => ctx.close().catch(() => {}), 800);
  } catch {
    /* ignore */
  }
}

function showBrowserNotification(a: LiveAlert) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(`SolSentry · ${a.risk_level}`, {
      body: `Risk ${a.risk_score} · ${a.mint.slice(0, 12)}…`,
      icon: "/favicon-192.png",
      tag: a.mint,
    });
  } catch {
    /* ignore */
  }
}

export default function LivePage() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [notifyOn, setNotifyOn] = useState(false);
  const [threshold, setThreshold] = useState<"HIGH" | "CRITICAL">("CRITICAL");
  const seenRef = useRef<Set<string>>(new Set());
  const firstFillRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSoundOn(window.localStorage.getItem(SOUND_KEY) === "1");
    setNotifyOn(window.localStorage.getItem(NOTIFY_KEY) === "1");
    const t = window.localStorage.getItem(THRESHOLD_KEY);
    if (t === "HIGH" || t === "CRITICAL") setThreshold(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      if (paused) return;
      try {
        const res = await fetch("https://api.solsentry.app/v1/alerts/recent?limit=50");
        if (!res.ok) {
          if (!cancelled) setError(`HTTP ${res.status}`);
          return;
        }
        const data = (await res.json()) as { alerts?: LiveAlert[] };
        const incoming = data.alerts ?? [];
        if (cancelled) return;
        setError(null);
        const fresh: LiveAlert[] = [];
        for (const a of incoming) {
          const key = `${a.mint}-${a.predicted_at}`;
          if (!seenRef.current.has(key)) {
            seenRef.current.add(key);
            fresh.push(a);
          }
        }
        if (fresh.length > 0) {
          setAlerts((prev) => [...fresh, ...prev].slice(0, 100));
          if (!firstFillRef.current) {
            for (const a of fresh) {
              const matchesThreshold =
                threshold === "HIGH"
                  ? a.risk_level === "HIGH" || a.risk_level === "CRITICAL"
                  : a.risk_level === "CRITICAL";
              if (matchesThreshold) {
                if (soundOn) playBeep();
                if (notifyOn) showBrowserNotification(a);
              }
            }
          }
          firstFillRef.current = false;
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "fetch failed");
      }
    }
    poll();
    const id = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [paused, soundOn, notifyOn, threshold]);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    window.localStorage.setItem(SOUND_KEY, next ? "1" : "0");
    if (next) playBeep();
  }

  async function toggleNotify() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (notifyOn) {
      setNotifyOn(false);
      window.localStorage.setItem(NOTIFY_KEY, "0");
      return;
    }
    if (Notification.permission === "granted") {
      setNotifyOn(true);
      window.localStorage.setItem(NOTIFY_KEY, "1");
      return;
    }
    const res = await Notification.requestPermission();
    if (res === "granted") {
      setNotifyOn(true);
      window.localStorage.setItem(NOTIFY_KEY, "1");
    }
  }

  function changeThreshold(t: "HIGH" | "CRITICAL") {
    setThreshold(t);
    window.localStorage.setItem(THRESHOLD_KEY, t);
  }

  return (
    <ProShell>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--brand-amber)",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: paused ? "var(--fg-3)" : "var(--brand-teal)",
                animation: paused ? "none" : "blink 1.5s ease-in-out infinite",
              }}
            />
            LIVE FEED · 5s polling
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg-1)",
            }}
          >
            Real-time alert stream
          </h1>
          <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 6 }}>
            Newest mainnet detections appear at the top. Sound + browser notifications
            optional. Click any mint to open the token card.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: 12,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            style={{
              padding: "8px 14px",
              background: paused ? "var(--brand-amber)" : "var(--surface-2)",
              color: paused ? "var(--fg-on-brand)" : "var(--fg-1)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>

          <button
            type="button"
            onClick={toggleSound}
            style={{
              padding: "8px 14px",
              background: soundOn ? "var(--brand-amber-tint)" : "var(--surface-2)",
              color: soundOn ? "var(--brand-amber)" : "var(--fg-2)",
              border: `1px solid ${soundOn ? "var(--brand-amber-line)" : "var(--border)"}`,
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ♪ Sound {soundOn ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={toggleNotify}
            style={{
              padding: "8px 14px",
              background: notifyOn ? "var(--brand-amber-tint)" : "var(--surface-2)",
              color: notifyOn ? "var(--brand-amber)" : "var(--fg-2)",
              border: `1px solid ${notifyOn ? "var(--brand-amber-line)" : "var(--border)"}`,
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ⌖ Browser notify {notifyOn ? "ON" : "OFF"}
          </button>

          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 2,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 6,
            }}
          >
            {(["HIGH", "CRITICAL"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeThreshold(t)}
                style={{
                  padding: "6px 10px",
                  background:
                    threshold === t ? "var(--brand-amber)" : "transparent",
                  color:
                    threshold === t ? "var(--fg-on-brand)" : "var(--fg-3)",
                  border: 0,
                  borderRadius: 4,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: threshold === t ? 700 : 400,
                }}
              >
                Alert at {t}+
              </button>
            ))}
          </div>

          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "var(--fg-3)",
              marginLeft: "auto",
            }}
          >
            {alerts.length} loaded · {error ? `error: ${error}` : "ok"}
          </span>

          <a
            href="https://t.me/solsentryai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              color: "var(--brand-teal)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
            }}
          >
            Telegram bot →
          </a>
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {alerts.length === 0 && (
            <li
              style={{
                padding: 24,
                color: "var(--fg-3)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
              }}
            >
              Waiting for the next alert from mainnet…
            </li>
          )}
          {alerts.map((a, idx) => (
            <li
              key={`${a.mint}-${a.predicted_at}-${idx}`}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 100px 80px",
                gap: 12,
                padding: "12px 14px",
                background: "var(--surface)",
                border: `1px solid ${a.risk_level === "CRITICAL" ? "var(--status-critical)" : "var(--border)"}`,
                borderLeftWidth: 3,
                borderRadius: 6,
                alignItems: "center",
                animation: idx < 3 ? "fadein 240ms ease" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  padding: "3px 8px",
                  borderRadius: 3,
                  textAlign: "center",
                  color:
                    a.risk_level === "CRITICAL"
                      ? "var(--status-critical)"
                      : "var(--brand-amber)",
                  background:
                    a.risk_level === "CRITICAL"
                      ? "var(--status-critical-tint)"
                      : "var(--brand-amber-tint)",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                }}
              >
                {a.risk_level}
              </span>
              <Link
                href={`/token/${a.mint}`}
                style={{
                  color: "var(--fg-1)",
                  textDecoration: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {a.symbol ? <strong>{a.symbol}</strong> : null} {a.mint}
              </Link>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--fg-3)",
                  textAlign: "right",
                }}
              >
                risk {a.risk_score}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "var(--fg-3)",
                  textAlign: "right",
                }}
              >
                {a.age_seconds !== undefined ? formatAge(a.age_seconds) : "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadein { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </ProShell>
  );
}

function formatAge(s: number): string {
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
