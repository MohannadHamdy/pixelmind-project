import { auth } from "@clerk/nextjs/server"

import { ItemCard } from "@/components/dashboard/item-card"
import { getPinnedItems } from "@/lib/db/items"

export async function PinnedItemsSection({
  view = "grid",
}: {
  view?: "grid" | "list"
}) {
  const { userId } = await auth.protect()

  const pinnedItems = await getPinnedItems(userId)
  if (pinnedItems.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Pinned
      </h3>
      <div
        className={
          view === "list"
            ? "flex flex-col gap-3"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {pinnedItems.map((item) => (
          <ItemCard key={item.id} item={item} view={view} />
        ))}
      </div>
    </section>
  )
}
