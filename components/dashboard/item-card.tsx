import {
  FileIcon,
  PushPinIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ItemWithRelations } from "@/lib/db/items"
import { iconsByName } from "@/lib/type-icons"
import { formatRelativeTime } from "@/lib/utils"

function getPreviewText(item: ItemWithRelations) {
  if (item.content) return item.content
  if (item.contentType === "file") return item.fileName ?? "File attachment"
  return item.url ?? ""
}

export function ItemCard({
  item,
  view = "grid",
}: {
  item: ItemWithRelations
  view?: "grid" | "list"
}) {
  const TypeIcon = iconsByName[item.type.icon] ?? FileIcon

  if (view === "list") {
    return (
      <Card
        size="sm"
        className="cursor-pointer flex-row items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-foreground/10"
      >
        <TypeIcon
          className="size-4 shrink-0"
          style={{ color: item.type.color }}
        />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-sm font-medium">{item.title}</span>
          <span className="shrink-0 text-xs text-muted-foreground capitalize">
            {item.type.name}
            {item.collectionName ? ` · ${item.collectionName}` : ""}
          </span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
          {item.isPinned && <PushPinIcon className="size-3.5" weight="fill" />}
          {item.isFavorite && (
            <StarIcon className="size-3.5 text-amber-500" weight="fill" />
          )}
          <span className="text-xs">
            {formatRelativeTime(item.updatedAt.toISOString())}
          </span>
        </div>
      </Card>
    )
  }

  return (
    <Card
      size="sm"
      className="cursor-pointer rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-foreground/10"
    >
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex min-w-0 items-start gap-2">
          <TypeIcon
            className="mt-0.5 size-4 shrink-0"
            style={{ color: item.type.color }}
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{item.title}</span>
            <span className="truncate text-xs text-muted-foreground capitalize">
              {item.type.name}
              {item.collectionName ? ` · ${item.collectionName}` : ""}
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
          {getPreviewText(item)}
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
            {formatRelativeTime(item.updatedAt.toISOString())}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
