'use client'

/* OperatorHeatmap — v0 #07, rewired to SolSentry AMBER tokens (bg-background,
 * bg-card, border-border, text-muted-foreground, text-primary). Risk palette
 * (red/amber/yellow/green/teal) kept intentionally — it's the semantic risk ramp.
 *
 * DATA STATUS: mock. The hour×day deploy/rug matrix has no API source —
 * /v1/top-operators exposes only totals (rug_rate, confirmed_rugs, total_tokens),
 * not temporal activity. Real wiring needs a backend endpoint, e.g.
 * GET /v1/operator/{wallet}/activity-heatmap → { days: [{ hours: [{deploys,rugs}] }] }.
 * Until then this renders synthetic patterns (bot/human/mixed) for design only. */

import { useState, useMemo } from 'react'
import { Activity, Clock, ChevronDown, ChevronRight, Download } from 'lucide-react'

type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE'
type SortBy = 'activity' | 'rugRate' | 'recency'

interface DayData {
  deploys: number
  rugs: number
  peakHour: number
  hours: { deploys: number; rugs: number }[]
}

interface Operator {
  wallet: string
  riskLevel: RiskLevel
  days: DayData[]
  totalDeploys: number
  totalRugs: number
  rugRate: number
  lastActive: Date
  isBotFarm?: boolean
}

const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; glow: string }> = {
  CRITICAL: { bg: 'bg-red-500', text: 'text-red-400', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]' },
  HIGH: { bg: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]' },
  MEDIUM: { bg: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-[0_0_12px_rgba(234,179,8,0.3)]' },
  LOW: { bg: 'bg-green-500', text: 'text-green-400', glow: 'shadow-[0_0_12px_rgba(34,197,94,0.3)]' },
  SAFE: { bg: 'bg-teal-500', text: 'text-teal-400', glow: 'shadow-[0_0_12px_rgba(20,184,166,0.3)]' },
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function generateMockOperators(): Operator[] {
  const now = new Date()
  
  const createDays = (pattern: 'bot' | 'human' | 'mixed' | 'low'): DayData[] => {
    return Array.from({ length: 7 }, (_, dayIdx) => {
      const hours = Array.from({ length: 24 }, (_, hour) => {
        let deploys = 0
        let rugs = 0
        
        if (pattern === 'bot') {
          deploys = Math.floor(Math.random() * 8) + 3
          rugs = Math.floor(deploys * (0.85 + Math.random() * 0.1))
        } else if (pattern === 'human') {
          const isSleep = hour >= 2 && hour <= 8
          const isWeekend = dayIdx >= 5
          deploys = isSleep ? 0 : isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 6) + 1
          rugs = Math.floor(deploys * (0.6 + Math.random() * 0.2))
        } else if (pattern === 'mixed') {
          const isActive = hour >= 10 && hour <= 22
          deploys = isActive ? Math.floor(Math.random() * 4) + 1 : Math.random() < 0.2 ? 1 : 0
          rugs = Math.floor(deploys * (0.65 + Math.random() * 0.2))
        } else {
          deploys = Math.random() < 0.15 ? Math.floor(Math.random() * 2) + 1 : 0
          rugs = Math.random() < 0.5 ? deploys : 0
        }
        
        return { deploys, rugs }
      })
      
      const totalDeploys = hours.reduce((s, h) => s + h.deploys, 0)
      const totalRugs = hours.reduce((s, h) => s + h.rugs, 0)
      const peakHour = hours.reduce((max, h, i, arr) => h.deploys > arr[max].deploys ? i : max, 0)
      
      return { deploys: totalDeploys, rugs: totalRugs, peakHour, hours }
    })
  }

  const operators: Operator[] = [
    {
      wallet: '4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1',
      riskLevel: 'CRITICAL',
      days: createDays('bot'),
      totalDeploys: 3212,
      totalRugs: 2953,
      rugRate: 91.9,
      lastActive: new Date(now.getTime() - 1000 * 60 * 5),
      isBotFarm: true,
    },
    {
      wallet: '7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp9xRtGhUvYz3nE',
      riskLevel: 'HIGH',
      days: createDays('human'),
      totalDeploys: 847,
      totalRugs: 662,
      rugRate: 78.2,
      lastActive: new Date(now.getTime() - 1000 * 60 * 45),
    },
    {
      wallet: '9xRtGhUvYz3nE7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp',
      riskLevel: 'CRITICAL',
      days: createDays('bot'),
      totalDeploys: 2156,
      totalRugs: 1906,
      rugRate: 88.4,
      lastActive: new Date(now.getTime() - 1000 * 60 * 12),
      isBotFarm: true,
    },
    {
      wallet: '2wWfJdCbnM4sKp9xRtGhUvYz3nE7mPzKLxeNHr8vT5Yq',
      riskLevel: 'HIGH',
      days: createDays('mixed'),
      totalDeploys: 523,
      totalRugs: 377,
      rugRate: 72.1,
      lastActive: new Date(now.getTime() - 1000 * 60 * 30),
    },
    {
      wallet: '3nE7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp9xRtGhUvYz',
      riskLevel: 'MEDIUM',
      days: createDays('low'),
      totalDeploys: 89,
      totalRugs: 40,
      rugRate: 45.2,
      lastActive: new Date(now.getTime() - 1000 * 60 * 60 * 3),
    },
    {
      wallet: '8vT5Yq2wWfJdCbnM4sKp9xRtGhUvYz3nE7mPzKLxeNHr',
      riskLevel: 'CRITICAL',
      days: createDays('bot'),
      totalDeploys: 1876,
      totalRugs: 1765,
      rugRate: 94.1,
      lastActive: new Date(now.getTime() - 1000 * 60 * 8),
      isBotFarm: true,
    },
    {
      wallet: 'z3nE7mPzKLxeNHr8vT5Yq2wWfJdCbnM4sKp9xRtGhUvY',
      riskLevel: 'LOW',
      days: createDays('low'),
      totalDeploys: 47,
      totalRugs: 11,
      rugRate: 23.4,
      lastActive: new Date(now.getTime() - 1000 * 60 * 60 * 12),
    },
  ]
  
  return operators
}

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  return `${Math.floor(diffHours / 24)}d`
}

