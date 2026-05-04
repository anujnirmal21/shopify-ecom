export default function Loading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 animate-pulse">
          {/* Image gallery skeleton */}
          <div className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 w-full bg-muted rounded-md"></div>
                ))}
              </div>
            </div>
            <div className="aspect-h-1 aspect-w-1 w-full bg-muted h-[500px] rounded-lg"></div>
          </div>

          {/* Info skeleton */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-3 mb-10">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <div className="h-12 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
