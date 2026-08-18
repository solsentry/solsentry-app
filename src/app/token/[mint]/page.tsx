// Token risk card — Pro/dense redesign (Nansen-style information density).
//
// 6 sections, top-to-bottom:
//   1. Top strip: symbol/name/mint + copy + risk badge + 4 KPIs
//   2. Deployer card: operator pubkey + mini-stats + tags
//   3. Risk breakdown: signals firing (left) + Sena verdict (right)
//   4. Holder profile: top-5 table (wired to /v1/holders/{mint})
//   5. Activity heatmap: <ActivityHeatmap tokens={timeline.tokens}/>
//   6. Related links strip: Birdeye, DexScreener, Solscan, RugCheck, Phantom
//
// Server component preserves the existing fetchToken (revalidate=60) pattern
// and fans out to fetchOperator + fetchOperatorTimeline when a deployer is
// known so the deployer card and heatmap render without client roundtrips.
//
// SenaLauncher (floating ☀ FAB) is intentionally kept — added by a recent
// edit and now used as the primary "ask Sena" entry on this page; SenaModal
// is the inline secondary CTA inside the risk breakdown.

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { RiskBadge } from "@/components/RiskBadge";
import { AddrLink } from "@/components/AddrLink";
import { ApiError } from "@/components/ApiError";
import { SenaModal } from "@/components/SenaModal";
import { SenaLauncher } from "@/components/SenaLauncher";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { CopyText } from "@/components/CopyText";
import {
  fetchToken,
  fetchOperator,
  fetchOperatorTimeline,
  fetchHolders,
  truncate,
  type TokenOperatorRef,
} from "@/lib/api";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { mint } = await params;
  return {
    title: `Token ${truncate(mint, 6, 4)} — risk card`,
    description: `SolSentry token risk card for ${mint}. Risk score, signals, deployer, and outcome.`,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Local atoms — single-use, kept inline to preserve dense layout intent
// without proliferating one-off components.

function KPI({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 120,
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
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      {hint && <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

function Pill({
  children,
  color = "var(--fg-2)",
  border = "var(--border)",
}: {
  children: React.ReactNode;
  color?: string;
  border?: string;
}) {
  return (
    <span
      style={{
        fontSize: 10,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color,
        border: `1px solid ${border}`,
        borderRadius: 3,
        padding: "2px 7px",
        fontFamily: "var(--font-mono)",
      }}
    >
      {children}
    </span>
  );
}

function SignalRow({ ok, label, detail }: { ok: boolean | null; label: string; detail?: string }) {
  const mark = ok === null ? "—" : ok ? "✓" : "✗";
  const color = ok === null ? "var(--fg-3)" : ok ? "var(--brand-teal)" : "var(--status-critical)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        padding: "6px 0",
        borderBottom: "1px dashed var(--border)",
        fontSize: 13,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          color,
          width: 14,
          flexShrink: 0,
          fontWeight: 700,
        }}
      >
        {mark}
      </span>
      <span style={{ color: "var(--fg-1)", flex: 1 }}>{label}</span>
      {detail && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-3)",
          }}
        >
          {detail}
        </span>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────

function ageString(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diffMs = Date.now() - d.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days >= 1) return `${days}d`;
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours >= 1) return `${hours}h`;
  const mins = Math.max(0, Math.floor(diffMs / 60_000));
  return `${mins}m`;
}

