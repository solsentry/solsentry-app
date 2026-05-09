"use client";

import { useEffect, useState } from "react";
import { ProShell } from "@/components/ProShell";

const SOUND_KEY = "solsentry:sound";
const NOTIFY_KEY = "solsentry:browser-notify";
const THRESHOLD_KEY = "solsentry:threshold";
const DISCORD_KEY = "solsentry:discord-webhook";
const EMAIL_KEY = "solsentry:email";

export default function NotificationsPage() {
  const [soundOn, setSoundOn] = useState(false);
  const [notifyOn, setNotifyOn] = useState(false);
  const [threshold, setThreshold] = useState<"HIGH" | "CRITICAL">("CRITICAL");
  const [webhook, setWebhook] = useState("");
  const [email, setEmail] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSoundOn(window.localStorage.getItem(SOUND_KEY) === "1");
    setNotifyOn(window.localStorage.getItem(NOTIFY_KEY) === "1");
    const t = window.localStorage.getItem(THRESHOLD_KEY);
    if (t === "HIGH" || t === "CRITICAL") setThreshold(t);
    setWebhook(window.localStorage.getItem(DISCORD_KEY) ?? "");
    setEmail(window.localStorage.getItem(EMAIL_KEY) ?? "");
  }, []);

  function flash() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    window.localStorage.setItem(SOUND_KEY, next ? "1" : "0");
    flash();
  }

  async function toggleNotify() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser notifications not supported here.");
      return;
    }
    if (notifyOn) {
      setNotifyOn(false);
      window.localStorage.setItem(NOTIFY_KEY, "0");
      flash();
      return;
    }
    if (Notification.permission !== "granted") {
      const res = await Notification.requestPermission();
      if (res !== "granted") return;
    }
    setNotifyOn(true);
    window.localStorage.setItem(NOTIFY_KEY, "1");
    flash();
  }

  function changeThreshold(t: "HIGH" | "CRITICAL") {
    setThreshold(t);
    window.localStorage.setItem(THRESHOLD_KEY, t);
    flash();
  }

  function saveWebhook() {
    window.localStorage.setItem(DISCORD_KEY, webhook);
    flash();
  }

  function saveEmail() {
    window.localStorage.setItem(EMAIL_KEY, email);
    flash();
  }

  return (
    <ProShell>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--brand-amber)",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            SETTINGS · NOTIFICATIONS
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
            Alert preferences
          </h1>
          <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 6 }}>
            Settings are stored locally in your browser. No account, no server.
          </p>
          {savedFlash && (
            <div
              style={{
                marginTop: 10,
                padding: "6px 12px",
                background: "var(--brand-teal-tint)",
                color: "var(--brand-teal)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                borderRadius: 4,
                display: "inline-block",
              }}
            >
              ✓ saved
            </div>
          )}
        </header>

        <Section title="Live feed alerts">
          <Row label="Sound (double-beep on threshold)">
            <Toggle on={soundOn} onClick={toggleSound} />
          </Row>
          <Row label="Browser notifications">
            <Toggle on={notifyOn} onClick={toggleNotify} />
          </Row>
          <Row label="Severity threshold">
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
                    padding: "6px 12px",
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
                  {t}+
                </button>
              ))}
            </div>
          </Row>
        </Section>

        <Section title="Telegram bot">
          <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
            Get the same alerts via Telegram with full operator profiles, drain
            traces, and hunter assignments. Open{" "}
            <a
              href="https://t.me/solsentryai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand-amber)", textDecoration: "none" }}
            >
              @solsentryai
            </a>{" "}
            and run <code style={{ fontFamily: "var(--font-mono)" }}>/start</code>.
          </p>
          <a
            href="https://t.me/solsentryai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 8,
              padding: "8px 14px",
              background: "var(--brand-amber)",
              color: "var(--fg-on-brand)",
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Open Telegram bot →
          </a>
        </Section>

        <Section title="Discord webhook">
          <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
            Paste a Discord webhook URL to forward CRITICAL alerts (UI placeholder
            — backend integration ships post-Demo Day).
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/…"
              style={{
                flex: 1,
                padding: "8px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                background: "var(--surface-2)",
                color: "var(--fg-1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={saveWebhook}
              style={{
                padding: "8px 14px",
                background: "var(--surface)",
                color: "var(--fg-1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </Section>

        <Section title="Email digest">
          <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
            Daily CRITICAL alert digest. Saved locally for now — opt-in flow ships
            post-Demo Day.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@protonmail.com"
              type="email"
              style={{
                flex: 1,
                padding: "8px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                background: "var(--surface-2)",
                color: "var(--fg-1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={saveEmail}
              style={{
                padding: "8px 14px",
                background: "var(--surface)",
                color: "var(--fg-1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </Section>
      </div>
    </ProShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 18,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 700,
          color: "var(--fg-1)",
          letterSpacing: "-0.01em",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid var(--border-soft)",
        gap: 12,
      }}
    >
      <span style={{ color: "var(--fg-2)", fontSize: 13 }}>{label}</span>
      {children}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        width: 52,
        height: 28,
        background: on ? "var(--brand-amber)" : "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 999,
        cursor: "pointer",
        transition: "background 160ms",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 26 : 2,
          width: 22,
          height: 22,
          background: "var(--fg-1)",
          borderRadius: 999,
          transition: "left 160ms",
        }}
      />
    </button>
  );
}
