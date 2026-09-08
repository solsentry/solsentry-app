"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addWatch,
  isWatchlistError,
  removeWatch,
  useWatchlist,
  type WatchKind,
} from "@/lib/watchlist";

export function TrackButton({ addr, kind }: { addr: string; kind: WatchKind }) {
  const watchlist = useWatchlist();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const tracked = watchlist.items.find((item) => item.addr === addr && item.kind === kind);

  async function toggle() {
    setError(null);
    setBusy(true);
    if (tracked) {
      const result = await removeWatch(tracked.id);
      if (isWatchlistError(result)) {
        if (result.code === "unauthenticated") router.push("/login?callback=/app");
        else setError(result.error);
      }
      setBusy(false);
      return;
    }

    const result = await addWatch({ addr, kind });
    if (isWatchlistError(result)) {
      if (result.code === "unauthenticated") {
        router.push("/login?callback=/app");
        setBusy(false);
        return;
      }
      setError(
        result.code === "slot_limit"
          ? `${result.limit ?? watchlist.limit}/${result.limit ?? watchlist.limit} slots used.`
          : result.error,
      );
    }
    setBusy(false);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={busy || watchlist.loading}
        className="whitespace-nowrap rounded border px-2.5 py-1.5 font-mono text-[11px] transition-colors"
        style={{
          background: tracked ? "var(--brand-amber-tint)" : "transparent",
          color: tracked ? "var(--brand-amber)" : "var(--fg-2)",
          borderColor: tracked ? "var(--brand-amber-line)" : "var(--border)",
        }}
      >
        {busy ? "Updating…" : tracked ? "★ Tracking" : `☆ Track ${kind}`}
      </button>
      {error && (
        <span className="whitespace-nowrap text-[11px] text-muted-foreground" role="status">
          {error}{" "}
          <Link href="/app" className="text-primary hover:underline">
            Manage radar
          </Link>
        </span>
      )}
      {!error && watchlist.notice && (
        <span className="max-w-sm text-[11px] text-muted-foreground" role="status">
          {watchlist.notice}
        </span>
      )}
    </span>
  );
}
