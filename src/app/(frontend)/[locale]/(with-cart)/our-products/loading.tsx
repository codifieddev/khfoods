export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8 h-8 w-1/4 rounded bg-gray-200"></div>
        
        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square w-full rounded-md bg-gray-200"></div>
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
