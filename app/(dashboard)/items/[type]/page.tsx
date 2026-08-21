import { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { FileIcon } from "@phosphor-icons/react/dist/ssr"

import { ItemCard } from "@/components/dashboard/item-card"
import { TopBar } from "@/components/dashboard/top-bar"
import { ViewToggle } from "@/components/dashboard/view-toggle"
import { getItemTypeBySlug } from "@/lib/db/item-types"
import { getItemsByType } from "@/lib/db/items"
import { iconsByName } from "@/lib/type-icons"

export default async function ItemsByTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>
  searchParams: Promise<{ view?: string }>
}) {
  const { userId } = await auth.protect()
  const { type: slug } = await params
  const view = (await searchParams).view === "list" ? "list" : "grid"

  const type = await getItemTypeBySlug(userId, slug)
  if (!type) notFound()

  const items = await getItemsByType(userId, type.id)
  const TypeIcon = iconsByName[type.icon] ?? FileIcon

  return (
    <>
      <TopBar />
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-7 sm:px-6">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight capitalize sm:text-3xl">
            <TypeIcon style={{ color: type.color }} />
            {type.name}s
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <Suspense fallback={null}>
          <ViewToggle />
        </Suspense>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No {type.name.toLowerCase()}s yet.
            </p>
          ) : (
            <div
              className={
                view === "list"
                  ? "flex flex-col gap-3"
                  : "grid grid-cols-1 gap-4 md:grid-cols-2"
              }
            >
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  view={view}
                  accentBorder
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
