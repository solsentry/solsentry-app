"use client";

import { RefreshCw } from "lucide-react";

export function EmptyClusterState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-[200px] h-[200px] mb-6">
        {/* Empty ring illustration */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-border" />
        <div className="absolute inset-[30px] rounded-full border-2 border-dashed border-[#1F1B14]" />
        <div className="absolute inset-[60px] rounded-full bg-popover border border-border flex items-center justify-center">
          <span className="text-4xl opacity-30">◎</span>
        </div>
      </div>

      <h3 className="text-foreground font-medium mb-2">No clusters detected yet</h3>
      <p className="text-muted-foreground/60 text-sm text-center max-w-xs mb-6">
        Run the cluster detection API to identify bot networks and wallet clusters.
      </p>

      <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border">
        <code className="text-primary font-mono text-xs">GET /v1/clusters/refresh</code>
        <RefreshCw className="w-3 h-3 text-muted-foreground/60" />
      </div>
    </div>
  );
}
