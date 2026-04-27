function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-4 w-32 bg-gray-100 rounded-full" />
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="h-3 w-20 bg-gray-100 rounded-full" />
          <div className="h-3 w-16 bg-gray-100 rounded-full" />
          <div className="h-3 w-14 bg-gray-100 rounded-full" />
          <div className="h-3 w-18 bg-gray-100 rounded-full" />
        </div>
        <div className="h-px bg-gray-100 mt-1" />
        <div className="flex gap-2 mt-1">
          <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="h-16 border-b border-gray-100 bg-white/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="hidden md:flex gap-4">
            {[64, 56, 60, 56].map((w, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-full h-4" style={{ width: w }} />
            ))}
          </div>
          <div className="h-9 w-28 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-gray-900 animate-pulse" style={{ minHeight: "92vh" }}>
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-end h-full pb-20 pt-32" style={{ minHeight: "calc(92vh - 80px)" }}>
          <div className="max-w-2xl flex flex-col gap-4">
            <div className="h-6 w-48 bg-white/10 rounded-full" />
            <div className="h-16 w-96 bg-white/10 rounded-2xl" />
            <div className="h-16 w-72 bg-white/10 rounded-2xl" />
            <div className="h-5 w-80 bg-white/10 rounded-full mt-2" />
            <div className="flex gap-3 mt-4">
              <div className="h-12 w-36 bg-white/10 rounded-full" />
              <div className="h-12 w-32 bg-white/10 rounded-full" />
            </div>
            <div className="flex gap-8 mt-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="h-7 w-16 bg-white/10 rounded-full" />
                  <div className="h-3 w-24 bg-white/10 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-56 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-10 w-24 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}