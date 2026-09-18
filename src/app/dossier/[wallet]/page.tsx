// /dossier/[wallet] — deployer-wallet identity dossier (server-rendered).
//
// Reads the cost-aware /v1/dossier/{wallet} (7-day server cache; the free
// mirror never forces a rebuild). Renders exactly what the report carries and
// says so when it carries nothing: an empty `sources` list is shown as an
// empty report, never dressed up as a clean bill of health.

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { RiskBadge } from "@/components/RiskBadge";
import { fetchDossier, truncate, type Dossier } from "@/lib/api";
import Link from "next/link";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  return {
    title: `Dossier ${truncate(wallet, 6, 4)}`,
    description: `SolSentry identity dossier for ${wallet}: genesis, funders, CEX exits, identity signals.`,
  };
}

function fmtIso(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function fmtNum(v: number | null | undefined, suffix = ""): string {
  return v === null || v === undefined ? "—" : `${v.toLocaleString("en-US")}${suffix}`;
}

function KPI({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 140,
        padding: "10px 14px",
        borderLeft: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fontSize: 17,
          color: "var(--fg-1)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ObjectRows({ obj }: { obj: Record<string, unknown> | null | undefined }) {
  const entries = obj
    ? Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "")
    : [];
  if (entries.length === 0) {
    return <div style={{ fontSize: 13, color: "var(--fg-3)" }}>No data in this report.</div>;
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gap: "6px 16px",
        fontSize: 13,
      }}
    >
      {entries.map(([k, v]) => (
        <div key={k} style={{ display: "contents" }}>
          <div style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            {k}
          </div>
          <div
            style={{
              color: "var(--fg-1)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              wordBreak: "break-all",
            }}
          >
            {typeof v === "string" && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v) ? (
              <AddrLink addr={v} head={10} tail={6} />
            ) : typeof v === "object" ? (
              JSON.stringify(v)
            ) : (
              String(v)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const CONFIDENCE_COLOR: Record<string, string> = {
  HIGH: "var(--brand-teal)",
  MEDIUM: "var(--brand-amber)",
  LOW: "var(--fg-3)",
};

export default async function DossierPage({ params }: PageProps) {
  const { wallet } = await params;
  const report: Dossier | null = await fetchDossier(wallet);

  const sources = report?.sources ?? [];
  const errors = (report?.errors ?? []).filter((e) => e !== "cache_hit");
  const signals = report?.identity_signals ?? [];
  const cexExits = report?.cex_exits ?? [];
  const siblings = report?.timing_siblings ?? [];
  const isEmpty =
    report !== null && sources.length === 0 && signals.length === 0 && !report.operator_id;
  const confidence = (report?.confidence ?? "").toUpperCase();

  return (
    <>
      <SiteTopbar />
      <main>
        <PageHeader
          eyebrow="Dossier · deployer identity"
          title={
            <>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55em",
                  color: "var(--brand-amber)",
                  display: "block",
                  wordBreak: "break-all",
                  letterSpacing: 0,
                  marginBottom: 8,
                }}
              >
                {wallet}
              </span>
              Who is behind this wallet
            </>
          }
          sub="Genesis funding, first and second funder, CEX exits and cross-token identity signals, assembled from on-chain history. Every field below is what the report carries — nothing is inferred on this page."
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link href={`/operator/${wallet}`} className="btn-ghost">
              Operator profile →
            </Link>
            <Link href={`/network/${wallet}`} className="btn-ghost">
              Network tree →
            </Link>
            <Link href={`/drain/${wallet}`} className="btn-ghost">
              Trace drain
            </Link>
            <a
              href={`https://api.solsentry.app/v1/dossier/${wallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
          </div>
        </PageHeader>

        {!report && (
          <Section>
            <ApiError
              endpoint={`/v1/dossier/${truncate(wallet, 8, 6)}`}
              message="Dossier unavailable right now. A first build for a wallet can take a minute or two — reload shortly."
            />
          </Section>
        )}

        {report && (
          <>
            <Section eyebrow="Summary">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  background: "var(--bg-2)",
                }}
              >
                <KPI
                  label="Risk"
                  value={report.risk_level ? <RiskBadge level={report.risk_level} /> : "—"}
                />
                <KPI label="Rug rate" value={fmtNum(report.rug_rate_pct, "%")} />
                <KPI label="Tokens deployed" value={fmtNum(report.total_tokens)} />
                <KPI label="Confirmed rugs" value={fmtNum(report.confirmed_rugs)} />
                <KPI
                  label="Confidence"
                  value={
                    <span style={{ color: CONFIDENCE_COLOR[confidence] ?? "var(--fg-2)" }}>
                      {confidence || "—"}
                    </span>
                  }
                />
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "var(--fg-3)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                built {fmtIso(report.built_at)} ·{" "}
                {report.cached ? "served from cache (≤ 7 d)" : "fresh build"} · sources:{" "}
                {sources.length > 0 ? sources.join(", ") : "none"}
                {report.operator_id ? (
                  <>
                    {" "}
                    · operator <AddrLink addr={report.operator_id} head={8} tail={6} />
                  </>
                ) : null}
              </div>
              {isEmpty && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    border: "1px solid var(--status-warning)",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "var(--fg-2)",
                  }}
                >
                  This report is empty: no source answered and no operator is linked to the wallet.
                  That is not a clean bill of health — it means SolSentry has no tracked history for
                  it yet.
                </div>
              )}
              {errors.length > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "var(--status-warning)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  errors: {errors.join(" · ")}
                </div>
              )}
            </Section>

            <Section eyebrow="Genesis" title="Where the first SOL came from">
              <ObjectRows obj={report.genesis} />
            </Section>

            <Section eyebrow="Funders" title="First and second funder">
              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>
                    first funder
                  </div>
                  <ObjectRows obj={report.first_funder} />
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>
                    second funder
                  </div>
                  <ObjectRows obj={report.second_funder} />
                </div>
              </div>
            </Section>

            <Section
              eyebrow="Identity signals"
              title={`${signals.length} signal${signals.length === 1 ? "" : "s"}`}
            >
              {signals.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--fg-3)" }}>
                  No identity signals in this report.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {signals.map((s, i) => (
                    <div
                      key={`${s.kind ?? "signal"}-${i}`}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "10px 14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "baseline",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "var(--fg-1)",
                          }}
                        >
                          {s.kind ?? "signal"}
                        </span>
                        {s.confidence && (
                          <span
                            style={{
                              fontSize: 10,
                              letterSpacing: 0.6,
                              textTransform: "uppercase",
                              color: CONFIDENCE_COLOR[s.confidence.toUpperCase()] ?? "var(--fg-3)",
                            }}
                          >
                            {s.confidence}
                          </span>
                        )}
                      </div>
                      {s.description && (
                        <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 4 }}>
                          {s.description}
                        </div>
                      )}
                      {s.evidence && Object.keys(s.evidence).length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <ObjectRows obj={s.evidence} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section
              eyebrow="CEX exits"
              title={`${cexExits.length} exit${cexExits.length === 1 ? "" : "s"}`}
            >
              {cexExits.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--fg-3)" }}>
                  No CEX exits in this report.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {cexExits.map((exit, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "8px 12px",
                      }}
                    >
                      <ObjectRows
                        obj={
                          typeof exit === "object" && exit !== null
                            ? (exit as Record<string, unknown>)
                            : { value: exit }
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {siblings.length > 0 && (
              <Section
                eyebrow="Timing siblings"
                title={`${siblings.length} wallet${siblings.length === 1 ? "" : "s"} funded in the same window`}
              >
                <div style={{ display: "grid", gap: 8 }}>
                  {siblings.map((sib, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "8px 12px",
                      }}
                    >
                      <ObjectRows
                        obj={
                          typeof sib === "object" && sib !== null
                            ? (sib as Record<string, unknown>)
                            : { value: sib }
                        }
                      />
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
