export function Skeleton({ className = '', style = {} }) {
  return <div className={`shimmer ${className}`} style={style} />
}

export function MatchCardSkeleton() {
  return (
    <div className="glass p-4" style={{ borderRadius: 14 }}>
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-10" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-3 flex-1" />
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-3 flex-1" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  )
}

export function PlayerSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-6 h-3" />
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-2 w-20" />
      </div>
      <Skeleton className="w-9 h-9 rounded-xl" />
    </div>
  )
}
