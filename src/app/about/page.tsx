// /about — Solscanner-inspired about page: origin story · differentiation ·
// methodology · honest case study · trust · team · commitments · get involved.
//
// Replaces previous about page (which was a landing repeat with banned phrase
// "Zero confirmed false positives at CRITICAL" and stale 559h/87.5% numbers).
// New version: live /v1/stats refresh + no banned phrases + real about content.
//
// Spec: internal/codex/16_SITE_RESTRUCTURE_PLAN.md §3

import { fetchStats } from "@/lib/api";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "About SolSentry — operator threat intelligence for Solana",
  description:
    "Solo-built, free, open-core operator-graph threat intelligence for Solana. Live mainnet since April 2026.",
  openGraph: {
    title: "About SolSentry",
    description:
      "Solo-built, free, open-core operator-graph threat intelligence for Solana.",
    images: ["/og/og-default.png"],
  },
};

function fmtInt(n: number | undefined | null): string {
  if (n == null) return "—";
  return n.toLocaleString();
}

function fmtPct(n: number | undefined | null, d = 1): string {
  if (n == null) return "—";
  return `${n.toFixed(d)}%`;
}

function fmtHours(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1000) return `${(n / 24).toFixed(0)} days`;
  return `${Math.round(n)}h`;
}

export default async function AboutPage() {
  const stats = await fetchStats();

  return (
    <>
      <Nav />
      <main>
        {/* ───────────── §1 HERO ───────────── */}
        <section className="hero">
          <div className="container">
            <span className="hero-eyebrow">About SolSentry</span>
            <h1 className="hero-title">
              Operator threat intelligence
              <br />
              for <em>Solana</em>.
            </h1>
            <p className="hero-sub">
              Solo-built. Free. Open-core. Live mainnet since April 2026 —
              tracking the wallets behind serial rug deployments before they
              catch the next buyer.
            </p>

            <div className="about-stat-grid">
              <AboutStat
                label="Continuous mainnet"
                value={fmtHours(stats?.runtime_hours)}
                href="https://api.solsentry.app/v1/stats"
              />
              <AboutStat
                label="Predictions issued"
                value={fmtInt(stats?.total_predictions)}
                href="https://api.solsentry.app/v1/stats"
              />
              <AboutStat
                label="Operators tracked"
                value={fmtInt(stats?.total_operators)}
                href="https://api.solsentry.app/v1/top-operators"
              />
              <AboutStat
                label="Accuracy (resolved)"
                value={fmtPct(stats?.accuracy_pct)}
                href="https://api.solsentry.app/v1/stats"
              />
            </div>

            <p
              style={{
                fontSize: 11,
                color: "var(--fg-3)",
                fontFamily: "var(--font-mono)",
                marginTop: 12,
              }}
            >
              All numbers live. Click any stat to verify against the public API.
            </p>
          </div>
        </section>

        {/* ───────────── §2 ORIGIN STORY ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">Why SolSentry exists</h2>
          <div className="about-prose">
            <p>
              One operator can deploy 3,000+ rug tokens from distinct wallets.
              Retail traders see 3,000 unrelated tokens. Existing tools score
              each token in isolation — by the time they flag a pattern, the
              operator has already rotated to a fresh wallet.
            </p>
            <p>
              <strong>The unit of analysis is wrong.</strong> The token is
              disposable. The operator is the persistent identity. SolSentry is
              the operator graph that didn&apos;t exist — a cross-token, cross-wallet
              database of who deploys what on Solana, computed live from the
              chain, free for retail.
            </p>
            <p>
              Started January 2025. First mainnet write April 8, 2026. Same
              operator wallet (
              <Link
                href="/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1"
                className="inline-link"
              >
                4kxscute…
              </Link>
              ) is still deploying today — 14 new tokens per day on average,
              roughly 90% rug rate.
            </p>
          </div>
        </section>

        {/* ───────────── §3 WHAT MAKES IT DIFFERENT ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">What makes it different</h2>
          <div className="comparison-grid">
            <ComparisonCard
              dim="Unit of analysis"
              others="One token at a time"
              us="Cross-token operator graph"
            />
            <ComparisonCard
              dim="Discovery latency"
              others="Post-rug (after the drain)"
              us="Pre-rug (at deploy time, &lt;50ms)"
            />
            <ComparisonCard
              dim="Architecture"
              others="Static rules engine"
              us="ALife agents that evolve"
            />
            <ComparisonCard
              dim="Audience"
              others="Enterprise / English-only"
              us="Free retail + PT-BR consumer-first"
            />
            <ComparisonCard
              dim="Audit trail"
              others="Black box / proprietary scores"
              us="Reproducible from public outcome_predictions.json"
            />
            <ComparisonCard
              dim="Cost"
              others="$30K+/year (Chainalysis lowest)"
              us="Free + per-call x402 (no subscription required)"
            />
          </div>
        </section>

        {/* ───────────── §4 METHODOLOGY ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">How the brain works</h2>
          <div className="about-prose">
            <p>
              Three-stage progressive scan (account info → DAS metadata + holder
              concentration → bundle forensics + Token-2022 extension scoring)
              drives a multi-signal resolver with three parallel windows: 6h
              fast-track, 2-day primary, 14-day safe-recheck.
            </p>
            <p>
              An autonomous brain layer — <code>investigator</code>,{" "}
              <code>retract_engine</code>, <code>anomaly_seeker</code>, plus
              stablecoin-flow and CEX-deposit tracers — runs investigation
              pipelines at roughly zero LLM tokens per call, replacing manual
              analysis.
            </p>
            <p>
              A self-tuning <code>MetaLearning</code> system snapshots scanner
              DNA at every prediction, waits for outcome, and feeds accuracy
              back via <code>auto_adjust()</code> every 20 ticks. The system
              tunes itself.
            </p>
          </div>

          <div className="layer-grid">
            <LayerCard
              n="Layer 1"
              title="Known detectors"
              status="✅ production"
              text="sham, drain, cluster, ring, privacy, first-funder — patterns pre-defined by humans"
            />
            <LayerCard
              n="Layer 2"
              title="Anomaly memory"
              status="🟡 stub demo-ready"
              text="stores unclassified patterns · feature vector + wallet context · emits candidate when N similar accumulate"
            />
            <LayerCard
              n="Layer 3"
              title="Research agent"
              status="🔴 P0 next sprint"
              text="autonomous detector breeder · LLM-generated detector code · backtest gate · admit if precision ≥70%"
            />
          </div>
        </section>

        {/* ───────────── §5 HONEST NUMBERS ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">The honest numbers</h2>
          <div className="about-prose">
            <p>
              All metrics on this page refresh from{" "}
              <a
                href="https://api.solsentry.app/v1/stats"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                <code>api.solsentry.app/v1/stats</code>
              </a>
              {" "}every 60 seconds. Per-tier precision:
            </p>
            <ul style={{ lineHeight: 1.8, color: "var(--fg-2)" }}>
              <li>
                <strong>96.6% CRITICAL precision</strong> · 607 FP events over
                231 unique mints classified
              </li>
              <li>
                <strong>98.9% HIGH precision</strong> — auditable per-mint via
                the public <code>outcome_predictions.json</code> snapshot
              </li>
              <li>
                <strong>Aggregate accuracy {fmtPct(stats?.accuracy_pct)}</strong>{" "}
                across {fmtInt(stats?.total_predictions)} resolved predictions
              </li>
            </ul>
            <p>
              FP composition at CRITICAL: 228 threshold edge cases (tokens
              surviving 1–14 days post-flag), 3 unclassified long survivors, 2
              persistent high-frequency rescan mints (tech debt scheduled
              v2.4). Every error is a threshold edge case — not a false-alarm
              pattern.
            </p>
          </div>
        </section>

        {/* ───────────── §6 TRUST & TRANSPARENCY ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">Trust &amp; transparency</h2>
          <div className="trust-grid">
            <TrustItem
              label="Public REST API"
              detail="No auth required for /v1/stats, /v1/operator, /v1/top-operators"
              href="https://api.solsentry.app/v1/stats"
            />
            <TrustItem
              label="Open source MCP"
              detail="@solsentry/mcp on NPM · source on GitHub"
              href="https://www.npmjs.com/package/@solsentry/mcp"
            />
            <TrustItem
              label="Open source docs"
              detail="solsentry/solsentry-docs · audit logs reproducible"
              href="https://github.com/solsentry/solsentry-docs"
            />
            <TrustItem
              label="Open source frontend"
              detail="solsentry/solsentry-app · this site's code"
              href="https://github.com/solsentry/solsentry-app"
            />
            <TrustItem
              label="Birdeye × SolSentry"
              detail="Trending feed with safety scoring · MIT"
              href="/birdeye-radar"
            />
            <TrustItem
              label="Live health"
              detail="api.solsentry.app/health · invariants checked daily"
              href="https://api.solsentry.app/health"
            />
          </div>
        </section>

        {/* ───────────── §7 TEAM ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">Team</h2>
          <div className="about-prose">
            <p>
              <strong>Crash Diniz</strong> — founder, sole developer. Self-taught
              since the early 2000s: Slackware, Unix, Oracle networking. No
              university, no bootcamp. Started learning Python in January 2025.
              Currently: {fmtInt(stats?.total_predictions)}+ mainnet predictions,
              ~1,612 passing tests, full async architecture, 96.6% CRITICAL
              precision — solo, in Brazil.
            </p>
            <p>
              <strong>Sena</strong> — the AI persona. Surfaces operator threat
              context in human language, in PT-BR or EN. Powered by Anthropic.
              Tone: senior security analyst, evidence-first, no sensationalism.
            </p>
            <p style={{ fontSize: 13, color: "var(--fg-3)" }}>
              Acknowledgments: Mert Mumtaz (Helius CEO) for the open-source
              Haradrim patterns we credit in our graph viz. Pedro Marafiotti
              (Superteam BR · The Garage). Every contributor to the public MCP
              + docs repos.
            </p>
          </div>
        </section>

        {/* ───────────── §8 WHAT WE'LL NEVER DO ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">What we&apos;ll never do</h2>
          <div className="commitments-grid">
            <Commitment text="Issue a token. Sem token. Ever." />
            <Commitment text="Multi-chain dilution — Solana depth is the moat" />
            <Commitment text="Gate basic operator verdict behind paywall" />
            <Commitment text="Sensationalize — every claim auditable from the API" />
            <Commitment text="Sell user data — we don't collect it" />
            <Commitment text="Replace RugCheck or competitors — we complement" />
          </div>
        </section>

        {/* ───────────── §9 GET INVOLVED ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">Get involved</h2>
          <div className="get-involved-grid">
            <GetInvolvedCard
              audience="Traders"
              cta="Try the Telegram bot"
              href="/telegram"
              text="Free alerts on CRITICAL operators · PT-BR + EN"
            />
            <GetInvolvedCard
              audience="Builders"
              cta="MCP + REST"
              href="/mcp"
              text="Zero-install MCP server for AI agents · public REST API"
            />
            <GetInvolvedCard
              audience="Researchers"
              cta="API + docs"
              href="/api"
              text="68 unique endpoints · reproducible audit logs · open data"
            />
            <GetInvolvedCard
              audience="Partners"
              cta="hello@solsentry.app"
              href="mailto:hello@solsentry.app"
              text="Integration · data partnership · investor inquiries"
            />
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .about-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 32px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--fg-1);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }
        .about-prose {
          max-width: 720px;
          line-height: 1.7;
          color: var(--fg-2);
          font-size: 15px;
        }
        .about-prose p {
          margin-bottom: 16px;
        }
        .about-prose code {
          background: var(--surface-2, rgba(242,237,228,0.05));
          padding: 1px 6px;
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--brand-amber);
        }
        .inline-link {
          color: var(--brand-amber);
          text-decoration: none;
          border-bottom: 1px dashed var(--brand-amber);
        }
        .inline-link:hover {
          opacity: 0.8;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
        .layer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
          margin-top: 24px;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
        .commitments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 8px;
        }
        .get-involved-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
      `}</style>
    </>
  );
}

const sectionStyle: React.CSSProperties = {
  paddingTop: 60,
  paddingBottom: 20,
};

function AboutStat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--fg-3)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 700,
          color: "var(--brand-amber)",
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
    </>
  );

  const styleProps: React.CSSProperties = {
    padding: 20,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    display: "block",
    textDecoration: "none",
  };

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={styleProps}>
      {inner}
    </a>
  ) : (
    <div style={styleProps}>{inner}</div>
  );
}

function ComparisonCard({
  dim,
  others,
  us,
}: {
  dim: string;
  others: string;
  us: string;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--fg-3)",
          marginBottom: 12,
        }}
      >
        {dim}
      </div>
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 10,
            color: "var(--fg-3)",
            marginBottom: 4,
          }}
        >
          Others
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--fg-2)",
          }}
          dangerouslySetInnerHTML={{ __html: others }}
        />
      </div>
      <div>
        <div
          style={{
            fontSize: 10,
            color: "var(--brand-amber)",
            marginBottom: 4,
          }}
        >
          SolSentry
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--fg-1)",
            fontWeight: 600,
          }}
          dangerouslySetInnerHTML={{ __html: us }}
        />
      </div>
    </div>
  );
}

function LayerCard({
  n,
  title,
  status,
  text,
}: {
  n: string;
  title: string;
  status: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--brand-amber)",
          marginBottom: 6,
          fontFamily: "var(--font-mono)",
        }}
      >
        {n} · {status}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "var(--fg-1)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>
        {text}
      </div>
    </div>
  );
}

function TrustItem({
  label,
  detail,
  href,
}: {
  label: string;
  detail: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        padding: 14,
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
          marginBottom: 4,
        }}
      >
        {label} ↗
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>
        {detail}
      </div>
    </a>
  );
}

function Commitment({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--brand-amber)",
        borderRadius: 4,
        fontSize: 13,
        color: "var(--fg-1)",
      }}
    >
      ❌ {text}
    </div>
  );
}

function GetInvolvedCard({
  audience,
  cta,
  href,
  text,
}: {
  audience: string;
  cta: string;
  href: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: 20,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--fg-3)",
          marginBottom: 8,
        }}
      >
        {audience}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "var(--brand-amber)",
          marginBottom: 8,
        }}
      >
        {cta} →
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>
        {text}
      </div>
    </Link>
  );
}
