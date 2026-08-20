import { auth } from "@clerk/nextjs/server"

import { ItemCard } from "@/components/dashboard/item-card"
import { getRecentItems } from "@/lib/db/items"

export async function RecentItemsSection({
  view = "grid",
}: {
  view?: "grid" | "list"
}) {
  const { userId } = await auth.protect()

  const recentItems = await getRecentItems(userId)
  if (recentItems.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Recent items
      </h3>
      <div
        className={
          view === "list"
            ? "flex flex-col gap-3"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {recentItems.map((item) => (
          <ItemCard key={item.id} item={item} view={view} />
        ))}
      </div>
    </section>
  )
}