function lastUpdatedString(iso?: string | null): string {
  if (!iso) return "Last updated —";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Last updated —";
  const secs = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (secs < 60) return `Last updated ${secs}s ago`;
  if (secs < 3600) return `Last updated ${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `Last updated ${Math.floor(secs / 3600)}h ago`;
  return `Last updated ${Math.floor(secs / 86400)}d ago`;
}

function opAddr(op: TokenOperatorRef | string | null | undefined): string | null {
  if (!op) return null;
  if (typeof op === "string") return op;
  return op.wallet ?? null;
}

export default async function TokenPage({ params }: PageProps) {
  const { mint } = await params;
  const tok = await fetchToken(mint);
  const isUntracked = tok?.known === false;

  const deployer = isUntracked ? null : tok?.dev_wallet || opAddr(tok?.operator) || null;

  // Parallel fan-out — server-side, cached via fetchOperator/Timeline/Holders TTLs.
  const [operator, timeline, fetchedHolders] = await Promise.all([
    deployer ? fetchOperator(deployer) : Promise.resolve(null),
    deployer ? fetchOperatorTimeline(deployer) : Promise.resolve(null),
    !tok?.holders ? fetchHolders(mint) : Promise.resolve(null),
  ]);

  const activeHolders = tok?.holders ?? fetchedHolders;
  const rawLargest = tok?.holders?.largest ?? fetchedHolders?.largest ?? [];

  // Top-5 holders, sorted by share desc (defensive — API usually pre-sorts).
  const topHolders = rawLargest
    .slice()
    .sort((a, b) => (b.pct ?? b.percentage ?? 0) - (a.pct ?? a.percentage ?? 0))
    .slice(0, 5);

  const riskLevel = tok?.risk_level ?? "UNKNOWN";
  const riskBorder =
    riskLevel === "CRITICAL"
      ? "var(--status-critical)"
      : riskLevel === "HIGH"
        ? "var(--status-warning)"
        : "var(--border)";

  return (
    <>
      <SiteTopbar />
      <main style={{ padding: "20px 0 40px" }}>
        {!tok && (
          <section className="wrap" style={{ padding: "32px 24px" }}>
            <ApiError endpoint={`/v1/token/${mint}`} />
          </section>
        )}

        {isUntracked && (
          <section className="wrap" style={{ padding: "32px 24px" }}>
            <div className="panel" style={{ padding: 20 }}>
              <RiskBadge level="UNKNOWN" />
              <p style={{ color: "var(--fg-1)", margin: "12px 0 0" }}>
                This token is not in the tracked database.
              </p>
              <p style={{ color: "var(--fg-3)", fontSize: 12, margin: "8px 0 0" }}>
                This is not a safety verdict.
              </p>
            </div>
          </section>
        )}

        {tok && !isUntracked && (
          <>
            {/* ─── 1. TOP STRIP ─────────────────────────────────────────── */}
            <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
              <div
                className="panel"
                style={{
                  padding: 0,
                  borderColor: riskBorder,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      flex: "2 1 320px",
                      padding: "14px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      borderRight: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <RiskBadge level={riskLevel} size="md" />
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 18,
                          color: "var(--fg-1)",
                        }}
                      >
                        {tok.symbol || (tok.known ? "Unnamed token" : "Unknown mint")}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--fg-3)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        SPL · Solana
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <code
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--brand-amber)",
                          letterSpacing: 0,
                        }}
                      >
                        {truncate(mint, 10, 8)}
                      </code>
                      <CopyText value={mint} label="Copy mint" />
                    </div>
                  </div>

                  <KPI
                    label="Tier"
                    value={tok.risk_level ?? "UNKNOWN"}
                    hint={
                      tok.risk_score !== undefined && tok.risk_score !== null
                        ? `Score: ${tok.risk_score}`
                        : "Auditável"
                    }
                  />
                  <KPI label="Outcome" value={tok.final_outcome || "pending"} />
                  <KPI label="Flags" value={((tok.risk_factors?.length || tok.flags?.length) ?? 0).toString()} />
                  <KPI
                    label="Age"
                    value={ageString(tok.predicted_at)}
                    hint={tok.is_bundle ? "lançamento coordenado" : undefined}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                  color: "var(--fg-3)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span>
                  {tok.source === "live_scan" ? (
                    <span style={{ color: "var(--brand-teal)" }}>
                      ● Escaneado agora {tok.latency_ms ? `(${tok.latency_ms}ms)` : ""}
                    </span>
                  ) : (
                    lastUpdatedString(tok.predicted_at)
                  )}
                </span>
                <span>
                  {tok.scanned_on_demand
                    ? "On-demand scan"
                    : tok.known
                      ? "Indexed by SolSentry"
                      : "Not yet scanned"}
                </span>
              </div>
            </section>

            {/* ─── 2. DEPLOYER CARD ─────────────────────────────────────── */}
            <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
              <div className="panel" style={{ padding: "14px 18px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                    }}
                  >
                    Deployer
                  </div>
                  {deployer && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link
                        href={`/operator/${deployer}`}
                        className="btn-ghost"
                        style={{ fontSize: 12, padding: "4px 10px" }}
                      >
                        Operator profile →
                      </Link>
                      <Link
                        href={`/network/${deployer}`}
                        className="btn-ghost"
                        style={{ fontSize: 12, padding: "4px 10px" }}
                      >
                        Network tree →
                      </Link>
                      <Link
                        href={`/drain/${deployer}`}
                        className="btn-ghost"
                        style={{ fontSize: 12, padding: "4px 10px" }}
                      >
                        Trace drain
                      </Link>
                    </div>
                  )}
                </div>

                {(() => {
                  const tokOp = typeof tok?.operator === "object" ? tok.operator : null;
                  const combinedOp = { ...(operator || {}), ...(tokOp || {}) };
                  const isDeployerKnown = tokOp?.known ?? operator?.known ?? true;
                  
                  if (!deployer) {
                    return (
                      <div style={{ color: "var(--fg-3)", fontSize: 13 }}>
                        Deployer wallet not yet resolved. Stage-2 enrichment may still be running.
                      </div>
                    );
                  }

                  if (!isDeployerKnown) {
                    return (
                      <div style={{ padding: "10px 0" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                          <AddrLink addr={deployer} head={12} tail={8} />
                          <CopyText value={deployer} label="Copy" />
                          <RiskBadge level="UNKNOWN" size="sm" />
                        </div>
                        <div style={{ color: "var(--status-warning)", fontSize: 13, fontWeight: 500 }}>
                          Deployer sem histórico rastreado (nunca assuma seguro)
                        </div>
                      </div>
                    );
                  }

                  return (
                    <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <AddrLink addr={deployer} head={12} tail={8} />
                      <CopyText value={deployer} label="Copy" />
                      {combinedOp?.risk_level && <RiskBadge level={combinedOp.risk_level} size="sm" />}
                      {(operator?.tags ?? []).map((t) => (
                        <Pill key={t} color="var(--brand-amber)" border="var(--brand-amber-line)">
                          {t}
                        </Pill>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <KPI
                        label="Tokens deployed"
                        value={combinedOp?.total_tokens?.toLocaleString() ?? "—"}
                      />
                      <KPI
                        label="Rug rate"
                        value={
                          combinedOp?.rug_rate_pct !== undefined
                            ? `${combinedOp.rug_rate_pct.toFixed(1)}%`
                            : "—"
                        }
                      />
                      <KPI
                        label="Confirmed rugs"
                        value={combinedOp?.confirmed_rugs?.toLocaleString() ?? "—"}
                      />
                      <KPI
                        label="Last Scam"
                        value={combinedOp?.recent_scams ? "Recent" : "—"}
                      />
                      <KPI
                        label="First seen"
                        value={
                          timeline?.first_seen
                            ? new Date(timeline.first_seen * 1000).toISOString().slice(0, 10)
                            : "—"
                        }
                      />
                    </div>
                  </>
                );
                })()}
              </div>
            </section>

            {/* ─── 3. RISK BREAKDOWN ────────────────────────────────────── */}
            <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 12,
                }}
              >
                <div className="panel" style={{ padding: "14px 18px" }}>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                      marginBottom: 8,
                    }}
                  >
                    Risk Factors
                  </div>
                  {(() => {
                    if (tok.risk_factors && tok.risk_factors.length > 0) {
                      return tok.risk_factors.map((rf, i) => {
                        const color =
                          rf.severity === "CRITICAL" ? "var(--status-critical)" :
                          rf.severity === "HIGH" ? "var(--status-warning)" :
                          rf.severity === "MEDIUM" ? "var(--brand-amber)" : "var(--brand-teal)";
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "6px 0", borderBottom: "1px dashed var(--border)", fontSize: 13 }}>
                            <span style={{ fontFamily: "var(--font-mono)", color, width: 14, flexShrink: 0, fontWeight: 700 }}>●</span>
                            <span style={{ color: "var(--fg-1)", flex: 1 }}>{rf.category}</span>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>{rf.detail}</span>
                          </div>
                        );
                      });
                    }

                    const flagSet = new Set(tok.flags ?? []);
                    const known: Array<{ key: string; label: string }> = [
                      { key: "mint_authority", label: "Mint authority retained" },
                      {
                        key: "freeze_authority",
                        label: "Freeze authority retained",
                      },
                      {
                        key: "top_holder_concentration",
                        label: "Top holder >30%",
                      },
                      { key: "lp_not_locked", label: "LP not locked / burned" },
                      {
                        key: "holder_concentration",
                        label: "Holder concentration high",
                      },
                      {
                        key: "deployer_history",
                        label: "Deployer has rug history",
                      },
                    ];
                    const knownKeys = new Set(known.map((k) => k.key));
                    const extra = [...flagSet].filter((f) => !knownKeys.has(f));
                    const anyKnown = tok.known === true;
                    return (
                      <>
                        {known.map((k) => (
                          <SignalRow
                            key={k.key}
                            ok={!anyKnown ? null : flagSet.has(k.key) ? false : true}
                            label={k.label}
                          />
                        ))}
                        {extra.map((f) => (
                          <SignalRow
                            key={f}
                            ok={false}
                            label={f.replace(/_/g, " ")}
                            detail="flag"
                          />
                        ))}
                        {!anyKnown && (
                          <div
                            style={{
                              marginTop: 10,
                              fontSize: 12,
                              color: "var(--fg-3)",
                            }}
                          >
                            Not analyzed yet — re-check after stage-2.
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Cluster Card */}
                <div className="panel" style={{ padding: "14px 18px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 8 }}>
                    Bot-cluster / Coordenação
                  </div>
                  {tok.cluster_evidence ? (
                    <div style={{ fontSize: 13, color: "var(--fg-2)", display: "flex", flexDirection: "column", gap: 6 }}>
                       <div style={{ display: "flex", justifyContent: "space-between" }}>
                         <span>Same block coord:</span>
                         <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-1)" }}>{tok.cluster_evidence.same_block_bundles ?? 0}</span>
                       </div>
                       <div style={{ display: "flex", justifyContent: "space-between" }}>
                         <span>Tight clusters:</span>
                         <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-1)" }}>{tok.cluster_evidence.tight_clusters ?? 0}</span>
                       </div>
                       <div style={{ display: "flex", justifyContent: "space-between" }}>
                         <span>Coordinated buy wallets:</span>
                         <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-1)" }}>{tok.cluster_evidence.coordinated_buy_wallets ?? 0}</span>
                       </div>
                       <div style={{ display: "flex", justifyContent: "space-between" }}>
                         <span>Coordinated sell wallets:</span>
                         <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-1)" }}>{tok.cluster_evidence.coordinated_sell_wallets ?? 0}</span>
                       </div>
                       {(tok.cluster_evidence.flags?.length ?? 0) > 0 && (
                         <div style={{ marginTop: 8, color: "var(--status-critical)" }}>
                           Flags: {tok.cluster_evidence.flags?.join(", ")}
                         </div>
                       )}
                    </div>
                  ) : tok.budget_mode === "cheap" ? (
                    <div style={{ color: "var(--fg-3)", fontSize: 13, padding: "10px 0" }}>
                      Análise de cluster sob demanda.<br/>
                      <span style={{ color: "var(--brand-teal)", cursor: "pointer", textDecoration: "underline" }}>Re-scan com premium</span>
                    </div>
                  ) : (
                    <div style={{ color: "var(--fg-3)", fontSize: 13 }}>
                      Nenhuma evidência de coordenação ou análise parcial.
                    </div>
                  )}
                </div>

                <div className="panel" style={{ padding: "14px 18px" }}>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                      marginBottom: 8,
                    }}
                  >
                    Why this verdict
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: "var(--fg-2)",
                      margin: "0 0 12px",
                    }}
                  >
                    Tier <strong style={{ color: "var(--fg-1)" }}>{tok.risk_level ?? "UNKNOWN"}</strong>{" "}
                    (Score {tok.risk_score ?? "—"}/100) derives from {tok.risk_factors?.length ?? tok.flags?.length ?? 0} signal
                    {((tok.risk_factors?.length ?? tok.flags?.length) === 1) ? "" : "s"} plus deployer history
                    {operator?.confirmed_rugs
                      ? ` (${operator.confirmed_rugs.toLocaleString()} confirmed rugs on file)`
                      : ""}
                    . Ask Sena for the full reasoning chain.
                  </p>
                  <SenaModal
                    subject={{
                      kind: "token",
                      mint,
                      symbol: tok.symbol,
                      riskLevel: tok.risk_level,
                      riskScore: tok.risk_score,
                      flags: tok.flags,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* ─── 4. CONTRACT PARITY STRIP ───────────────────────────────── */}
            <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
              <div className="panel" style={{ padding: 0, overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
                <KPI
                  label="Mint Auth"
                  value={tok.has_mint_authority === true ? "Retained" : tok.has_mint_authority === false ? "Revoked" : "—"}
                  hint={tok.has_mint_authority === true ? "⚠️ Risk" : ""}
                />
                <KPI
                  label="Freeze Auth"
                  value={tok.has_freeze_authority === true ? "Retained" : tok.has_freeze_authority === false ? "Revoked" : "—"}
                  hint={tok.has_freeze_authority === true ? "⚠️ Risk" : ""}
                />
                <KPI
                  label="LP Locked"
                  value={tok.lp_locked_pct !== undefined ? `${tok.lp_locked_pct.toFixed(1)}%` : "—"}
                  hint={tok.lp_locked_usd ? `$${tok.lp_locked_usd.toLocaleString()}` : ""}
                />
                <KPI
                  label="Platform"
                  value={tok.launch_platform || "Unknown"}
                  hint={tok.token_extensions?.length ? `Ext: ${tok.token_extensions.length}` : ""}
                />
                <KPI
                  label="Creator Tokens"
                  value={tok.creator_tokens != null ? tok.creator_tokens.toLocaleString() : "—"}
                />
              </div>
            </section>

            {/* ─── 5. HOLDER PROFILE ────────────────────────────────────── */}
            <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 12,
                }}
              >
              <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "10px 18px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                    }}
                  >
                    Top holders
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "var(--fg-3)",
                    }}
                  >
                    {activeHolders
                      ? `${(activeHolders as any).count ?? (activeHolders as any).holder_count ?? "—"} holders${
                          topHolders[0] ? ` · top1 ${((topHolders[0].pct ?? topHolders[0].percentage) ?? 0).toFixed(1)}%` : ""
                        }`
                      : "parcial/sob demanda"}
                  </div>
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <thead>
                    <tr style={{ color: "var(--fg-3)", textAlign: "left" }}>
                      <th style={{ padding: "8px 18px", width: 40 }}>#</th>
                      <th style={{ padding: "8px 8px" }}>Address</th>
                      <th style={{ padding: "8px 8px" }}>Label</th>
                      <th
                        style={{
                          padding: "8px 18px",
                          textAlign: "right",
                          width: 80,
                        }}
                      >
                        Share
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topHolders.length > 0
                      ? topHolders.map((h, idx) => (
                          <tr
                            key={h.wallet || h.address || idx}
                            style={{
                              background:
                                idx % 2 === 1
                                  ? "color-mix(in oklch, var(--fg-1) 4%, transparent)"
                                  : "transparent",
                            }}
                          >
                            <td style={{ padding: "6px 18px", color: "var(--fg-3)" }}>{idx + 1}</td>
                            <td style={{ padding: "6px 8px" }}>
                              {h.wallet || h.address ? (
                                <Link
                                  href={`/network/${h.wallet || h.address}`}
                                  style={{ color: "var(--fg-1)", textDecoration: "none" }}
                                >
                                  {truncate(h.wallet || h.address || "")}
                                </Link>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td style={{ padding: "6px 8px", color: "var(--fg-3)" }}>—</td>
                            <td
                              style={{
                                padding: "6px 18px",
                                textAlign: "right",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {typeof h.pct === "number" ? `${h.pct.toFixed(1)}%` : typeof h.percentage === "number" ? `${h.percentage.toFixed(1)}%` : "—"}
                            </td>
                          </tr>
                        ))
                      : [1, 2, 3, 4, 5].map((i) => (
                          <tr
                            key={i}
                            style={{
                              background:
                                i % 2 === 0
                                  ? "color-mix(in oklch, var(--fg-1) 4%, transparent)"
                                  : "transparent",
                              color: "var(--fg-3)",
                            }}
                          >
                            <td style={{ padding: "6px 18px" }}>{i}</td>
                            <td style={{ padding: "6px 8px" }}>—</td>
                            <td style={{ padding: "6px 8px" }}>Not available yet</td>
                            <td
                              style={{
                                padding: "6px 18px",
                                textAlign: "right",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              —
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              {/* NEW: Related-wallet clusters */}
              <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "10px 18px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                    }}
                  >
                    Related-Wallet Clusters
                  </div>
                </div>
                <div style={{ padding: "14px 18px" }}>
                  {tok.cluster_evidence && tok.cluster_evidence.tight_clusters && tok.cluster_evidence.tight_clusters > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "var(--status-critical)", fontFamily: "var(--font-mono)", fontSize: 13 }}>Cluster A</span>
                          <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{tok.cluster_evidence.tight_clusters} wallets</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "var(--status-warning)", fontFamily: "var(--font-mono)", fontSize: 13 }}>Cluster B</span>
                          <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{tok.cluster_evidence.coordinated_buy_wallets || 0} wallets</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: "var(--fg-3)", fontSize: 12 }}>
                      Nenhum cluster co-relacionado detectado ou on-demand scan incompleto.
                    </div>
                  )}
                </div>
              </div>
              </div>

            </section>

            {/* ─── 6. ACTIVITY HEATMAP ──────────────────────────────────── */}
            {deployer && (
              <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
                <div className="panel" style={{ padding: "14px 18px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 8,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        color: "var(--fg-3)",
                      }}
                    >
                      Deployer activity · 365d
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        color: "var(--fg-3)",
                      }}
                    >
                      {timeline?.tokens?.length ?? 0} deployments in window
                    </div>
                  </div>
                  {timeline?.tokens && timeline.tokens.length > 0 ? (
                    <ActivityHeatmap tokens={timeline.tokens} />
                  ) : (
                    <div style={{ color: "var(--fg-3)", fontSize: 12 }}>
                      Not available yet for this deployer.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ─── 7. RELATED LINKS STRIP ───────────────────────────────── */}
            <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
              <div
                className="panel"
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: "var(--fg-3)",
                    marginRight: 4,
                  }}
                >
                  Explore on
                </span>
                {[
                  {
                    label: "Birdeye",
                    href: `https://birdeye.so/token/${mint}?chain=solana`,
                  },
                  {
                    label: "DexScreener",
                    href: `https://dexscreener.com/solana/${mint}`,
                  },
                  {
                    label: "Solscan",
                    href: `https://solscan.io/token/${mint}`,
                  },
                  {
                    label: "RugCheck",
                    href: `https://rugcheck.xyz/tokens/${mint}`,
                  },
                  {
                    label: "Phantom",
                    href: `https://phantom.app/tokens/solana/${mint}`,
                  },
                  {
                    label: "Full JSON",
                    href: `https://api.solsentry.app/v1/token/${mint}`,
                  },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: "4px 10px" }}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      {tok && (
        <SenaLauncher
          entity={{
            type: "token",
            id: mint,
            summary: {
              symbol: tok.symbol,
              riskLevel: tok.risk_level,
              riskScore: tok.risk_score,
              flags: tok.flags,
              deployer: tok.dev_wallet ?? undefined,
            },
          }}
        />
      )}
      <Footer />
    </>
  );
}
