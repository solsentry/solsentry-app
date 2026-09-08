"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellOff, ChevronDown, ChevronRight, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  isWatchlistError,
  removeWatch,
  updateWatch,
  useWatchlist,
  type WatchItem,
} from "@/lib/watchlist";

function formatCreatedAt(createdAt: number): string {
  const date = new Date(createdAt * 1000);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function WatchlistRow({ item }: { item: WatchItem }) {
  const [expanded, setExpanded] = useState(false);
  const [label, setLabel] = useState(item.label ?? "");
  const [tags, setTags] = useState(item.tags.join(", "));
  const [notes, setNotes] = useState(item.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLabel(item.label ?? "");
    setTags(item.tags.join(", "));
    setNotes(item.notes ?? "");
  }, [item.label, item.notes, item.tags]);

  const href = item.kind === "operator" ? `/operator/${item.addr}` : `/token/${item.addr}`;

  async function saveDetails() {
    const result = await updateWatch(item.id, {
      label,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes,
    });
    if (isWatchlistError(result)) {
      setMessage(result.error);
      return;
    }
    setMessage("Saved.");
  }

  async function toggleAlerts() {
    const result = await updateWatch(item.id, { alerts: !item.alerts });
    setMessage(isWatchlistError(result) ? result.error : null);
  }

  async function remove() {
    const result = await removeWatch(item.id);
    if (isWatchlistError(result)) setMessage(result.error);
  }

  return (
    <div className="border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label={expanded ? "Collapse watch details" : "Expand watch details"}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {item.kind}
            </Badge>
            {item.label && <span className="truncate text-sm font-medium">{item.label}</span>}
          </div>
          <Link
            href={href}
            className="mt-1 block truncate font-mono text-xs text-muted-foreground hover:text-primary"
            title={item.addr}
          >
            {item.addr}
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleAlerts}
          className={item.alerts ? "text-primary" : "text-muted-foreground"}
          aria-label={item.alerts ? "Mute alerts" : "Enable alerts"}
          title={item.alerts ? "Mute alerts" : "Enable alerts"}
        >
          {item.alerts ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={remove}
          className="text-muted-foreground transition-colors hover:text-destructive"
          aria-label="Remove from watchlist"
          title="Remove from watchlist"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-border bg-card/40 px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs text-muted-foreground">
              Alias
              <Input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                maxLength={80}
                placeholder="Optional label"
                className="mt-1"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              Tags
              <Input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="Comma-separated, up to 10"
                className="mt-1"
              />
            </label>
          </div>

          <label className="block space-y-1 text-xs text-muted-foreground">
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={500}
              placeholder="Optional notes"
              className="mt-1 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">
              Tracked {formatCreatedAt(item.created_at)} · alerts {item.alerts ? "on" : "muted"}
            </span>
            <Button type="button" size="sm" onClick={saveDetails}>
              <Save className="mr-2 h-3.5 w-3.5" />
              Save details
            </Button>
          </div>
          {message && (
            <p className="text-xs text-muted-foreground" role="status">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function WatchlistPanel() {
  const watchlist = useWatchlist();
  const router = useRouter();

  useEffect(() => {
    if (watchlist.error?.code === "unauthenticated") {
      router.replace("/login?callback=/app");
    }
  }, [router, watchlist.error]);

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Watchlist</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Operators and tokens saved to your radar.
            </p>
          </div>
          <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
            {watchlist.count}/{watchlist.limit} slots
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {watchlist.notice && (
          <div className="border-b border-primary/30 bg-primary/5 px-4 py-3">
            <p className="text-xs text-muted-foreground" role="status">
              {watchlist.notice}
            </p>
          </div>
        )}
        {watchlist.error && watchlist.error.code !== "unauthenticated" && (
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs text-destructive" role="alert">
              {watchlist.error.error}
            </p>
          </div>
        )}
        {watchlist.loading && !watchlist.initialized ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            Loading your watchlist…
          </div>
        ) : watchlist.items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-sm font-medium text-foreground">Your radar is empty</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Open an operator or token profile and select Track. The item will appear here.
            </p>
          </div>
        ) : (
          <div className="max-h-[640px] overflow-y-auto">
            {watchlist.items.map((item) => (
              <WatchlistRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WatchlistPanel;
