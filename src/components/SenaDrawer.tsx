"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type SenaEntity =
  | {
      type: "operator";
      id: string;
      summary?: {
        riskLevel?: string;
        riskScore?: number;
        confirmedRugs?: number;
        totalTokens?: number;
        rugRatePct?: number;
        tags?: string[];
      };
    }
  | {
      type: "token";
      id: string;
      summary?: {
        symbol?: string | null;
        riskLevel?: string;
        riskScore?: number;
        flags?: string[];
        deployer?: string;
      };
    };

interface Message {
  role: "sena" | "user";
  text: string;
  ts: number;
}

function shortId(id: string) {
  if (id.length <= 12) return id;
  return id.slice(0, 6) + "…" + id.slice(-4);
}

function initialGreeting(entity: SenaEntity): string {
  if (entity.type === "operator") {
    const s = entity.summary;
    const rate = s?.rugRatePct;
    const total = s?.totalTokens;
    if (rate !== undefined && total !== undefined) {
      return `Looking at operator ${shortId(entity.id)} — rug rate ${rate.toFixed(1)}%, ${total.toLocaleString()} tokens deployed. What do you want to know?`;
    }
    return `Looking at operator ${shortId(entity.id)}. What do you want to know?`;
  }
  const s = entity.summary;
  const sym = s?.symbol ?? "this token";
  const level = s?.riskLevel ?? "UNKNOWN";
  return `This is ${sym} (${shortId(entity.id)}) — risk ${level}. Ask me anything.`;
}

function suggestedPrompts(entity: SenaEntity): string[] {
  if (entity.type === "operator") {
    return [
      "Why is this CRITICAL?",
      "Show drain trace",
      "Compare to known clusters",
      "What's the operator's history?",
    ];
  }
  return [
    "Why is this risky?",
    "Show drain trace",
    "Who deployed this?",
    "Compare to known clusters",
  ];
}

export function SenaDrawer({
  entity,
  open,
  onClose,
  launcherRef,
}: {
  entity: SenaEntity;
  open: boolean;
  onClose: () => void;
  launcherRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Seed initial greeting once per entity
  useEffect(() => {
    setMessages([
      { role: "sena", text: initialGreeting(entity), ts: Date.now() },
    ]);
  }, [entity.type, entity.id]);

  // ESC + focus trap + return focus
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, textarea, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      const target = launcherRef.current ?? previouslyFocused;
      target?.focus();
    };
  }, [open, onClose, launcherRef]);

  // Autoscroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: Message = { role: "user", text: trimmed, ts: Date.now() };
      setMessages((m) => [...m, userMsg]);
      setDraft("");
      setTyping(true);
      try {
        const res = await fetch("/api/sena/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entity_type: entity.type,
            entity_id: entity.id,
            summary: entity.summary ?? {},
            message: trimmed,
            history: messages.map((m) => ({ role: m.role, text: m.text })),
          }),
        });
        const data = (await res.json()) as { reply: string };
        // Simulated typing delay handled server-side; small UI delay too
        await new Promise((r) => setTimeout(r, 200));
        setMessages((m) => [
          ...m,
          { role: "sena", text: data.reply, ts: Date.now() },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "sena",
            text: "Couldn't reach the analyst right now. Try again in a moment.",
            ts: Date.now(),
          },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [entity.id, entity.type, entity.summary, messages],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  };

  if (!open) return null;

  const prompts = suggestedPrompts(entity);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(16, 14, 10, 0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 60,
          animation: "sena-drawer-fade 200ms ease",
        }}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sena-drawer-title"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--surface)",
          borderLeft: "1px solid var(--brand-amber-line)",
          zIndex: 61,
          display: "flex",
          flexDirection: "column",
          animation: "sena-drawer-slide 240ms ease",
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--brand-amber)",
                boxShadow: "0 0 10px var(--brand-amber-tint)",
              }}
            />
            <div>
              <div
                id="sena-drawer-title"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--fg-1)",
                  letterSpacing: "-0.01em",
                }}
              >
                Sena
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--fg-3)",
                  letterSpacing: "0.04em",
                }}
              >
                AI threat analyst
              </div>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close Sena chat"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--fg-2)",
              padding: "6px 10px",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
          >
            ✕
          </button>
        </header>

        {/* Messages */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background:
                    m.role === "user"
                      ? "var(--brand-amber-tint)"
                      : "var(--bg)",
                  border:
                    m.role === "user"
                      ? "1px solid var(--brand-amber-line)"
                      : "1px solid var(--border)",
                  color: "var(--fg-1)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Suggested prompts (shown only when just greeting) */}
          {messages.length === 1 && !typing && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 4,
              }}
            >
              {prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--brand-amber-line)",
                    color: "var(--brand-amber)",
                    padding: "6px 10px",
                    borderRadius: 999,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.02em",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                aria-label="Sena is typing"
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  gap: 4,
                }}
              >
                <span className="sena-dot" />
                <span className="sena-dot" style={{ animationDelay: "150ms" }} />
                <span className="sena-dot" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask Sena…"
            rows={1}
            aria-label="Message Sena"
            style={{
              flex: 1,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--fg-1)",
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: 14,
              fontFamily: "inherit",
              resize: "none",
              minHeight: 40,
              maxHeight: 120,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => send(draft)}
            disabled={!draft.trim() || typing}
            style={{
              padding: "10px 14px",
              background:
                "linear-gradient(135deg, var(--brand-amber) 0%, var(--brand-amber-400) 100%)",
              color: "var(--fg-on-brand)",
              border: 0,
              borderRadius: 6,
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              cursor: draft.trim() && !typing ? "pointer" : "not-allowed",
              opacity: draft.trim() && !typing ? 1 : 0.5,
              letterSpacing: "-0.01em",
            }}
          >
            Send
          </button>
        </div>
      </aside>

      <style>{`
        @keyframes sena-drawer-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes sena-drawer-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sena-dot-pulse {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-2px); }
        }
        .sena-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brand-amber);
          animation: sena-dot-pulse 1.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          aside[role="dialog"] { animation: none !important; }
          .sena-dot { animation: none !important; opacity: 0.7; }
        }
      `}</style>
    </>
  );
}
