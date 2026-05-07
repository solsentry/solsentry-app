import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { AskConsole } from "@/components/AskConsole";

export const metadata = {
  title: "Ask SolSentry — natural language query",
  description:
    "Ask questions in English or Portuguese about Solana operators, bot clusters, and rug deployments. SolSentry translates the query into live API calls and summarizes the answer.",
};

export default function AskPage() {
  return (
    <>
      <main>
        <PageHeader
          eyebrow="Ask SolSentry · natural language"
          title={
            <>
              Type a question.
              <br />
              <span style={{ color: "var(--brand-orange)" }}>
                Get live operator intel back.
              </span>
            </>
          }
          sub={
            <>
              Arkham has Oracle. Dune has DuneAI. Nansen has AI-powered search.
              SolSentry plugs the same interface on top of Solana operator data
              — but with live drain traces, bot cluster memory, and
              outcome-resolved predictions. No query language required.
            </>
          }
        />

        <Section>
          <AskConsole />
        </Section>

        <Section
          eyebrow="How it works"
          title="Question → tool calls → summary"
          sub="Behind the textbox: your question is matched to a set of REST + MCP tools. Calls are chained when the answer depends on cross-referencing (e.g. 'is this operator in a cluster with any known KOL wallets?')."
        >
          <div className="grid-3">
            {[
              {
                t: "1. Intent detection",
                d: "Is the query about a specific wallet? Token? Operator cohort? Drain path? Cluster? The intent picks the tools.",
              },
              {
                t: "2. Tool calls",
                d: "The system hits /v1/operator, /v1/drain-trace, /v1/clusters, /v1/top-operators as needed. Everything is live.",
              },
              {
                t: "3. Grounded summary",
                d: "Results are formatted with real data only — no hallucination. Every claim is traceable back to a specific API response.",
              },
            ].map((c) => (
              <div key={c.t} className="panel">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  {c.t}
                </h3>
                <p
                  style={{
                    color: "var(--fg-2)",
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Roadmap"
          title="What this page becomes"
          sub="The current version ships canned answers mapped to real API calls. The full LLM router is on the post-Colosseum roadmap — same frontend, upgraded backend. Builders who want the raw tool surface can use the MCP server today."
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/mcp" className="btn-primary">
              Use the MCP now →
            </a>
            <a href="/api" className="btn-ghost">
              REST reference
            </a>
            <a href="/roadmap" className="btn-ghost">
              Full roadmap
            </a>
          </div>
        </Section>
      </main>
    </>
  );
}
