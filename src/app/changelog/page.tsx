// /changelog — public build history, grouped by month, newest first.
// Content source: internal/marketing/social/CHANGELOG_PUBLIC.md (curated, gate-checked).
// Items marked (deploy-confirm) are OMITTED until Crash gives the go.
// [verify live] stat = fetched client-side from /v1/stats via CriticalPrecisionStat.

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { fetchStats } from "@/lib/api";

export const metadata = {
  title: "SolSentry — Changelog",
  description:
    "SolSentry build history: operator graph, ALife brain, public API, classifier improvements, and more — since day one (February 2026).",
  openGraph: {
    title: "SolSentry — Changelog",
    description:
      "Build history of the Solana operator threat intelligence platform. Free API, MCP server, ALife agents — auditable per-mint.",
    images: ["/og/og-default.png"],
  },
};

// NOTE: no noindex — this page is intentionally public and indexable.

export const revalidate = 60;

export default async function ChangelogPage() {
  // Server-render the precision figure (no client "…%" flash on this CTA page).
  const stats = await fetchStats();
  const criticalPct =
    stats?.critical_precision_pct != null ? `${stats.critical_precision_pct.toFixed(1)}%` : "—";
  return (
    <>
      <SiteTopbar />
      <main>
        {/* ───────────── BANNER ───────────── */}
        <div
          style={{
            background: "var(--brand-amber-tint)",
            borderBottom: "1px solid var(--brand-amber-line)",
            padding: "10px 0",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--brand-amber-400)",
              letterSpacing: 0.3,
            }}
          >
            Open beta opens July 2026.
          </span>
        </div>

        {/* ───────────── HERO ───────────── */}
        <section className="hero">
          <div className="container">
            <span className="hero-eyebrow">Changelog</span>
            <h1 className="hero-title">
              What shipped —
              <br />
              since <em>day one</em>.
            </h1>
            <p className="hero-sub">
              Every significant build milestone, from the first public commit (Feb 8, 2026) to
              today. Data-first, no hype. All accuracy claims auditable at{" "}
              <a
                href="https://api.solsentry.app/v1/stats"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--brand-amber)",
                  textDecoration: "none",
                  borderBottom: "1px dashed var(--brand-amber)",
                }}
              >
                /v1/stats
              </a>
              .
            </p>
          </div>
        </section>

        {/* ───────────── CHANGELOG ENTRIES ───────────── */}
        <section className="container" style={{ paddingBottom: 40 }}>
          <div className="changelog-timeline">

            {/* ── June 2026 ── */}
            <div className="changelog-month">
              <div className="changelog-month-label">June 2026</div>
              <div className="changelog-month-title">Hardening, low-latency layer &amp; launch prep</div>
              <ul className="changelog-list">
                <li>
                  <strong>Attribution audit complete.</strong> Full multi-source re-verification of
                  historical dev-wallet attributions, cross-checked across independent on-chain
                  datasets. Honest data over big numbers.
                </li>
                <li>
                  <strong>Classifier self-correction.</strong> Found and fixed a false-positive class
                  (position-NFTs read as tokens); backfilled affected predictions. CRITICAL-tier
                  precision now {criticalPct}, auditable per-mint at{" "}
                  <code>/v1/predictions/&#123;mint&#125;</code>.
                </li>
                <li>
                  <strong>Shadow detectors wired.</strong> Forensic detectors (cashout tracing,
                  CEX-attribution, sybil-evasion patterns) now run in shadow mode — observing, not
                  yet scoring — to validate signal before going live.
                </li>
                <li>
                  <strong>Cost-control &amp; reliability.</strong> Self-detecting waste guardrail (a
                  misconfigured webhook burned credits overnight → velocity gate + event-type filter
                  + daily reconcile). Self-healer fixed to run on schedule. Redis-backed rate
                  limiting + Postgres auth layer landed ahead of launch.
                </li>
                <li>
                  <strong>
                    <code>/v1/contract-analysis</code>
                  </strong>{" "}
                  — program/contract analysis via the API.
                </li>
              </ul>
            </div>

            {/* ── May 2026 ── */}
            <div className="changelog-month">
              <div className="changelog-month-label">May 2026</div>
              <div className="changelog-month-title">
                Case machine, dataset-first architecture &amp; product surface
              </div>
              <ul className="changelog-list">
                <li>
                  <strong>Dataset-first architecture.</strong> Unified waterfall resolver
                  (dataset-first → RPC fallback) + RPC-level cache, cutting repeated on-chain spend
                  on re-queried mints.
                </li>
                <li>
                  <strong>Bidirectional tracer + SNS deep-trace.</strong> Full Solana Name Service
                  ownership graph; multi-hop fund-flow investigator following outflow to its
                  terminus.
                </li>
                <li>
                  <strong>
                    <code>/v1/external-history</code>
                  </strong>{" "}
                  — unified endpoint aggregating transaction history across providers.
                </li>
                <li>
                  <strong>Adversarial monitor + narrative generator.</strong> Autonomous prose from
                  investigation data; 7 alert types; structured-deposit (&quot;smurfing&quot;) cluster
                  detection.
                </li>
                <li>
                  <strong>
                    <code>@solsentry/guard</code> SDK v0
                  </strong>{" "}
                  — pre-signing risk client published to NPM (MIT, examples, CI template).
                </li>
                <li>
                  <strong>Next.js 15 public site MVP</strong> + documentation scaffold.
                </li>
                <li>
                  <strong>Submitted to Colosseum Frontier</strong> (May 12).
                </li>
              </ul>
            </div>

            {/* ── April 2026 ── */}
            <div className="changelog-month">
              <div className="changelog-month-label">April 2026</div>
              <div className="changelog-month-title">
                Operator graph, ALife brain &amp; public API
              </div>
              <ul className="changelog-list">
                <li>
                  <strong>
                    Public API launch + <code>@solsentry/mcp</code> on NPM.
                  </strong>{" "}
                  Free REST API and an MCP server exposing operator risk as a composable primitive.
                  Open-core surface live (MIT SDK, SECURITY policy, public roadmap).
                </li>
                <li>
                  <strong>ALife autonomous brain ships.</strong> Evolutionary agents on live
                  mainnet: signal feedback loop, retraction engine, anomaly seeker, and a
                  self-healer for autonomous data-integrity repair.
                </li>
                <li>
                  <strong>Operator graph + investigation graph.</strong> Operator → token → wallet
                  relationships connected; <code>/v1/graph</code> (named nodes, roles),{" "}
                  <code>/v1/drain-trace/&#123;wallet&#125;</code> fund-flow tracing, ring detector.
                </li>
                <li>
                  <strong>Token-2022 support + launchpad detection.</strong> Native Token-2022
                  handling; 12 launch platforms recognized; King-of-the-Hill pattern detection.
                </li>
                <li>
                  <strong>Multi-window outcome resolution.</strong> 24h / 3d / 7d resolution
                  windows + fast-track; accuracy feedback wired end-to-end. Live accuracy auditable
                  at <code>/v1/stats</code>.
                </li>
              </ul>
            </div>

            {/* ── March 2026 ── */}
            <div className="changelog-month">
              <div className="changelog-month-label">March 2026</div>
              <div className="changelog-month-title">
                Accuracy feedback loop &amp; operator profiling
              </div>
              <ul className="changelog-list">
                <li>
                  <strong>Outcome tracker wired — accuracy feedback loop active.</strong> Resolved
                  predictions feed back into the classifier; first build with a live,
                  self-correcting accuracy metric.
                </li>
                <li>
                  <strong>Hunter auto-scan pipeline.</strong> Automated high-risk detection routed
                  without manual trigger.
                </li>
                <li>
                  <strong>Operator profiling + KOL cross-reference.</strong> Per-wallet context and
                  holder-confidence tiers in scan output; evolutionary feedback persists across
                  restarts.
                </li>
              </ul>
            </div>

            {/* ── February 2026 ── */}
            <div className="changelog-month">
              <div className="changelog-month-label">February 2026</div>
              <div className="changelog-month-title">
                First scanner, agents &amp; on-chain monitoring
              </div>
              <ul className="changelog-list">
                <li>
                  <strong>First public commit</strong> (Feb 8) — token scanner, outcome tracker,
                  baseline intelligence pipeline.
                </li>
                <li>
                  <strong>Autonomous Hunter &amp; Sentinel agents.</strong> Watch for new deploys,
                  large transfers, and liquidity removals; first evolutionary genome module.
                </li>
                <li>
                  <strong>RPC pool with failover</strong> + holder-distribution analysis.
                </li>
                <li>
                  <strong>Known-entities + wallet-alias registry.</strong> Seeded registry of known
                  programs/protocols to suppress false positives and add context;
                  operator-to-alias mapping.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ───────────── CAPABILITY ANCHORS ───────────── */}
        <section
          className="container"
          style={{
            paddingTop: 60,
            paddingBottom: 80,
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--fg-1)",
              marginBottom: 24,
              letterSpacing: "-0.01em",
            }}
          >
            Capability anchors
          </h2>
          <div className="anchors-grid">
            <AnchorCard
              label="Free REST API"
              detail={
                <>
                  No key, no signup.{" "}
                  <code
                    style={{
                      background: "var(--surface-2, rgba(242,237,228,0.05))",
                      padding: "1px 5px",
                      borderRadius: 3,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--brand-amber)",
                    }}
                  >
                    /v1/operator/&#123;wallet&#125;
                  </code>
                  : risk level, confirmed rugs, serial-deployer flag, connected bot clusters.
                  Sub-50ms scan response.
                </>
              }
              href="https://api.solsentry.app/v1/stats"
            />
            <AnchorCard
              label="MCP server"
              detail={
                <>
                  <code
                    style={{
                      background: "var(--surface-2, rgba(242,237,228,0.05))",
                      padding: "1px 5px",
                      borderRadius: 3,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--brand-amber)",
                    }}
                  >
                    @solsentry/mcp
                  </code>{" "}
                  on NPM. Operator risk as a composable primitive.
                </>
              }
              href="https://www.npmjs.com/package/@solsentry/mcp"
            />
            <AnchorCard
              label="Auditable"
              detail={
                <>
                  <code
                    style={{
                      background: "var(--surface-2, rgba(242,237,228,0.05))",
                      padding: "1px 5px",
                      borderRadius: 3,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--brand-amber)",
                    }}
                  >
                    /v1/predictions/&#123;mint&#125;
                  </code>{" "}
                  and{" "}
                  <code
                    style={{
                      background: "var(--surface-2, rgba(242,237,228,0.05))",
                      padding: "1px 5px",
                      borderRadius: 3,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--brand-amber)",
                    }}
                  >
                    /v1/operator/&#123;wallet&#125;
                  </code>{" "}
                  are public. Check any claim.
                </>
              }
              href="https://api.solsentry.app/v1/predictions/So11111111111111111111111111111111111111112"
            />
            <AnchorCard
              label="Open-core"
              detail="Open SDK + MCP + free API; the intelligence engine is proprietary."
              href="https://github.com/solsentry"
            />
          </div>
          <p
            style={{
              marginTop: 32,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--brand-amber-400)",
              fontFamily: "var(--font-mono)",
              letterSpacing: 0.3,
            }}
          >
            Open beta opens July 2026.
          </p>
        </section>
      </main>
      <Footer />

      <style>{`
        .changelog-timeline {
          max-width: 760px;
          padding-top: 48px;
        }
        .changelog-month {
          margin-bottom: 56px;
        }
        .changelog-month-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--brand-amber);
          margin-bottom: 6px;
        }
        .changelog-month-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--fg-1);
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }
        .changelog-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .changelog-list li {
          font-size: 14px;
          line-height: 1.65;
          color: var(--fg-2);
          padding-left: 20px;
          position: relative;
        }
        .changelog-list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--brand-amber);
          font-size: 12px;
          top: 2px;
        }
        .changelog-list code {
          background: var(--surface-2, rgba(242,237,228,0.05));
          padding: 1px 5px;
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--brand-amber);
        }
        .anchors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
      `}</style>
    </>
  );
}

function AnchorCard({
  label,
  detail,
  href,
}: {
  label: string;
  detail: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        padding: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--brand-amber)",
          marginBottom: 6,
        }}
      >
        {label} ↗
      </div>
      <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.55 }}>{detail}</div>
    </a>
  );
}
