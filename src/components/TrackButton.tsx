"use client";

import { useEffect, useState } from "react";

const KEY = "solsentry:watchlist";

function loadList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveList(list: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function TrackButton({ wallet }: { wallet: string }) {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    setTracked(loadList().includes(wallet));
  }, [wallet]);

  function toggle() {
    const list = loadList();
    if (list.includes(wallet)) {
      saveList(list.filter((w) => w !== wallet));
      setTracked(false);
    } else {
      saveList([...list, wallet]);
      setTracked(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        padding: "6px 10px",
        background: tracked ? "var(--brand-amber-tint)" : "transparent",
        color: tracked ? "var(--brand-amber)" : "var(--fg-2)",
        border: `1px solid ${tracked ? "var(--brand-amber-line)" : "var(--border)"}`,
        borderRadius: 4,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        cursor: "pointer",
        alignSelf: "flex-start",
      }}
    >
      {tracked ? "★ Tracking" : "☆ Track this KOL"}
    </button>
  );
}
