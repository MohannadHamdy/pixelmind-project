import { FileIcon } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ItemTypeCount } from "@/lib/db/items"
import { iconsByName } from "@/lib/type-icons"

export function TypeBreakdown({ typeCounts }: { typeCounts: ItemTypeCount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Items by type</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {typeCounts.map((type) => {
          const TypeIcon = iconsByName[type.icon] ?? FileIcon
          return (
            <div
              key={type.id}
              className="flex items-center gap-2.5 rounded-2xl bg-muted/50 px-3 py-2.5"
            >
              <TypeIcon
                className="size-4.5 shrink-0"
                style={{ color: type.color }}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium">{type.count}</span>
                <span className="truncate text-xs text-muted-foreground capitalize">
                  {type.name}s
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
