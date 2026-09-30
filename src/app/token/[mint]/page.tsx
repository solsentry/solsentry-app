// Token risk card — CLOSED BETA (token mints only).
//
// Sections, top-to-bottom:
//   0. Beta seal (always visible)
//   1. Top strip: symbol/mint + copy + risk badge + KPIs (tier, outcome, flags, scored)
//   2. Deployer: address ONLY when the API proves the attribution (see verifiedDeployer);
//      otherwise "Deployer not verified"
//   3. Risk breakdown: mint-level signals + cluster evidence + verdict blurb
//   4. Contract parity strip
//   5. Top holders
//   6. External explorers
//
// Closed-beta rules (GO-019 item 22):
//   - no precision/accuracy figure anywhere (frozen until re-measurement)
//   - no operator-level count/aggregate or named-operator narrative (LOCK-01/LOCK-03):
//     operator/timeline fetches, rug rate, confirmed rugs, deployer heatmap are gone
//   - no links/buttons to closed pages (/operator, /dossier, /network, /drain, /pro, /app, /login)
//   - Sena chat/modal removed on this card (LLM output cannot be gated for the rules above)
//
// Server component; fetchTokenState (10s timeout) separates "unknown mint" from
// "API slow/unavailable" so the card never shows a false "not in database".

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { RiskBadge } from "@/components/RiskBadge";
import { ApiError } from "@/components/ApiError";
import { CopyText } from "@/components/CopyText";
import { fetchTokenState, fetchHolders, truncate } from "@/lib/api";
import { BASE58_RE, BETA_SEAL, isOperatorSignal, verifiedDeployer } from "@/lib/token-card";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { mint } = await params;
  return {
    title: `Token ${truncate(mint, 6, 4)} — risk card (beta)`,
    description: `SolSentry token risk card (beta) for ${mint}: risk tier, signals, and outcome.`,
    robots: { index: false, follow: false },
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Local atoms — single-use, kept inline to preserve dense layout intent.

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
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>
          {detail}
        </span>
      )}
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: "var(--fg-3)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function BetaSeal() {
  return (
    <section className="wrap" style={{ padding: "0 24px", marginBottom: 12 }}>
      <div
        role="note"
        data-testid="beta-seal"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          border: "1px solid var(--brand-amber-line)",
          background: "var(--brand-amber-tint)",
          borderRadius: 6,
          fontSize: 12,
          color: "var(--brand-amber)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span>{BETA_SEAL}</span>
      </div>
    </section>
  );
}

function StatePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="wrap" style={{ padding: "8px 24px 32px" }}>
      <div className="panel" style={{ padding: 20 }} data-testid="token-state">
        <RiskBadge level="UNKNOWN" />
        <p style={{ color: "var(--fg-1)", margin: "12px 0 0", fontSize: 15 }}>{title}</p>
        <div style={{ color: "var(--fg-3)", fontSize: 12, margin: "8px 0 0", lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────

function ageString(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diffMs = Date.now() - d.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours >= 1) return `${hours}h ago`;
  const mins = Math.max(0, Math.floor(diffMs / 60_000));
  return `${mins}m ago`;
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

const pctOf = (h: { pct?: number; percentage?: number }): number | null =>
  typeof h.pct === "number" ? h.pct : typeof h.percentage === "number" ? h.percentage : null;

export default async function TokenPage({ params }: PageProps) {
  const { mint } = await params;

  const shell = (body: React.ReactNode) => (
    <>
      <SiteTopbar hideClosedLinks />
      <main style={{ padding: "20px 0 40px" }}>
        <BetaSeal />
        {body}
      </main>
      <Footer />
    </>
  );

  // Malformed mint → friendly message, no API call.
  if (!BASE58_RE.test(mint)) {
    return shell(
      <StatePanel title="That doesn't look like a Solana token mint.">
        Mint addresses are base58, 32–44 characters. Check the address and try again.
      </StatePanel>,
    );
  }

  const state = await fetchTokenState(mint);

  if (state.status === "unavailable") {
    return shell(
      <section className="wrap" style={{ padding: "8px 24px 32px" }}>
        <ApiError
          endpoint={`/v1/token/${mint}`}
          message="The risk API didn't answer in time (slow, rate-limited or down). This is not a verdict on the token — try again in a minute."
        />
      </section>,
    );
  }

  if (state.status === "not_found" || state.token.known === false) {
    return shell(
      <StatePanel title="This token is not in the tracked database.">
        This is not a safety verdict. Unknown does not mean safe.
      </StatePanel>,
    );
  }

  const tok = state.token;
  const isUnscored = !tok.risk_level || tok.risk_level === "UNKNOWN";
  const deployer = verifiedDeployer(tok);

  const fetchedHolders = tok.holders ? null : await fetchHolders(mint);
  const activeHolders = tok.holders ?? fetchedHolders;
  const rawLargest = tok.holders?.largest ?? fetchedHolders?.largest ?? [];
  const topHolders = rawLargest
    .slice()
    .sort((a, b) => (pctOf(b) ?? 0) - (pctOf(a) ?? 0))
    .slice(0, 5);

  const riskLevel = tok.risk_level ?? "UNKNOWN";
  const riskBorder =
    riskLevel === "CRITICAL"
      ? "var(--status-critical)"
      : riskLevel === "HIGH"
        ? "var(--status-warning)"
        : "var(--border)";

  // Mint-level signals only: operator-history signals are dropped (LOCK-01/03).
  const riskFactors = (tok.risk_factors ?? []).filter(
    (rf) => !isOperatorSignal(rf.category, rf.detail),
  );
  const flags = (tok.flags ?? []).filter((f) => !isOperatorSignal(f));
  const signalCount = riskFactors.length > 0 ? riskFactors.length : flags.length;

  return shell(
    <>
      {/* ─── 1. TOP STRIP ─────────────────────────────────────────── */}
      <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
        <div
          className="panel"
          style={{ padding: 0, borderColor: riskBorder, overflow: "hidden" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <RiskBadge level={riskLevel} size="md" />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--fg-1)",
                  }}
                >
                  {tok.symbol || "Unnamed token"}
                </span>
                <span
                  style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}
                >
                  SPL · Solana
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
              value={riskLevel}
              hint={
                isUnscored
                  ? "No score yet"
                  : typeof tok.risk_score === "number"
                    ? `Score: ${tok.risk_score}/100`
                    : undefined
              }
            />
            <KPI label="Outcome" value={(tok.final_outcome || "pending").replace(/_/g, " ")} />
            <KPI label="Flags" value={signalCount.toString()} />
            <KPI
              label="Scored"
              value={ageString(tok.predicted_at)}
              hint={tok.is_bundle ? "coordinated launch" : undefined}
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
                ● Scanned just now {tok.latency_ms ? `(${Math.round(tok.latency_ms)}ms)` : ""}
              </span>
            ) : (
              lastUpdatedString(tok.predicted_at)
            )}
          </span>
          <span>{tok.scanned_on_demand ? "On-demand scan" : "Indexed by SolSentry"}</span>
        </div>
        {isUnscored && (
          <div
            className="panel"
            data-testid="unscored-note"
            style={{ marginTop: 10, padding: "10px 14px", fontSize: 13, color: "var(--fg-2)" }}
          >
            Not enough data to score this address yet. This is not a safety verdict — and if this
            address is a wallet rather than a token mint, wallet lookups are not open yet.
          </div>
        )}
      </section>

      {/* ─── 2. DEPLOYER (verified-only) ──────────────────────────── */}
      <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
        <div className="panel" style={{ padding: "14px 18px" }} data-testid="deployer-card">
          <PanelLabel>Deployer</PanelLabel>
          {deployer ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <code
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--brand-amber)",
                  }}
                >
                  {truncate(deployer, 12, 8)}
                </code>
                <CopyText value={deployer} label="Copy" />
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-3)" }}>
                Deployer proven on-chain (creation tx).
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--fg-3)", fontSize: 13 }}>
              Deployer not verified. We only show a deployer wallet when its attribution is proven
              on-chain.
            </div>
          )}
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
            <PanelLabel>Risk Factors</PanelLabel>
            {(() => {
              if (riskFactors.length > 0) {
                return riskFactors.map((rf, i) => {
                  const color =
                    rf.severity === "CRITICAL"
                      ? "var(--status-critical)"
                      : rf.severity === "HIGH"
                        ? "var(--status-warning)"
                        : rf.severity === "MEDIUM"
                          ? "var(--brand-amber)"
                          : "var(--brand-teal)";
                  return (
                    <div
                      key={i}
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
                        ●
                      </span>
                      <span style={{ color: "var(--fg-1)", flex: 1 }}>{rf.category}</span>
                      <span
                        style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}
                      >
                        {rf.detail}
                      </span>
                    </div>
                  );
                });
              }

              // Only list what the API actually flagged. (An earlier version rendered a
              // fixed checklist with ✓ for every un-flagged item, which showed
              // "✓ Top holder >30%" next to a real 47% top holder when the API simply
              // had not analysed the token.)
              const LABELS: Record<string, string> = {
                mint_authority: "Mint authority retained",
                freeze_authority: "Freeze authority retained",
                top_holder_concentration: "Top holder >30%",
                lp_not_locked: "LP not locked / burned",
                holder_concentration: "Holder concentration high",
              };
              return (
                <>
                  {flags.map((f) => (
                    <SignalRow key={f} ok={false} label={LABELS[f] ?? f.replace(/_/g, " ")} />
                  ))}
                  {flags.length === 0 && (
                    <div style={{ fontSize: 13, color: "var(--fg-3)", lineHeight: 1.5 }}>
                      {isUnscored
                        ? "Not analyzed yet — check again in a few minutes."
                        : "No signals flagged. The absence of flags is not a safety verdict."}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div className="panel" style={{ padding: "14px 18px" }}>
            <PanelLabel>Bot-cluster / coordination</PanelLabel>
            {tok.cluster_evidence ? (
              <div
                style={{
                  fontSize: 13,
                  color: "var(--fg-2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {[
                  ["Same block coord:", tok.cluster_evidence.same_block_bundles],
                  ["Tight clusters:", tok.cluster_evidence.tight_clusters],
                  ["Coordinated buy wallets:", tok.cluster_evidence.coordinated_buy_wallets],
                  ["Coordinated sell wallets:", tok.cluster_evidence.coordinated_sell_wallets],
                ].map(([label, val]) => (
                  <div key={label as string} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-1)" }}>
                      {(val as number | undefined) ?? 0}
                    </span>
                  </div>
                ))}
                {(tok.cluster_evidence.flags?.length ?? 0) > 0 && (
                  <div style={{ marginTop: 8, color: "var(--status-critical)" }}>
                    Flags: {tok.cluster_evidence.flags?.join(", ")}
                  </div>
                )}
              </div>
            ) : tok.budget_mode === "cheap" ? (
              <div style={{ color: "var(--fg-3)", fontSize: 13 }}>
                Cluster analysis not run for this token (on-demand only).
              </div>
            ) : (
              <div style={{ color: "var(--fg-3)", fontSize: 13 }}>
                No coordination evidence, or the analysis is partial.
              </div>
            )}
          </div>

          <div className="panel" style={{ padding: "14px 18px" }}>
            <PanelLabel>Why this verdict</PanelLabel>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--fg-2)", margin: 0 }}>
              {isUnscored ? (
                <>No tier yet — there is not enough data to score this token.</>
              ) : (
                <>
                  Tier <strong style={{ color: "var(--fg-1)" }}>{riskLevel}</strong>
                  {typeof tok.risk_score === "number" ? ` (score ${tok.risk_score}/100)` : ""} from{" "}
                  {signalCount} mint-level signal{signalCount === 1 ? "" : "s"}.
                </>
              )}{" "}
              Scores are being re-measured during the beta.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. CONTRACT PARITY STRIP ───────────────────────────────── */}
      <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
        <div
          className="panel"
          style={{ padding: 0, overflow: "hidden", display: "flex", flexWrap: "wrap" }}
        >
          <KPI
            label="Mint Auth"
            value={
              tok.has_mint_authority === true
                ? "Retained"
                : tok.has_mint_authority === false
                  ? "Revoked"
                  : "—"
            }
            hint={tok.has_mint_authority === true ? "⚠️ Risk" : ""}
          />
          <KPI
            label="Freeze Auth"
            value={
              tok.has_freeze_authority === true
                ? "Retained"
                : tok.has_freeze_authority === false
                  ? "Revoked"
                  : "—"
            }
            hint={tok.has_freeze_authority === true ? "⚠️ Risk" : ""}
          />
          <KPI
            label="LP Locked"
            value={typeof tok.lp_locked_pct === "number" ? `${tok.lp_locked_pct.toFixed(1)}%` : "—"}
            hint={tok.lp_locked_usd ? `$${tok.lp_locked_usd.toLocaleString()}` : ""}
          />
          <KPI
            label="Platform"
            value={tok.launch_platform || "Unknown"}
            hint={tok.token_extensions?.length ? `Ext: ${tok.token_extensions.length}` : ""}
          />
        </div>
      </section>

      {/* ─── 5. HOLDER PROFILE ────────────────────────────────────── */}
      <section className="wrap" style={{ padding: "0 24px", marginBottom: 16 }}>
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
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)" }}>
              {activeHolders
                ? `${(() => {
                    const a = activeHolders as any;
                    const n = a.count ?? a.holder_count;
                    if (typeof n !== "number") return "—";
                    // the API samples at most 5,000 holders → at the cap say "5,000+", not "5,000"
                    return `${n.toLocaleString("en-US")}${n >= 5000 && (typeof a.sampled !== "number" || n >= a.sampled) ? "+" : ""}`;
                  })()} holders${
                    topHolders[0] && pctOf(topHolders[0]) !== null
                      ? ` · top1 ${pctOf(topHolders[0])!.toFixed(1)}%`
                      : ""
                  }`
                : "partial / on demand"}
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
                <th style={{ padding: "8px 18px", textAlign: "right", width: 80 }}>Share</th>
              </tr>
            </thead>
            <tbody>
              {topHolders.length > 0 ? (
                topHolders.map((h, idx) => {
                  const addr = h.wallet || h.address || "";
                  const p = pctOf(h);
                  return (
                    <tr
                      key={addr || idx}
                      style={{
                        background:
                          idx % 2 === 1
                            ? "color-mix(in oklch, var(--fg-1) 4%, transparent)"
                            : "transparent",
                      }}
                    >
                      <td style={{ padding: "6px 18px", color: "var(--fg-3)" }}>{idx + 1}</td>
                      <td style={{ padding: "6px 8px", color: "var(--fg-1)" }}>
                        {addr ? truncate(addr) : "—"}
                      </td>
                      <td
                        style={{
                          padding: "6px 18px",
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {p !== null ? `${p.toFixed(1)}%` : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ color: "var(--fg-3)" }}>
                  <td colSpan={3} style={{ padding: "12px 18px" }}>
                    Holder data not available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 6. EXTERNAL EXPLORERS ────────────────────────────────── */}
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
            { label: "Birdeye", href: `https://birdeye.so/token/${mint}?chain=solana` },
            { label: "DexScreener", href: `https://dexscreener.com/solana/${mint}` },
            { label: "Solscan", href: `https://solscan.io/token/${mint}` },
            { label: "RugCheck", href: `https://rugcheck.xyz/tokens/${mint}` },
            { label: "Phantom", href: `https://phantom.app/tokens/solana/${mint}` },
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
    </>,
  );
}
