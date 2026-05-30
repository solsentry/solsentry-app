"use client"

import { useState } from "react"

// Types
type WalletType = "all" | "kol" | "whale" | "insider" | "dev"
type ActionType = "bought" | "sold" | "dumped" | "aped" | "deployed" | "transferred"

interface SmartWallet {
  id: string
  name: string
  wallet: string
  type: WalletType
  avatarColor: string
  initials: string
  verified: boolean
  twitter?: string
  // Last action
  lastAction: ActionType
  lastActionTime: string
  lastActionAmount: string
  lastActionToken: string
  lastActionUsd: string
  // PnL data
  pnl24h: number
  pnl7d: number
  pnl30d: number
  // Risk flag
  flagged?: boolean
}

// Mock data
const mockWallets: SmartWallet[] = [
  {
    id: "1",
    name: "@ansem",
    wallet: "7kPq...mN4x",
    type: "kol",
    avatarColor: "#3b82f6",
    initials: "AN",
    verified: true,
    twitter: "blknoiz06",
    lastAction: "bought",
    lastActionTime: "2m",
    lastActionAmount: "2.4M",
    lastActionToken: "BONK",
    lastActionUsd: "$14K",
    pnl24h: 22400,
    pnl7d: 45600,
    pnl30d: 156000,
  },
  {
    id: "2",
    name: "@whale47",
    wallet: "9mTx...kQ2y",
    type: "whale",
    avatarColor: "#C17D0E",
    initials: "W4",
    verified: false,
    lastAction: "dumped",
    lastActionTime: "5m",
    lastActionAmount: "89K",
    lastActionToken: "WIF",
    lastActionUsd: "$340K",
    pnl24h: -18500,
    pnl7d: 120300,
    pnl30d: 445000,
    flagged: true,
  },
  {
    id: "3",
    name: "smartmoney#12",
    wallet: "3jRv...pL8w",
    type: "insider",
    avatarColor: "#22c55e",
    initials: "SM",
    verified: false,
    lastAction: "deployed",
    lastActionTime: "8m",
    lastActionAmount: "",
    lastActionToken: "PEPE2",
    lastActionUsd: "",
    pnl24h: 8900,
    pnl7d: 32100,
    pnl30d: 98000,
  },
  {
    id: "4",
    name: "@mert",
    wallet: "4nYu...zR5t",
    type: "kol",
    avatarColor: "#10b981",
    initials: "ME",
    verified: true,
    twitter: "0xMert_",
    lastAction: "aped",
    lastActionTime: "12m",
    lastActionAmount: "500K",
    lastActionToken: "POPCAT",
    lastActionUsd: "$28K",
    pnl24h: 15800,
    pnl7d: 58900,
    pnl30d: 198000,
  },
  {
    id: "5",
    name: "@toly",
    wallet: "8wKp...bV7s",
    type: "dev",
    avatarColor: "#ec4899",
    initials: "TO",
    verified: true,
    twitter: "aaboronkov",
    lastAction: "transferred",
    lastActionTime: "15m",
    lastActionAmount: "10K",
    lastActionToken: "SOL",
    lastActionUsd: "$1.4M",
    pnl24h: 22400,
    pnl7d: 45600,
    pnl30d: 156000,
  },
  {
    id: "6",
    name: "@whale_alert",
    wallet: "2qLm...xC4r",
    type: "whale",
    avatarColor: "#8b5cf6",
    initials: "WA",
    verified: false,
    twitter: "whale_alert",
    lastAction: "bought",
    lastActionTime: "18m",
    lastActionAmount: "2.1M",
    lastActionToken: "JUP",
    lastActionUsd: "$890K",
    pnl24h: 45200,
    pnl7d: 189000,
    pnl30d: 567000,
  },
  {
    id: "7",
    name: "insider#847",
    wallet: "5pJr...gY6u",
    type: "insider",
    avatarColor: "#f97316",
    initials: "IN",
    verified: false,
    lastAction: "sold",
    lastActionTime: "22m",
    lastActionAmount: "1.2M",
    lastActionToken: "MYRO",
    lastActionUsd: "$45K",
    pnl24h: -12400,
    pnl7d: 28900,
    pnl30d: 78000,
    flagged: true,
  },
  {
    id: "8",
    name: "@hsaka",
    wallet: "6tHn...aD9e",
    type: "kol",
    avatarColor: "#eab308",
    initials: "HS",
    verified: true,
    twitter: "HsakaTrades",
    lastAction: "bought",
    lastActionTime: "28m",
    lastActionAmount: "150K",
    lastActionToken: "TNSR",
    lastActionUsd: "$62K",
    pnl24h: 8700,
    pnl7d: 34500,
    pnl30d: 112000,
  },
  {
    id: "9",
    name: "dev_wallet_42",
    wallet: "1xQw...nM3k",
    type: "dev",
    avatarColor: "#06b6d4",
    initials: "DV",
    verified: false,
    lastAction: "deployed",
    lastActionTime: "35m",
    lastActionAmount: "",
    lastActionToken: "SNEK",
    lastActionUsd: "",
    pnl24h: 5200,
    pnl7d: 18900,
    pnl30d: 45000,
  },
  {
    id: "10",
    name: "@degenwhale",
    wallet: "7yRt...pK2m",
    type: "whale",
    avatarColor: "#a855f7",
    initials: "DW",
    verified: false,
    twitter: "DegenWhale",
    lastAction: "aped",
    lastActionTime: "42m",
    lastActionAmount: "800K",
    lastActionToken: "BOME",
    lastActionUsd: "$180K",
    pnl24h: 67800,
    pnl7d: 245000,
    pnl30d: 890000,
  },
]

