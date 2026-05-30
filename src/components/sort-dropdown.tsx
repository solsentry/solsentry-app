'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export type SortField = 'rugRate' | 'rugs' | 'tokensDeployed' | 'lastActive'
export type SortDirection = 'asc' | 'desc'

interface SortDropdownProps {
  value: SortField
  direction: SortDirection
  onChange: (field: SortField, direction: SortDirection) => void
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'rugRate', label: 'Rug rate' },
  { value: 'rugs', label: 'Total rugs' },
  { value: 'tokensDeployed', label: 'Tokens deployed' },
  { value: 'lastActive', label: 'Last active' },
]

export function SortDropdown({ value, direction, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLabel = sortOptions.find((o) => o.value === value)?.label

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
          'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
        )}
      >
        Sort: {currentLabel}
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-lg bg-card border border-border shadow-lg shadow-black/50 z-50 overflow-hidden">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                const newDirection = value === option.value && direction === 'desc' ? 'asc' : 'desc'
                onChange(option.value, newDirection)
                setOpen(false)
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs transition-colors',
                value === option.value
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              {option.label}
              {value === option.value && (
                <span className="flex items-center gap-1 text-primary">
                  <Check className="w-3 h-3" />
                  <span className="text-[10px]">{direction === 'desc' ? 'DESC' : 'ASC'}</span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
