"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DrainSearchForm() {
  const router = useRouter();
  const [v, setV] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = v.trim();
    if (w.length < 32) return;
    router.push(`/drain/${w}`);
  };

  return (
    <form
      onSubmit={submit}
      style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
    >
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Paste a Solana wallet address"
        spellCheck={false}
        autoComplete="off"
        style={{
          flex: "1 1 440px",
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
      <button type="submit" className="btn-primary">
        Trace →
      </button>
    </form>
  );
}
