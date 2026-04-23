import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import {
  fetchAlertsRecent,
  fetchResolutionsRecent,
  fmtUnixAge,
  truncate,
} from "@/lib/api";

export const revalidate = 10;

export const metadata = {
  title: "Live alerts",
  description:
    "Live feed of CRITICAL/HIGH risk Solana token alerts and recent rug confirmations from SolSentry's mainnet scanner.",
};

const LEVEL_COLOR: Record<string, string> = {
  CRITICAL: "var(--status-critical)",
  HIGH: "var(--status-warning)",
  MEDIUM: "var(--brand-orange)",
  LOW: "var(--brand-teal)",
};

export default async function AlertsPage() {
  const [alerts, resolutions] = await Promise.all([
    fetchAlertsRecent(20),
    fetchResolutionsRecent(20),
  ]);

  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ padding: "80px 0 32px" }}>
          <div className="container">
            <span className="hero-eyebrow">Live · refreshed every 10s</span>
            <h1 className="hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              Threat stream
            </h1>
            <p className="hero-sub">
              Recent CRITICAL and HIGH risk alerts on the left, confirmed rug outcomes
              on the right. Direct from the mainnet scanner.
            </p>
          </div>
        </section>

        <section style={{ padding: "0 0 80px" }}>
          <div className="container">
            <div className="alerts-grid">
              <div className="alerts-col">
                <h2 className="section-title" style={{ marginBottom: 16, fontSize: 20 }}>
                  Recent alerts
                </h2>
                {alerts.length === 0 ? (
                  <div className="empty-state">No recent alerts.</div>
                ) : (
                  <div className="alerts-list">
                    {alerts.map((a) => (
                      <Link
                        key={`${a.mint}-${a.predicted_at}`}
                        href={`/token/${a.mint}`}
                        className="alert-item"
                      >
                        <div className="alert-head">
                          <span
                            className="alert-level"
                            style={{ color: LEVEL_COLOR[a.risk_level] || "var(--fg-3)" }}
                          >
                            {a.risk_level}
                          </span>
                          <span className="alert-age">{fmtUnixAge(a.predicted_at)}</span>
                        </div>
                        <div className="alert-mint mono">{truncate(a.mint, 8, 6)}</div>
                        {a.symbol && <div className="alert-symbol">{a.symbol}</div>}
                        <div className="alert-flags">
                          {(a.flags ?? []).slice(0, 3).map((f, i) => (
                            <span key={i} className="alert-flag">{f}</span>
                          ))}
                          {(a.flags ?? []).length > 3 && (
                            <span className="alert-flag-more">+{(a.flags ?? []).length - 3}</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="alerts-col">
                <h2 className="section-title" style={{ marginBottom: 16, fontSize: 20 }}>
                  Recent resolutions
                </h2>
                {resolutions.length === 0 ? (
                  <div className="empty-state">No recent resolutions.</div>
                ) : (
                  <div className="alerts-list">
                    {resolutions.map((r) => (
                      <Link
                        key={`${r.mint}-${r.resolved_at}`}
                        href={`/token/${r.mint}`}
                        className="alert-item"
                      >
                        <div className="alert-head">
                          <span
                            className="alert-level"
                            style={{
                              color:
                                r.final_outcome === "confirmed_scam"
                                  ? "var(--status-critical)"
                                  : "var(--brand-teal)",
                            }}
                          >
                            {r.final_outcome.replace("_", " ").toUpperCase()}
                          </span>
                          <span className="alert-age">
                            {r.was_correct ? "✓ correct" : "✗ miss"}
                          </span>
                        </div>
                        <div className="alert-mint mono">{truncate(r.mint, 8, 6)}</div>
                        <div className="alert-meta">
                          predicted {r.predicted_level} · resolved in{" "}
                          {r.resolve_latency_hours?.toFixed(1) ?? "?"}h
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
