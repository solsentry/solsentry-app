import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RiskBadge } from "@/components/RiskBadge";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { fetchAlertsRecent, fmtUnixAge, fmtAgeSeconds } from "@/lib/api";
import Link from "next/link";
import { ProShell } from "@/components/ProShell";

export const revalidate = 30;

export const metadata = {
  title: "Live alerts — HIGH and CRITICAL risk feed",
  description:
    "Real-time stream of HIGH and CRITICAL risk alerts from the SolSentry scanner. Last 50 events, refreshed every 30 seconds.",
};

export default async function AlertsPage() {
  const alerts = await fetchAlertsRecent(50);

  return (
    <ProShell>
      <main>
        <PageHeader
          eyebrow="Live alert feed · refreshes every 30s"
          title="HIGH and CRITICAL risk events"
          sub="The scanner emits an alert whenever a token crosses the HIGH or CRITICAL threshold. This is the same stream the Telegram bot publishes to."
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href="https://api.solsentry.app/v1/alerts/recent?limit=50"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
            <a
              href="https://t.me/solsentryai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Subscribe via Telegram →
            </a>
          </div>
        </PageHeader>

        <Section eyebrow={`${alerts.length} alerts`} title="Latest events">
          {alerts.length === 0 ? (
            <ApiError
              endpoint="/v1/alerts/recent?limit=50"
              message="No alerts returned. The endpoint may be temporarily unavailable, or the scanner has not emitted any HIGH+ alerts in the recent window."
            />
          ) : (
            <div className="alerts-list">
              {alerts.map((a, i) => (
                <Link
                  key={`${a.mint}-${i}`}
                  href={`/token/${a.mint}`}
                  className="alert-item"
                >
                  <div className="alert-head">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <RiskBadge level={a.risk_level} size="sm" />
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--fg-3)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        risk {a.risk_score}
                      </span>
                      {a.symbol && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "var(--fg-2)",
                            textTransform: "uppercase",
                          }}
                        >
                          ${a.symbol}
                        </span>
                      )}
                    </div>
                    <span className="alert-age">
                      {a.age_seconds != null
                        ? fmtAgeSeconds(a.age_seconds)
                        : fmtUnixAge(a.predicted_at)}
                    </span>
                  </div>

                  <div className="alert-mint">{a.mint}</div>

                  {a.dev_wallet && (
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: a.dev_known
                          ? "var(--status-critical)"
                          : "var(--fg-3)",
                      }}
                    >
                      dev {a.dev_wallet.slice(0, 8)}…{a.dev_wallet.slice(-6)}
                      {a.dev_known && a.dev_confirmed_rugs != null && (
                        <span style={{ marginLeft: 8 }}>
                          · {a.dev_confirmed_rugs} prior rugs
                        </span>
                      )}
                    </div>
                  )}

                  {a.flags && a.flags.length > 0 && (
                    <div className="alert-flags">
                      {a.flags.slice(0, 5).map((f) => (
                        <span key={f} className="alert-flag">
                          {f}
                        </span>
                      ))}
                      {a.flags.length > 5 && (
                        <span className="alert-flag-more">
                          +{a.flags.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Section>
      </main>
    </ProShell>
  );
}
