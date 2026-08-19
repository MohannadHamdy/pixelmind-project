import { ItemCard } from "@/components/dashboard/item-card"
import { items } from "@/lib/mock-data"

export function PinnedItemsSection() {
  const pinnedItems = items.filter((item) => item.isPinned)

  if (pinnedItems.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Pinned
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pinnedItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
