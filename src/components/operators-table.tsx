"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Copy, ArrowUp, ArrowDown, ExternalLink, User } from "lucide-react";
import { cn, truncateAddress, formatRelativeTime, formatNumber } from "@/lib/utils";
import { mockOperators, type Operator, type RiskLevel } from "@/lib/mock-data";
import { RiskBadge } from "./risk-badge";
import { MiniSparkline } from "./mini-sparkline";
import { FilterPills, type FilterValue } from "./filter-pills";
import { SortDropdown, type SortField, type SortDirection } from "./sort-dropdown";
import { SearchInput } from "./search-input";

type SortableColumn = "rank" | "wallet" | "rugRate" | "tokensDeployed" | "lastActive";

function getRateColor(rate: number): string {
  if (rate >= 90) return "text-[#ef4444]";
  if (rate >= 70) return "text-primary";
  return "text-[#eab308]";
}

function getSparklineColor(level: RiskLevel): string {
  if (level === "CRITICAL") return "#ef4444";
  if (level === "HIGH") return "#C17D0E";
  return "#eab308";
}

// External links
function getSolscanUrl(wallet: string): string {
  return `https://solscan.io/account/${wallet}`;
}

export function OperatorsTable({ operators = mockOperators }: { operators?: Operator[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("rugRate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [columnSort, setColumnSort] = useState<{
    field: SortableColumn;
    direction: SortDirection;
  } | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const filteredData = useMemo(() => {
    let data = [...operators];

    // Apply filter
    if (filter === "critical") {
      data = data.filter((op) => op.riskLevel === "CRITICAL");
    } else if (filter === "high") {
      data = data.filter((op) => op.riskLevel === "HIGH");
    } else if (filter === "serial") {
      data = data.filter((op) => op.tags.includes("serial_deployer"));
    } else if (filter === "new") {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      data = data.filter((op) => op.lastActive.getTime() > sevenDaysAgo);
    }

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (op) => op.wallet.toLowerCase().includes(q) || (op.sns && op.sns.toLowerCase().includes(q)),
      );
    }

    // Apply sort
    const actualSortField = columnSort?.field ?? sortField;
    const actualDirection = columnSort?.direction ?? sortDirection;

    data.sort((a, b) => {
      let comparison = 0;
      switch (actualSortField) {
        case "rank":
          comparison = a.rank - b.rank;
          break;
        case "wallet":
          comparison = a.wallet.localeCompare(b.wallet);
          break;
        case "rugRate":
          comparison = a.rugRate - b.rugRate;
          break;
        case "rugs":
          comparison = a.rugs - b.rugs;
          break;
        case "tokensDeployed":
          comparison = a.tokensDeployed - b.tokensDeployed;
          break;
        case "lastActive":
          comparison = a.lastActive.getTime() - b.lastActive.getTime();
          break;
      }
      return actualDirection === "desc" ? -comparison : comparison;
    });

    return data;
  }, [filter, search, sortField, sortDirection, columnSort]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const counts: Record<FilterValue, number> = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      all: operators.length,
      critical: operators.filter((op) => op.riskLevel === "CRITICAL").length,
      high: operators.filter((op) => op.riskLevel === "HIGH").length,
      serial: operators.filter((op) => op.tags.includes("serial_deployer")).length,
      new: operators.filter((op) => op.lastActive.getTime() > sevenDaysAgo).length,
    };
  }, []);

  const handleCopyWallet = (e: React.MouseEvent, wallet: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet);
    toast.success("Address copied", {
      description: truncateAddress(wallet, 8),
    });
  };

  const handleRowClick = (operator: Operator) => {
    console.log(`Navigate to /operator/${operator.wallet}`);
  };

  const handleColumnSort = (field: SortableColumn) => {
    if (columnSort?.field === field) {
      setColumnSort({
        field,
        direction: columnSort.direction === "desc" ? "asc" : "desc",
      });
    } else {
      setColumnSort({ field, direction: "desc" });
    }
  };

  const SortIndicator = ({ field }: { field: SortableColumn }) => {
    if (columnSort?.field !== field) return null;
    return columnSort.direction === "desc" ? (
      <ArrowDown className="w-3 h-3 text-primary" />
    ) : (
      <ArrowUp className="w-3 h-3 text-primary" />
    );
  };

  return (
    <div className="w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <FilterPills
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
          counts={counts}
        />
        <div className="flex items-center gap-3">
          <SortDropdown
            value={sortField}
            direction={sortDirection}
            onChange={(f, d) => {
              setSortField(f);
              setSortDirection(d);
              setColumnSort(null);
            }}
          />
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            className="w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#18181b]">
                <th
                  className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() => handleColumnSort("rank")}
                >
                  <span className="inline-flex items-center gap-1">
                    # <SortIndicator field="rank" />
                  </span>
                </th>
                <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  <span className="sr-only">Avatar</span>
                </th>
                <th
                  className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() => handleColumnSort("wallet")}
                >
                  <span className="inline-flex items-center gap-1">
                    Wallet <SortIndicator field="wallet" />
                  </span>
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  SNS
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Risk
                </th>
                <th
                  className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() => handleColumnSort("rugRate")}
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Rug Rate <SortIndicator field="rugRate" />
                  </span>
                </th>
                <th
                  className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() => handleColumnSort("tokensDeployed")}
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Tokens <SortIndicator field="tokensDeployed" />
                  </span>
                </th>
                <th
                  className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() => handleColumnSort("lastActive")}
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Last Active <SortIndicator field="lastActive" />
                  </span>
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  7d Rugs
                </th>
                <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center">
                    <p className="text-muted-foreground/60 text-sm">
                      No operators match &apos;{filter.toUpperCase()}
                      {search ? ` + "${search}"` : ""}&apos;. Try broader filter.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((op, idx) => (
                  <tr
                    key={op.wallet}
                    onClick={() => handleRowClick(op)}
                    className={cn(
                      "h-12 cursor-pointer transition-all group",
                      idx % 2 === 0 ? "bg-[#0c0c0c]" : "bg-[#18181b]/30",
                      "hover:bg-card hover:border-l-2 hover:border-l-primary",
                    )}
                  >
                    <td className="px-3 py-2 text-muted-foreground/60 text-xs font-mono">
                      {op.rank}
                    </td>
                    <td className="px-2 py-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
                        {op.avatarUrl ? (
                          <Image
                            src={op.avatarUrl}
                            alt=""
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground/60" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={(e) => handleCopyWallet(e, op.wallet)}
                        className="inline-flex items-center gap-1.5 text-foreground font-mono text-xs hover:text-primary transition-colors group/wallet"
                      >
                        {truncateAddress(op.wallet, 4)}
                        <Copy className="w-3 h-3 opacity-0 group-hover/wallet:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {op.sns || <span className="text-muted-foreground/60">—</span>}
                    </td>
                    <td className="px-3 py-2">
                      <RiskBadge level={op.riskLevel} />
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 text-right font-mono text-xs font-semibold",
                        getRateColor(op.rugRate),
                      )}
                    >
                      {op.rugRate.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                      {formatNumber(op.tokensDeployed)}
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-muted-foreground/60">
                      {formatRelativeTime(op.lastActive)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end">
                        <MiniSparkline
                          data={op.rugHistory}
                          color={getSparklineColor(op.riskLevel)}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center">
                        <a
                          href={getSolscanUrl(op.wallet)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded hover:bg-secondary text-muted-foreground/60 hover:text-primary transition-colors"
                          title="View on Solscan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs">
          <span className="text-muted-foreground/60">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredData.length)} of{" "}
            {filteredData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={cn(
                "px-3 py-1.5 rounded-md transition-colors",
                page === 1
                  ? "text-muted-foreground/60 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "w-8 h-8 rounded-md text-xs font-medium transition-colors",
                  p === page
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={cn(
                "px-3 py-1.5 rounded-md transition-colors",
                page === totalPages
                  ? "text-muted-foreground/60 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
