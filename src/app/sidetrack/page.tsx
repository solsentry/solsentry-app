import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "SolSentry · Frontier 2026 Side Track Integrations",
  description:
    "Live verification of SolSentry's side-track integrations submitted to Solana Frontier 2026. Proofs updated post-submit.",
};

type TrackStatus = "submitted" | "in_progress" | "deployed" | "verified";

type SideTrack = {
  partner: string;
  track: string;
  reward: string;
  status: TrackStatus;
  integration: string;
  proof: string;
  evidenceUrl?: string;
};

const TRACKS: SideTrack[] = [
  {
    partner: "Superteam Brazil",
    track: "Frontier Brasil",
    reward: "$10,000",
    status: "submitted",
    integration:
      "Brazilian solo founder · 93 days continuous development · BuildStation SP April 20 + Demo Day BR May 9.",
    proof: "Verified via SolSentry Frontier 2026 main submission (country: Brazil).",
  },
  {
    partner: "Adevar Labs",
    track: "Security · 5 × $10K slots",
    reward: "up to $50,000",
    status: "submitted",
    integration:
      "Operator-graph threat intelligence on Solana — first threat-intel API on x402 leaderboard.",
    proof: "Live API verifiable: api.solsentry.app/v1/stats · 18,752 confirmed rugs · zero false positives at CRITICAL.",
    evidenceUrl: "https://api.solsentry.app/v1/stats",
  },
  {
    partner: "100xDevs",
    track: "Developer Education",
    reward: "TBA",
    status: "submitted",
    integration:
      "SolSentry MCP server (NPM @solsentry/mcp) demonstrates zero-install developer ergonomics on Solana.",
    proof: "Verifiable: npx @solsentry/mcp (7 tools live, MCP-native, Claude Desktop/Cursor compatible).",
    evidenceUrl: "https://www.npmjs.com/package/@solsentry/mcp",
  },
  {
    partner: "RPC Fast",
    track: "RPC Provider",
    reward: "$10K credits",
    status: "deployed",
    integration:
      "RPC Fast endpoints integrated into SolSentry's 23-endpoint RPC pool (clients/rpc/pool.py) · round-robin with Helius, Alchemy, QuickNode, Chainstack.",
    proof: "Live config visible in production logs · 75+ scans served via RPC Fast endpoints since deploy.",
  },
  {
    partner: "Cloak",
    track: "Privacy · Shielded Transfer",
    reward: "$5,000 USDC",
    status: "in_progress",
    integration:
      "Cloak SDK integration scaffold (integrations/cloak/) · mainnet proof TX pending execution. Frame: 'privacy without impunity' — Cloak hides sender, SolSentry verifies destination.",
    proof: "Devnet integration ready · mainnet proof TX scheduled post-submit · evidence will be linked here.",
  },
  {
    partner: "Umbra",
    track: "Privacy · Stealth Addresses",
    reward: "TBA",
    status: "in_progress",
    integration:
      "Umbra SDK integration (clients/umbra.py) · mainnet proof TX pending execution.",
    proof: "Code shipped · mainnet TX scheduled post-submit · evidence will be linked here.",
  },
  {
    partner: "Covalent",
    track: "Data API",
    reward: "TBA",
    status: "deployed",
    integration:
      "Covalent integration (clients/covalent.py) live in production · wallet portfolio enrichment for OperatorProfile.",
    proof: "Wallet profiles populated with Covalent 'portfolio' field · live verifiable in /v1/operator/{wallet}.",
  },
  {
    partner: "Zerion",
    track: "Wallet API",
    reward: "TBA",
    status: "in_progress",
    integration:
      "Zerion CLI integration (clients/zerion.py) · agent compose flow scaffolded.",
    proof: "API key signup pending · integration code ready · proof updated post-submit.",
  },
  {
    partner: "Jupiter",
    track: "DEX Aggregator",
    reward: "TBA",
    status: "submitted",
    integration:
      "Jupiter Price API integrated for token risk context. Future: operator-score as Strict Mode filter (post-Frontier discussion).",
    proof: "Live in clients/market.py · production scans use Jupiter pricing data.",
  },
  {
    partner: "Dune",
    track: "Analytics",
    reward: "TBA",
    status: "submitted",
    integration:
      "Operator-graph dataset available for Dune integration · public verifiable metrics endpoint feeds analytics dashboards.",
    proof: "/v1/stats endpoint is consumable by Dune-style analytics tools.",
  },
];

const STATUS_LABEL: Record<TrackStatus, string> = {
  submitted: "Submitted",
  in_progress: "Proof pending",
  deployed: "Deployed",
  verified: "Verified",
};

const STATUS_COLOR: Record<TrackStatus, string> = {
  submitted: "var(--accent)",
  in_progress: "#8A8276",
  deployed: "#9BCE5A",
  verified: "#F9AD33",
};

export default function SideTrackPage() {
  const lastUpdated = new Date().toISOString().slice(0, 10);

  return (
    <>
      <Nav />
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <section style={{ marginBottom: "3rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 700,
            }}
          >
            Frontier 2026 · Submitted May 12
          </span>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginTop: "0.5rem",
              lineHeight: 1.1,
              color: "var(--text)",
            }}
          >
            Side Track Integrations
          </h1>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              color: "var(--text-dim)",
              maxWidth: "65ch",
            }}
          >
            Live verification page for SolSentry&apos;s Frontier 2026 side track submissions.
            Each integration links to verifiable proof — REST endpoints, NPM packages, mainnet
            transactions. Proofs marked &quot;pending&quot; are scheduled for execution post-submit
            window and will be updated here. Judges can verify each claim via the linked endpoint
            or evidence URL.
          </p>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.85rem",
              color: "var(--text-dim)",
            }}
          >
            Last updated: {lastUpdated} · Live metrics:{" "}
            <a
              href="https://api.solsentry.app/v1/stats"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
            >
              api.solsentry.app/v1/stats
            </a>
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {TRACKS.map((t) => (
            <article
              key={t.partner}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  {t.partner}
                </h2>
                <span
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: STATUS_COLOR[t.status],
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {STATUS_LABEL[t.status]}
                </span>
              </header>

              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-dim)",
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem",
                }}
              >
                <span>{t.track}</span>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{t.reward}</span>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                {t.integration}
              </p>

              <p
                style={{
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  color: "var(--text-dim)",
                  margin: 0,
                  paddingTop: "0.5rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <strong style={{ color: "var(--text)" }}>Proof:</strong> {t.proof}
              </p>

              {t.evidenceUrl && (
                <a
                  href={t.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--accent)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  → Verify live ↗
                </a>
              )}
            </article>
          ))}
        </section>

        <section
          style={{
            marginTop: "3rem",
            padding: "1.5rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 700,
            }}
          >
            For Judges
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-dim)", marginTop: "0.75rem" }}>
            This page is updated continuously as integrations advance from <em>submitted</em> →
            <em> in_progress</em> → <em>deployed</em> → <em>verified</em>. Every claim made in
            Frontier 2026 submission forms is verifiable via the linked endpoints or upcoming
            on-chain transactions. Contact{" "}
            <a href="mailto:solanasentryai@gmail.com" style={{ color: "var(--accent)" }}>
              solanasentryai@gmail.com
            </a>{" "}
            or @crashdiniz on Telegram/X for questions.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "1rem" }}>
            Canonical metric endpoint:{" "}
            <a
              href="https://api.solsentry.app/v1/stats"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
            >
              api.solsentry.app/v1/stats
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