// Get intensity level 0-4 based on deploys
function getIntensity(deploys: number, maxDeploys: number): number {
  if (deploys === 0) return 0
  const ratio = deploys / maxDeploys
  if (ratio < 0.25) return 1
  if (ratio < 0.5) return 2
  if (ratio < 0.75) return 3
  return 4
}

// Get cell color based on activity intensity (mapped to risk colors)
function getCellColorByIntensity(deploys: number, maxDeploys: number): string {
  if (deploys === 0) return 'bg-card'
  
  const ratio = deploys / maxDeploys
  
  // Map intensity to risk colors: green (low) -> yellow -> amber -> red (high)
  if (ratio < 0.25) return 'bg-green-500'     // LOW activity
  if (ratio < 0.5) return 'bg-yellow-400'     // MEDIUM activity
  if (ratio < 0.75) return 'bg-amber-500'     // HIGH activity
  return 'bg-red-500'                          // CRITICAL activity
}

export default function OperatorHeatmap() {
  const [sortBy, setSortBy] = useState<SortBy>('activity')
  const [expandedOperator, setExpandedOperator] = useState<string | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{ wallet: string; day: number; hour?: number } | null>(null)
  
  const operators = useMemo(() => generateMockOperators(), [])
  
  const sortedOperators = useMemo(() => {
    const sorted = [...operators]
    switch (sortBy) {
      case 'activity':
        sorted.sort((a, b) => b.totalDeploys - a.totalDeploys)
        break
      case 'rugRate':
        sorted.sort((a, b) => b.rugRate - a.rugRate)
        break
      case 'recency':
        sorted.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
        break
    }
    return sorted
  }, [operators, sortBy])
  
  const stats = useMemo(() => ({
    totalOperators: operators.length,
    botFarms: operators.filter(op => op.isBotFarm).length,
    criticalCount: operators.filter(op => op.riskLevel === 'CRITICAL').length,
    avgRugRate: (operators.reduce((sum, op) => sum + op.rugRate, 0) / operators.length).toFixed(1),
  }), [operators])

  // Find max deploys across all operators for consistent color scaling
  const maxDailyDeploys = useMemo(() => {
    return Math.max(...operators.flatMap(op => op.days.map(d => d.deploys)))
  }, [operators])

  const maxHourlyDeploys = useMemo(() => {
    return Math.max(...operators.flatMap(op => op.days.flatMap(d => d.hours.map(h => h.deploys))))
  }, [operators])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-medium">Activity Heatmap</h1>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-popover border border-border rounded-lg p-4">
            <div className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1">Tracked</div>
            <div className="font-mono text-xl">{stats.totalOperators}</div>
          </div>
          <div className="bg-popover border border-border rounded-lg p-4">
            <div className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1">Bot Farms</div>
            <div className="font-mono text-xl text-red-400">{stats.botFarms}</div>
          </div>
          <div className="bg-popover border border-border rounded-lg p-4">
            <div className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1">Critical</div>
            <div className="font-mono text-xl text-red-400">{stats.criticalCount}</div>
          </div>
          <div className="bg-popover border border-border rounded-lg p-4">
            <div className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1">Avg Rug Rate</div>
            <div className="font-mono text-xl text-primary">{stats.avgRugRate}%</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-popover border border-border rounded-lg p-1">
            {([
              { key: 'activity', label: 'Activity' },
              { key: 'rugRate', label: 'Rug Rate' },
              { key: 'recency', label: 'Recent' },
            ] as { key: SortBy; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  sortBy === key
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground/60 hover:text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
            <span>SAFE</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <div className="w-3 h-3 rounded-sm bg-yellow-400" />
              <div className="w-3 h-3 rounded-sm bg-amber-500" />
              <div className="w-3 h-3 rounded-sm bg-red-500" />
            </div>
            <span>CRITICAL</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-2">
          {sortedOperators.map((operator) => {
            const isExpanded = expandedOperator === operator.wallet
            
            return (
              <div 
                key={operator.wallet} 
                className="bg-popover border border-border rounded-lg overflow-hidden transition-all"
              >
                {/* Main Row */}
                <div 
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-card transition-colors"
                  onClick={() => setExpandedOperator(isExpanded ? null : operator.wallet)}
                >
                  {/* Expand Icon */}
                  <div className="text-muted-foreground/60">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>

                  {/* Risk Indicator */}
                  <div className={`w-1.5 h-10 rounded-full ${RISK_COLORS[operator.riskLevel].bg} ${RISK_COLORS[operator.riskLevel].glow}`} />

                  {/* Operator Info */}
                  <div className="w-44 shrink-0">
                    <div className="flex items-center gap-2 mb-1">
<span
                                        className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                      >
                                        {truncateWallet(operator.wallet)}
                                      </span>
                      {operator.isBotFarm && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded font-mono uppercase">
                          Bot
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground/60">
                      <span>{operator.totalDeploys.toLocaleString()}</span>
                      <span className={RISK_COLORS[operator.riskLevel].text}>{operator.rugRate}%</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(operator.lastActive)}
                      </span>
                    </div>
                  </div>

                  {/* Daily Heatmap */}
                  <div className="flex-1 flex items-center gap-1">
                    {operator.days.map((day, dayIdx) => {
                      const intensity = getIntensity(day.deploys, maxDailyDeploys)
                      const isHovered = hoveredCell?.wallet === operator.wallet && hoveredCell?.day === dayIdx && hoveredCell?.hour === undefined
                      
                      return (
                        <div 
                          key={dayIdx} 
                          className="flex-1 flex flex-col items-center gap-1"
                          onMouseEnter={() => setHoveredCell({ wallet: operator.wallet, day: dayIdx })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div className="text-[9px] font-mono text-muted-foreground/60">{DAY_LABELS[dayIdx]}</div>
<div 
                                            className={`
                                              w-full h-8 rounded-md transition-all relative
                                              ${day.deploys === 0 ? 'bg-card border border-border' : getCellColorByIntensity(day.deploys, maxDailyDeploys)}
                                              ${isHovered ? 'ring-2 ring-white/50' : ''}
                                            `}
                                          >
                            {/* Tooltip */}
                            {isHovered && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                                <div className="bg-background border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                                  <div className="font-mono text-foreground mb-1">{DAY_LABELS[dayIdx]}</div>
                                  <div className="flex gap-3 font-mono text-muted-foreground">
                                    <span>{day.deploys} deploys</span>
                                    <span className="text-red-400">{day.rugs} rugs</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-[9px] font-mono text-muted-foreground/60">{day.deploys}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Expanded Hourly View */}
                {isExpanded && (
                  <div className="border-t border-border p-4 bg-background">
                    <div className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-3">
                      Hourly Breakdown (Last 7 Days)
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                      {operator.days.map((day, dayIdx) => (
                        <div key={dayIdx} className="space-y-1">
                          <div className="text-[10px] font-mono text-muted-foreground text-center mb-2">{DAY_LABELS[dayIdx]}</div>
                          <div className="grid grid-cols-6 gap-0.5">
                            {day.hours.map((hour, hourIdx) => {
                              const intensity = getIntensity(hour.deploys, maxHourlyDeploys)
                              const isHovered = hoveredCell?.wallet === operator.wallet && 
                                                hoveredCell?.day === dayIdx && 
                                                hoveredCell?.hour === hourIdx
                              
                              return (
                                <div
                                  key={hourIdx}
                                  className="relative"
                                  onMouseEnter={() => setHoveredCell({ wallet: operator.wallet, day: dayIdx, hour: hourIdx })}
                                  onMouseLeave={() => setHoveredCell(null)}
                                >
                                  <div 
                                    className={`
                                      w-full aspect-square rounded-sm transition-all
                                      ${getCellColorByIntensity(hour.deploys, maxHourlyDeploys)}
                                      ${isHovered ? 'ring-1 ring-white' : ''}
                                    `}
                                  />
                                  
                                  {/* Hourly Tooltip */}
                                  {isHovered && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20 pointer-events-none">
                                      <div className="bg-background border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-lg">
                                        <div className="font-mono text-muted-foreground">
                                          {String(hourIdx).padStart(2, '0')}:00 - {hour.deploys}d / {hour.rugs}r
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          {/* Hour labels */}
                          <div className="flex justify-between px-0.5 mt-1">
                            <span className="text-[8px] font-mono text-muted-foreground/60">00</span>
                            <span className="text-[8px] font-mono text-muted-foreground/60">12</span>
                            <span className="text-[8px] font-mono text-muted-foreground/60">23</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                      <div className="text-[11px] font-mono">
                        <span className="text-muted-foreground/60">Peak Activity: </span>
                        <span className="text-muted-foreground">
                          {DAY_LABELS[operator.days.reduce((max, d, i, arr) => d.deploys > arr[max].deploys ? i : max, 0)]} @ {String(operator.days[0].peakHour).padStart(2, '0')}:00
                        </span>
                      </div>
                      <div className="text-[11px] font-mono">
                        <span className="text-muted-foreground/60">Weekly Total: </span>
                        <span className="text-muted-foreground">{operator.days.reduce((s, d) => s + d.deploys, 0)} deploys</span>
                      </div>
                      <div className="text-[11px] font-mono">
                        <span className="text-muted-foreground/60">Pattern: </span>
                        <span className={operator.isBotFarm ? 'text-red-400' : 'text-muted-foreground'}>
                          {operator.isBotFarm ? '24/7 Automated' : 'Human Activity'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