// Icons
const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const KolIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
)

const WhaleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12c0-4 3-8 9-8s9 4 9 8-3 6-9 6-9-2-9-6z"/>
    <circle cx="8" cy="10" r="1" fill="currentColor"/>
  </svg>
)

const InsiderIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const FlagIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" x2="4" y1="22" y2="15" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const DevIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
)

// Helper functions
function formatPnl(value: number): string {
  const absValue = Math.abs(value)
  if (absValue >= 1000000) {
    return `${value >= 0 ? '+' : '-'}$${(absValue / 1000000).toFixed(1)}M`
  }
  if (absValue >= 1000) {
    return `${value >= 0 ? '+' : '-'}$${(absValue / 1000).toFixed(1)}K`
  }
  return `${value >= 0 ? '+' : '-'}$${absValue}`
}

function getActionColor(action: ActionType): string {
  switch (action) {
    case "bought":
    case "aped":
      return "#22c55e"
    case "sold":
    case "dumped":
      return "#ef4444"
    case "deployed":
      return "#C17D0E"
    case "transferred":
      return "#3b82f6"
    default:
      return "#B8B0A0"
  }
}

function getPnlBgColor(value: number): string {
  return value >= 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)"
}

function getPnlTextColor(value: number): string {
  return value >= 0 ? "#22c55e" : "#ef4444"
}

// Components
function TypeBadge({ type }: { type: WalletType }) {
  const config = {
    kol: { icon: <KolIcon />, label: "KOL", color: "#C17D0E" },
    whale: { icon: <WhaleIcon />, label: "Whale", color: "#3b82f6" },
    insider: { icon: <InsiderIcon />, label: "Insider", color: "#a855f7" },
    dev: { icon: <DevIcon />, label: "Dev", color: "#f43f5e" },
    all: { icon: null, label: "", color: "" },
  }
  
  const { icon, color } = config[type]
  if (!icon) return null
  
  return (
    <span className="flex items-center gap-1 text-[10px]" style={{ color }}>
      {icon}
    </span>
  )
}

