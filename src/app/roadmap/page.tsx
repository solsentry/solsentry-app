import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Roadmap — public, versioned, opinionated",
  description:
    "What shipped, what's next, and what we will not build. Public roadmap, updated weekly. Feedback welcome at hello@solsentry.app.",
};

type Status = "shipped" | "in-progress" | "next" | "later" | "wont-build";

interface Item {
  title: string;
  status: Status;
  note?: string;
}

const GROUPS: { phase: string; subtitle: string; items: Item[] }[] = [
  {
    phase: "Phase 1 — Foundation",
    subtitle: "Apr 9–20 · Shipped before Colosseum BuildStation SP",
    items: [
      { title: "Autonomous scanner loop on mainnet", status: "shipped" },
      { title: "Operator profile persistence", status: "shipped" },
      { title: "Telegram bot — 32 commands", status: "shipped" },
      {
        title: "4-stage scan pipeline (fast → deep → forensic → enrich)",
        status: "shipped",
      },
      { title: "AI explainer (PT-BR, EN)", status: "shipped" },
      { title: "ALife hunter agents with DNA", status: "shipped" },
      { title: "Outcome resolver (H6, 2d, 14d windows)", status: "shipped" },
      { title: "240h continuous mainnet runtime", status: "shipped" },
    ],
  },
  {
    phase: "Phase 2 — Public surface",
    subtitle: "Apr 21–May 9 · We are here",
    items: [
      { title: "REST API public (11 endpoints)", status: "shipped" },
      { title: "Health + invariants endpoint", status: "shipped" },
      { title: "MCP server published (@solsentry/mcp)", status: "shipped" },
      { title: "Drain tracer REST (/v1/drain-trace)", status: "shipped" },
      { title: "Dashboard v2 (12 panels)", status: "shipped" },
      {
        title: "solsentry.app landing + full site",
        status: "in-progress",
        note: "You are reading it.",
      },
      { title: "Self-check /me (wallet lookup)", status: "shipped" },
      { title: "Watchlist + Labels (local)", status: "shipped" },
      {
        title: "Glossary, Compare, Roadmap, Partners pages",
        status: "shipped",
      },
    ],
  },
  {
    phase: "Phase 3 — Colosseum submission",
    subtitle: "May 5–9 · Final push",
    items: [
      { title: "Pitch video (3 min)", status: "next" },
      { title: "Technical demo video", status: "next" },
      { title: "Final submission write-up", status: "next" },
      { title: "Submission metrics refresh from live VPS", status: "next" },
    ],
  },
  {
    phase: "Phase 4 — Post-Colosseum",
    subtitle: "May 10+",
    items: [
      {
        title: "LLM-backed /ask endpoint (real intent routing)",
        status: "later",
      },
      { title: "x402 gating on premium MCP tools", status: "later" },
      {
        title: "Contract-analysis endpoint (/v1/contract-analysis/{program})",
        status: "later",
      },
      { title: "Webhooks (push alerts to partner URLs)", status: "later" },
      { title: "Operator change-stream (SSE live feed)", status: "later" },
      { title: "Community scam reporting + curation layer", status: "later" },
      {
        title: "Drain-trace pricing tier (victim: free; others: paid)",
        status: "later",
      },
    ],
  },
  {
    phase: "Things we won't build",
    subtitle: "Because they are already well-served elsewhere",
    items: [
      {
        title: "Cross-chain tracking — use Range or Chainalysis",
        status: "wont-build",
      },
      {
        title: "Portfolio tracking — use Nansen, Zerion, DeBank",
        status: "wont-build",
      },
      {
        title: "Wallet app — we stay infrastructure-layer",
        status: "wont-build",
      },
      {
        title: "Smart-money trader copying — Nansen owns this",
        status: "wont-build",
      },
      {
        title: "Generic contract auditor — use Sec3, OtterSec, Neodyme",
        status: "wont-build",
      },
    ],
  },
];

const STATUS_STYLE: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  shipped: {
    label: "shipped",
    color: "var(--brand-teal)",
    bg: "rgba(0,201,167,0.1)",
  },
  "in-progress": {
    label: "in progress",
    color: "var(--brand-orange)",
    bg: "rgba(255,107,0,0.1)",
  },
  next: {
    label: "next",
    color: "var(--status-warning)",
    bg: "rgba(255,176,32,0.1)",
  },
  later: { label: "later", color: "var(--fg-3)", bg: "var(--surface-2)" },
  "wont-build": {
    label: "won't build",
    color: "var(--fg-4)",
    bg: "transparent",
  },
};

export default function RoadmapPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Public roadmap · updated weekly"
          title={
            <>
              What shipped,
              <br />
              what&rsquo;s{" "}
              <span style={{ color: "var(--brand-orange)" }}>next</span>.
            </>
          }
          sub="The roadmap below is opinionated — it lists what we are building, what we are not, and why. The 'won't build' section is intentional: SolSentry is infrastructure, not a consumer app. Feedback welcome."
        >
          <div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
          >
            <a
              href="mailto:hello@solsentry.app?subject=SolSentry%20roadmap%20feedback"
              className="btn-primary"
            >
              Send feedback →
            </a>
            <a
              href="https://github.com/solsentry"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              GitHub
            </a>
          </div>
        </PageHeader>

        {GROUPS.map((g) => (
          <Section key={g.phase} eyebrow={g.subtitle} title={g.phase}>
            <div className="panel" style={{ padding: 0 }}>
              {g.items.map((item, i) => {
                const st = STATUS_STYLE[item.status];
                return (
                  <div
                    key={item.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr",
                      gap: 16,
                      padding: "16px 24px",
                      borderBottom:
                        i === g.items.length - 1
                          ? "none"
                          : "1px solid var(--border-soft)",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: st.color,
                        background: st.bg,
                        border: `1px solid ${st.color}`,
                        padding: "4px 10px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        textAlign: "center",
                        alignSelf: "start",
                        justifySelf: "start",
                      }}
                    >
                      {st.label}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          color: "var(--fg-1)",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.title}
                      </div>
                      {item.note && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--fg-3)",
                            marginTop: 4,
                            fontStyle: "italic",
                          }}
                        >
                          {item.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        ))}
      </main>
      <Footer />
    </>
  );
}
