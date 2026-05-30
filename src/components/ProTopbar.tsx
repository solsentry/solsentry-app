"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, BellOff, BellRing } from "lucide-react";

export function ProTopbar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [notifyOn, setNotifyOn] = useState(false);
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const [bellOpen, setBellOpen] = useState(false);

  // Determine active mode - only highlight when truly on the representative page for that mode
  const getActiveMode = () => {
    if (pathname === '/') return 'easy';   // only exact home for Easy
    if (pathname?.startsWith('/pro') || pathname?.startsWith('/dashboard')) return 'pro';
    if (pathname?.startsWith('/api') || 
        pathname?.startsWith('/docs') || 
        pathname?.startsWith('/architecture') || 
        pathname?.startsWith('/skills') || 
        pathname?.startsWith('/x402')) return 'dev';
    return null;   // on internal pages (live, operators, clusters, alerts, etc.) → no tab selected
  };

  const activeMode = getActiveMode();

  const SOUND_KEY = "solsentry:sound";
  const NOTIFY_KEY = "solsentry:browser-notify";

  // Load notification prefs + cross-tab sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadPrefs = () => {
      setSoundOn(localStorage.getItem(SOUND_KEY) === "1");
      setNotifyOn(localStorage.getItem(NOTIFY_KEY) === "1");
    };
    loadPrefs();

    const onStorage = (e: StorageEvent) => {
      if (e.key === SOUND_KEY || e.key === NOTIFY_KEY) loadPrefs();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Click outside to close bell dropdown
  useEffect(() => {
    if (!bellOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bellOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load persisted lang/theme/auth for Pro area
    const savedLang = window.localStorage.getItem("solsentry-lang") as "en" | "pt" | null;
    const savedTheme = window.localStorage.getItem("solsentry-theme") as "dark" | "light" | null;
    const mockUser = window.localStorage.getItem("solsentry-mock-user");

    if (savedLang) setLang(savedLang);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    setIsLoggedIn(!!mockUser);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (q.length >= 32 && q.length <= 44) {
      // Heuristic for token vs wallet:
      // Pump.fun mints end in "pump", Bonk-style in "bonk", etc → /token
      // Otherwise default to /operator (most common Solana wallet)
      const isToken =
        /pump$/i.test(q) || /moon$/i.test(q) || /bonk$/i.test(q);
      router.push(isToken ? `/token/${q}` : `/operator/${q}`);
      return;
    }
    setQuery("");
  }

  // === New controls logic ===
  const toggleLang = () => {
    const newLang = lang === "en" ? "pt" : "en";
    setLang(newLang);
    localStorage.setItem("solsentry-lang", newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("solsentry-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleMockLogin = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    if (newState) {
      localStorage.setItem("solsentry-mock-user", "demo");
    } else {
      localStorage.removeItem("solsentry-mock-user");
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem(SOUND_KEY, next ? "1" : "0");
  };

  const toggleNotify = async () => {
    if (!notifyOn && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch {
          /* ignore */
        }
      }
    }
    const next = !notifyOn;
    setNotifyOn(next);
    localStorage.setItem(NOTIFY_KEY, next ? "1" : "0");
  };

  const openLive = () => {
    setBellOpen(false);
    router.push("/live");
  };

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
      {/* Left group: Search + Bell (before the visual separator) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
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

        {/* Notifications Bell + Dropdown (moved next to search, before the |) */}
        <div ref={bellRef} style={{ position: "relative" }}>
          <button
            onClick={() => setBellOpen((o) => !o)}
            title={
              soundOn && notifyOn
                ? "Alertas: Som + Browser ativos"
                : soundOn
                  ? "Alertas: Som ativo (browser off)"
                  : notifyOn
                    ? "Alertas: Browser notify ativo (som off)"
                    : "Alertas silenciados (sem som e sem notify)"
            }
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              background: bellOpen ? "var(--surface-2)" : "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: unread > 0 ? "var(--brand-amber)" : "var(--fg-3)",
              cursor: "pointer",
              opacity: soundOn || notifyOn ? 1 : 0.65,
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            {/* Dynamic bell icon based on active channels */}
            {(() => {
              if (soundOn && notifyOn) {
                // Both active → ringing bell (strongest alert state)
                return <BellRing size={16} color="var(--brand-amber)" />;
              }
              if (soundOn && !notifyOn) {
                // Only sound → same ringing effect as Both, but in yellow
                return <BellRing size={16} color="#fbbf24" />;
              }
              if (notifyOn) {
                // Only browser notifications → bell in teal
                return <Bell size={16} color="var(--brand-teal)" />;
              }
              // Both off → muted with weak red tone
              return <BellOff size={16} color="rgba(248, 113, 113, 0.55)" />;
            })()}

            {/* Unread badge - top right (always priority) */}
            {unread > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  background: "var(--status-critical)",
                  color: "#fff",
                  fontSize: 10,
                  padding: "1px 5px",
                  borderRadius: 999,
                  fontWeight: 700,
                  minWidth: 16,
                  textAlign: "center",
                }}
              >
                {unread > 99 ? "99+" : unread}
              </span>
            )}

            {/* Status dot bottom-right:
                - Green when sound is armed (audio alert)
                - Teal when only browser notify is on (no sound)
            */}
            {(soundOn || notifyOn) && (
              <span
                style={{
                  position: "absolute",
                  bottom: 3,
                  right: 3,
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: soundOn ? "var(--brand-teal)" : "var(--brand-teal)",
                  border: "1px solid var(--surface)",
                  opacity: soundOn ? 1 : 0.85,
                }}
              />
            )}
          </button>

          {bellOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                minWidth: 228,
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                zIndex: 100,
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                overflow: "hidden",
              }}
            >
              {/* Sound toggle */}
              <div
                onClick={toggleSound}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                <span>♪ Sound alerts</span>
                <span style={{ color: soundOn ? "var(--brand-amber)" : "var(--fg-3)", fontWeight: 600 }}>
                  {soundOn ? "ON" : "OFF"}
                </span>
              </div>

              {/* Browser notifications toggle */}
              <div
                onClick={toggleNotify}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span>⌖ Browser notify</span>
                <span style={{ color: notifyOn ? "var(--brand-amber)" : "var(--fg-3)", fontWeight: 600 }}>
                  {notifyOn ? "ON" : "OFF"}
                </span>
              </div>

              {/* Thin separator */}
              <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />

              {/* Open Live */}
              <div
                onClick={openLive}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  color: "var(--brand-amber)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
                }}
              >
                Abrir Live Feed →
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right cluster: EN/PT + Theme + Easy/Pro/Dev + Login/Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12, paddingLeft: 12, borderLeft: '1px solid var(--border)' }}>

        {/* Language */}
        <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          <button
            onClick={() => {
              const newLang = "en";
              setLang(newLang);
              localStorage.setItem("solsentry-lang", newLang);
            }}
            style={{
              padding: '10px 14px',
              background: lang === "en" ? "var(--brand-amber-tint)" : "transparent",
              color: lang === "en" ? "var(--brand-amber)" : "var(--fg-2)",
              border: 'none',
              cursor: 'pointer',
              minHeight: 38,
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            EN
          </button>
          <button
            onClick={() => {
              const newLang = "pt";
              setLang(newLang);
              localStorage.setItem("solsentry-lang", newLang);
            }}
            style={{
              padding: '10px 14px',
              background: lang === "pt" ? "var(--brand-amber-tint)" : "transparent",
              color: lang === "pt" ? "var(--brand-amber)" : "var(--fg-2)",
              border: 'none',
              cursor: 'pointer',
              minHeight: 38,
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            PT
          </button>
        </div>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          style={{ 
            minWidth: 38, 
            height: 38, 
            border: '1px solid var(--border)', 
            borderRadius: 6, 
            background: 'var(--surface)', 
            color: 'var(--fg-2)', 
            cursor: 'pointer', 
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
          }}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>

        {/* Mode tabs */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          border: '1px solid var(--border)', 
          borderRadius: 6, 
          padding: 2,
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
        }}>
          <a 
            href="/" 
            style={{
              padding: '8px 12px',
              borderRadius: 4,
              color: activeMode === 'easy' ? 'var(--brand-amber)' : 'var(--fg-2)',
              background: activeMode === 'easy' ? 'var(--brand-amber-tint)' : 'transparent',
              textDecoration: 'none',
              fontWeight: activeMode === 'easy' ? 600 : 400,
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              fontSize: 11,
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            Easy
          </a>

          {activeMode !== 'easy' && activeMode !== 'pro' && (
            <span 
              style={{ 
                width: 1, 
                alignSelf: 'stretch', 
                background: 'var(--border)', 
                margin: '0 2px' 
              }} 
            />
          )}

          <a 
            href="/pro" 
            style={{
              padding: '8px 12px',
              borderRadius: 4,
              color: activeMode === 'pro' ? 'var(--brand-amber)' : 'var(--fg-2)',
              background: activeMode === 'pro' ? 'var(--brand-amber-tint)' : 'transparent',
              textDecoration: 'none',
              fontWeight: activeMode === 'pro' ? 600 : 400,
              opacity: activeMode === 'pro' ? 1 : 0.85,
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              fontSize: 11,
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            Pro
          </a>

          {activeMode !== 'pro' && activeMode !== 'dev' && (
            <span 
              style={{ 
                width: 1, 
                alignSelf: 'stretch', 
                background: 'var(--border)', 
                margin: '0 2px' 
              }} 
            />
          )}

          <a 
            href="/api" 
            style={{
              padding: '8px 12px',
              borderRadius: 4,
              color: activeMode === 'dev' ? 'var(--brand-amber)' : 'var(--fg-2)',
              background: activeMode === 'dev' ? 'var(--brand-amber-tint)' : 'transparent',
              textDecoration: 'none',
              fontWeight: activeMode === 'dev' ? 600 : 400,
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              fontSize: 11,
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            Dev
          </a>
        </div>

        {/* Auth */}
        {isLoggedIn ? (
          <a 
            href="/pro" 
            style={{ 
              fontSize: 12, 
              padding: '10px 14px', 
              minHeight: 38,
              display: 'flex',
              alignItems: 'center',
              background: 'var(--border)', 
              color: 'var(--brand-amber)', 
              borderRadius: 6, 
              textDecoration: 'none',
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            Profile
          </a>
        ) : (
          <a 
            href="/login" 
            style={{ 
              fontSize: 12, 
              padding: '10px 14px', 
              minHeight: 38,
              display: 'flex',
              alignItems: 'center',
              background: 'var(--border)', 
              color: 'var(--brand-amber)', 
              borderRadius: 6, 
              textDecoration: 'none',
              transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
            }}
          >
            Login
          </a>
        )}
      </div>
    </header>
  );
}
