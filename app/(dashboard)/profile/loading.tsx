import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <>
      <header className="flex h-18 shrink-0 items-center gap-4 border-b border-border px-6">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 w-20" />
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col gap-6">
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </>
  )
}
