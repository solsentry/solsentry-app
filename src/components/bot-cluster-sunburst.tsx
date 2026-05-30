'use client'

import { useState, useEffect } from 'react'
import { SunburstChart } from '@/components/sunburst-chart'
import { ClusterDetailPanel } from '@/components/cluster-detail-panel'
import { RiskLegend } from '@/components/risk-legend'
import { SunburstSkeleton } from '@/components/sunburst-skeleton'
import { EmptyClusterState } from '@/components/empty-cluster-state'
import { SenaAIChat } from '@/components/sena-ai-chat'
import { BotCluster, MOCK_CLUSTERS, TOTAL_CLUSTERS_TRACKED, SelectedItem } from '@/lib/cluster-data'

type TopCount = 10 | 20 | 50

interface BotClusterSunburstProps {
  isLoading?: boolean
  isEmpty?: boolean
}

export function BotClusterSunburst({ isLoading = false, isEmpty = false }: BotClusterSunburstProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null)
  const [clusters, setClusters] = useState<BotCluster[]>([])
  const [loading, setLoading] = useState(true)
  const [topCount, setTopCount] = useState<TopCount>(20)

  useEffect(() => {
    if (isLoading) {
      setLoading(true)
      return
    }

    const timer = setTimeout(() => {
      if (!isEmpty) {
        setClusters(MOCK_CLUSTERS)
      }
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [isLoading, isEmpty])

  const displayedClusters = clusters.slice(0, topCount)

  return (
    <div className="w-full max-w-[1100px] mx-auto space-y-4">
      {/* Sunburst Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-foreground font-semibold">Bot Clusters</h2>
              <span className="text-muted-foreground/60 font-normal text-sm">· top {topCount}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Top count selector */}
              <div className="flex items-center gap-1 bg-background rounded-md p-1">
                {([10, 20, 50] as TopCount[]).map((count) => (
                  <button
                    key={count}
                    onClick={() => setTopCount(count)}
                    className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                      topCount === count
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground/60 hover:text-muted-foreground'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              
              <span className="text-[11px] font-mono text-muted-foreground/60">
                {TOTAL_CLUSTERS_TRACKED.toLocaleString()} clusters tracked
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Chart area */}
          <div className="flex-1 p-6">
            {loading ? (
              <SunburstSkeleton />
            ) : clusters.length === 0 ? (
              <EmptyClusterState />
            ) : (
              <>
                <SunburstChart
                  clusters={displayedClusters}
                  onSelect={setSelectedItem}
                  selectedItem={selectedItem}
                />
                
                {/* Legend */}
                <div className="mt-4">
                  <RiskLegend />
                </div>
              </>
            )}
          </div>

          {/* Detail panel */}
          {!loading && clusters.length > 0 && (
            <div className="w-[280px] border-l border-border p-4 bg-background/50">
              <ClusterDetailPanel
                selectedItem={selectedItem}
                onClose={() => setSelectedItem(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sena AI Chat */}
      <SenaAIChat selectedItem={selectedItem} />
    </div>
  )
}
