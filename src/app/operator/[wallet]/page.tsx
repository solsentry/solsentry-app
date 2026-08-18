import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { RiskBadge } from "@/components/RiskBadge";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { SenaModal } from "@/components/SenaModal";
import { SenaLauncher } from "@/components/SenaLauncher";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { CopyShareLink } from "@/components/CopyShareLink";
import { ScanDepthControl } from "@/components/ScanDepthControl";
import {
  fetchOperator,
  fetchOperatorTimeline,
  fetchOperatorNetwork,
  fmtInt,
  fmtPct,
  fmtUnixAge,
  truncate,
} from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

const SAMPLE_WALLET = "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1";

// Grok design tokens (dark-only, matches the site's amber palette).
const T = {
  bg: "#0a0a0a",
  surface: "#1a1a1a",
  raised: "#131313",
  border: "#262626",
  borderSoft: "#1f1f1f",
  amber: "#f59e0b",
  critical: "#ef4444",
  teal: "#14b8a6",
  text: "#fafafa",
  muted: "#a3a3a3",
  dim: "#525252",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const card: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 10,
};

const UNKNOWN_OPERATOR_MESSAGE = "This wallet is not in the tracked database.";

interface PageProps {
  params: Promise<{ wallet: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  return {
    title: `Operator ${truncate(wallet, 6, 4)} — risk profile`,
    description: `SolSentry operator profile for ${wallet}. Risk level, confirmed rugs, total tokens, deployment timeline.`,
  };
}

export default async function OperatorPage({ params, searchParams }: PageProps) {
  const { wallet } = await params;
  const sp = searchParams ? await searchParams : {};
  // ?sena=1 deep-link from the landing — pop Sena drawer open on arrival.
  const senaAutoOpen = sp.sena === "1" || sp.sena === "true";

  const [op, timeline, network] = await Promise.all([
    fetchOperator(wallet),
    fetchOperatorTimeline(wallet),
    fetchOperatorNetwork(wallet),
  ]);

  const operator = op?.known ? op : null;
  const isCritical = op?.risk_level === "CRITICAL";
  const accent = isCritical ? T.critical : T.amber;

  return (
    <>
      <SiteTopbar />
      <main style={{ background: T.bg, color: T.text, minHeight: "100vh", paddingTop: 72 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
          {/* ─── PAGE HEADER ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 11,
                color: T.dim,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Operator profile ·{" "}
              {wallet === SAMPLE_WALLET
                ? "sample · CRITICAL"
                : op?.known
                  ? "live · tracked"
                  : "live"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 14,
                  background: T.raised,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${T.border}`,
                  wordBreak: "break-all",
                }}
              >
                {wallet}
              </div>
              {operator ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: accent, lineHeight: 1 }}>
                    {operator.risk_score ?? "—"}
                  </div>
                  {operator.risk_level && <RiskBadge level={operator.risk_level} />}
                </div>
              ) : (
                <RiskBadge level="UNKNOWN" />
              )}
              {operator?.tags?.length || operator?.patterns?.length ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(operator?.tags || []).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        background: "rgba(245,158,11,0.1)",
                        color: T.amber,
                        borderRadius: 999,
                        border: `1px solid ${T.amber}30`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {(operator?.patterns || []).map((p) => (
                    <span
                      key={p}
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        background: "rgba(20,184,166,0.1)",
                        color: T.teal,
                        borderRadius: 999,
                        border: `1px solid ${T.teal}30`,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            {operator && timeline && (
              <div style={{ marginTop: 8, color: T.muted, fontSize: 13 }}>
                Tracked since {fmtUnixAge(timeline.first_seen)} · Last seen{" "}
                {fmtUnixAge(timeline.last_seen)}
              </div>
            )}

            {/* action row — real tools, Grok button styling */}
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <CopyShareLink 
                wallet={wallet}
                riskLevel={operator?.risk_level}
                rugRate={operator?.rug_rate_pct !== undefined ? String(operator.rug_rate_pct) : undefined}
                totalTokens={operator?.total_tokens !== undefined ? String(operator.total_tokens) : undefined}
              />
              <Link href={`/network/${wallet}`} className="btn-ghost">
                Organograma →
              </Link>
              <Link href={`/drain/${wallet}`} className="btn-ghost">
                Trace drain
              </Link>
              <a
                href={`https://api.solsentry.app/v1/operator/${wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Full JSON ↗
              </a>
              <a
                href={`https://solscan.io/account/${wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Solscan ↗
              </a>
            </div>
          </div>

          {!operator && (
            <div style={{ ...card, padding: 20, marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}
              >
                <RiskBadge level="UNKNOWN" />
                <span style={{ color: T.muted, fontSize: 13 }}>Live API lookup complete</span>
              </div>
              <p style={{ color: T.text, lineHeight: 1.6, margin: 0 }}>
                {UNKNOWN_OPERATOR_MESSAGE}
              </p>
              <p style={{ color: T.dim, fontSize: 12, lineHeight: 1.6, margin: "10px 0 0" }}>
                Unknown means SolSentry does not currently have this wallet in the tracked operator
                database. It is not a safety verdict.
              </p>
              {!op && (
                <div style={{ marginTop: 16 }}>
                  <ApiError
                    endpoint={`/v1/operator/${wallet}`}
                    message="The live operator endpoint did not return a tracked profile for this wallet."
                  />
                </div>
              )}
            </div>
          )}

          {operator && (
            <>
              {/* ─── VERDICT STRIP ──────────────────────────────────────── */}
              <div
                style={{
                  ...card,
                  padding: "16px 20px",
                  marginBottom: 16,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 20,
                  borderLeft: `4px solid ${accent}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", color: T.dim, marginBottom: 4 }}>Tier</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: accent }}>{operator.risk_level ?? "UNKNOWN"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", color: T.dim, marginBottom: 4 }}>Confirmed Rugs</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: operator.confirmed_rugs ? T.critical : T.text }}>
                    {fmtInt(operator.confirmed_rugs)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", color: T.dim, marginBottom: 4 }}>Total Tokens</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: T.text }}>{fmtInt(operator.total_tokens)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", color: T.dim, marginBottom: 4 }}>Rug Rate</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: (operator.rug_rate_pct && operator.rug_rate_pct > 80) ? T.critical : T.text }}>
                    {fmtPct(operator.rug_rate_pct, 1)}
                  </div>
                </div>
                {(operator.tags && operator.tags.length > 0) && (
                  <div style={{ borderLeft: `1px solid ${T.border}`, paddingLeft: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {operator.tags.map((t) => (
                      <span key={t} style={{ fontSize: 11, padding: "2px 8px", background: "rgba(245,158,11,0.1)", color: T.amber, borderRadius: 999, border: `1px solid ${T.amber}30` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ─── AI NARRATIVE (Sena) ────────────────────────────────── */}
              <div
                style={{
                  ...card,
                  padding: 20,
                  marginBottom: 28,
                  background: "var(--brand-amber-tint, rgba(245,158,11,0.05))",
                  border: `1px solid var(--brand-amber-line, rgba(245,158,11,0.2))`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ color: T.amber, fontSize: 16 }}>✦</span>
                  <span style={{ fontWeight: 700, color: T.amber }}>Sena AI Narrative</span>
                  {operator.risk_label && (
                    <span style={{ marginLeft: "auto", fontSize: 12, color: T.dim }}>
                      {operator.risk_label}
                    </span>
                  )}
                </div>
                <p style={{ lineHeight: 1.6, color: T.text, margin: 0 }}>
                  {operator.known
                    ? `Sena analysis indicates this is a tracked operator with ${fmtInt(operator.confirmed_rugs)} confirmed rugs across ${fmtInt(operator.total_tokens)} deployed tokens, resulting in a ${fmtPct(operator.rug_rate_pct, 1)} rug rate. Assigned risk level is ${operator.risk_level ?? "—"} (score ${operator.risk_score ?? "—"}/100).${operator.tags?.length ? ` Behavioral patterns show: ${operator.tags.join(", ")}.` : ""}`
                    : UNKNOWN_OPERATOR_MESSAGE}
                </p>
                <div style={{ marginTop: 16 }}>
                  <ScanDepthControl />
                  <SenaModal
                    subject={{
                      kind: "operator",
                      wallet,
                      riskLevel: operator.risk_level,
                      riskScore: operator.risk_score,
                      confirmedRugs: operator.confirmed_rugs,
                      totalTokens: operator.total_tokens,
                      rugRatePct: operator.rug_rate_pct,
                      tags: operator.tags,
                    }}
                  />
                </div>
              </div>

              {/* ─── ACTIVITY HEATMAP 365d (real) ─────────────────────── */}
              {timeline?.tokens && timeline.tokens.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ marginBottom: 12, fontSize: 15 }}>
                    Deployment heatmap · last 365 days
                  </h3>
                  <div style={{ ...card, padding: 16 }}>
                    <ActivityHeatmap tokens={timeline.tokens} />
                  </div>
                </div>
              )}

              {/* ─── DEPLOYMENT HISTORY (Grok table, real tokens) ─────── */}
              {timeline?.tokens && timeline.tokens.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ marginBottom: 12, fontSize: 15 }}>
                    Deployment history{" "}
                    <span style={{ color: T.dim, fontWeight: 400 }}>
                      · {timeline.tokens.length} tokens
                    </span>
                  </h3>
                  <div style={{ ...card, overflow: "hidden" }}>
                    <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}`, color: T.dim }}>
                          <th style={{ textAlign: "left", padding: 12 }}>Mint / Symbol</th>
                          <th style={{ textAlign: "left", padding: 12 }}>Deployed</th>
                          <th style={{ textAlign: "left", padding: 12 }}>Risk</th>
                          <th style={{ textAlign: "right", padding: 12 }}>Outcome</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeline.tokens.slice(0, 50).map((tok, i) => (
                          <tr
                            key={tok.mint}
                            style={{ borderTop: i > 0 ? `1px solid ${T.borderSoft}` : "none" }}
                          >
                            <td style={{ padding: 12, fontFamily: T.mono }}>
                              <Link href={`/token/${tok.mint}`} style={{ color: T.text }}>
                                {tok.symbol || truncate(tok.mint, 6, 4)}
                              </Link>
                            </td>
                            <td style={{ padding: 12, color: T.muted }}>
                              {fmtUnixAge(tok.deployed_at)}
                            </td>
                            <td style={{ padding: 12 }}>
                              <span
                                style={{
                                  color: tok.risk_level === "CRITICAL" ? T.critical : T.muted,
                                }}
                              >
                                {tok.risk_level} · {tok.risk_score}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: 12,
                                textAlign: "right",
                                color: tok.final_outcome === "RUG" ? T.critical : T.teal,
                              }}
                            >
                              {tok.final_outcome}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {timeline.tokens.length > 50 && (
                    <div style={{ marginTop: 8, fontSize: 12, color: T.amber }}>
                      <a
                        href={`https://api.solsentry.app/v1/operator/${wallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: T.amber }}
                      >
                        Show all {fmtInt(timeline.tokens.length)} tokens →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* ─── CONNECTED WALLETS (real network nodes) ───────────── */}
              {network?.nodes && network.nodes.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ marginBottom: 12, fontSize: 15 }}>
                    Connected wallets{" "}
                    <span style={{ color: T.dim, fontWeight: 400 }}>
                      · {network.nodes.length} nodes · {network.edges?.length ?? 0} edges
                    </span>
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {network.nodes.slice(0, 24).map((n) => (
                      <div key={n.address} style={{ ...card, padding: 14 }}>
                        <div style={{ marginBottom: 6 }}>
                          <AddrLink addr={n.address} />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            fontSize: 11,
                            color: T.dim,
                            fontFamily: T.mono,
                          }}
                        >
                          {n.type && <span>{n.type}</span>}
                          {n.risk !== undefined && <span>risk {n.risk}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Link href={`/network/${wallet}`} className="btn-ghost">
                      Open full network →
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {operator && (
        <SenaLauncher
          initialOpen={senaAutoOpen}
          entity={{
            type: "operator",
            id: wallet,
            summary: {
              riskLevel: operator.risk_level,
              riskScore: operator.risk_score,
              confirmedRugs: operator.confirmed_rugs,
              totalTokens: operator.total_tokens,
              rugRatePct: operator.rug_rate_pct,
              tags: operator.tags,
            },
          }}
        />
      )}
      <Footer />
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 11, color: T.dim }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, color: accent || T.text }}>
        {value}
      </div>
    </div>
  );
}
