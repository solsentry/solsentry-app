"use client";

import { useState, useEffect } from "react";
import { Holders, fetchHolders, truncate, fmtPct, fmtInt } from "../lib/api";

function formatMoney(value: number | undefined) {
  if (value === undefined || value === null) return "$0.00";
  if (value < 0.01) return "$" + value.toFixed(6);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function DeepScanView({ mint, pt }: { mint: string; pt: boolean }) {
  const [data, setData] = useState<Holders | null>(null);
  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [h, m] = await Promise.all([
          fetchHolders(mint),
          fetch(`/api/birdeye/token?mint=${mint}`)
            .then((res) => res.json())
            .catch(() => null),
        ]);
        setData(h);
        setMarket(m);
      } catch (e) {
        console.error("DeepScan failed", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [mint]);

  if (loading) {
    return (
      <div
        style={{
          marginTop: 16,
          padding: "24px 12px",
          border: "1px solid var(--border)",
          borderRadius: 6,
          color: "var(--fg-2)",
          fontSize: 13,
          textAlign: "center",
          background: "var(--surface-1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: "2px solid var(--border)",
            borderTopColor: "var(--brand-amber)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ animation: "pulse 1.5s ease-in-out infinite", fontWeight: 600 }}>
          {pt
            ? "Processando Deep Scan (Mercado & Holders)..."
            : "Processing Deep Scan (Market & Holders)..."}
        </div>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes pulse { 50% { opacity: 0.5; } }
        `}</style>
      </div>
    );
  }

  // Graceful degradation: holders/market may be unavailable (anon credit quota
  // exhausted → 429, or Birdeye key not configured). Show a clear note instead of
  // silently vanishing after the user clicked "deep scan". The primary verdict +
  // authorities + operator already render in ScanResultCard above this.
  if (!data && !market) {
    return (
      <div
        style={{
          marginTop: 16,
          borderTop: "1px solid var(--border)",
          paddingTop: 16,
          fontSize: 13,
          color: "var(--fg-2)",
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--fg-1)" }}>
          {pt ? "DETALHE DE MERCADO & HOLDERS" : "MARKET & HOLDERS DETAIL"}
        </div>
        {pt
          ? "Indisponível no momento (cota gratuita de scans excedida ou dados de mercado fora). O veredito, as autoridades e o operador acima continuam válidos. Tente de novo mais tarde."
          : "Currently unavailable (free scan quota exceeded or market data offline). The verdict, authorities and operator above still apply. Try again later."}
      </div>
    );
  }

  const largest = (data?.largest || []).map((h: any) => ({
    wallet: h.address || h.wallet || "unknown",
    pct: h.percentage ?? h.pct ?? 0,
    amount: h.amount ?? 0,
  }));

  const mcap = market?.marketcap || market?.fdv || 0;
  const price = market?.price || 0;
  const liquidity = market?.liquidity || 0;

  return (
    <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--fg-1)" }}>
        {pt ? "VISÃO GERAL DO MERCADO" : "MARKET OVERVIEW"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {/* Market cards only when Birdeye data is present — otherwise a missing key
            would render "$0.00 / LIQUIDITY $0.00 in red", a false rug signal. */}
        {market && (
          <>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>
                {pt ? "MARKET CAP" : "MARKET CAP"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {formatMoney(mcap)}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>
                {pt ? "LIQUIDEZ" : "LIQUIDITY"}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: liquidity < 5000 ? "var(--status-critical)" : "inherit",
                }}
              >
                {formatMoney(liquidity)}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{pt ? "PREÇO" : "PRICE"}</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {formatMoney(price)}
              </div>
            </div>
          </>
        )}
        {data && (
          <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>
              {pt ? "TOTAL HOLDERS" : "TOTAL HOLDERS"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>
              {fmtInt(data.count)}
            </div>
          </div>
        )}
      </div>

      {largest.length > 0 && (
        <div style={{ background: "var(--surface-2)", borderRadius: 6, padding: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 11, color: "var(--fg-3)", fontWeight: 600 }}>TOP HOLDERS</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color:
                  data?.top1 && data.top1 > 30 ? "var(--status-critical)" : "var(--status-success)",
              }}
            >
              TOP 1: {fmtPct(data?.top1 || 0)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {largest.slice(0, 10).map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: "var(--fg-3)", fontSize: 10 }}>#{i + 1}</span>
                  <span style={{ color: "var(--fg-2)" }}>{truncate(h.wallet)}</span>
                </div>
                <span
                  style={{
                    fontWeight: 600,
                    color: h.pct > 15 ? "var(--status-warning)" : "var(--fg-1)",
                  }}
                >
                  {fmtPct(h.pct, 2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
