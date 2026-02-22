/**
 * Native Next.js loading UI for the /scanner route.
 * Shown automatically while the page is streaming or suspending.
 * Uses skeleton placeholders that match the scanner table layout.
 */
export default function ScannerLoading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 space-y-6" aria-busy="true" aria-label="Loading scanner">
      {/* Controls skeleton */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col gap-1 md:w-40">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-9 w-full rounded-lg bg-gray-200" />
          </div>
        ))}
        <div className="flex flex-col gap-1 md:w-28 md:self-end">
          <div className="h-9 w-full rounded-lg bg-gray-300" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
        {/* Header */}
        <div className="grid grid-cols-6 border-b border-gray-100 bg-gray-50 px-4 py-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-3 rounded bg-gray-200" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 border-b border-gray-50 px-4 py-3 gap-4 last:border-0"
          >
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 w-3/4 rounded bg-gray-100" />
            <div className="h-5 w-14 rounded-full bg-gray-200" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
