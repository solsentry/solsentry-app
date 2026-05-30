'use client'

import { cn } from '@/lib/utils'

export type FilterValue = 'all' | 'critical' | 'high' | 'serial' | 'new'

interface FilterPillsProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
  counts: Record<FilterValue, number>
}

const filters: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'CRITICAL' },
  { value: 'high', label: 'HIGH' },
  { value: 'serial', label: 'Serial' },
  { value: 'new', label: 'New <7d' },
]

export function FilterPills({ value, onChange, counts }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-1">
      {filters.map((filter) => {
        const isActive = value === filter.value
        const count = counts[filter.value]
        
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              isActive
                ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            {filter.label}
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'bg-secondary text-muted-foreground/60'
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
