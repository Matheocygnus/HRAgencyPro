export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className ?? ''}`}
    aria-label="loading"
  />
)

export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div role="table" aria-label="loading table">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} role="row" style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4 w-full" />
        ))}
      </div>
    ))}
  </div>
)
