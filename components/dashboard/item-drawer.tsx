"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckIcon,
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
import { toast } from "sonner"

import {
  deleteItem,
  getItemDetail,
  getLanguageOptions,
  setItemFavorite,
  setItemPinned,
  updateItem,
} from "@/actions/items"
import { LanguageCombobox } from "@/components/dashboard/language-combobox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/dashboard/tag-input"
import type { ItemDetail } from "@/lib/db/items"
import {
  CONTENT_FIELD_TYPES,
  LANGUAGE_FIELD_TYPES,
  URL_FIELD_TYPES,
} from "@/lib/item-field-types"
import { getTagColorClass } from "@/lib/tag-colors"
import { iconsByName } from "@/lib/type-icons"
import { cn, formatRelativeTime } from "@/lib/utils"

interface EditForm {
  title: string
  description: string
  content: string
  url: string
  language: string
  tags: string[]
}

function buildEditForm(item: ItemDetail): EditForm {
  return {
    title: item.title,
    description: item.description ?? "",
    content: item.content ?? "",
    url: item.url ?? "",
    language: item.language ?? "",
    tags: item.tags,
  }
}

function isFormDirty(item: ItemDetail, form: EditForm): boolean {
  return (
    form.title !== item.title ||
    form.description !== (item.description ?? "") ||
    form.content !== (item.content ?? "") ||
    form.url !== (item.url ?? "") ||
    form.language !== (item.language ?? "") ||
    form.tags.length !== item.tags.length ||
    form.tags.some((tag, index) => tag !== item.tags[index])
  )
}

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
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [form, setForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [languageOptions, setLanguageOptions] = useState<string[]>([])
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

  const [prevItemId, setPrevItemId] = useState(itemId)
  if (itemId !== prevItemId) {
    setPrevItemId(itemId)
    setMode("view")
    setForm(null)
  }

  const item = result?.itemId === itemId ? result.item : undefined
  const error = result?.itemId === itemId ? result.error : undefined
  const loading = open && itemId !== null && result?.itemId !== itemId
  const isEditing = mode === "edit" && form !== null
  const isDirty = isEditing && item ? isFormDirty(item, form) : false

  function handleOpenChange(next: boolean) {
    if (!next && isDirty) {
      setShowUnsavedAlert(true)
      return
    }
    onOpenChange(next)
  }

  function handleStartEdit() {
    if (!item) return
    setForm(buildEditForm(item))
    setMode("edit")
    if (LANGUAGE_FIELD_TYPES.includes(item.type.name)) {
      getLanguageOptions().then((response) => {
        if (response.success) setLanguageOptions(response.data)
      })
    }
  }

  function handleCancelEdit() {
    setMode("view")
    setForm(null)
  }

  function handleDiscardChanges() {
    setShowUnsavedAlert(false)
    setMode("view")
    setForm(null)
    onOpenChange(false)
  }

  async function handleSave() {
    if (!item || !form || !form.title.trim()) return
    setSaving(true)
    const response = await updateItem(item.id, {
      title: form.title.trim(),
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      url: form.url.trim() || null,
      language: form.language.trim() || null,
      tags: form.tags,
    })
    setSaving(false)

    if (response.success) {
      setResult({ itemId: item.id, status: "loaded", item: response.data })
      setMode("view")
      setForm(null)
      toast.success("Item updated")
      router.refresh()
    } else {
      toast.error(response.error)
    }
  }

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

  async function confirmDelete() {
    if (!item) return
    setDeleting(true)
    const response = await deleteItem(item.id)
    setDeleting(false)
    if (response.success) {
      setShowDeleteConfirm(false)
      onOpenChange(false)
      toast.success("Item deleted")
      router.refresh()
    } else {
      toast.error(response.error)
    }
  }

  const TypeIcon = item ? (iconsByName[item.type.icon] ?? FileIcon) : null

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
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
              onClick={() => handleOpenChange(false)}
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
                        onClick={() => handleOpenChange(false)}
                        className="absolute top-4 right-4 bg-secondary"
                      >
                        <XIcon />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>

                    {isEditing ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          <CheckIcon /> {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={saving}
                        >
                          <XIcon /> Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCopy}
                        >
                          <CopyIcon /> Copy
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleStartEdit}
                        >
                          <PencilSimpleIcon /> Edit
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleToggleFavorite}
                          className={cn(item.isFavorite && "text-amber-500")}
                        >
                          <StarIcon
                            weight={item.isFavorite ? "fill" : "regular"}
                          />
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
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <TrashIcon /> Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing && form ? (
                    <div className="flex flex-col gap-5 p-6">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          value={form.title}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                        />
                      </div>

                      {CONTENT_FIELD_TYPES.includes(item.type.name) && (
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="edit-content">Content</Label>
                          <Textarea
                            id="edit-content"
                            className="min-h-32 font-mono text-xs"
                            value={form.content}
                            onChange={(e) =>
                              setForm({ ...form, content: e.target.value })
                            }
                          />
                        </div>
                      )}

                      {LANGUAGE_FIELD_TYPES.includes(item.type.name) && (
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="edit-language">Language</Label>
                          <LanguageCombobox
                            value={form.language}
                            options={languageOptions}
                            onChange={(language) =>
                              setForm({ ...form, language })
                            }
                          />
                        </div>
                      )}

                      {URL_FIELD_TYPES.includes(item.type.name) && (
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="edit-url">URL</Label>
                          <Input
                            id="edit-url"
                            value={form.url}
                            onChange={(e) =>
                              setForm({ ...form, url: e.target.value })
                            }
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-tags">Tags</Label>
                        <TagInput
                          id="edit-tags"
                          tags={form.tags}
                          onChange={(tags) => setForm({ ...form, tags })}
                        />
                      </div>

                      <div className="flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                        <p>
                          Type:{" "}
                          <span className="capitalize">{item.type.name}</span>
                        </p>
                        {item.collectionName && (
                          <p>Collection: {item.collectionName}</p>
                        )}
                        <p>
                          Updated{" "}
                          {formatRelativeTime(item.updatedAt.toISOString())}
                        </p>
                      </div>
                    </div>
                  ) : (
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
                              <Badge
                                key={tag}
                                variant="secondary"
                                className={getTagColorClass(tag)}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showUnsavedAlert} onOpenChange={setShowUnsavedAlert}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Discarding will permanently lose your
              edits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDiscardChanges}
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete item</DialogTitle>
            <DialogDescription>
              Delete &quot;{item?.title}&quot;? This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
