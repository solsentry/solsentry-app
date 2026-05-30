"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import {
  BotCluster,
  ClusterWallet,
  RISK_COLORS,
  RiskLevel,
  SelectedItem,
} from "@/lib/cluster-data";

interface SunburstChartProps {
  clusters: BotCluster[];
  onSelect: (item: SelectedItem) => void;
  selectedItem: SelectedItem;
}

interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
  data?: BotCluster;
  risk?: RiskLevel;
  isWallet?: boolean;
  walletAddress?: string;
  parentCluster?: BotCluster;
  walletData?: ClusterWallet;
}

interface TooltipData {
  type: "cluster" | "wallet";
  cluster?: BotCluster;
  wallet?: ClusterWallet;
}

export function SunburstChart({ clusters, onSelect, selectedItem }: SunburstChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleDoubleClick = useCallback(
    (cluster: BotCluster) => {
      router.push(`/cluster/${cluster.id}`);
    },
    [router],
  );

  // Check if an item is selected
  const isItemSelected = useCallback(
    (nodeData: HierarchyNode): boolean => {
      if (!selectedItem) return false;

      if (nodeData.isWallet && selectedItem.type === "wallet") {
        return nodeData.walletAddress === selectedItem.wallet.address;
      }

      if (!nodeData.isWallet && selectedItem.type === "cluster") {
        return nodeData.data?.id === selectedItem.cluster.id;
      }

      return false;
    },
    [selectedItem],
  );

  useEffect(() => {
    if (!svgRef.current || clusters.length === 0) return;

    const width = 420;
    const height = 420;
    const radius = Math.min(width, height) / 2;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "10px JetBrains Mono, monospace");

    // Build hierarchy with wallet data
    const hierarchyData: HierarchyNode = {
      name: "root",
      children: clusters.map((cluster) => ({
        name: `Cluster #${cluster.clusterId}`,
        value: cluster.walletCount,
        data: cluster,
        risk: cluster.risk,
        children: cluster.topWallets.slice(0, 4).map((wallet) => ({
          name: wallet.address.slice(0, 8),
          value: Math.max(wallet.deploys, 5),
          isWallet: true,
          walletAddress: wallet.address,
          walletData: wallet,
          risk: cluster.risk,
          parentCluster: cluster,
        })),
      })),
    };

    const root = d3
      .hierarchy(hierarchyData)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<HierarchyNode>().size([2 * Math.PI, radius]);

    partition(root);

    // Arc generator with fixed radii
    const arc = d3
      .arc<d3.HierarchyRectangularNode<HierarchyNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d) => (d.depth === 1 ? 60 : 130))
      .outerRadius((d) => (d.depth === 1 ? 125 : 175));

    const nodes = root.descendants().filter((d) => d.depth > 0);

    // Create group for each arc
    const arcGroups = svg
      .selectAll("g.arc")
      .data(nodes)
      .join("g")
      .attr("class", "arc")
      .style("pointer-events", "all");

    // Add paths
    arcGroups
      .append("path")
      .attr("fill", (d) => {
        const nodeData = d.data as HierarchyNode;
        const risk = nodeData.risk || "MEDIUM";
        const baseColor = RISK_COLORS[risk];
        return nodeData.isWallet
          ? d3.color(baseColor)?.darker(0.3)?.toString() || baseColor
          : baseColor;
      })
      .attr("fill-opacity", (d) => {
        const nodeData = d.data as HierarchyNode;
        if (isItemSelected(nodeData)) return 1;
        return nodeData.isWallet ? 0.65 : 0.85;
      })
      .attr("d", arc as unknown as (d: unknown) => string)
      .attr("stroke", (d) => {
        const nodeData = d.data as HierarchyNode;
        return isItemSelected(nodeData) ? "#F2EDE4" : "transparent";
      })
      .attr("stroke-width", (d) => {
        const nodeData = d.data as HierarchyNode;
        return isItemSelected(nodeData) ? 2 : 0;
      })
      .style("cursor", "pointer")
      .style("transition", "all 0.15s ease-out")
      .style("pointer-events", "all")
      .on("mouseenter", function (event, d) {
        const nodeData = d.data as HierarchyNode;

        d3.select(this)
          .raise()
          .transition()
          .duration(150)
          .attr("fill-opacity", 1)
          .attr("transform", nodeData.isWallet ? "scale(1.05)" : "scale(1.02)")
          .style("filter", `drop-shadow(0 0 12px ${RISK_COLORS[nodeData.risk || "MEDIUM"]}80)`);

        const rect = svgRef.current!.getBoundingClientRect();
        setTooltipPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });

        if (nodeData.isWallet && nodeData.walletData) {
          setTooltipData({
            type: "wallet",
            wallet: nodeData.walletData,
            cluster: nodeData.parentCluster,
          });
        } else if (nodeData.data) {
          setTooltipData({
            type: "cluster",
            cluster: nodeData.data,
          });
        }
      })
      .on("mousemove", function (event) {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltipPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      })
      .on("mouseleave", function (event, d) {
        const nodeData = d.data as HierarchyNode;
        const selected = isItemSelected(nodeData);

        setTooltipData(null);

        d3.select(this)
          .transition()
          .duration(150)
          .attr("fill-opacity", selected ? 1 : nodeData.isWallet ? 0.65 : 0.85)
          .attr("transform", "scale(1)")
          .style(
            "filter",
            selected ? `drop-shadow(0 0 8px ${RISK_COLORS[nodeData.risk || "MEDIUM"]}50)` : "none",
          );
      })
      .on("click", function (event, d) {
        event.stopPropagation();
        const nodeData = d.data as HierarchyNode;

        // Check if clicking same item to deselect
        if (isItemSelected(nodeData)) {
          onSelect(null);
          return;
        }

        if (nodeData.isWallet && nodeData.walletData && nodeData.parentCluster) {
          // Select wallet
          onSelect({
            type: "wallet",
            wallet: nodeData.walletData,
            parentCluster: nodeData.parentCluster,
          });
        } else if (nodeData.data) {
          // Select cluster
          onSelect({
            type: "cluster",
            cluster: nodeData.data,
          });
        }
      })
      .on("dblclick", function (event, d) {
        const nodeData = d.data as HierarchyNode;
        const cluster = nodeData.isWallet ? nodeData.parentCluster : nodeData.data;
        if (cluster) {
          handleDoubleClick(cluster);
        }
      });

    // Center styling
    const defs = svg.append("defs");

    const glowGradient = defs
      .append("radialGradient")
      .attr("id", "center-glow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    glowGradient.append("stop").attr("offset", "70%").attr("stop-color", "#18150F");

    glowGradient.append("stop").attr("offset", "100%").attr("stop-color", "#1F1B14");

    svg
      .append("circle")
      .attr("r", 54)
      .attr("fill", "none")
      .attr("stroke", "#2A251C")
      .attr("stroke-width", 1);

    svg.append("circle").attr("r", 52).attr("fill", "url(#center-glow)");

    svg
      .append("circle")
      .attr("r", 52)
      .attr("fill", "none")
      .attr("stroke", "#C17D0E")
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.3);

    // Center text
    const centerGroup = svg.append("g").attr("class", "center-content");
    const totalWallets = clusters.reduce((sum, c) => sum + c.walletCount, 0);

    centerGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .attr("fill", "#F2EDE4")
      .style("font-size", "22px")
      .style("font-weight", "700")
      .style("font-family", "JetBrains Mono, monospace")
      .style("letter-spacing", "-0.02em")
      .text(totalWallets.toLocaleString());

    centerGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", "#5A5448")
      .style("font-size", "9px")
      .style("font-weight", "500")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.1em")
      .text("BOT WALLETS");

    centerGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.8em")
      .attr("fill", "#B8B0A0")
      .style("font-size", "9px")
      .style("font-family", "JetBrains Mono, monospace")
      .text(`${clusters.length} clusters`);
  }, [clusters, selectedItem, onSelect, handleDoubleClick, isItemSelected]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="mx-auto" />

      {tooltipData && (
        <div
          className="absolute pointer-events-none z-50 px-3 py-2 rounded-md bg-card border border-border shadow-lg max-w-[220px]"
          style={{
            left: tooltipPosition.x + 16,
            top: tooltipPosition.y - 10,
          }}
        >
          {tooltipData.type === "cluster" && tooltipData.cluster && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: RISK_COLORS[tooltipData.cluster.risk] }}
                />
                <span className="font-mono text-foreground font-medium">
                  Cluster #{tooltipData.cluster.clusterId}
                </span>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                <span className="text-muted-foreground/60">Wallets</span>
                <span className="font-mono text-muted-foreground text-right">
                  {tooltipData.cluster.walletCount}
                </span>
                <span className="text-muted-foreground/60">Deploys</span>
                <span className="font-mono text-muted-foreground text-right">
                  {tooltipData.cluster.totalDeploys.toLocaleString()}
                </span>
                <span className="text-muted-foreground/60">Rug Rate</span>
                <span className="font-mono text-muted-foreground text-right">
                  {tooltipData.cluster.rugRate.toFixed(1)}%
                </span>
              </div>
            </>
          )}
          {tooltipData.type === "wallet" && tooltipData.wallet && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: RISK_COLORS[tooltipData.cluster?.risk || "MEDIUM"] }}
                />
                <span className="font-mono text-foreground text-[10px]">
                  {tooltipData.wallet.address.slice(0, 4)}...{tooltipData.wallet.address.slice(-4)}
                </span>
              </div>
              <div className="mt-1.5 text-[10px] text-muted-foreground/60">
                Cluster #{tooltipData.cluster?.clusterId}
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                <span className="text-muted-foreground/60">Deploys</span>
                <span className="font-mono text-muted-foreground text-right">
                  {tooltipData.wallet.deploys.toLocaleString()}
                </span>
                <span className="text-muted-foreground/60">Rugs</span>
                <span className="font-mono text-muted-foreground text-right">
                  {tooltipData.wallet.rugs.toLocaleString()}
                </span>
                <span className="text-muted-foreground/60">Rug Rate</span>
                <span className="font-mono text-muted-foreground text-right">
                  {tooltipData.wallet.rugRate.toFixed(1)}%
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
