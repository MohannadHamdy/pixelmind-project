import { PushPinIcon, StarIcon } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { collections, itemTypes, type Item } from "@/lib/mock-data"
import { getTypeStyle } from "@/lib/type-styles"
import { cn, formatRelativeTime } from "@/lib/utils"

export function ItemCard({ item }: { item: Item }) {
  const { icon: Icon, className: iconClassName } = getTypeStyle(item.typeId)
  const typeName = itemTypes.find((type) => type.id === item.typeId)?.name
  const collectionName = collections.find(
    (collection) => collection.id === item.collectionId
  )?.name

  return (
    <Card
      size="sm"
      className="cursor-pointer rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-foreground/10"
    >
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex min-w-0 items-start gap-2">
          <Icon className={cn("mt-0.5 size-4 shrink-0", iconClassName)} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{item.title}</span>
            <span className="truncate text-xs text-muted-foreground">
              {typeName} · {collectionName}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          {item.isPinned && <PushPinIcon className="size-3.5" weight="fill" />}
          {item.isFavorite && (
            <StarIcon className="size-3.5 text-amber-500" weight="fill" />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <pre className="max-h-24 overflow-hidden rounded-xl bg-muted p-3 font-mono text-xs whitespace-pre-wrap text-muted-foreground">
          {item.content}
        </pre>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(item.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
