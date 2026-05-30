'use client'

import { useState, useCallback } from 'react'
import { Sparkles, Copy, Check, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'

// Types
interface SparklineDataPoint {
  hour: string
  rugs: number
}

interface IntelData {
  date: string
  headline: string
  highlights: string[]
  sparklineData: SparklineDataPoint[]
  sources: {
    scans: number
    resolutions: number
    operatorUpdates: number
    clusterEvents: number
  }
}

type CardState = 'loaded' | 'loading' | 'error'

interface DailyIntelCardProps {
  data?: IntelData
  state?: CardState
  onReadMore?: () => void
  className?: string
}

// Mock data
const MOCK_DATA: IntelData = {
  date: 'May 19',
  headline: '1.247 novos tokens · 89 rugs detectados · 4kxscute liderou com 47 deploys',
  highlights: [
    'Bot cluster #847 expanded to 12 wallets — now largest active cluster',
    'Drain alert: 8.2K SOL routed via Cloak mixer in 3 txns',
    'New CRITICAL operator: GhostA…9xY3 flagged after 12 rugs in 6h',
  ],
  sparklineData: [
    { hour: '00:00', rugs: 2 },
    { hour: '01:00', rugs: 1 },
    { hour: '02:00', rugs: 3 },
    { hour: '03:00', rugs: 1 },
    { hour: '04:00', rugs: 0 },
    { hour: '05:00', rugs: 2 },
    { hour: '06:00', rugs: 4 },
    { hour: '07:00', rugs: 3 },
    { hour: '08:00', rugs: 5 },
    { hour: '09:00', rugs: 8 },
    { hour: '10:00', rugs: 6 },
    { hour: '11:00', rugs: 7 },
    { hour: '12:00', rugs: 9 },
    { hour: '13:00', rugs: 12 },
    { hour: '14:00', rugs: 8 },
    { hour: '15:00', rugs: 6 },
    { hour: '16:00', rugs: 4 },
    { hour: '17:00', rugs: 5 },
    { hour: '18:00', rugs: 3 },
    { hour: '19:00', rugs: 2 },
    { hour: '20:00', rugs: 4 },
    { hour: '21:00', rugs: 3 },
    { hour: '22:00', rugs: 2 },
    { hour: '23:00', rugs: 1 },
  ],
  sources: {
    scans: 2400,
    resolutions: 89,
    operatorUpdates: 1247,
    clusterEvents: 12,
  },
}

// Custom sparkline tooltip
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SparklineDataPoint }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-md border border-border bg-card px-2 py-1 text-xs shadow-lg">
        <span className="font-mono text-muted-foreground">{data.hour}</span>
        <span className="mx-1 text-muted-foreground/60">—</span>
        <span className="font-mono text-primary">{data.rugs} rugs</span>
      </div>
    )
  }
  return null
}

