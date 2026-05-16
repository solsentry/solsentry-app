"use client";

// CopyText — inline copy-to-clipboard button with transient feedback.
// Used in dense info strips next to mints / wallets where a full
// btn-ghost would be too heavy.

import { useState } from "react";

interface Props {
  value: string;
  label?: string;
}

export function CopyText({ value, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silent — clipboard may be unavailable in some contexts.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${label} ${value}`}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        padding: "2px 8px",
        background: "transparent",
        color: copied ? "var(--brand-teal)" : "var(--fg-3)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        cursor: "pointer",
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
