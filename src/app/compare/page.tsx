"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteTopbar } from "@/components/SiteTopbar";
import { Search } from "lucide-react";

const T = {
  bg: "#0a0a0a",
  surface: "#1a1a1a",
  border: "#262626",
  amber: "#f59e0b",
  text: "#fafafa",
  muted: "#a3a3a3",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

export default function CompareSkeletonPage() {
  const router = useRouter();
  const [wallet1, setWallet1] = useState("");
  const [wallet2, setWallet2] = useState("");

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet1 && wallet2) {
      router.push(`/compare?w1=${wallet1}&w2=${wallet2}`);
    }
  };

  return (
    <>
      <SiteTopbar />
      <main style={{ background: T.bg, color: T.text, minHeight: "100vh", paddingTop: 72 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Compare Operators
          </h1>
          <p style={{ color: T.muted, marginBottom: 40, fontSize: 15 }}>
            Side-by-side analysis of two wallets to detect overlapping behavior or shared funding.
          </p>

          <form onSubmit={handleCompare} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, textTransform: "uppercase", color: T.muted, marginBottom: 8, letterSpacing: "0.05em" }}>
                  Operator 1
                </label>
                <input
                  type="text"
                  value={wallet1}
                  onChange={(e) => setWallet1(e.target.value)}
                  placeholder="Wallet address..."
                  style={{
                    width: "100%", padding: "12px 16px", background: T.bg, border: `1px solid ${T.border}`,
                    borderRadius: 8, color: T.text, fontFamily: T.mono, fontSize: 14, outline: "none"
                  }}
                />
              </div>
              
              <div style={{ color: T.muted, fontWeight: 600, fontSize: 14, marginTop: 24 }}>VS</div>

              <div>
                <label style={{ display: "block", fontSize: 12, textTransform: "uppercase", color: T.muted, marginBottom: 8, letterSpacing: "0.05em" }}>
                  Operator 2
                </label>
                <input
                  type="text"
                  value={wallet2}
                  onChange={(e) => setWallet2(e.target.value)}
                  placeholder="Wallet address..."
                  style={{
                    width: "100%", padding: "12px 16px", background: T.bg, border: `1px solid ${T.border}`,
                    borderRadius: 8, color: T.text, fontFamily: T.mono, fontSize: 14, outline: "none"
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={!wallet1 || !wallet2}
                style={{
                  background: (!wallet1 || !wallet2) ? T.border : T.amber,
                  color: (!wallet1 || !wallet2) ? T.muted : "#000",
                  border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14,
                  cursor: (!wallet1 || !wallet2) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 8
                }}
              >
                <Search size={16} /> Run Comparison
              </button>
            </div>
          </form>

          {/* Skeleton Results Area */}
          <div style={{ marginTop: 40, borderTop: `1px solid ${T.border}`, paddingTop: 40 }}>
            <div style={{ textAlign: "center", color: T.muted, padding: "40px 0" }}>
              Enter two operator wallets above to see their overlapping deployment patterns, funding sources, and network cluster associations.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
