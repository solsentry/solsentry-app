import { OperatorsTable } from "@/components/operators-table";
import { LiveFeedLive } from "@/components/LiveFeedLive";
import { AISuggestionsCard } from "@/components/AISuggestionsCard";
import { mockOperators } from "@/lib/mock-data";
export const metadata = {
  title: "Dashboard v3 lab",
  robots: { index: false, follow: false },
};

/* Dashboard v3 — first real-data mount of an integrated v0 component.
 * The existing /dashboard (v2) is untouched. TopOperatorsTable here is fed by
 * the live /v1/top-operators endpoint instead of mock-data.
 *
 * Honest data note: /v1/top-operators carries rank, wallet, rug_rate, rugs,
 * tokens, risk_label, tags — but NOT sns, last-active, or 7-day history. Those
 * fields are filled with null/now/flat-line placeholders below until endpoints
 * expose them. */

export default async function DashboardV3Page() {
  const operators = mockOperators;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="h2">Top Operators</h1>
          <p className="p-small">
            Mocked data preview
            {operators.length === 0
              ? " — no data"
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
