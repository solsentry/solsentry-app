'use client'

import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Pause, Play, ExternalLink, Copy, Check } from 'lucide-react'

// Types
type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type EventType = 'deploy' | 'drain' | 'cluster' | 'kol' | 'flow'

export interface FeedEvent {
  id: string
  timestamp: Date
  riskLevel: RiskLevel
  wallet: string
  eventType: EventType
  description: string
  metrics: { label: string; value: string | number }[]
  isNew?: boolean
}

type FilterType = 'all' | 'critical' | 'high+' | 'drains' | 'deploys'

// Mock data generator
function generateMockEvents(): FeedEvent[] {
  const now = new Date()
  
  return [
    {
      id: '1',
      timestamp: new Date(now.getTime() - 2000),
      riskLevel: 'CRITICAL',
      wallet: '7ZqRsT8n4kLmPqWx5pH1',
      eventType: 'deploy',
      description: 'deployed token PEPE2',
      metrics: [
        { label: 'risk', value: 94 },
        { label: 'serial', value: '7x' },
      ],
    },
    {
      id: '2',
      timestamp: new Date(now.getTime() - 14000),
      riskLevel: 'HIGH',
      wallet: '4kxscuteRLQd5pH1',
      eventType: 'drain',
      description: 'drain detected on WOJAK',
      metrics: [
        { label: 'amount', value: '$47K' },
        { label: 'holders', value: 312 },
      ],
    },
    {
      id: '3',
      timestamp: new Date(now.getTime() - 38000),
      riskLevel: 'HIGH',
      wallet: '9XmNpQ2rVbYt3pH1',
      eventType: 'cluster',
      description: 'cluster expanded +12 wallets',
      metrics: [
        { label: 'total', value: 89 },
        { label: 'vol', value: '$1.2M' },
      ],
    },
    {
      id: '4',
      timestamp: new Date(now.getTime() - 67000),
      riskLevel: 'MEDIUM',
      wallet: 'KoLwAlLeT8x2nM5pH1',
      eventType: 'kol',
      description: 'KOL @pumpdotfun sold 80%',
      metrics: [
        { label: 'profit', value: '+$23K' },
        { label: 'time', value: '4h' },
      ],
    },
    {
      id: '5',
      timestamp: new Date(now.getTime() - 120000),
      riskLevel: 'CRITICAL',
      wallet: '3FgHjK9pLmNq5pH1',
      eventType: 'deploy',
      description: 'deployed token DOGE3',
      metrics: [
        { label: 'risk', value: 91 },
        { label: 'serial', value: '4x' },
      ],
    },
    {
      id: '6',
      timestamp: new Date(now.getTime() - 180000),
      riskLevel: 'HIGH',
      wallet: '8BnMpQrStUv5pH1',
      eventType: 'flow',
      description: 'USDC flow $89K to mixer',
      metrics: [
        { label: 'hops', value: 3 },
        { label: 'dest', value: 'Tornado' },
      ],
    },
    {
      id: '7',
      timestamp: new Date(now.getTime() - 245000),
      riskLevel: 'MEDIUM',
      wallet: '5CdEfGhIjK5pH1',
      eventType: 'deploy',
      description: 'deployed token SHIB2',
      metrics: [
        { label: 'risk', value: 67 },
        { label: 'serial', value: '2x' },
      ],
    },
    {
      id: '8',
      timestamp: new Date(now.getTime() - 312000),
      riskLevel: 'HIGH',
      wallet: '2AbCdEfGhI5pH1',
      eventType: 'drain',
      description: 'drain detected on BONK2',
      metrics: [
        { label: 'amount', value: '$12K' },
        { label: 'holders', value: 89 },
      ],
    },
    {
      id: '9',
      timestamp: new Date(now.getTime() - 420000),
      riskLevel: 'CRITICAL',
      wallet: '6JkLmNoPqR5pH1',
      eventType: 'cluster',
      description: 'new cluster identified',
      metrics: [
        { label: 'wallets', value: 23 },
        { label: 'rugs', value: 18 },
      ],
    },
    {
      id: '10',
      timestamp: new Date(now.getTime() - 540000),
      riskLevel: 'HIGH',
      wallet: '1ZxYwVuTsR5pH1',
      eventType: 'kol',
      description: 'KOL @whale_alert entry',
      metrics: [
        { label: 'amount', value: '$156K' },
        { label: 'token', value: 'WIF' },
      ],
    },
  ]
}

