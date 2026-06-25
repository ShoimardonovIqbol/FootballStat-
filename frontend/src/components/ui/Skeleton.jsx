const shimmer = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 6,
}

export function Skeleton({ style = {} }) {
  return <div className="shimmer" style={{ borderRadius: 6, ...style }} />
}

export function MatchCardSkeleton() {
  return (
    <div style={{
      padding: 14, borderRadius: 14,
      background: 'rgba(16,16,42,0.7)',
      border: '1px solid rgba(124,58,237,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Skeleton style={{ width: 28, height: 28, borderRadius: '50%' }} />
        <Skeleton style={{ height: 12, flex: 1 }} />
        <Skeleton style={{ height: 32, width: 72, borderRadius: 10 }} />
        <Skeleton style={{ height: 12, flex: 1 }} />
        <Skeleton style={{ width: 28, height: 28, borderRadius: '50%' }} />
      </div>
    </div>
  )
}

export function PlayerSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
      <Skeleton style={{ width: 20, height: 12 }} />
      <Skeleton style={{ width: 38, height: 38, borderRadius: '50%' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton style={{ height: 12, width: 110 }} />
        <Skeleton style={{ height: 10, width: 80 }} />
      </div>
      <Skeleton style={{ width: 36, height: 36, borderRadius: 10 }} />
    </div>
  )
}
