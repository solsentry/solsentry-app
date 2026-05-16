"use client";

// CopyShareLink — one-click copy of the public share URL for an operator.
// Renders a btn-ghost styled button with transient "Copied" feedback.

import { useState } from "react";

interface Props {
  wallet: string;
}

export function CopyShareLink({ wallet }: Props) {
  const [copied, setCopied] = useState(false);

  const url = `https://solsentry.app/share/operator/${wallet}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback — open in new tab so the user can copy from address bar.
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn-ghost"
      aria-label="Copy public share link to clipboard"
    >
      {copied ? "Copied ✓" : "Copy share link"}
    </button>
  );
}
