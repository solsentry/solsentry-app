'use client'

export function SunburstSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-[400px] h-[400px]">
        {/* Outer ring skeleton */}
        <div className="absolute inset-0 rounded-full border-[40px] border-border animate-pulse" />
        
        {/* Inner ring skeleton */}
        <div className="absolute inset-[60px] rounded-full border-[30px] border-[#1F1B14] animate-pulse" />
        
        {/* Center circle */}
        <div className="absolute inset-[100px] rounded-full bg-popover border border-border flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-3 bg-secondary rounded animate-pulse mx-auto mb-2" />
            <div className="w-6 h-5 bg-secondary rounded animate-pulse mx-auto mb-2" />
            <div className="w-12 h-2 bg-secondary rounded animate-pulse mx-auto" />
          </div>
        </div>
        
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(250,250,250,0.03) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>
      
      {/* Legend skeleton */}
      <div className="mt-6 flex gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <div className="w-12 h-2 bg-secondary rounded animate-pulse" />
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
