"use client";

import { WatchlistPanel } from "@/components/WatchlistPanel";
import { WatchlistEventsFeed } from "@/components/WatchlistEventsFeed";

export function MyRadarClient() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">My Radar</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Tracked operators and tokens
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage saved profiles and review recent SolSentry alerts in one place.
        </p>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.75fr)]">
        <WatchlistPanel />
        <WatchlistEventsFeed />
      </div>
    </main>
  );
}
