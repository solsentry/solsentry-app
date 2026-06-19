import { LiveFeed } from "@/components/live-feed";
import { DailyIntelCardDemo } from "@/components/daily-intel-card";
import { OperatorsTable } from "@/components/operators-table";
import { BotClusterSunburst } from "@/components/bot-cluster-sunburst";
import { DrainOfTheDay } from "@/components/drain-of-the-day";
import { SmartMoneyPanel } from "@/components/smart-money-panel";
import WatchlistPanel from "@/components/WatchlistPanel";

export const metadata = {
  title: "Components lab",
  robots: { index: false, follow: false },
};

function Lab({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-6">
      <h2 className="label-brand mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentsLabPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <h1 className="h2">v0 components — on-brand integration lab</h1>
        <Lab title="04 · TopOperatorsTable">
          <OperatorsTable />
        </Lab>
        <Lab title="02 · LiveFeed">
          <LiveFeed />
        </Lab>
        <Lab title="03 · AIDailySummary">
          <DailyIntelCardDemo />
        </Lab>
        <Lab title="05 · ClusterSunburst">
          <BotClusterSunburst />
        </Lab>
        <Lab title="06 · FeaturedDrain">
          <DrainOfTheDay />
        </Lab>
        <Lab title="08 · KOLPanel / SmartMoney">
          <SmartMoneyPanel />
        </Lab>
        <Lab title="09 · WatchlistPanel">
          <div className="max-w-sm">
            <WatchlistPanel />
          </div>
        </Lab>
      </div>
    </div>
  );
}
