"use client";

import Link from "next/link";
import { BotCluster, ClusterWallet, RISK_COLORS, SelectedItem } from "@/lib/cluster-data";
import { ArrowRight, Copy, ExternalLink, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface DetailPanelProps {
  selectedItem: SelectedItem;
  onClose: () => void;
}

export function ClusterDetailPanel({ selectedItem, onClose }: DetailPanelProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!selectedItem) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground/60 text-sm">
        <div className="text-center">
          <div className="text-3xl mb-2 opacity-50">◎</div>
          <p>Select a cluster or wallet</p>
          <p className="text-xs mt-1 text-[#3f3f46]">Click to view details</p>
        </div>
      </div>
    );
  }

  // Wallet detail view
  if (selectedItem.type === "wallet") {
    const { wallet, parentCluster } = selectedItem;

    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
        {/* Back to cluster link */}
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-3 h-3" />
          Back
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: RISK_COLORS[parentCluster.risk] }}
            />
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${RISK_COLORS[parentCluster.risk]}20`,
                color: RISK_COLORS[parentCluster.risk],
              }}
            >
              {parentCluster.risk}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-foreground text-sm font-semibold">
              {truncateAddress(wallet.address)}
            </h3>
            <button
              onClick={() => copyToClipboard(wallet.address)}
              className="p-1 hover:bg-secondary rounded transition-colors"
              title="Copy full address"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-muted-foreground" />
            </button>
          </div>
          {copiedAddress === wallet.address && (
            <div className="text-[10px] text-[#22c55e] mt-1">Copied to clipboard!</div>
          )}
        </div>

        {/* Wallet stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-popover rounded-md p-3 border border-border">
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
              Deploys
            </div>
            <div className="font-mono text-foreground text-lg">
              {wallet.deploys.toLocaleString()}
            </div>
          </div>
          <div className="bg-popover rounded-md p-3 border border-border">
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
              Rugs
            </div>
            <div className="font-mono text-foreground text-lg">{wallet.rugs.toLocaleString()}</div>
          </div>
          <div className="col-span-2 bg-popover rounded-md p-3 border border-border">
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
              Rug Rate
            </div>
            <div className="font-mono text-2xl" style={{ color: RISK_COLORS[parentCluster.risk] }}>
              {wallet.rugRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Parent cluster info */}
        <div className="mb-4">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
            Parent Cluster
          </div>
          <div className="bg-popover rounded-md p-3 border border-border">
            <div className="flex items-center justify-between">
              <span className="font-mono text-foreground text-sm">
                Cluster #{parentCluster.clusterId}
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                {parentCluster.walletCount} wallets
              </span>
            </div>
          </div>
        </div>

        {/* Full address */}
        <div className="mb-4">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
            Full Address
          </div>
          <div className="bg-popover rounded-md p-2 border border-border font-mono text-[10px] text-muted-foreground break-all">
            {wallet.address}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-2">
          <a
            href={`https://solscan.io/account/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-secondary hover:bg-[#3f3f46] text-foreground text-sm font-medium transition-colors group"
          >
            View on Solscan
            <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100" />
          </a>
          <Link
            href={`/cluster/${parentCluster.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-border hover:bg-card text-muted-foreground text-sm font-medium transition-colors group"
          >
            View full cluster
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // Cluster detail view
  const cluster = selectedItem.cluster;

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: RISK_COLORS[cluster.risk] }}
          />
          <h3 className="font-mono text-foreground text-sm font-semibold">
            Cluster #{cluster.clusterId}
          </h3>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${RISK_COLORS[cluster.risk]}20`,
            color: RISK_COLORS[cluster.risk],
          }}
        >
          {cluster.risk}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-popover rounded-md p-3 border border-border">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
            Wallets
          </div>
          <div className="font-mono text-foreground text-lg">{cluster.walletCount}</div>
        </div>
        <div className="bg-popover rounded-md p-3 border border-border">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
            Total Deploys
          </div>
          <div className="font-mono text-foreground text-lg">
            {cluster.totalDeploys.toLocaleString()}
          </div>
        </div>
        <div className="bg-popover rounded-md p-3 border border-border">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
            Total Rugs
          </div>
          <div className="font-mono text-foreground text-lg">
            {cluster.totalRugs.toLocaleString()}
          </div>
        </div>
        <div className="bg-popover rounded-md p-3 border border-border">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
            Rug Rate
          </div>
          <div className="font-mono text-lg" style={{ color: RISK_COLORS[cluster.risk] }}>
            {cluster.rugRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
          Tags
        </div>
        <div className="flex flex-wrap gap-1.5">
          {cluster.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-mono text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Top wallets */}
      <div className="flex-1 min-h-0">
        <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
          Top 3 Wallets
        </div>
        <div className="space-y-2">
          {cluster.topWallets.map((wallet, index) => (
            <div
              key={wallet.address}
              className="bg-popover rounded-md p-2.5 border border-border group hover:border-[#3f3f46] transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    #{index + 1}
                  </span>
                  <span className="font-mono text-[11px] text-foreground">
                    {truncateAddress(wallet.address)}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(wallet.address)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded"
                  title="Copy address"
                >
                  <Copy className="w-3 h-3 text-muted-foreground/60" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-muted-foreground">
                  <span className="font-mono">{wallet.deploys}</span> deploys
                </span>
                <span className="text-muted-foreground">
                  <span className="font-mono">{wallet.rugs}</span> rugs
                </span>
                <span style={{ color: RISK_COLORS[cluster.risk] }}>
                  <span className="font-mono">{wallet.rugRate.toFixed(1)}%</span>
                </span>
              </div>
              {copiedAddress === wallet.address && (
                <div className="text-[10px] text-[#22c55e] mt-1">Copied!</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View link */}
      <Link
        href={`/cluster/${cluster.id}`}
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-secondary hover:bg-[#3f3f46] text-foreground text-sm font-medium transition-colors group"
      >
        View full cluster
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
