"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Eye,
  Trash2,
  ExternalLink,
  Search,
  Download,
  FolderPlus,
  Tag,
  Bell,
  CheckSquare,
  Square,
  X,
  Edit2,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";

interface WatchlistItem {
  id: string;
  wallet: string;
  alias?: string;
  riskLevel: RiskLevel;
  delta: "up" | "down" | "unchanged";
  lastActivity: string;
  rugCount7d: number;
  avatarColor: string;
  group?: string;
  tags?: string[];
  notes?: string;
  pnl24h?: number;
  pnl7d?: number;
  riskHistory: number[]; // 0-100 scale, last 7 days
  recentTokens?: { symbol: string; action: "buy" | "sell" }[];
  isNew?: boolean;
  notificationsEnabled?: boolean;
}

const mockWatchlist: WatchlistItem[] = [
  {
    id: "1",
    wallet: "0x7a3b...9f2c",
    alias: "legal team #3",
    riskLevel: "CRITICAL",
    delta: "up",
    lastActivity: "2 hours ago",
    rugCount7d: 12,
    avatarColor: "bg-[#ef4444]",
    group: "Suspects",
    tags: ["rugger", "insider"],
    notes: "Linked to multiple rug pulls. Watch closely.",
    pnl24h: -45200,
    pnl7d: 128000,
    riskHistory: [45, 52, 60, 75, 82, 90, 95],
    recentTokens: [
      { symbol: "PEPE", action: "sell" },
      { symbol: "WOJAK", action: "sell" },
      { symbol: "DOGE", action: "buy" },
    ],
    isNew: true,
    notificationsEnabled: true,
  },
  {
    id: "2",
    wallet: "0x4kxs...5pH1",
    riskLevel: "HIGH",
    delta: "up",
    lastActivity: "5 hours ago",
    rugCount7d: 7,
    avatarColor: "bg-primary",
    group: "Suspects",
    pnl24h: 12300,
    pnl7d: -8500,
    riskHistory: [30, 35, 40, 55, 60, 68, 75],
    recentTokens: [
      { symbol: "SHIB", action: "buy" },
      { symbol: "FLOKI", action: "sell" },
    ],
    notificationsEnabled: true,
  },
  {
    id: "3",
    wallet: "0x9c2d...3e7f",
    alias: "whale tracker",
    riskLevel: "MEDIUM",
    delta: "down",
    lastActivity: "1 day ago",
    rugCount7d: 3,
    avatarColor: "bg-[#eab308]",
    group: "Monitoring",
    tags: ["whale"],
    pnl24h: 5600,
    pnl7d: 42000,
    riskHistory: [55, 50, 48, 45, 42, 40, 38],
    recentTokens: [{ symbol: "ETH", action: "buy" }],
  },
  {
    id: "4",
    wallet: "0x1f8e...4b2a",
    riskLevel: "LOW",
    delta: "unchanged",
    lastActivity: "3 days ago",
    rugCount7d: 1,
    avatarColor: "bg-[#22c55e]",
    pnl24h: 890,
    pnl7d: 3200,
    riskHistory: [20, 22, 18, 15, 18, 20, 18],
    recentTokens: [],
  },
  {
    id: "5",
    wallet: "0x5d9a...8c1e",
    alias: "safe dev",
    riskLevel: "SAFE",
    delta: "unchanged",
    lastActivity: "1 week ago",
    rugCount7d: 0,
    avatarColor: "bg-[#3b82f6]",
    group: "Trusted",
    tags: ["dev", "verified"],
    notes: "Verified developer, clean history.",
    pnl24h: 15000,
    pnl7d: 89000,
    riskHistory: [8, 10, 8, 5, 6, 5, 5],
    recentTokens: [
      { symbol: "UNI", action: "buy" },
      { symbol: "AAVE", action: "buy" },
    ],
  },
];

const defaultGroups = ["All", "Suspects", "Monitoring", "Trusted"];

function getRiskBadgeStyles(level: RiskLevel) {
  switch (level) {
    case "CRITICAL":
      return "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30";
    case "HIGH":
      return "bg-primary/20 text-primary border-primary/30";
    case "MEDIUM":
      return "bg-[#eab308]/20 text-[#eab308] border-[#eab308]/30";
    case "LOW":
      return "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30";
    case "SAFE":
      return "bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/30";
    default:
      return "bg-muted-foreground/60/20 text-muted-foreground/60 border-[#5A5448]/30";
  }
}

