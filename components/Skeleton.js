export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-cream" />
      <div className="pt-4 space-y-2">
        <div className="h-5 bg-cream rounded w-3/4" />
        <div className="h-4 bg-cream rounded w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 animate-pulse">
      <div className="grid md:grid-cols-2 gap-20">
        <div className="aspect-square bg-cream" />
        <div className="space-y-4">
          <div className="h-4 bg-cream rounded w-1/4" />
          <div className="h-10 bg-cream rounded w-3/4" />
          <div className="h-6 bg-cream rounded w-1/4" />
          <div className="h-20 bg-cream rounded" />
          <div className="h-12 bg-cream rounded" />
        </div>
      </div>
    </div>
  );
}
