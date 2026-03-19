export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };
  return (
    <div
      className={`${sizes[size]} border-primary-container border-t-transparent rounded-full animate-spin`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/10 animate-pulse">
      <div className="h-72 bg-surface-container-high" />
      <div className="p-8 space-y-4">
        <div className="h-5 w-3/4 bg-surface-container-high rounded" />
        <div className="h-4 w-1/2 bg-surface-container-high rounded" />
        <div className="flex justify-between mt-4">
          <div className="h-6 w-24 bg-surface-container-high rounded" />
          <div className="h-6 w-20 bg-surface-container-high rounded" />
        </div>
        <div className="h-12 w-full bg-surface-container-high rounded-lg mt-2" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-5 animate-pulse border-b border-outline-variant/5">
      <div className="w-12 h-12 rounded bg-surface-container-high shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 bg-surface-container-high rounded" />
        <div className="h-3 w-1/4 bg-surface-container-high rounded" />
      </div>
      <div className="h-4 w-24 bg-surface-container-high rounded" />
      <div className="h-6 w-16 bg-surface-container-high rounded-full" />
      <div className="flex gap-2 ml-auto">
        <div className="h-4 w-12 bg-surface-container-high rounded" />
        <div className="h-4 w-14 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
          Loading...
        </p>
      </div>
    </div>
  );
}
