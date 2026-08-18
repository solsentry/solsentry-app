"use client";

import { ProShell } from "@/components/ProShell";
import { LiveFeed } from "@/components/live-feed";

export default function LivePage() {
  return (
    <ProShell>
      <div className="mx-auto max-w-5xl py-8">
        <h1 className="mb-8 text-2xl font-display font-semibold text-foreground">
          Live Intelligence Feed
        </h1>
        <LiveFeed />
      </div>
    </ProShell>
  );
}
