import { Skeleton } from "@/components/ui/skeleton"

export default function ItemsByTypeLoading() {
  return (
    <>
      <header className="flex h-18 shrink-0 items-center gap-4 border-b border-border px-6">
        <Skeleton className="h-9 max-w-md flex-1 rounded-xl" />
        <div className="ml-auto flex items-center gap-3">
          <Skeleton className="h-9 w-16 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </header>
      <div className="border-b border-border px-4 py-7 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
