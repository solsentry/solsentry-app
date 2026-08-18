"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";

export default function ScreenGatePage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    
    // Mock POST /v1/screen
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect logic based on input
    // In a real app this would use the mocked response data
    if (address.length < 40 || address.includes("pump")) {
      router.push(`/token/${encodeURIComponent(address)}`);
    } else {
      router.push(`/operator/${encodeURIComponent(address)}`);
    }
  };

  return (
    <>
      <SiteTopbar />
      <main style={{ padding: "80px 24px", minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="panel" style={{ maxWidth: 500, width: "100%", padding: 32 }}>
          <h1 style={{ fontSize: 24, margin: "0 0 16px", color: "var(--fg-1)", fontFamily: "var(--font-display)" }}>
            Screen Gate
          </h1>
          <p style={{ color: "var(--fg-2)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            Submit a smart contract or operator wallet to the SolSentry pipeline for deep analysis.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--fg-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Target Address
              </label>
              <input
                type="text"
                placeholder="Contract or Wallet (e.g. neutra1...xyz)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--fg-1)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  outline: "none",
                }}
                disabled={loading}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 12, color: "var(--brand-amber)", fontWeight: 600 }}>x402 Gateway Active</span>
                  <span style={{ fontSize: 11, color: "var(--fg-3)" }}>Costs 0.05 USDC per query (NÃO-Stripe)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !address.trim()}
              style={{
                marginTop: 16,
                padding: "14px",
                background: loading ? "var(--surface-2)" : "var(--brand-amber)",
                color: loading ? "var(--fg-3)" : "#000",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading || !address.trim() ? "not-allowed" : "pointer",
                transition: "opacity 200ms",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, border: "2px solid var(--fg-3)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  Processing...
                </>
              ) : (
                "Execute Deep Scan"
              )}
            </button>
            <p style={{ fontSize: 11, color: "var(--fg-3)", textAlign: "center", marginTop: 8 }}>
              Latencies vary based on queue depth. Please allow a few seconds for on-chain resolution.
            </p>
          </form>
        </div>
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </>
  );
}
