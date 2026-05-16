// Public read-only share view for an operator profile.
// Minimal chrome (no Nav/Footer/Sena/CredGate) — designed for viral sharing.
// Stable OG meta tags so links unfurl with risk context on social platforms.

import Link from "next/link";
import type { Metadata } from "next";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { RiskBadge } from "@/components/RiskBadge";
import {
  fetchOperator,
  fetchOperatorTimeline,
  fmtInt,
  fmtPct,
  truncate,
} from "@/lib/api";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { wallet } = await params;
  const op = await fetchOperator(wallet).catch(() => null);

  const short = truncate(wallet, 6, 4);
  const title = op?.known
    ? `${short} — ${op.risk_level ?? "tracked"} operator · SolSentry`
    : `${short} — operator lookup · SolSentry`;
  const description = op?.known
    ? `${op.confirmed_rugs ?? 0} confirmed rugs across ${op.total_tokens ?? 0} tokens · ${
        op.rug_rate_pct != null ? `${op.rug_rate_pct.toFixed(1)}% rug rate · ` : ""
      }Live on Solana.`
    : `Operator threat intelligence for ${wallet}. Live on Solana via SolSentry.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/og/og-default.png"],
      type: "website",
      url: `https://solsentry.app/share/operator/${wallet}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/og-default.png"],
    },
  };
}

export default async function ShareOperatorPage({ params }: PageProps) {
  const { wallet } = await params;

  const [op, timeline] = await Promise.all([
    fetchOperator(wallet),
    fetchOperatorTimeline(wallet),
  ]);

  const short = truncate(wallet, 6, 4);
  const borderColor = op?.known
    ? op.risk_level === "CRITICAL"
      ? "var(--status-critical)"
      : "var(--brand-amber)"
    : "var(--brand-teal)";

  return (
    <main style={{ minHeight: "100vh", padding: "32px 20px 48px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--brand-amber)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            SolSentry
          </Link>
          <span
            className="label-tag"
            style={{ fontSize: 11, color: "var(--fg-3)" }}
          >
            Public operator profile · read-only
          </span>
        </div>

        {/* Wallet + risk */}
        <div
          className="panel"
          style={{
            borderColor,
            padding: "24px 28px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--brand-amber)",
              wordBreak: "break-all",
              marginBottom: 12,
            }}
          >
            {wallet}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {op?.known ? (
              <>
                <RiskBadge level={op.risk_level} size="lg" />
                <div>
                  <div className="label-tag" style={{ marginBottom: 4 }}>
                    Risk score
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 28,
                      color: "var(--fg-1)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {op.risk_score ?? "—"}
                    <span style={{ color: "var(--fg-3)", fontSize: 16 }}>
                      {" "}
                      / 100
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    marginLeft: "auto",
                  }}
                >
                  {short}
                </div>
              </>
            ) : (
              <span style={{ color: "var(--fg-2)", fontSize: 14 }}>
                {op
                  ? "Wallet not flagged · no operator history on file yet."
                  : "Operator data temporarily unavailable. Refresh in a few seconds — the API may be warming up the cache."}
              </span>
            )}
          </div>

          {op?.known && (op.tags?.length || op.patterns?.length) && (
            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {(op.tags || []).map((t) => (
                <span key={t} className="hover-chip" style={{ fontSize: 11 }}>
                  {t}
                </span>
              ))}
              {(op.patterns || []).map((p) => (
                <span
                  key={p}
                  className="hover-chip"
                  style={{ fontSize: 11, color: "var(--brand-teal)" }}
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* KPI cards */}
        {op?.known && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <KpiCard
              label="Confirmed rugs"
              value={fmtInt(op.confirmed_rugs)}
              accent="critical"
            />
            <KpiCard label="Total tokens" value={fmtInt(op.total_tokens)} />
            <KpiCard
              label="Rug rate"
              value={fmtPct(op.rug_rate_pct, 1)}
              accent={
                op.rug_rate_pct && op.rug_rate_pct > 80 ? "critical" : undefined
              }
            />
          </div>
        )}

        {/* Heatmap */}
        {timeline?.tokens && timeline.tokens.length > 0 && (
          <div
            className="panel"
            style={{ padding: "24px 28px", marginBottom: 24 }}
          >
            <div
              className="label-tag"
              style={{ marginBottom: 16, color: "var(--fg-3)" }}
            >
              Deployment heatmap · last 365 days
            </div>
            <ActivityHeatmap tokens={timeline.tokens} />
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            padding: "24px 16px",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--fg-3)",
              marginBottom: 12,
            }}
          >
            Powered by SolSentry · operator threat intelligence for Solana.
          </div>
          <Link
            href={`/operator/${wallet}`}
            className="btn-ghost"
            style={{ marginRight: 8 }}
          >
            Open full investigation →
          </Link>
          <Link href="/" className="btn-ghost">
            solsentry.app
          </Link>
        </div>
      </div>
    </main>
  );
}

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "critical";
}) {
  return (
    <div
      className="panel"
      style={{
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span className="label-tag">{label}</span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 28,
          color: accent === "critical" ? "var(--status-critical)" : "var(--fg-1)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}
