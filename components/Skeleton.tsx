export function CardSkeleton() {
  return (
    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-zinc-700 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
          <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
          <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-5 bg-zinc-700 rounded w-20"></div>
          <div className="h-3 bg-zinc-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-zinc-700 rounded-lg"></div>
        <div className="h-4 bg-zinc-700 rounded w-20"></div>
      </div>
      <div className="h-8 bg-zinc-700 rounded w-16"></div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-zinc-700 animate-pulse">
      <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
        <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
      </div>
      <div className="h-6 bg-zinc-700 rounded w-20"></div>
      <div className="h-5 bg-zinc-700 rounded w-16"></div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
