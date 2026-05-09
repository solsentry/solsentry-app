import { ProShell } from "@/components/ProShell";
import { TrackButton } from "@/components/TrackButton";
import { fetchTopOperators, truncate, fmtInt, fmtPct } from "@/lib/api";
import Link from "next/link";

export const revalidate = 300;

export const metadata = {
  title: "KOL trackers — Solana operator radar",
  description:
    "SolSentry KOL & operator radar. Track wallets that ship serial deployments, follow their portfolios, watchlist them locally.",
};

export default async function KolsPage() {
  const operators = await fetchTopOperators(50);

  return (
    <ProShell>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--brand-amber)",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            KOL · OPERATOR RADAR
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg-1)",
            }}
          >
            Track who's deploying
          </h1>
          <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>
            Top 50 operators by confirmed rugs. Click any wallet to open their
            full timeline, or hit "Track" to add to your local watchlist.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 12,
          }}
        >
          {operators.map((op) => {
            const initials = op.wallet.slice(0, 2).toUpperCase();
            const critical = op.rug_rate_pct > 80;
            return (
              <div
                key={op.wallet}
                style={{
                  padding: 14,
                  background: "var(--surface)",
                  border: `1px solid ${critical ? "var(--status-critical)" : "var(--border)"}`,
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: critical
                        ? "var(--status-critical-tint)"
                        : "var(--brand-amber-tint)",
                      color: critical ? "var(--status-critical)" : "var(--brand-amber)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Link
                      href={`/operator/${op.wallet}`}
                      style={{
                        display: "block",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--fg-1)",
                        textDecoration: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {truncate(op.wallet, 8, 4)}
                    </Link>
                    <div
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        color: "var(--fg-3)",
                      }}
                    >
                      Rank #{op.rank} · {op.tags?.[0] ?? "operator"}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 18,
                      color: critical ? "var(--status-critical)" : "var(--brand-amber)",
                    }}
                  >
                    {fmtPct(op.rug_rate_pct, 0)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--fg-3)",
                  }}
                >
                  <span>
                    Rugs{" "}
                    <strong style={{ color: "var(--status-critical)" }}>
                      {fmtInt(op.confirmed_rugs)}
                    </strong>
                  </span>
                  <span>
                    Tokens{" "}
                    <strong style={{ color: "var(--fg-1)" }}>
                      {fmtInt(op.total_tokens)}
                    </strong>
                  </span>
                  <span>
                    Pending{" "}
                    <strong style={{ color: "var(--fg-2)" }}>
                      {fmtInt(op.pending)}
                    </strong>
                  </span>
                </div>
                {op.tags && op.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {op.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 10,
                          fontFamily: "var(--font-mono)",
                          color: "var(--fg-3)",
                          padding: "2px 6px",
                          border: "1px solid var(--border)",
                          borderRadius: 3,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <TrackButton wallet={op.wallet} />
              </div>
            );
          })}
        </div>

        {operators.length === 0 && (
          <div
            style={{
              padding: 24,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            No operators returned by the API.
          </div>
        )}
      </div>
    </ProShell>
  );
}