// Time ago formatter
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// Time formatter HH:MM:SS
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// Truncate wallet
function truncateWallet(wallet: string): string {
  if (wallet.length <= 12) return wallet
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
}

// Risk level styles
const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  CRITICAL: {
    bg: 'bg-[#ef4444]/20',
    text: 'text-[#ef4444]',
    border: 'border-[#ef4444]/30',
  },
  HIGH: {
    bg: 'bg-primary/20',
    text: 'text-primary',
    border: 'border-primary/30',
  },
  MEDIUM: {
    bg: 'bg-[#eab308]/20',
    text: 'text-[#eab308]',
    border: 'border-[#eab308]/30',
  },
  LOW: {
    bg: 'bg-[#22c55e]/20',
    text: 'text-[#22c55e]',
    border: 'border-[#22c55e]/30',
  },
}

// Filter labels
const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Todos',
  critical: 'CRITICAL',
  'high+': 'HIGH+',
  drains: 'Drains',
  deploys: 'Deploys',
}

// Wallet copy button
function WalletAddress({ wallet }: { wallet: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(wallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [wallet])

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-1 font-mono text-foreground transition-colors hover:text-primary"
      title={`Copiar: ${wallet}`}
    >
      <span>{truncateWallet(wallet)}</span>
      {copied ? (
        <Check className="size-3 text-[#22c55e]" />
      ) : (
        <Copy className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  )
}

// Event row component
function EventRow({ event, isNew }: { event: FeedEvent; isNew?: boolean }) {
  const riskStyle = RISK_STYLES[event.riskLevel]

  return (
    <div
      className={cn(
        'flex items-start gap-2 border-b border-border/50 px-3 py-2 transition-all sm:items-center sm:gap-3 sm:px-4',
        isNew && 'animate-slide-in bg-primary/5'
      )}
    >
      {/* Timestamp */}
      <span className="hidden shrink-0 font-mono text-xs text-muted-foreground/60 sm:inline">
        [{formatTimestamp(event.timestamp)}]
      </span>
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground/60 sm:hidden">
        {formatTimeAgo(event.timestamp)}
      </span>

      {/* Risk badge */}
      <span
        className={cn(
          'shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold',
          riskStyle.bg,
          riskStyle.text
        )}
      >
        {event.riskLevel === 'CRITICAL' ? 'CRIT' : event.riskLevel.slice(0, 4)}
      </span>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        {/* Wallet + Description */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
          <WalletAddress wallet={event.wallet} />
          <span className="truncate text-xs text-muted-foreground sm:text-sm">
            {event.description}
          </span>
        </div>

        {/* Metrics */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {event.metrics.slice(0, 2).map((metric, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              <span className="text-muted-foreground/60">{metric.label}</span>
              <span className="text-foreground">{metric.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* View link */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          console.log('[v0] View event:', event.id)
        }}
        className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground/60 transition-colors hover:text-primary sm:inline-flex"
      >
        view
        <ExternalLink className="size-3" />
      </a>
    </div>
  )
}

// Empty state
function EmptyState({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'size-2 rounded-full',
            isConnected ? 'animate-pulse bg-[#22c55e]' : 'bg-[#ef4444]'
          )}
        />
        <span className="font-mono text-sm text-muted-foreground/60">
          {isConnected ? 'connected' : 'disconnected'}
        </span>
      </div>
      <span className="font-mono text-xs text-muted-foreground/60">
        Waiting for events... 0 in last 60s
      </span>
    </div>
  )
}

// Stale banner
function StaleBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-[#ef4444]/10 px-3 py-2 text-center">
      <span className="size-2 rounded-full bg-[#ef4444]" />
      <span className="font-mono text-xs text-[#ef4444]">Reconnecting...</span>
    </div>
  )
}

// Main component
interface LiveFeedProps {
  className?: string
  showScanlines?: boolean
  // When provided, the feed renders these real events and disables the mock
  // generator + simulated stream. The owner (LiveFeedLive) handles polling.
  events?: FeedEvent[]
}

export function LiveFeed({ className, showScanlines = true, events: externalEvents }: LiveFeedProps) {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [isPaused, setIsPaused] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [isStale, setIsStale] = useState(false)
  const [eventRate, setEventRate] = useState(12)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())

  // Initialize: real events if supplied, else mock data.
  useEffect(() => {
    if (externalEvents) return
    setEvents(generateMockEvents())
  }, [externalEvents])

  // Sync real events in when the poller updates them.
  useEffect(() => {
    if (!externalEvents) return
    setEvents(externalEvents)
  }, [externalEvents])

  // Simulate new events coming in (mock mode only).
  useEffect(() => {
    if (externalEvents || isPaused) return

    const interval = setInterval(() => {
      const newEvent: FeedEvent = {
        id: `new-${Date.now()}`,
        timestamp: new Date(),
        riskLevel: (['CRITICAL', 'HIGH', 'MEDIUM'] as RiskLevel[])[
          Math.floor(Math.random() * 3)
        ],
        wallet: `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
        eventType: (['deploy', 'drain', 'cluster', 'kol', 'flow'] as EventType[])[
          Math.floor(Math.random() * 5)
        ],
        description: [
          'deployed token MEME',
          'drain detected',
          'cluster activity',
          'KOL movement',
          'USDC flow detected',
        ][Math.floor(Math.random() * 5)],
        metrics: [
          { label: 'risk', value: Math.floor(Math.random() * 40) + 60 },
          { label: 'serial', value: `${Math.floor(Math.random() * 5) + 1}x` },
        ],
        isNew: true,
      }

      setEvents((prev) => [newEvent, ...prev].slice(0, 50))
      setNewEventIds((prev) => new Set(prev).add(newEvent.id))

      // Clear new status after animation
      setTimeout(() => {
        setNewEventIds((prev) => {
          const next = new Set(prev)
          next.delete(newEvent.id)
          return next
        })
      }, 1000)

      // Update rate randomly
      setEventRate((prev) => Math.max(5, Math.min(20, prev + Math.floor(Math.random() * 5) - 2)))
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  // Filter events
  const filteredEvents = events.filter((event) => {
    switch (filter) {
      case 'critical':
        return event.riskLevel === 'CRITICAL'
      case 'high+':
        return event.riskLevel === 'CRITICAL' || event.riskLevel === 'HIGH'
      case 'drains':
        return event.eventType === 'drain'
      case 'deploys':
        return event.eventType === 'deploy'
      default:
        return true
    }
  })

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-background',
        className
      )}
    >
      {/* Scanline overlay */}
      {showScanlines && (
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-popover px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={cn(
                'size-2 rounded-full',
                isStale
                  ? 'bg-[#ef4444]'
                  : isConnected
                    ? 'animate-pulse bg-[#22c55e]'
                    : 'bg-muted-foreground/60'
              )}
            />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground sm:text-sm">
              Live Feed
            </span>
          </div>

          {/* Event rate */}
          <span className="hidden font-mono text-[10px] text-muted-foreground/60 sm:inline sm:text-xs">
            {eventRate} events/min
          </span>

          {/* Paused badge */}
          {isPaused && (
            <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-primary">
              paused
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 font-mono text-[10px] text-muted-foreground hover:bg-secondary hover:text-foreground sm:text-xs"
              >
                {FILTER_LABELS[filter]}
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border bg-card"
            >
              <DropdownMenuRadioGroup
                value={filter}
                onValueChange={(v) => setFilter(v as FilterType)}
              >
                {(Object.keys(FILTER_LABELS) as FilterType[]).map((key) => (
                  <DropdownMenuRadioItem
                    key={key}
                    value={key}
                    className="font-mono text-xs text-muted-foreground focus:bg-secondary focus:text-foreground"
                  >
                    {FILTER_LABELS[key]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pause/Resume */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsPaused(!isPaused)}
            className="size-7 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* Stale banner */}
      {isStale && <StaleBanner />}

      {/* Event list */}
      <div
        ref={scrollRef}
        className="max-h-[400px] overflow-y-auto sm:max-h-[480px]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#2A251C #100E0A',
        }}
      >
        {filteredEvents.length === 0 ? (
          <EmptyState isConnected={isConnected} />
        ) : (
          filteredEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              isNew={newEventIds.has(event.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border bg-popover px-3 py-2 sm:px-4">
        <span className="font-mono text-[10px] text-muted-foreground/60 sm:text-xs">
          Showing last {Math.min(filteredEvents.length, 50)}
        </span>
        <a
          href="#"
          className="font-mono text-[10px] text-primary transition-colors hover:text-primary/80 sm:text-xs"
          onClick={(e) => {
            e.preventDefault()
            console.log('[v0] Connect Pro clicked')
          }}
        >
          connect Pro for unlimited
        </a>
      </div>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
            background-color: rgba(245, 158, 11, 0.15);
          }
          50% {
            background-color: rgba(245, 158, 11, 0.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            background-color: rgba(245, 158, 11, 0.05);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