function PnlBadge({ value, period }: { value: number; period: string }) {
  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono"
      style={{ 
        backgroundColor: getPnlBgColor(value),
        color: getPnlTextColor(value)
      }}
    >
      {period} {formatPnl(value)}
    </span>
  )
}

// Mock PnL data generator
function generatePnlData(baseValue: number) {
  const days = []
  const dates = [
    "Apr 20", "Apr 21", "Apr 21", "Apr 23", "Apr 24", "Apr 26", "Apr 27", "Apr 28", "Apr 30",
    "May 1", "May 4", "May 5", "May 6", "May 7", "May 9", "May 10", "May 12", "May 13", "May 13",
    "May 14", "May 15", "May 17", "May 18"
  ]
  
  for (let i = 0; i < dates.length; i++) {
    const variance = (Math.random() - 0.3) * baseValue * 0.5
    days.push({
      date: dates[i],
      value: Math.round(variance)
    })
  }
  return days
}

// PnL Chart Icons
const ChartBarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="10" width="4" height="10" rx="1"/>
    <rect x="10" y="6" width="4" height="14" rx="1"/>
    <rect x="17" y="2" width="4" height="18" rx="1"/>
  </svg>
)

const TableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M3 15h18M9 3v18"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" x2="21" y1="14" y2="3"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)

// PnL Chart Component
type ChartPeriod = "daily" | "weekly" | "monthly" | "alltime"

