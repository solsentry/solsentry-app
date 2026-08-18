"use client";

// CopyShareLink — one-click copy of the public share URL for an operator.
// Renders a btn-ghost styled button with transient "Copied" feedback.

import { useState } from "react";

interface Props {
  wallet: string;
  riskLevel?: string;
  rugRate?: string;
  totalTokens?: string;
}

export function CopyShareLink({ wallet, riskLevel, rugRate, totalTokens }: Props) {
  const [copied, setCopied] = useState(false);

  const url = `https://solsentry.app/share/operator/${wallet}`;

  async function handleCopy() {
    let snippet = url;
    if (riskLevel) {
      snippet = `🚨 SolSentry Risk Alert\nOperator: ${wallet}\nRisk Level: ${riskLevel}\n${rugRate ? `Rug Rate: ${rugRate}%\n` : ""}${totalTokens ? `Tokens: ${totalTokens}\n` : ""}Proof of Threat: ${url}`;
    }

    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
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
