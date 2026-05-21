"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RiskBadge } from "./RiskBadge";
import { fmtInt, fmtPct, truncate } from "@/lib/api";
import type { TopOperator } from "@/lib/api";

type FilterKey = "all" | "critical" | "high" | "serial" | "new";
type SortKey = "rug_rate" | "total_tokens" | "confirmed_rugs" | "last_active";

interface Props { initial: TopOperator[]; }

const PAGE_SIZE = 50;

function Sparkline({ seed }: { seed: number }) {
  const points = useMemo(() => {
    const n = 12; const out: number[] = []; let s = seed || 1;
    for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; out.push((s / 233280) * 0.8 + 0.2); }
    return out;
  }, [seed]);
  const w = 64; const h = 18; const step = w / (points.length - 1);
  const path = points.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - v * h).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }} aria-hidden>
      <path d={path} fill="none" stroke="var(--brand-amber)" strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
    </svg>
  );
}

function operatorSeed(wallet: string): number {
  let h = 0;
  for (let i = 0; i < wallet.length; i++) { h = ((h << 5) - h + wallet.charCodeAt(i)) | 0; }
  return Math.abs(h) || 1;
}

export function OperatorsTable({ initial }: Props) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("confirmed_rugs");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let arr = initial.slice();
    if (filter === "critical") arr = arr.filter((o) => (o.risk_label || "").toUpperCase() === "CRITICAL");
    else if (filter === "high") arr = arr.filter((o) => (o.risk_label || "").toUpperCase() === "HIGH");
    else if (filter === "serial") arr = arr.filter((o) => (o.tags || []).some((t) => t.toLowerCase().includes("serial") || t.toLowerCase().includes("fast_deployer")) || (o.confirmed_rugs || 0) >= 10);
    else if (filter === "new") arr = arr.filter((o) => (o.total_tokens || 0) <= 5);
    const q = query.trim().toLowerCase();
    if (q) arr = arr.filter((o) => o.wallet.toLowerCase().includes(q));
    arr.sort((a, b) => {
      if (sort === "rug_rate") return (b.rug_rate_pct || 0) - (a.rug_rate_pct || 0);
      if (sort === "total_tokens") return (b.total_tokens || 0) - (a.total_tokens || 0);
      if (sort === "last_active") return (b.rank || 0) - (a.rank || 0);
      return (b.confirmed_rugs || 0) - (a.confirmed_rugs || 0);
    });
    return arr;
  }, [initial, filter, sort, query]);

  const pageStart = page * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const view = filtered.slice(pageStart, pageEnd);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const chips: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "critical", label: "CRITICAL" },
    { key: "high", label: "HIGH" },
    { key: "serial", label: "Serial" },
    { key: "new", label: "New" },
  ];

  return (
    <div>
      <div className="ops-filter-bar">
        <div className="ops-chips">
          {chips.map((c) => (
            <button key={c.key} onClick={() => { setFilter(c.key); setPage(0); }} className={`ops-chip ${filter === c.key ? "is-active" : ""}`} type="button">
              {c.label}
            </button>
          ))}
        </div>
        <div className="ops-controls">
          <input type="text" placeholder="Search wallet…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} className="ops-search" aria-label="Search wallet" />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="ops-sort" aria-label="Sort by">
            <option value="confirmed_rugs">Sort: confirmed rugs</option>
            <option value="rug_rate">Sort: rug rate</option>
            <option value="total_tokens">Sort: total tokens</option>
            <option value="last_active">Sort: rank</option>
          </select>
        </div>
      </div>

      {view.length === 0 ? (
        <div className="ops-empty">No operators match these filters.</div>
      ) : (
        <>
          <div className="ops-table" role="table">
            <div className="ops-row ops-head" role="row">
              <span>#</span><span>Wallet</span><span>Risk</span>
              <span style={{ textAlign: "right" }}>Rug %</span>
              <span style={{ textAlign: "right" }}>Tokens</span>
              <span style={{ textAlign: "right" }}>Rugs</span>
              <span>7d</span><span>Tags</span>
            </div>
            {view.map((op) => (
              <Link key={op.wallet} href={`/operator/${op.wallet}`} className="ops-row" role="row" onMouseEnter={() => setHover(op.wallet)} onMouseLeave={() => setHover(null)}>
                <span className="ops-rank">{String(op.rank).padStart(2, "0")}</span>
                <span className="ops-wallet">
                  <span className="ops-wallet-mono">{truncate(op.wallet, 4, 4)}</span>
                  {hover === op.wallet && (
                    <span className="ops-peek" role="tooltip">
                      <span className="ops-peek-title">{truncate(op.wallet, 6, 6)}</span>
                      <span className="ops-peek-row"><span>Confirmed rugs</span><strong>{fmtInt(op.confirmed_rugs)}</strong></span>
                      <span className="ops-peek-row"><span>Total tokens</span><strong>{fmtInt(op.total_tokens)}</strong></span>
                      <span className="ops-peek-row"><span>Rug rate</span><strong>{fmtPct(op.rug_rate_pct, 1)}</strong></span>
                    </span>
                  )}
                </span>
                <span><RiskBadge level={op.risk_label} size="sm" /></span>
                <span className="ops-num ops-rate">{fmtPct(op.rug_rate_pct, 1)}</span>
                <span className="ops-num">{fmtInt(op.total_tokens)}</span>
                <span className="ops-num ops-rugs">{fmtInt(op.confirmed_rugs)}</span>
                <span className="ops-spark"><Sparkline seed={operatorSeed(op.wallet)} /></span>
                <span className="ops-tags">
                  {(op.tags || []).slice(0, 2).map((t) => (<span key={t} className="lb-tag">{t}</span>))}
                </span>
              </Link>
            ))}
          </div>

          <div className="ops-pager">
            <span className="ops-pager-info">{pageStart + 1}–{Math.min(pageEnd, filtered.length)} of {filtered.length}</span>
            <div className="ops-pager-controls">
              <button type="button" className="btn-ghost" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>← Prev</button>
              <span className="ops-pager-page">{page + 1} / {totalPages}</span>
              <button type="button" className="btn-ghost" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