function PnlChart({ wallet, onClose }: { wallet: SmartWallet; onClose: () => void }) {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily")
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")
  
  const pnlData = generatePnlData(wallet.pnl24h)
  const maxValue = Math.max(...pnlData.map(d => Math.abs(d.value)))
  const chartHeight = 200
  const barWidth = 20
  
  // Format Y axis
  function formatYAxis(value: number): string {
    if (value === 0) return "$0"
    const absValue = Math.abs(value)
    if (absValue >= 1000) {
      return `${value >= 0 ? '+' : '-'}$${(absValue / 1000).toFixed(0)}K`
    }
    return `${value >= 0 ? '+' : '-'}$${absValue}`
  }
  
  const yAxisValues = [maxValue, maxValue * 0.5, 0, -maxValue * 0.5, -maxValue]
  
  const periods: { key: ChartPeriod; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "alltime", label: "All Time" },
  ]
  
  return (
    <div className="px-4 pb-4 bg-background border-t border-[#1F1B14]">
      {/* Chart header */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          {/* Period tabs */}
          <div className="flex items-center bg-card rounded-md p-0.5">
            {periods.map((period) => (
              <button
                key={period.key}
                onClick={() => setChartPeriod(period.key)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  chartPeriod === period.key 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground/60 hover:text-muted-foreground"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            + Compare
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          {/* View mode toggle */}
          <button
            onClick={() => setViewMode("chart")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "chart" ? "text-foreground bg-secondary" : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
          >
            <ChartBarIcon />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "table" ? "text-foreground bg-secondary" : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
          >
            <TableIcon />
          </button>
        </div>
      </div>
      
      {/* Chart with bars going up and down from zero line */}
      <div className="relative overflow-x-auto">
        <div className="flex">
          {/* Y Axis */}
          <div className="w-14 shrink-0 flex flex-col justify-between pr-2 text-right" style={{ height: chartHeight }}>
            {yAxisValues.map((value, i) => (
              <span key={i} className="text-[10px] font-mono text-muted-foreground/60">
                {formatYAxis(value)}
              </span>
            ))}
          </div>
          
          {/* Bars container */}
          <div className="flex-1 relative" style={{ height: chartHeight }}>
            {/* Zero line at center */}
            <div 
              className="absolute w-full border-t border-[#404040]" 
              style={{ top: '50%' }}
            />
            
            {/* Grid lines */}
            <div className="absolute w-full border-t border-[#1F1B14]" style={{ top: '0%' }} />
            <div className="absolute w-full border-t border-[#1F1B14]" style={{ top: '25%' }} />
            <div className="absolute w-full border-t border-[#1F1B14]" style={{ top: '75%' }} />
            <div className="absolute w-full border-t border-[#1F1B14]" style={{ top: '100%' }} />
            
            {/* Bars */}
            <div className="flex items-center justify-start gap-1 h-full px-2">
              {pnlData.map((day, i) => {
                const heightPercent = (Math.abs(day.value) / maxValue) * 45
                const isPositive = day.value >= 0
                
                return (
                  <div 
                    key={i} 
                    className="flex flex-col items-center group relative h-full"
                    style={{ width: barWidth + 4 }}
                  >
                    {/* Bar wrapper - positioned relative to center */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {isPositive ? (
                        /* Positive bar - grows upward from center */
                        <div 
                          className="absolute rounded-sm transition-all hover:opacity-80 cursor-pointer"
                          style={{ 
                            width: barWidth,
                            height: `${heightPercent}%`,
                            minHeight: day.value !== 0 ? 4 : 0,
                            backgroundColor: "#22c55e",
                            bottom: '50%',
                          }}
                        />
                      ) : (
                        /* Negative bar - grows downward from center */
                        <div 
                          className="absolute rounded-sm transition-all hover:opacity-80 cursor-pointer"
                          style={{ 
                            width: barWidth,
                            height: `${heightPercent}%`,
                            minHeight: day.value !== 0 ? 4 : 0,
                            backgroundColor: "#ef4444",
                            top: '50%',
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full hidden group-hover:block z-10">
                      <div className="px-2 py-1 bg-secondary rounded text-xs font-mono whitespace-nowrap border border-[#404040]">
                        <div className="text-muted-foreground text-[10px]">{day.date}</div>
                        <span style={{ color: isPositive ? "#22c55e" : "#ef4444" }}>
                          {formatPnl(day.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* X Axis dates */}
        <div className="flex ml-14 px-2 mt-2">
          {pnlData.map((day, i) => (
            <div 
              key={i} 
              className="text-[8px] font-mono text-muted-foreground/60 text-center"
              style={{ width: barWidth + 4, flexShrink: 0 }}
            >
              {i % 3 === 0 ? day.date.split(' ')[1] : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WalletRow({ wallet, isExpanded, onToggle }: { wallet: SmartWallet; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#1F1B14]">
      <div 
        className={`flex items-center gap-3 px-4 py-3 hover:bg-popover transition-colors cursor-pointer group ${isExpanded ? 'bg-popover' : ''}`}
        onClick={onToggle}
      >
      {/* Avatar */}
      <a
        href={wallet.twitter ? `https://twitter.com/${wallet.twitter}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      >
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white hover:ring-2 hover:ring-primary/50 transition-all"
          style={{ backgroundColor: wallet.avatarColor }}
        >
          {wallet.initials}
        </div>
      </a>
      
      {/* Name, wallet, time */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <span className="font-medium text-foreground">{wallet.name}</span>
        <TypeBadge type={wallet.type} />
        <span className="font-mono text-xs text-muted-foreground/60">{wallet.wallet}</span>
        <span className="text-xs text-muted-foreground/60">·</span>
        <span className="text-xs text-muted-foreground/60">{wallet.lastActionTime}</span>
      </div>
      
      {/* Action */}
      <div className="flex items-center gap-2 flex-1">
        <span 
          className="text-sm font-medium"
          style={{ color: getActionColor(wallet.lastAction) }}
        >
          {wallet.lastAction}
        </span>
        {wallet.lastActionAmount && (
          <span className="text-sm text-foreground">{wallet.lastActionAmount}</span>
        )}
        <span className="px-1.5 py-0.5 text-xs font-mono bg-secondary rounded text-muted-foreground">
          {wallet.lastActionToken}
        </span>
        {wallet.lastActionUsd && (
          <span className="text-sm text-muted-foreground">{wallet.lastActionUsd}</span>
        )}
        {wallet.flagged && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded">
            <FlagIcon />
          </span>
        )}
      </div>
      
      {/* PnL badge - only 24h in row */}
      <div className="flex items-center shrink-0">
        <PnlBadge value={wallet.pnl24h} period="24h" />
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          className={`p-1.5 rounded transition-colors ${isExpanded ? 'bg-secondary text-foreground' : 'text-muted-foreground/60 hover:text-muted-foreground'}`}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          title="Toggle chart"
        >
          <ChevronDownIcon />
        </button>
        <button 
          className="p-1.5 rounded text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary transition-colors"
          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(wallet.wallet); }}
          title="Copy wallet"
        >
          <CopyIcon />
        </button>
        <button 
          className="p-1.5 rounded text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary transition-colors"
          onClick={(e) => e.stopPropagation()}
          title="Search wallet"
        >
          <SearchIcon />
        </button>
        {wallet.twitter ? (
          <a
            href={`https://twitter.com/intent/tweet?text=Check out this wallet: ${wallet.wallet}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors"
            title="Share on X"
          >
            <TwitterIcon />
          </a>
        ) : (
          <a
            href={`https://solscan.io/account/${wallet.wallet}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary transition-colors"
            title="View on explorer"
          >
            <ExternalIcon />
          </a>
        )}
      </div>
    </div>
    
    {/* Expanded chart */}
    {isExpanded && (
      <PnlChart wallet={wallet} onClose={onToggle} />
    )}
  </div>
  )
}

// Main Component
export function SmartMoneyPanel() {
  const [activeFilter, setActiveFilter] = useState<WalletType>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const filters: { key: WalletType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "kol", label: "KOLs" },
    { key: "whale", label: "Whales" },
    { key: "insider", label: "Insiders" },
    { key: "dev", label: "Devs" },
  ]
  
  const filteredWallets = activeFilter === "all" 
    ? mockWallets 
    : mockWallets.filter(w => w.type === activeFilter)
  
  const counts = {
    all: mockWallets.length,
    kol: mockWallets.filter(w => w.type === "kol").length,
    whale: mockWallets.filter(w => w.type === "whale").length,
    insider: mockWallets.filter(w => w.type === "insider").length,
    dev: mockWallets.filter(w => w.type === "dev").length,
  }
  
  return (
    <div className="w-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary">
              <TargetIcon />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Smart Money</h2>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">{mockWallets.length} wallets</span> tracked
              </p>
            </div>
          </div>
          
          {/* Type legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <KolIcon /> <span className="text-primary">KOL</span>
            </span>
            <span className="flex items-center gap-1">
              <WhaleIcon /> <span className="text-[#3b82f6]">Whale</span>
            </span>
            <span className="flex items-center gap-1">
              <InsiderIcon /> <span className="text-[#a855f7]">Insider</span>
            </span>
            <span className="flex items-center gap-1">
              <DevIcon /> <span className="text-[#f43f5e]">Dev</span>
            </span>
            <span className="flex items-center gap-1">
              <FlagIcon /> <span className="text-[#6b7280]">Flagged</span>
            </span>
          </div>
        </div>
        
        {/* Filter pills */}
        <div className="flex items-center gap-2 mt-4">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeFilter === key
                  ? "bg-primary text-[#100E0A]"
                  : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
              }`}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>
      
      {/* Wallet list */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredWallets.map((wallet) => (
          <WalletRow 
            key={wallet.id} 
            wallet={wallet} 
            isExpanded={expandedId === wallet.id}
            onToggle={() => setExpandedId(expandedId === wallet.id ? null : wallet.id)}
          />
        ))}
        
        {filteredWallets.length === 0 && (
          <div className="py-12 text-center text-muted-foreground/60">
            No wallets found for this filter
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-5 py-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground/60">
          Click row to view operator details · Click avatar to open X profile
        </p>
      </div>
    </div>
  )
}

export default SmartMoneyPanel
