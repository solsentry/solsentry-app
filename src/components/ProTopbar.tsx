"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function ProTopbar() {
  const [query, setQuery] = useState("");
  const [healthy, setHealthy] = useState<boolean | null>(null);
  const [unread, setUnread] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSoundOn(window.localStorage.getItem("solsentry:sound") === "1");
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function ping() {
      try {
        const res = await fetch("https://api.solsentry.app/health");
        if (!cancelled) setHealthy(res.ok);
      } catch {
        if (!cancelled) setHealthy(false);
      }
    }
    ping();
    const id = setInterval(ping, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let lastSeen = 0;
    async function poll() {
      try {
        const res = await fetch("https://api.solsentry.app/v1/alerts/recent?limit=20");
        if (!res.ok) return;
        const data = (await res.json()) as { alerts?: { predicted_at: number }[] };
        const alerts = data.alerts ?? [];
        if (alerts.length === 0) return;
        const newest = Math.max(...alerts.map((a) => a.predicted_at ?? 0));
        if (lastSeen === 0) {
          lastSeen = newest;
          return;
        }
        const fresh = alerts.filter((a) => (a.predicted_at ?? 0) > lastSeen).length;
        if (!cancelled && fresh > 0) {
          setUnread((u) => u + fresh);
          lastSeen = newest;
        }
      } catch {
        /* ignore */
      }
    }
    poll();
    const id = setInterval(poll, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("solsentry:sound", next ? "1" : "0");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // Solana addresses are base58, 32-44 chars; if it looks like a token, route to /token, else /operator
    if (q.length >= 32 && q.length <= 44) {
      router.push(`/operator/${q}`);
      return;
    }
    setQuery("");
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 24px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(16, 14, 10, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste a Solana wallet or mint address…"
          style={{
            flex: 1,
            padding: "10px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            background: "var(--surface)",
            color: "var(--fg-1)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            background: "var(--brand-amber)",
            color: "var(--fg-on-brand)",
            border: 0,
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Search
        </button>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: healthy ? "var(--brand-teal)" : "var(--fg-3)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background:
              healthy === true
                ? "var(--brand-teal)"
                : healthy === false
                  ? "var(--status-critical)"
                  : "var(--fg-4)",
          }}
        />
        {healthy === null ? "checking" : healthy ? "live" : "offline"}
      </div>

      <button
        type="button"
        onClick={toggleSound}
        title={soundOn ? "Sound on" : "Sound off"}
        style={{
          padding: "8px 10px",
          background: soundOn ? "var(--brand-amber-tint)" : "var(--surface)",
          color: soundOn ? "var(--brand-amber)" : "var(--fg-3)",
          border: `1px solid ${soundOn ? "var(--brand-amber-line)" : "var(--border)"}`,
          borderRadius: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        {soundOn ? "♪ on" : "♪ off"}
      </button>

      <a
        href="/live"
        title="Notifications"
        style={{
          position: "relative",
          padding: "8px 10px",
          background: "var(--surface)",
          color: unread > 0 ? "var(--brand-amber)" : "var(--fg-3)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          textDecoration: "none",
        }}
      >
        ⌖ {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--status-critical)",
              color: "#fff",
              fontSize: 10,
              padding: "1px 5px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </a>
    </header>
  );
}
