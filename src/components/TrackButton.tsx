"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  addWatch,
  isWatchlistError,
  listWatchlist,
  removeWatch,
  subscribe,
  type WatchKind,
} from "@/lib/watchlist";

export function TrackButton({ addr, kind }: { addr: string; kind: WatchKind }) {
  const watchlist = useSyncExternalStore(subscribe, listWatchlist, listWatchlist);
  const [error, setError] = useState<string | null>(null);
  const tracked = watchlist.items.find((item) => item.addr === addr && item.kind === kind);

  function toggle() {
    setError(null);
    if (tracked) {
      const result = removeWatch(tracked.id);
      if (isWatchlistError(result)) setError(result.error);
      return;
    }

    const result = addWatch({ addr, kind });
    if (isWatchlistError(result)) {
      setError(
        result.code === "slot_limit"
          ? `${result.limit ?? watchlist.limit}/${result.limit ?? watchlist.limit} slots used.`
          : result.error,
      );
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="whitespace-nowrap rounded border px-2.5 py-1.5 font-mono text-[11px] transition-colors"
        style={{
          background: tracked ? "var(--brand-amber-tint)" : "transparent",
          color: tracked ? "var(--brand-amber)" : "var(--fg-2)",
          borderColor: tracked ? "var(--brand-amber-line)" : "var(--border)",
        }}
      >
        {tracked ? "★ Tracking" : `☆ Track ${kind}`}
      </button>
      {error && (
        <span className="whitespace-nowrap text-[11px] text-muted-foreground" role="status">
          {error}{" "}
          <Link href="/app" className="text-primary hover:underline">
            Manage radar
          </Link>
        </span>
      )}
    </span>
  );
}
