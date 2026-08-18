"use client";

// AISearchBar v1 — address-routing only.
//
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §3.1
//
// Phase 1 (this file): client detects kind and routes:
//   .sol           → SNS (DISABLED in v1 — no resolver endpoint yet)
//   base58 32-44   → /lookup?addr=... (server disambiguates wallet vs mint)
//   ALL-CAPS short → DISABLED (/scan removed in scan consolidation)
//   NL (≥2 words)  → /app/playground?q=... (placeholder, no execute backend)
//
// Phase 2 (future): NL routes hit /v1/playground/estimate + /execute.
//
// Routing bug fix (from spec): base58 32-44 chars matches BOTH wallets AND
// token mints — same alphabet, same length range. We can't tell on the
// client, so we punt to a server route that parallel-fetches both and
// 302s to whichever resolves.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Sparkles } from "lucide-react";

export type AISearchVariant = "hero" | "nav" | "dashboard";

interface Props {
  variant?: AISearchVariant;
  /** Optional initial value (e.g. when pre-filling from query string). */
  initialValue?: string;
  /** Override placeholder cycle (mostly for tests). */
  placeholders?: readonly string[];
  className?: string;
}

type Kind = "empty" | "sns" | "address" | "symbol" | "nl" | "unknown";

const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const SNS_RE = /\.sol$/i;
const SYMBOL_RE = /^[A-Z0-9]{2,10}$/;

const DEFAULT_PLACEHOLDERS = [
  "7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp9xRtGhUvYz3nE",
  "qual operador rodou mais rug essa semana?",
  "vagrant.sol",
  "compare 7mPzKL com 7ZqRsT... em 14 dias",
  "USDC",
  "que tokens este cluster lançou nas últimas 24h?",
] as const;

/** Pure: classify the trimmed input. Exported for unit tests. */
export function detectKind(raw: string): Kind {
  const v = raw.trim();
  if (!v) return "empty";
  if (SNS_RE.test(v)) return "sns";
  if (BASE58_RE.test(v)) return "address";
  // NL: multi-word OR contains a question mark.
  const words = v.split(/\s+/).filter(Boolean);
  if (words.length >= 2 || /\?/.test(v)) return "nl";
  if (SYMBOL_RE.test(v)) return "symbol";
  return "unknown";
}

/** Pure: route a kind+value to a destination. Exported for tests. */
export function routeFor(kind: Kind, value: string): string | null {
  const v = value.trim();
  switch (kind) {
    case "address":
      return `/lookup?addr=${encodeURIComponent(v)}`;
    case "symbol":
      // /scan page removed (scan consolidation) — no symbol-search surface.
      return null;
    case "nl":
      return `/app/playground?q=${encodeURIComponent(v)}`;
    case "sns":
      // v1: no resolver endpoint — disabled.
      return null;
    default:
      return null;
  }
}

export function AISearchBar({
  variant = "hero",
  initialValue = "",
  placeholders = DEFAULT_PLACEHOLDERS,
  className = "",
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(initialValue);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kind = useMemo(() => detectKind(value), [value]);

  // Placeholder cycle every 3s, paused while typing.
  useEffect(() => {
    if (value.length > 0) return;
    const t = setInterval(() => setPlaceholderIdx((i) => (i + 1) % placeholders.length), 3000);
    return () => clearInterval(t);
  }, [value, placeholders.length]);

  function submit() {
    const v = value.trim();
    if (!v || submitting) return;

    if (kind === "sns") {
      setError("SNS (.sol) resolution coming soon. Paste the wallet address.");
      return;
    }
    if (kind === "unknown") {
      setError("Paste a wallet, token mint, .sol name, or ask a question.");
      return;
    }

    const target = routeFor(kind, v);
    if (!target) return;
    setError(null);
    setSubmitting(true);
    router.push(target);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setValue("");
      setError(null);
    }
  }

  const sizeClass =
    variant === "hero"
      ? "ai-search--hero"
      : variant === "nav"
        ? "ai-search--nav"
        : "ai-search--dashboard";

  return (
    <div
      className={`ai-search ${sizeClass} ${className}`.trim()}
      data-variant={variant}
      data-kind={kind}
    >
      <div className="ai-search__field">
        <Search size={16} className="ai-search__icon" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholders[placeholderIdx]}
          aria-label="Search wallet, token, .sol, or ask a question"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          disabled={submitting}
        />

        {kind === "address" && (
          <span className="ai-search__chip ai-search__chip--addr" aria-live="polite">
            address
          </span>
        )}
        {kind === "symbol" && <span className="ai-search__chip ai-search__chip--addr">symbol</span>}
        {kind === "sns" && <span className="ai-search__chip ai-search__chip--addr">.sol</span>}
        {kind === "nl" && (
          <span className="ai-search__chip ai-search__chip--ai" title="AI search coming soon">
            <Sparkles size={11} aria-hidden /> AI · soon
          </span>
        )}

        <button
          type="button"
          className="ai-search__cta"
          onClick={submit}
          disabled={submitting || kind === "empty" || kind === "unknown"}
          aria-busy={submitting}
        >
          {submitting ? (
            <Loader2 size={14} className="spin" aria-hidden />
          ) : (
            <Search size={14} aria-hidden />
          )}
          <span>{variant === "nav" ? "" : "Search"}</span>
        </button>
      </div>

      {error && (
        <p role="alert" className="ai-search__err">
          {error}
        </p>
      )}

      <style jsx>{`
        .ai-search {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ai-search--hero {
          max-width: 600px;
          margin: 0 auto;
        }
        .ai-search--nav {
          max-width: 360px;
        }
        .ai-search--dashboard {
          max-width: 720px;
        }
        .ai-search__field {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          height: ${variant === "hero" ? "56px" : variant === "nav" ? "36px" : "44px"};
          background: rgba(20, 20, 24, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          backdrop-filter: blur(8px);
          transition:
            border-color 120ms ease,
            box-shadow 120ms ease;
        }
        .ai-search__field:focus-within {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
        }
        .ai-search__icon {
          color: rgba(255, 255, 255, 0.45);
          flex: 0 0 auto;
        }
        .ai-search__field input {
          flex: 1 1 auto;
          min-width: 0;
          background: transparent;
          border: 0;
          outline: 0;
          color: #fafafa;
          font-size: ${variant === "hero" ? "16px" : "14px"};
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .ai-search__field input::placeholder {
          color: rgba(255, 255, 255, 0.32);
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .ai-search__chip {
          flex: 0 0 auto;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          font-family: ui-monospace, monospace;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .ai-search__chip--addr {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .ai-search__chip--ai {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .ai-search__cta {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: ${variant === "hero" ? "40px" : "28px"};
          padding: 0 ${variant === "hero" ? "14px" : "10px"};
          border-radius: 8px;
          border: 0;
          background: #f59e0b;
          color: #0a0a0a;
          font-weight: 600;
          font-size: ${variant === "hero" ? "14px" : "12px"};
          cursor: pointer;
          transition: opacity 120ms ease;
        }
        .ai-search__cta:hover:not(:disabled) {
          opacity: 0.9;
        }
        .ai-search__cta:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .ai-search__err {
          margin: 0;
          padding: 0 4px;
          font-size: 12px;
          color: #f87171;
        }
        :global(.spin) {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default AISearchBar;
