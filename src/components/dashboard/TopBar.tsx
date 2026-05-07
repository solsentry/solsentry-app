"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WalletConnectButton } from "../WalletConnectButton";

interface TopBarProps {
  runtimeHours?: number;
  totalScans?: number;
  /** Optional version label, e.g. "v0.4.0". Default hidden. */
  version?: string;
}

const SOLANA_ADDR_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/** Smart-route a search input to the most likely tool. */
function routeForInput(value: string): string {
  const v = value.trim();
  if (!v) return "/dashboard";
  if (SOLANA_ADDR_RE.test(v)) {
    // Heuristic: 44-char base58 ≈ wallet, 43-44 ≈ mint. Both valid; default to operator.
    return `/operator/${v}`;
  }
  // Fallback: send to operator search page (which validates and routes).
  return `/operator?q=${encodeURIComponent(v)}`;
}

export function TopBar({ runtimeHours, totalScans, version }: TopBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById(
          "solsentry-topbar-search",
        ) as HTMLInputElement | null;
        input?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = routeForInput(query);
  };

  return (
    <header
      style={{
        height: 56,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 20,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Link
        href="/dashboard"
        aria-label="SolSentry Pro home"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <img src="/logo-shield.svg" width={22} height={22} alt="" />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
          }}
        >
          SOLSENTRY
        </span>
        {version && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-3)",
              marginLeft: 6,
              padding: "2px 6px",
              border: "1px solid var(--border)",
              borderRadius: 2,
            }}
          >
            {version}
          </span>
        )}
      </Link>

      <form
        onSubmit={onSubmit}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 10,
          maxWidth: 560,
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: "6px 12px",
        }}
        role="search"
        aria-label="Global search"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "var(--fg-3)" }}
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          id="solsentry-topbar-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Scan wallet, token, or operator…"
          aria-label="Search wallet, token, or operator"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--fg-1)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--fg-4)",
            padding: "1px 5px",
            border: "1px solid var(--border)",
            borderRadius: 2,
          }}
          aria-hidden
        >
          ⌘K
        </span>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginLeft: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--fg-3)",
        }}
      >
        <span aria-label="Solana mainnet status">
          <span style={{ color: "var(--brand-teal)" }}>●</span> Mainnet
        </span>
        {runtimeHours !== undefined && (
          <span aria-label="Continuous runtime">
            {runtimeHours.toFixed(0)}h runtime
          </span>
        )}
        {totalScans !== undefined && (
          <span aria-label="Total scans">
            {totalScans.toLocaleString("en-US")}+ scans
          </span>
        )}
        <WalletConnectButton />
        <span
          aria-disabled
          title="Coming May 12 — login + persistent profile"
          style={{
            padding: "4px 10px",
            border: "1px solid var(--border)",
            borderRadius: 4,
            color: "var(--fg-4)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            cursor: "not-allowed",
          }}
        >
          Login · soon
        </span>
      </div>
    </header>
  );
}
