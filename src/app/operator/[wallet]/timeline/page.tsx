import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOperatorTimeline, fmtInt, fmtUnixAge, truncate } from "@/lib/api";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ wallet: string }>;
}

const OUTCOME_COLOR: Record<string, string> = {
  confirmed_scam: "var(--status-critical)",
  confirmed_safe: "var(--brand-teal)",
  pending: "var(--fg-3)",
  volume_dead: "var(--status-warning)",
};

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  return {
    title: `Timeline ${truncate(wallet, 6, 4)}`,
    description: `Chronological deployment timeline for Solana operator ${wallet}.`,
  };
}

export default async function TimelinePage({ params }: PageProps) {
  const { wallet } = await params;

  if (wallet.length < 32 || wallet.length > 44) {
    notFound();
  }

  const timeline = await fetchOperatorTimeline(wallet);

  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ padding: "80px 0 32px" }}>
          <div className="container">
            <span className="hero-eyebrow">Operator timeline</span>
            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(20px, 3vw, 32px)",
                wordBreak: "break-all",
              }}
            >
              <code
                style={{
                  color: "var(--brand-orange)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {wallet}
              </code>
            </h1>
            {timeline && (
              <div className="timeline-stats">
                <div>
                  <span className="label">Tokens deployed</span>
                  <span className="metric">
                    {fmtInt(timeline.total_tokens_in_window)}
                  </span>
                </div>
                <div>
                  <span className="label">Confirmed rugs</span>
                  <span
                    className="metric"
                    style={{ color: "var(--status-critical)" }}
                  >
                    {fmtInt(timeline.confirmed_rugs_in_window)}
                  </span>
                </div>
                <div>
                  <span className="label">Risk label</span>
                  <span className="metric" style={{ fontSize: 18 }}>
                    {timeline.risk_label ?? "—"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: "0 0 80px" }}>
          <div className="container">
            {!timeline ? (
              <div className="empty-state">Could not load timeline.</div>
            ) : timeline.tokens.length === 0 ? (
              <div className="empty-state">No deployments in window.</div>
            ) : (
              <div className="timeline">
                {timeline.tokens.slice(0, 100).map((t, i) => (
                  <Link
                    key={`${t.mint}-${i}`}
                    href={`/token/${t.mint}`}
                    className="timeline-item"
                  >
                    <div className="timeline-time">
                      {fmtUnixAge(t.deployed_at)}
                    </div>
                    <div className="timeline-body">
                      <div className="timeline-mint mono">
                        {truncate(t.mint, 8, 6)}
                      </div>
                      <div className="timeline-meta">
                        {t.symbol && (
                          <span className="timeline-symbol">{t.symbol}</span>
                        )}
                        <span className="timeline-risk">
                          risk {t.risk_score}/100
                        </span>
                        <span
                          className="timeline-outcome"
                          style={{
                            color:
                              OUTCOME_COLOR[t.final_outcome] || "var(--fg-3)",
                          }}
                        >
                          {t.final_outcome}
                        </span>
                        {t.platform && (
                          <span className="timeline-platform">
                            {t.platform}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                {timeline.tokens.length > 100 && (
                  <div className="empty-state" style={{ marginTop: 16 }}>
                    Showing 100 of {timeline.tokens.length} total deployments.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section
          style={{
            padding: "0 0 80px",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div className="container" style={{ paddingTop: 32 }}>
            <Link
              href={`/operator/${wallet}`}
              style={{
                color: "var(--brand-orange)",
                fontFamily: "var(--font-mono)",
                fontSize: 14,
              }}
            >
              ← Back to operator profile
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
