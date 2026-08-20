import { auth } from "@clerk/nextjs/server"
import { ArrowUpRightIcon, StarIcon } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent } from "@/components/ui/card"
import { getRecentCollections } from "@/lib/db/collections"
import { getTypeIcon } from "@/lib/type-icons"

// Hex alpha suffixes for the collection card's accent-color gradient (~15% and ~5% opacity).
const GRADIENT_ALPHA_STRONG = "26"
const GRADIENT_ALPHA_SOFT = "0d"

export async function CollectionsSection() {
  const { userId } = await auth.protect()

  const recentCollections = await getRecentCollections(userId)
  if (recentCollections.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Collections
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentCollections.map((collection) => {
          const accentColor = collection.dominantType?.color
          return (
            <Card
              key={collection.id}
              size="sm"
              style={{
                background: accentColor
                  ? `linear-gradient(to bottom right, ${accentColor}${GRADIENT_ALPHA_STRONG}, ${accentColor}${GRADIENT_ALPHA_SOFT})`
                  : undefined,
                borderColor: accentColor ?? undefined,
              }}
              className="group/collection-card cursor-pointer gap-4 rounded-2xl border border-transparent transition-all duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-foreground/10"
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
                {collection.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {collection.description}
                  </p>
                )}
                {collection.types.length > 0 && (
                  <div className="mt-1 flex items-center gap-1.5">
                    {collection.types.map((type) => {
                      const TypeIcon = getTypeIcon(type.icon)
                      return (
                        <TypeIcon
                          key={type.id}
                          className="size-3.5"
                          style={{ color: type.color }}
                        />
                      )
                    })}
                  </div>
                )}
              </CardContent>
              <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{collection.itemCount} items</span>
                <span className="flex items-center gap-1 transition-transform duration-200 group-hover/collection-card:translate-x-0.5">
                  Open <ArrowUpRightIcon className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
