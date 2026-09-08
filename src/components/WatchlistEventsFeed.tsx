"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchWithSession, UnauthenticatedError } from "@/lib/api-session";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/api";
import type { WatchKind } from "@/lib/watchlist";

interface MatchedWatch {
  item_id: string;
  kind: WatchKind;
  addr: string;
}

interface WatchlistEvent extends Alert {
  matched_watch: MatchedWatch[];
  server_time?: number;
  timestamp?: number;
}

interface EventsResponse {
  count: number;
  watched: number;
  events: WatchlistEvent[];
  server_time?: number;
}

function isMatchedWatch(value: unknown): value is MatchedWatch {
  if (!value || typeof value !== "object") return false;
  const match = value as Partial<MatchedWatch>;
  return (
    typeof match.item_id === "string" &&
    (match.kind === "operator" || match.kind === "token") &&
    typeof match.addr === "string"
  );
}

function isWatchlistEvent(value: unknown): value is WatchlistEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<WatchlistEvent>;
  return (
    typeof event.mint === "string" &&
    typeof event.risk_score === "number" &&
    typeof event.risk_level === "string" &&
    typeof event.predicted_at === "number" &&
    Array.isArray(event.matched_watch) &&
    event.matched_watch.every(isMatchedWatch)
  );
}

function eventTime(event: WatchlistEvent): number {
  if (typeof event.server_time === "number") return event.server_time;
  if (typeof event.timestamp === "number") return event.timestamp;
  return event.predicted_at;
}

function eventKey(event: WatchlistEvent): string {
  const matches = event.matched_watch
    .map((match) => match.item_id)
    .sort()
    .join(":");
  return `${event.mint}:${event.predicted_at}:${matches}`;
}

function truncate(value: string): string {
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  if (Number.isNaN(date.getTime())) return "Time unavailable";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function visibleRiskLevel(level: string): "CRITICAL" | "HIGH" | "MEDIUM" | null {
  const normalized = level.toUpperCase();
  if (normalized === "CRITICAL" || normalized === "HIGH" || normalized === "MEDIUM") {
    return normalized;
  }
  return null;
}

function WatchlistEventRow({ event }: { event: WatchlistEvent }) {
  const level = visibleRiskLevel(event.risk_level);
  const tokenName = event.symbol || truncate(event.mint);

  return (
    <article className="space-y-3 border-b border-border px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {level && (
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-[10px]",
                  level === "CRITICAL"
                    ? "border-destructive/40 text-destructive"
                    : level === "HIGH"
                      ? "border-primary/40 text-primary"
                      : "text-muted-foreground",
                )}
              >
                {level}
              </Badge>
            )}
            <Link
              href={`/token/${event.mint}`}
              className="truncate text-sm font-medium text-foreground hover:text-primary"
            >
              {tokenName}
            </Link>
          </div>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            Risk {Math.round(event.risk_score)} · {formatTimestamp(event.predicted_at)}
          </p>
        </div>
        <Link
          href={`/token/${event.mint}`}
          className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
          aria-label={`Open ${tokenName} token profile`}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          Matched watched item
        </p>
        <div className="flex flex-wrap gap-2">
          {event.matched_watch.map((match) => (
            <Link
              key={match.item_id}
              href={`/${match.kind}/${match.addr}`}
              title={match.addr}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary/50 px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <span className="uppercase">{match.kind}</span>
              <span>{truncate(match.addr)}</span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export function WatchlistEventsFeed() {
  const router = useRouter();
  const [events, setEvents] = useState<WatchlistEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sinceRef = useRef(0);

  useEffect(() => {
    let active = true;

    async function pull() {
      const params = new URLSearchParams({ limit: "50" });
      params.set("since", String(sinceRef.current));

      try {
        const response = await fetchWithSession(`/v1/watchlist/events?${params.toString()}`);
        if (!response.ok) throw new Error("Could not load watched-item alerts.");

        const value: unknown = await response.json();
        if (!value || typeof value !== "object") {
          throw new Error("Could not load watched-item alerts.");
        }
        const data = value as Partial<EventsResponse>;
        if (!Array.isArray(data.events)) {
          throw new Error("Could not load watched-item alerts.");
        }

        const incoming = data.events.filter(isWatchlistEvent);
        const responseTime =
          typeof data.server_time === "number"
            ? data.server_time
            : incoming.reduce((latest, event) => Math.max(latest, eventTime(event)), 0);
        if (responseTime > 0) sinceRef.current = Math.max(sinceRef.current, responseTime);

        if (active) {
          setEvents((current) => {
            const merged = new Map(current.map((event) => [eventKey(event), event]));
            incoming.forEach((event) => merged.set(eventKey(event), event));
            return Array.from(merged.values())
              .sort((left, right) => eventTime(right) - eventTime(left))
              .slice(0, 200);
          });
          setError(null);
        }
      } catch (requestError) {
        if (requestError instanceof UnauthenticatedError) {
          router.replace("/login?callback=/app");
          return;
        }
        if (active) setError("Could not load watched-item alerts. Retrying automatically.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void pull();
    const interval = window.setInterval(pull, 15_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [router]);

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <div>
            <h2 className="text-base font-semibold text-foreground">Watched-item alerts</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Alerts matched to operators and tokens on your radar.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          </div>
        )}
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            Loading watched-item alerts…
          </div>
        ) : events.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-sm font-medium text-foreground">
              No alerts for your watched items yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              New matches will appear here while alerts are enabled for an item.
            </p>
          </div>
        ) : (
          <div className="max-h-[640px] overflow-y-auto">
            {events.map((event) => (
              <WatchlistEventRow key={eventKey(event)} event={event} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WatchlistEventsFeed;
