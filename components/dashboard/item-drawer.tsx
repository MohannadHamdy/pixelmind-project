"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CopyIcon,
  FileIcon,
  PencilSimpleIcon,
  PushPinIcon,
  StarIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { LayoutStorage } from "react-resizable-panels"
import { useDefaultLayout } from "react-resizable-panels"

import {
  deleteItem,
  getItemDetail,
  setItemFavorite,
  setItemPinned,
} from "@/actions/items"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import type { ItemDetail } from "@/lib/db/items"
import { iconsByName } from "@/lib/type-icons"
import { cn, formatRelativeTime } from "@/lib/utils"

const LAYOUT_ID = "pixelmind-item-drawer"
const DEFAULT_WIDTH = 560
const MIN_WIDTH = 440
const MAX_WIDTH = 880

// A no-op storage during SSR, since `window.localStorage` isn't available there.
const drawerLayoutStorage: LayoutStorage = {
  getItem: (key) =>
    typeof window === "undefined" ? null : window.localStorage.getItem(key),
  setItem: (key, value) => {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value)
  },
}

function getPreviewContent(item: ItemDetail) {
  if (item.content) return item.content
  if (item.contentType === "file") return item.fileName ?? "File attachment"
  return item.url ?? "No content"
}

interface DrawerResult {
  itemId: string
  status: "loaded" | "error"
  item?: ItemDetail
  error?: string
}

export function ItemDrawer({
  itemId,
  open,
  onOpenChange,
}: {
  itemId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [result, setResult] = useState<DrawerResult | null>(null)
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: LAYOUT_ID,
    storage: drawerLayoutStorage,
  })

  useEffect(() => {
    if (!open || !itemId) return

    let cancelled = false
    getItemDetail(itemId).then((response) => {
      if (cancelled) return
      setResult(
        response.success
          ? { itemId, status: "loaded", item: response.data }
          : { itemId, status: "error", error: response.error }
      )
    })

    return () => {
      cancelled = true
    }
  }, [open, itemId])

  const item = result?.itemId === itemId ? result.item : undefined
  const error = result?.itemId === itemId ? result.error : undefined
  const loading = open && itemId !== null && result?.itemId !== itemId

  async function handleToggleFavorite() {
    if (!item || !itemId) return
    const next = !item.isFavorite
    setResult({ itemId, status: "loaded", item: { ...item, isFavorite: next } })
    const response = await setItemFavorite(item.id, next)
    if (!response.success) {
      setResult({
        itemId,
        status: "loaded",
        item: { ...item, isFavorite: !next },
      })
    } else {
      router.refresh()
    }
  }

  async function handleTogglePinned() {
    if (!item || !itemId) return
    const next = !item.isPinned
    setResult({ itemId, status: "loaded", item: { ...item, isPinned: next } })
    const response = await setItemPinned(item.id, next)
    if (!response.success) {
      setResult({
        itemId,
        status: "loaded",
        item: { ...item, isPinned: !next },
      })
    } else {
      router.refresh()
    }
  }

  async function handleCopy() {
    if (!item) return
    const text = item.content ?? item.url ?? item.fileName ?? ""
    if (text) await navigator.clipboard.writeText(text)
  }

  async function handleDelete() {
    if (!item) return
    if (!window.confirm(`Delete "${item.title}"? This can't be undone.`)) return
    const response = await deleteItem(item.id)
    if (response.success) {
      onOpenChange(false)
      router.refresh()
    }
  }

  const TypeIcon = item ? (iconsByName[item.type.icon] ?? FileIcon) : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="w-full! max-w-none! border-l-0! bg-transparent! p-0 shadow-none!"
      >
        <ResizablePanelGroup
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChanged={onLayoutChanged}
        >
          <ResizablePanel
            id="spacer"
            onClick={() => onOpenChange(false)}
            className="cursor-default"
          />
          <ResizableHandle withHandle />
          <ResizablePanel
            id="drawer"
            defaultSize={DEFAULT_WIDTH}
            minSize={MIN_WIDTH}
            maxSize={MAX_WIDTH}
            className="flex flex-col overflow-y-auto border-l border-border bg-popover text-sm text-popover-foreground shadow-xl"
          >
            {loading && (
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {!loading && error && (
              <div className="p-6 text-sm text-destructive">{error}</div>
            )}

            {!loading && item && TypeIcon && (
              <>
                <div className="flex flex-col gap-3 border-b border-border p-6 pr-14 pb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${item.type.color}1a` }}
                    >
                      <TypeIcon
                        className="size-4.5"
                        style={{ color: item.type.color }}
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <SheetTitle className="wrap-break-word">
                        {item.title}
                      </SheetTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.type.name}
                        {item.collectionName
                          ? ` · ${item.collectionName}`
                          : ""}{" "}
                        · updated{" "}
                        {formatRelativeTime(item.updatedAt.toISOString())}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onOpenChange(false)}
                      className="absolute top-4 right-4 bg-secondary"
                    >
                      <XIcon />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                      <CopyIcon /> Copy
                    </Button>
                    <Button variant="secondary" size="sm" disabled>
                      <PencilSimpleIcon /> Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleToggleFavorite}
                      className={cn(item.isFavorite && "text-amber-500")}
                    >
                      <StarIcon weight={item.isFavorite ? "fill" : "regular"} />
                      Favorite
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleTogglePinned}
                    >
                      <PushPinIcon
                        weight={item.isPinned ? "fill" : "regular"}
                      />
                      Pin
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <TrashIcon /> Delete
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-6 p-6">
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Content
                      </h4>
                      {item.language && (
                        <Badge variant="secondary">{item.language}</Badge>
                      )}
                    </div>
                    <pre className="overflow-x-auto rounded-xl bg-muted p-3 font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                      {getPreviewContent(item)}
                    </pre>
                  </div>

                  {item.tags.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </SheetContent>
    </Sheet>
  )
}
