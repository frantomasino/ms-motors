export default function CarDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 h-14 sm:h-[4.25rem] mt-[2px] flex items-center px-4">
        <div className="h-4 w-32 bg-gray-100 rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Galería skeleton */}
          <div>
            <div className="rounded-2xl bg-gray-200 aspect-[4/3] w-full" />
            <div className="flex gap-2 mt-3">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="h-16 w-20 rounded-xl bg-gray-200 shrink-0" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="h-3 w-16 bg-gray-200 rounded-full mb-2" />
              <div className="h-8 w-48 bg-gray-200 rounded-full mb-3" />
              <div className="h-8 w-32 bg-gray-200 rounded-full" />
            </div>
            <div className="h-7 w-44 bg-gray-100 rounded-full" />
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div className="h-3 w-24 bg-gray-100 rounded-full" />
                  <div className="h-3 w-16 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
            <div className="h-14 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}