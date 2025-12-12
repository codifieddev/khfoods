export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="aspect-square w-full rounded-md bg-gray-200"></div>
          
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-3/4 rounded bg-gray-200"></div>
            <div className="h-6 w-1/4 rounded bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200"></div>
              <div className="h-4 w-full rounded bg-gray-200"></div>
              <div className="h-4 w-2/3 rounded bg-gray-200"></div>
            </div>
            <div className="h-12 w-full rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