// Sparkline component
function Sparkline({ data }: { data: SparklineDataPoint[] }) {
  return (
    <div className="h-[60px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rugGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C17D0E" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#C17D0E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="hour" hide />
          <YAxis hide domain={[0, 'dataMax + 2']} />
          <RechartsTooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#C17D0E', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="rugs"
            stroke="#C17D0E"
            strokeWidth={1.5}
            fill="url(#rugGradient)"
            dot={false}
            activeDot={{ r: 3, fill: '#C17D0E', stroke: '#100E0A', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded bg-secondary" />
        <Skeleton className="h-4 w-24 bg-secondary" />
        <Skeleton className="h-4 w-16 bg-secondary" />
      </div>

      {/* Headline skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full bg-secondary" />
        <Skeleton className="h-5 w-3/4 bg-secondary" />
      </div>

      {/* Bullets skeleton */}
      <div className="space-y-2 pt-2">
        <div className="flex items-start gap-2">
          <Skeleton className="mt-1 size-2 shrink-0 rounded-full bg-secondary" />
          <Skeleton className="h-4 w-full bg-secondary" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="mt-1 size-2 shrink-0 rounded-full bg-secondary" />
          <Skeleton className="h-4 w-5/6 bg-secondary" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="mt-1 size-2 shrink-0 rounded-full bg-secondary" />
          <Skeleton className="h-4 w-4/5 bg-secondary" />
        </div>
      </div>

      {/* Sparkline skeleton */}
      <div className="pt-2">
        <Skeleton className="h-[60px] w-full animate-pulse rounded bg-secondary" />
      </div>

      {/* Footer skeleton */}
      <Skeleton className="h-3 w-2/3 bg-secondary" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-28 bg-secondary" />
        <Skeleton className="h-8 w-24 bg-secondary" />
        <Skeleton className="size-8 bg-secondary" />
      </div>
    </div>
  )
}

// Error state
function ErrorState({ sources }: { sources?: IntelData['sources'] }) {
  const fallbackSources = sources || { scans: 0, resolutions: 0, operatorUpdates: 0, clusterEvents: 0 }
  
  return (
    <div className="space-y-4">
      {/* Error banner */}
      <div className="flex items-center gap-2 rounded-md border border-[#ef4444]/30 bg-[#ef4444]/10 px-3 py-2">
        <AlertCircle className="size-4 shrink-0 text-[#ef4444]" />
        <span className="text-sm text-[#ef4444]">AI summary unavailable. Showing raw stats.</span>
      </div>

      {/* Fallback stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-popover p-3">
          <div className="font-mono text-lg text-foreground">{fallbackSources.scans.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground/60">scans today</div>
        </div>
        <div className="rounded-md border border-border bg-popover p-3">
          <div className="font-mono text-lg text-foreground">{fallbackSources.resolutions}</div>
          <div className="text-xs text-muted-foreground/60">resolutions</div>
        </div>
        <div className="rounded-md border border-border bg-popover p-3">
          <div className="font-mono text-lg text-foreground">{fallbackSources.operatorUpdates.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground/60">operator updates</div>
        </div>
        <div className="rounded-md border border-border bg-popover p-3">
          <div className="font-mono text-lg text-foreground">{fallbackSources.clusterEvents}</div>
          <div className="text-xs text-muted-foreground/60">cluster events</div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground/60">
        Full AI analysis will be available shortly.
      </p>
    </div>
  )
}

// Email subscribe modal
function SubscribeModal({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Subscribe email:', email)
    setSubmitted(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="size-5 text-primary" />
            Sena AI Daily Intel
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Receive the daily intelligence summary in your inbox every morning at 9 AM UTC.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#22c55e]/20">
              <Check className="size-6 text-[#22c55e]" />
            </div>
            <p className="text-sm text-foreground">Subscribed successfully!</p>
            <p className="text-xs text-muted-foreground/60">Check your inbox to confirm.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-border bg-popover text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              className="shrink-0 bg-primary text-[#100E0A] hover:bg-primary/90"
            >
              Subscribe
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Main component
export function DailyIntelCard({
  data = MOCK_DATA,
  state = 'loaded',
  onReadMore,
  className,
}: DailyIntelCardProps) {
  const [copied, setCopied] = useState(false)

  const generateMarkdown = useCallback(() => {
    if (!data) return ''
    return `# Sena AI Daily Intel — ${data.date}

${data.headline}

${data.highlights.map((h) => `• ${h}`).join('\n')}

---
Sources: ${data.sources.scans.toLocaleString()} scans · ${data.sources.resolutions} resolutions · ${data.sources.operatorUpdates.toLocaleString()} operator updates · ${data.sources.clusterEvents} cluster events
`
  }, [data])

  const handleCopy = useCallback(async () => {
    const markdown = generateMarkdown()
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generateMarkdown])

  const handleReadMore = useCallback(() => {
    if (onReadMore) {
      onReadMore()
    } else {
      console.log('[v0] Read full report clicked')
    }
  }, [onReadMore])

  return (
    <Card
      className={cn(
        'w-full max-w-[420px] border-border bg-card',
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        {state === 'loading' ? (
          <LoadingSkeleton />
        ) : state === 'error' ? (
          <>
            {/* Header even in error state */}
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sena AI</span>
              <span className="text-sm text-muted-foreground/60">·</span>
              <span className="text-sm text-muted-foreground">Daily Intel</span>
              <span className="text-sm text-muted-foreground/60">·</span>
              <span className="text-sm text-muted-foreground/60">{data.date}</span>
            </div>
            <ErrorState sources={data.sources} />
          </>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sena AI</span>
              <span className="text-sm text-muted-foreground/60">·</span>
              <span className="text-sm text-muted-foreground">Daily Intel</span>
              <span className="text-sm text-muted-foreground/60">·</span>
              <span className="text-sm text-muted-foreground/60">{data.date}</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-secondary" />

            {/* Headline */}
            <h3
              className="text-balance text-lg font-semibold leading-snug text-foreground"
              aria-live="polite"
            >
              {data.headline}
            </h3>

            {/* Highlights */}
            <ul className="space-y-2">
              {data.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 text-primary">•</span>
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Sparkline */}
            <div className="pt-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  24h rugs/hour
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60">
                  peak: {Math.max(...data.sparklineData.map((d) => d.rugs))}
                </span>
              </div>
              <TooltipProvider>
                <Sparkline data={data.sparklineData} />
              </TooltipProvider>
            </div>

            {/* Source citations */}
            <div className="h-px bg-secondary" />
            <p className="text-xs italic text-muted-foreground/60">
              Based on: {data.sources.scans.toLocaleString()} scans ·{' '}
              {data.sources.resolutions} resolutions ·{' '}
              {data.sources.operatorUpdates.toLocaleString()} operator updates ·{' '}
              {data.sources.clusterEvents} cluster events
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReadMore}
                className="border-primary/50 bg-transparent text-primary hover:border-primary hover:bg-primary/10"
              >
                Read full report
                <ArrowRight className="ml-1 size-3" />
              </Button>

              <SubscribeModal>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Mail className="mr-1 size-3" />
                  Subscribe
                </Button>
              </SubscribeModal>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="size-4 text-[#22c55e]" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="border-border bg-card text-xs text-foreground"
                >
                  {copied ? 'Copied!' : 'Copy as Markdown'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Demo wrapper to show all states
export function DailyIntelCardDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Loaded state */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Loaded</h3>
        <DailyIntelCard state="loaded" />
      </div>

      {/* Loading state */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Loading</h3>
        <DailyIntelCard state="loading" />
      </div>

      {/* Error state */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Error</h3>
        <DailyIntelCard state="error" />
      </div>
    </div>
  )
}
