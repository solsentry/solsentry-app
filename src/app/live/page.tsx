"use client";

import { ProShell } from "@/components/ProShell";
import { LiveFeedLive } from "@/components/LiveFeedLive";

export default function LivePage() {
  return (
    <ProShell>
      <div className="mx-auto max-w-5xl py-8">
        <h1 className="mb-8 text-2xl font-display font-semibold text-foreground">
          Live Intelligence Feed
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">Polled every 10s</p>
        <LiveFeedLive />
      </div>
    </ProShell>
  );
}
