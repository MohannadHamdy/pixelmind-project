import { ArrowUpRightIcon, StarIcon } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent } from "@/components/ui/card"
import { collections } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const collectionColorStyles: Record<string, string> = {
  emerald: "bg-gradient-to-br from-emerald-500/25 to-emerald-500/5",
  teal: "bg-gradient-to-br from-teal-500/25 to-teal-500/5",
  violet: "bg-gradient-to-br from-violet-500/25 to-violet-500/5",
  amber: "bg-gradient-to-br from-amber-500/25 to-amber-500/5",
  rose: "bg-gradient-to-br from-rose-500/25 to-rose-500/5",
  blue: "bg-gradient-to-br from-blue-500/25 to-blue-500/5",
}

export function CollectionsSection() {
  const recentCollections = collections.slice(0, 6)

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Collections
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentCollections.map((collection) => (
          <Card
            key={collection.id}
            size="sm"
            className={cn(
              collectionColorStyles[collection.color],
              "group/collection-card cursor-pointer gap-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-foreground/10"
            )}
          >
            <CardContent className="flex flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {collection.name}
                </span>
                {collection.isFavorite && (
                  <StarIcon
                    className="size-4 shrink-0 text-amber-500"
                    weight="fill"
                  />
                )}
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {collection.description}
              </p>
            </CardContent>
            <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{collection.itemCount} items</span>
              <span className="flex items-center gap-1 transition-transform duration-200 group-hover/collection-card:translate-x-0.5">
                Open <ArrowUpRightIcon className="size-3.5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