function getRiskColor(level: RiskLevel) {
  switch (level) {
    case "CRITICAL":
      return "#ef4444";
    case "HIGH":
      return "#C17D0E";
    case "MEDIUM":
      return "#eab308";
    case "LOW":
      return "#22c55e";
    case "SAFE":
      return "#3b82f6";
    default:
      return "#5A5448";
  }
}

function formatPnl(value: number): string {
  const absValue = Math.abs(value);
  const sign = value >= 0 ? "+" : "-";
  if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(1)}K`;
  }
  return `${sign}$${absValue.toFixed(0)}`;
}

function DeltaIndicator({ delta }: { delta: "up" | "down" | "unchanged" }) {
  if (delta === "up") {
    return <ArrowUp className="w-3 h-3 text-[#ef4444]" />;
  }
  if (delta === "down") {
    return <ArrowDown className="w-3 h-3 text-[#22c55e]" />;
  }
  return <span className="w-3 h-3 text-muted-foreground/60">—</span>;
}

// Mini sparkline chart for risk history
function RiskSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const height = 20;
  const width = 56;
  const padding = 4;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const pointWidth = innerWidth / (data.length - 1);

  const points = data
    .map((value, i) => {
      const x = padding + i * pointWidth;
      const y = padding + innerHeight - ((value - min) / range) * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className="rounded bg-card border border-border flex items-center justify-center"
      style={{ width: width + 8, height: height + 8 }}
    >
      <svg width={width} height={height}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Current value dot */}
        <circle
          cx={padding + innerWidth}
          cy={padding + innerHeight - ((data[data.length - 1] - min) / range) * innerHeight}
          r="2.5"
          fill={color}
        />
      </svg>
    </div>
  );
}

// Progress bar for slots used
function SlotsProgressBar({ used, max }: { used: number; max: number }) {
  const percentage = (used / max) * 100;
  const isNearLimit = percentage >= 80;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isNearLimit ? "bg-primary" : "bg-[#3b82f6]"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={`text-[10px] font-mono ${isNearLimit ? "text-primary" : "text-muted-foreground/60"}`}
      >
        {used}/{max}
      </span>
    </div>
  );
}

function EmptyState({ onAddFirst }: { onAddFirst: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
        <Eye className="w-8 h-8 text-muted-foreground/60" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">Track wallets you care about</h3>
      <p className="text-sm text-muted-foreground/60 mb-6 max-w-[280px]">
        Get notified when risk levels change. Monitor suspicious activity as it happens.
      </p>
      <Button onClick={onAddFirst} className="bg-primary hover:bg-[#d97706] text-black font-medium">
        <Plus className="w-4 h-4 mr-2" />
        Add your first wallet
      </Button>
    </div>
  );
}

function WatchlistRow({
  item,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  onRemove,
  onUpdateNotes,
  onToggleNotifications,
  selectionMode,
}: {
  item: WatchlistItem;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onRemove: () => void;
  onUpdateNotes: (notes: string) => void;
  onToggleNotifications: () => void;
  selectionMode: boolean;
}) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(item.notes || "");

  const handleSaveNotes = () => {
    onUpdateNotes(notesValue);
    setIsEditingNotes(false);
  };

  return (
    <div
      className={`border-b border-[#1F1B14] last:border-b-0 transition-colors ${isSelected ? "bg-card/70" : ""}`}
    >
      {/* Main Row */}
      <div
        className="h-14 flex items-center justify-between px-4 hover:bg-card/50 cursor-pointer transition-colors"
        onClick={selectionMode ? onSelect : onToggle}
      >
        <div className="flex items-center gap-3">
          {selectionMode ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="text-muted-foreground/60 hover:text-muted-foreground"
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          ) : (
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground/60 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            />
          )}
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarFallback className={`${item.avatarColor} text-white text-xs font-mono`}>
                {item.wallet.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* New indicator */}
            {item.isNew && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{item.wallet}</span>
              {item.isNew && (
                <Badge className="text-[8px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">
                  NEW
                </Badge>
              )}
            </div>
            {item.alias && (
              <span className="text-[10px] text-muted-foreground/60">{item.alias}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini sparkline */}
          <div className="hidden sm:block">
            <RiskSparkline data={item.riskHistory} color={getRiskColor(item.riskLevel)} />
          </div>

          <Badge
            variant="outline"
            className={`text-[10px] font-mono px-1.5 py-0 h-5 ${getRiskBadgeStyles(item.riskLevel)}`}
          >
            {item.riskLevel}
          </Badge>
          <DeltaIndicator delta={item.delta} />

          {/* Notification bell */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleNotifications();
            }}
            className={`p-1 rounded transition-colors ${item.notificationsEnabled ? "text-primary" : "text-muted-foreground/60 hover:text-muted-foreground"}`}
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/60 hover:text-muted-foreground"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-border">
              <DropdownMenuItem asChild>
                <Link
                  href={`/operator/${item.wallet}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View full profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(item.wallet);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy address
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingNotes(true);
                  onToggle();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit notes
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-secondary" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-[#ef4444] hover:text-[#f87171]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from watchlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 pl-12 bg-[#0d0d0d] animate-in slide-in-from-top-2 duration-200">
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <Tag className="w-3 h-3 text-muted-foreground/60" />
              {item.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 h-4 bg-card text-muted-foreground border-border"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-[10px] text-muted-foreground/60 block mb-1">PnL 24h</span>
              <span
                className={`text-sm font-mono ${(item.pnl24h || 0) >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}
              >
                {formatPnl(item.pnl24h || 0)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground/60 block mb-1">PnL 7d</span>
              <span
                className={`text-sm font-mono ${(item.pnl7d || 0) >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}
              >
                {formatPnl(item.pnl7d || 0)}
              </span>
            </div>
          </div>

          {/* Recent tokens */}
          {item.recentTokens && item.recentTokens.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] text-muted-foreground/60 block mb-1.5">
                Recent Activity
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {item.recentTokens.map((token, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      token.action === "buy"
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : "bg-[#ef4444]/10 text-[#ef4444]"
                    }`}
                  >
                    {token.action === "buy" ? "+" : "-"}
                    {token.symbol}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risk chart larger */}
          <div className="mb-3">
            <span className="text-[10px] text-muted-foreground/60 block mb-1.5">
              Risk History (7d)
            </span>
            <div className="h-12 bg-background rounded border border-[#1F1B14] p-2 flex items-end gap-1">
              {item.riskHistory.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    height: `${value}%`,
                    backgroundColor: getRiskColor(item.riskLevel),
                    opacity: 0.3 + (i / item.riskHistory.length) * 0.7,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <span className="text-[10px] text-muted-foreground/60 block mb-1.5">Notes</span>
            {isEditingNotes ? (
              <div className="flex gap-2">
                <Input
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Add notes..."
                  className="flex-1 h-8 text-xs bg-background border-border text-foreground placeholder:text-muted-foreground/60"
                />
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  className="h-8 px-2 bg-[#22c55e] hover:bg-[#16a34a] text-black"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingNotes(false)}
                  className="h-8 px-2 text-muted-foreground/60"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <p
                className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => setIsEditingNotes(true)}
              >
                {item.notes || "Click to add notes..."}
              </p>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60 mb-3">
            <span>
              Last activity: <span className="text-muted-foreground">{item.lastActivity}</span>
            </span>
            <span>
              7d rug count: <span className="text-muted-foreground">{item.rugCount7d}</span>
            </span>
            {item.group && (
              <span>
                Group: <span className="text-muted-foreground">{item.group}</span>
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={`/operator/${item.wallet}`}
              className="text-xs text-primary hover:text-[#fbbf24] transition-colors"
            >
              view full profile
            </Link>
            <button
              onClick={onRemove}
              className="text-xs text-muted-foreground/60 hover:text-[#ef4444] transition-colors"
            >
              remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WatchlistPanel() {
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "changed" | "high-risk">("all");
  const [sort, setSort] = useState<"alpha" | "risk" | "change">("risk");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groups] = useState(defaultGroups);

  const maxWallets = 20;
  const usedWallets = watchlist.length;

  const handleAddWallet = () => {
    console.log("[v0] Add wallet modal triggered");
  };

  const handleRemoveWallet = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleBulkRemove = () => {
    setWatchlist((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedList.map((item) => item.id)));
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setWatchlist((prev) => prev.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  const handleToggleNotifications = (id: string) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, notificationsEnabled: !item.notificationsEnabled } : item,
      ),
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "Wallet",
      "Alias",
      "Risk Level",
      "Group",
      "Tags",
      "Notes",
      "PnL 24h",
      "PnL 7d",
    ];
    const rows = watchlist.map((item) => [
      item.wallet,
      item.alias || "",
      item.riskLevel,
      item.group || "",
      (item.tags || []).join(";"),
      item.notes || "",
      item.pnl24h || 0,
      item.pnl7d || 0,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watchlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAndSortedList = useMemo(() => {
    return watchlist
      .filter((item) => {
        // Group filter
        if (selectedGroup !== "All" && item.group !== selectedGroup) return false;

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            item.wallet.toLowerCase().includes(query) ||
            item.alias?.toLowerCase().includes(query) ||
            item.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        // Status filter
        if (filter === "changed") return item.delta !== "unchanged";
        if (filter === "high-risk")
          return item.riskLevel === "CRITICAL" || item.riskLevel === "HIGH";
        return true;
      })
      .sort((a, b) => {
        if (sort === "alpha") return a.wallet.localeCompare(b.wallet);
        if (sort === "risk") {
          const riskOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, SAFE: 4 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        }
        if (sort === "change") {
          const changeOrder = { up: 0, down: 1, unchanged: 2 };
          return changeOrder[a.delta] - changeOrder[b.delta];
        }
        return 0;
      });
  }, [watchlist, filter, sort, searchQuery, selectedGroup]);

  const isEmpty = watchlist.length === 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-[420px] bg-background border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-foreground">Your Watchlist</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/60 hover:text-muted-foreground"
                onClick={handleExportCSV}
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${selectionMode ? "text-primary" : "text-muted-foreground/60 hover:text-muted-foreground"}`}
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  setSelectedIds(new Set());
                }}
                title="Select multiple"
              >
                <CheckSquare className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/60 hover:text-primary hover:bg-primary/10"
                onClick={handleAddWallet}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <SlotsProgressBar used={usedWallets} max={maxWallets} />

          {!isEmpty && (
            <>
              {/* Search */}
              <div className="relative mt-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by address, alias, or tag..."
                  className="h-8 pl-8 text-xs bg-background border-border text-foreground placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Groups tabs */}
              <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-2.5 py-1 text-xs rounded whitespace-nowrap transition-colors ${
                      selectedGroup === group
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-card"
                    }`}
                  >
                    {group}
                    {group !== "All" && (
                      <span className="ml-1 text-[10px] text-muted-foreground/60">
                        ({watchlist.filter((w) => w.group === group).length})
                      </span>
                    )}
                  </button>
                ))}
                <button className="p-1 text-muted-foreground/60 hover:text-muted-foreground">
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs bg-transparent border-border text-muted-foreground hover:bg-card"
                    >
                      {filter === "all" ? "All" : filter === "changed" ? "Changed" : "High risk"}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border-border">
                    <DropdownMenuItem
                      onClick={() => setFilter("all")}
                      className="text-muted-foreground"
                    >
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter("changed")}
                      className="text-muted-foreground"
                    >
                      Changed today
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter("high-risk")}
                      className="text-muted-foreground"
                    >
                      High risk
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs bg-transparent border-border text-muted-foreground hover:bg-card"
                    >
                      Sort: {sort === "alpha" ? "A-Z" : sort === "risk" ? "Risk" : "Change"}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border-border">
                    <DropdownMenuItem
                      onClick={() => setSort("alpha")}
                      className="text-muted-foreground"
                    >
                      Alphabetical
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSort("risk")}
                      className="text-muted-foreground"
                    >
                      Risk level
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSort("change")}
                      className="text-muted-foreground"
                    >
                      Last change
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isEmpty ? (
            <EmptyState onAddFirst={handleAddWallet} />
          ) : (
            <>
              {/* Bulk actions bar */}
              {selectionMode && selectedIds.size > 0 && (
                <div className="px-4 py-2 bg-card border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {selectedIds.size === filteredAndSortedList.length
                        ? "Deselect all"
                        : "Select all"}
                    </button>
                    <span className="text-xs text-muted-foreground/60">
                      {selectedIds.size} selected
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkRemove}
                    className="h-6 text-xs bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30 border-0"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              )}

              {/* Watchlist Items */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredAndSortedList.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground/60">
                    No wallets found
                  </div>
                ) : (
                  filteredAndSortedList.map((item) => (
                    <WatchlistRow
                      key={item.id}
                      item={item}
                      isExpanded={expandedId === item.id}
                      isSelected={selectedIds.has(item.id)}
                      selectionMode={selectionMode}
                      onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      onSelect={() => handleToggleSelect(item.id)}
                      onRemove={() => handleRemoveWallet(item.id)}
                      onUpdateNotes={(notes) => handleUpdateNotes(item.id, notes)}
                      onToggleNotifications={() => handleToggleNotifications(item.id)}
                    />
                  ))
                )}
              </div>

              {/* Paywall Tease */}
              <div className="px-4 py-3 border-t border-border bg-[#0d0d0d]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground/60">
                    Free: {maxWallets} wallets | Pro: unlimited + email alerts
                  </p>
                  <Link
                    href="/pricing"
                    className="text-[10px] text-primary hover:text-[#fbbf24] transition-colors"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
