import { OperatorsTable } from "@/components/operators-table";
import { LiveFeedLive } from "@/components/LiveFeedLive";
import { AISuggestionsCard } from "@/components/AISuggestionsCard";
import type { Operator, RiskLevel } from "@/lib/mock-data";
import { fetchTopOperators, type TopOperator } from "@/lib/api";

/* Dashboard v3 — first real-data mount of an integrated v0 component.
 * The existing /dashboard (v2) is untouched. TopOperatorsTable here is fed by
 * the live /v1/top-operators endpoint instead of mock-data.
 *
 * Honest data note: /v1/top-operators carries rank, wallet, rug_rate, rugs,
 * tokens, risk_label, tags — but NOT sns, last-active, or 7-day history. Those
 * fields are filled with null/now/flat-line placeholders below until endpoints
 * expose them. */

function mapOperator(o: TopOperator, i: number): Operator {
  const rugRate = o.rug_rate_pct ?? 0;
  const riskLevel: RiskLevel = rugRate >= 90 ? "CRITICAL" : rugRate >= 70 ? "HIGH" : "MEDIUM";
  return {
    rank: o.rank ?? i + 1,
    wallet: o.wallet,
    sns: null,
    riskLevel,
    rugRate,
    rugs: o.confirmed_rugs ?? 0,
    tokensDeployed: o.total_tokens ?? 0,
    lastActive: new Date(), // endpoint has no last-active; placeholder
    rugHistory: Array(7).fill(0), // endpoint has no 7d history; flat placeholder
    tags: o.tags ?? [],
    avatarUrl: null,
  };
}

export default async function DashboardV3Page() {
  const top = await fetchTopOperators(50);
  const operators = top.map(mapOperator);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="h2">Top Operators</h1>
          <p className="p-small">
            Live from <code>/v1/top-operators</code>
            {operators.length === 0
              ? " — no data (API unreachable at render)"
              : ` — ${operators.length} operators`}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <OperatorsTable operators={operators} />
          <div className="space-y-4">
            <div>
              <h2 className="label-brand mb-3">AI Suggestions</h2>
              <AISuggestionsCard loggedIn={false} />
            </div>
            <div>
              <h2 className="label-brand mb-3">Live feed</h2>
              <LiveFeedLive />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
