"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { truncate } from "@/lib/api";

const KEY = "solsentry:labels:v1";

interface LabelEntry {
  wallet: string;
  label: string;
  updated_at: number;
}

function loadLabels(): LabelEntry[] {
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

function saveLabels(labels: LabelEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(labels));
}

export function LabelsManager() {
  const [labels, setLabels] = useState<LabelEntry[]>([]);
  const [wallet, setWallet] = useState("");
  const [label, setLabel] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLabels(loadLabels());
    setMounted(true);
  }, []);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const w = wallet.trim();
    const l = label.trim();
    if (w.length < 32 || !l) return;
    const filtered = labels.filter((x) => x.wallet !== w);
    const next = [{ wallet: w, label: l, updated_at: Date.now() }, ...filtered];
    setLabels(next);
    saveLabels(next);
    setWallet("");
    setLabel("");
  };

  const remove = (w: string) => {
    const next = labels.filter((x) => x.wallet !== w);
    setLabels(next);
    saveLabels(next);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(labels, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solsentry-labels-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <form onSubmit={add} style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
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
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. suspicious dev #3)"
            style={{
              flex: "1 1 240px",
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
            Save label →
          </button>
        </div>
      </form>

      {!mounted && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--fg-3)" }}>
          Loading…
        </div>
      )}

      {mounted && labels.length === 0 && (
        <div
          className="panel"
          style={{
            textAlign: "center",
            padding: 60,
            border: "1px dashed var(--border)",
          }}
        >
          <div className="label-tag" style={{ marginBottom: 12 }}>
            No labels yet
          </div>
          <p style={{ color: "var(--fg-2)", fontSize: 15 }}>
            Add your first one above. Labels stay in your browser — never sent
            to our servers.
          </p>
        </div>
      )}

      {mounted && labels.length > 0 && (
        <>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span className="label-tag">{labels.length} labeled wallets</span>
            <button onClick={exportJson} className="btn-ghost">
              Export JSON
            </button>
          </div>
          <div className="panel" style={{ padding: 0 }}>
            {labels.map((l, i) => (
              <div
                key={l.wallet}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 80px",
                  gap: 16,
                  padding: "14px 20px",
                  borderBottom:
                    i === labels.length - 1
                      ? "none"
                      : "1px solid var(--border-soft)",
                  alignItems: "center",
                }}
              >
                <Link
                  href={`/operator/${l.wallet}`}
                  className="mono"
                  style={{ color: "var(--brand-orange)", fontSize: 13 }}
                >
                  {truncate(l.wallet, 8, 6)}
                </Link>
                <span style={{ fontSize: 14, color: "var(--fg-1)" }}>
                  {l.label}
                </span>
                <button
                  onClick={() => remove(l.wallet)}
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
            ))}
          </div>
        </>
      )}
    </>
  );
}
