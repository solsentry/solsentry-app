"use client";

import { useEffect, useState } from "react";

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken?: { address: string; name: string; symbol: string };
  quoteToken?: { address: string; name: string; symbol: string };
  priceUsd?: string;
  priceNative?: string;
  txns?: {
    h24?: { buys: number; sells: number };
    h1?: { buys: number; sells: number };
  };
  volume?: { h24?: number; h6?: number; h1?: number };
  priceChange?: { h24?: number; h6?: number; h1?: number };
  liquidity?: { usd?: number };
  marketCap?: number;
  fdv?: number;
  info?: {
    imageUrl?: string;
    socials?: { type: string; url: string }[];
    websites?: { url: string }[];
  };
}

interface DexScreenerResp {
  pairs?: DexScreenerPair[];
}

function fmtUsd(n: number | undefined): string {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")}`;
}

function fmtPct(n: number | undefined): string {
  if (n == null || isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function fmtN(n: number | undefined): string {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("en-US");
}

export function TokenEnrichment({ mint }: { mint: string }) {
  const [pair, setPair] = useState<DexScreenerPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPair() {
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
        );
        if (!res.ok) throw new Error(`DexScreener ${res.status}`);
        const data = (await res.json()) as DexScreenerResp;
        if (cancelled) return;
        const sorted = (data.pairs ?? []).sort(
          (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0),
        );
        setPair(sorted[0] ?? null);
      } catch (e) {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "fetch failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPair();
    return () => {
      cancelled = true;
    };
  }, [mint]);

  if (loading) {
    return (
      <div
        className="panel"
        style={{ padding: 20, color: "var(--fg-3)", fontSize: 13 }}
      >
        Loading market data from DexScreener…
      </div>
    );
  }

  if (err || !pair) {
    return (
      <div
        className="panel"
        style={{
          padding: 20,
          color: "var(--fg-3)",
          fontSize: 13,
          fontFamily: "var(--font-mono)",
        }}
      >
        DexScreener has no pair for this token (yet).
      </div>
    );
  }

  const name = pair.baseToken?.name ?? "Unknown";
  const symbol = pair.baseToken?.symbol ?? "?";
  const priceUsd = pair.priceUsd ? parseFloat(pair.priceUsd) : undefined;
  const change24 = pair.priceChange?.h24;
  const buys24 = pair.txns?.h24?.buys ?? 0;
  const sells24 = pair.txns?.h24?.sells ?? 0;
  const buyRatio =
    buys24 + sells24 > 0
      ? (buys24 / (buys24 + sells24)) * 100
      : undefined;

  return (
    <div
      className="panel"
      style={{
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Header with logo + name */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
        }}
      >
        {pair.info?.imageUrl ? (
          <img
            src={pair.info.imageUrl}
            alt={symbol}
            width={48}
            height={48}
            style={{
              borderRadius: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--brand-amber)",
            }}
          >
            {symbol.slice(0, 2)}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--fg-1)",
              letterSpacing: "-0.01em",
            }}
          >
            {name}
            <span
              style={{
                color: "var(--fg-3)",
                fontWeight: 500,
                fontSize: 16,
                marginLeft: 10,
              }}
            >
              ${symbol}
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg-3)",
              marginTop: 2,
            }}
          >
            {pair.dexId} · {pair.chainId}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--fg-1)",
            }}
          >
            {fmtUsd(priceUsd)}
          </div>
          {change24 != null && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 600,
                color:
                  change24 >= 0
                    ? "var(--brand-teal)"
                    : "var(--status-critical)",
              }}
            >
              {fmtPct(change24)} 24h
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 0,
        }}
      >
        {[
          { label: "Market cap", value: fmtUsd(pair.marketCap) },
          { label: "Liquidity", value: fmtUsd(pair.liquidity?.usd) },
          { label: "Volume 24h", value: fmtUsd(pair.volume?.h24) },
          { label: "FDV", value: fmtUsd(pair.fdv) },
          { label: "Buys 24h", value: fmtN(buys24) },
          { label: "Sells 24h", value: fmtN(sells24) },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "16px 20px",
              borderRight:
                (i + 1) % 6 === 0 ? "none" : "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              className="label-tag"
              style={{ marginBottom: 6, fontSize: 9 }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--fg-1)",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Buy/sell pressure bar */}
      {buyRatio != null && (
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "var(--fg-3)",
              marginBottom: 6,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--brand-teal)" }}>
              Buys {buyRatio.toFixed(0)}%
            </span>
            <span style={{ color: "var(--status-critical)" }}>
              Sells {(100 - buyRatio).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "var(--status-critical)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${buyRatio}%`,
                height: "100%",
                background: "var(--brand-teal)",
              }}
            />
          </div>
        </div>
      )}

      {/* External links */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {pair.info?.websites?.[0]?.url && (
          <a
            href={pair.info.websites[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ fontSize: 12, padding: "6px 14px" }}
          >
            🌐 Website
          </a>
        )}
        {pair.info?.socials?.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{
              fontSize: 12,
              padding: "6px 14px",
              textTransform: "capitalize",
            }}
          >
            {s.type === "twitter"
              ? "𝕏"
              : s.type === "telegram"
                ? "✈"
                : "🔗"}{" "}
            {s.type}
          </a>
        ))}
        <a
          href={pair.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          style={{ fontSize: 12, padding: "6px 14px" }}
        >
          DexScreener ↗
        </a>
        <a
          href={`https://jup.ag/swap/SOL-${mint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          style={{
            fontSize: 12,
            padding: "6px 14px",
            color: "var(--brand-amber)",
            borderColor: "var(--brand-amber-line)",
          }}
        >
          Trade on Jupiter →
        </a>
      </div>
    </div>
  );
}
