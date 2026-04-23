"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { fetchOperator, truncate, type Operator } from "@/lib/api";

const KEY = "solsentry:watchlist:v1";

interface Entry {
  wallet: string;
  added_at: number;
  label?: string;
  data?: Operator;
  loading?: boolean;
  error?: string;
}

function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: Entry[]) {
  if (typeof window === "undefined") return;
  const persisted = entries.map((e) => ({
    wallet: e.wallet,
    added_at: e.added_at,
    label: e.label,
  }));
  localStorage.setItem(KEY, JSON.stringify(persisted));
}

export function WatchlistManager() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setMounted(true);
  }, []);

  const refresh = useCallback(async (list: Entry[]) => {
    const updated = await Promise.all(
      list.map(async (entry) => {
        if (entry.data) return entry;
        try {
          const data = await fetchOperator(entry.wallet);
          return { ...entry, data: data ?? undefined, loading: false };
        } catch {
          return { ...entry, error: "Fetch failed", loading: false };
        }
      }),
    );
    setEntries(updated);
  }, []);

  useEffect(() => {
    if (mounted && entries.length > 0 && entries.some((e) => !e.data && !e.error)) {
      void refresh(entries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const w = input.trim();
    if (w.length < 32) return;
    if (entries.some((entry) => entry.wallet === w)) return;
    const next: Entry[] = [
      { wallet: w, added_at: Date.now(), label: labelInput.trim() || undefined, loading: true },
      ...entries,
    ];
    setEntries(next);
    saveEntries(next);
    setInput("");
    setLabelInput("");
    void refresh(next);
  };

  const remove = (wallet: string) => {
    const next = entries.filter((e) => e.wallet !== wallet);
    setEntries(next);
    saveEntries(next);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries.map((e) => ({ wallet: e.wallet, added_at: e.added_at, label: e.label })), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solsentry-watchlist-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <form onSubmit={add} style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Solana wallet address"
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: "1 1 380px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              color: "var(--fg-1)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <input
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            placeholder="Label (optional)"
            style={{
              flex: "1 1 200px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              color: "var(--fg-1)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button type="submit" className="btn-primary">
            Add →
          </button>
        </div>
      </form>

      {!mounted && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--fg-3)" }}>Loading your list…</div>
      )}

      {mounted && entries.length === 0 && (
        <div
          className="panel"
          style={{ textAlign: "center", padding: 60, border: "1px dashed var(--border)" }}
        >
          <div className="label-tag" style={{ marginBottom: 12 }}>
            Empty
          </div>
          <p style={{ color: "var(--fg-2)", fontSize: 15 }}>
            Paste a wallet above to start. Your list is saved in this browser only.
          </p>
        </div>
      )}

      {mounted && entries.length > 0 && (
        <>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span className="label-tag">{entries.length} wallets tracked</span>
            <button onClick={exportJson} className="btn-ghost">
              Export JSON
            </button>
          </div>

          <div className="panel" style={{ padding: 0 }}>
            {entries.map((entry, i) => {
              const op = entry.data;
              const level = (op?.risk_level || "UNKNOWN").toUpperCase();
              return (
                <div
                  key={entry.wallet}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 110px 100px 80px",
                    gap: 16,
                    padding: "14px 20px",
                    borderBottom: i === entries.length - 1 ? "none" : "1px solid var(--border-soft)",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Link
                      href={`/operator/${entry.wallet}`}
                      className="mono"
                      style={{ color: "var(--brand-orange)", fontSize: 13 }}
                    >
                      {truncate(entry.wallet, 8, 6)}
                    </Link>
                    {entry.label && (
                      <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>{entry.label}</div>
                    )}
                  </div>
                  <span>
                    {op ? (
                      op.known ? (
                        <span className={`risk-badge ${level}`}>{level}</span>
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: "var(--brand-teal)",
                            fontSize: 11,
                            padding: "2px 8px",
                            border: "1px solid var(--brand-teal)",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          not flagged
                        </span>
                      )
                    ) : (
                      <span style={{ color: "var(--fg-3)", fontSize: 12 }}>loading…</span>
                    )}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-2)", fontSize: 13 }}>
                    {op?.confirmed_rugs ?? "—"} rugs
                  </span>
                  <button
                    onClick={() => remove(entry.wallet)}
                    style={{
                      color: "var(--fg-3)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      padding: "4px 10px",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
