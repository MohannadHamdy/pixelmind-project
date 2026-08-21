"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createItem,
  getCreatableItemTypeOptions,
  getLanguageOptions,
} from "@/actions/items"
import { LanguageCombobox } from "@/components/dashboard/language-combobox"
import { TagInput } from "@/components/dashboard/tag-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ItemTypeSummary } from "@/lib/db/item-types"
import {
  CONTENT_FIELD_TYPES,
  LANGUAGE_FIELD_TYPES,
  URL_FIELD_TYPES,
} from "@/lib/item-field-types"
import { typeSlug } from "@/lib/item-type-slug"

interface CreateForm {
  typeId: string
  title: string
  description: string
  content: string
  url: string
  language: string
  tags: string[]
}

const EMPTY_FORM: CreateForm = {
  typeId: "",
  title: "",
  description: "",
  content: "",
  url: "",
  language: "",
  tags: [],
}

export function CreateItemDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [types, setTypes] = useState<ItemTypeSummary[]>([])
  const [languageOptions, setLanguageOptions] = useState<string[]>([])
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setForm(EMPTY_FORM)
  }

  useEffect(() => {
    if (!open) return
    getCreatableItemTypeOptions().then((response) => {
      if (response.success) {
        setTypes(response.data)
        const slug = pathname.match(/^\/items\/([^/]+)$/)?.[1]
        const typeForRoute = slug
          ? response.data.find((type) => typeSlug(type.name) === slug)
          : undefined
        setForm((current) => ({
          ...current,
          typeId:
            current.typeId || typeForRoute?.id || (response.data[0]?.id ?? ""),
        }))
      }
    })
    getLanguageOptions().then((response) => {
      if (response.success) setLanguageOptions(response.data)
    })
  }, [open, pathname])

  const selectedType = types.find((type) => type.id === form.typeId)
  const typeName = selectedType?.name.toLowerCase() ?? ""
  const isUrlRequired = URL_FIELD_TYPES.includes(typeName)
  const canSubmit =
    form.typeId.trim().length > 0 &&
    form.title.trim().length > 0 &&
    (!isUrlRequired || form.url.trim().length > 0)

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    const response = await createItem({
      typeId: form.typeId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      url: form.url.trim() || null,
      language: form.language.trim() || null,
      tags: form.tags,
    })
    setSubmitting(false)

    if (response.success) {
      toast.success("Item created")
      onOpenChange(false)
      router.refresh()
    } else {
      toast.error(response.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New item</DialogTitle>
          <DialogDescription>
            Add a snippet, prompt, command, note, or link to your hub.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-type">Type</Label>
            <Select
              value={form.typeId}
              onValueChange={(typeId) =>
                setForm({ ...form, typeId: typeId ?? "" })
              }
            >
              <SelectTrigger id="create-type" className="w-full">
                <SelectValue placeholder="Select a type">
                  {(typeId: string | null) => {
                    const name = types.find((type) => type.id === typeId)?.name
                    return name ? (
                      <span className="capitalize">{name}</span>
                    ) : (
                      "Select a type"
                    )
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <span className="capitalize">{type.name}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-title">Title</Label>
            <Input
              id="create-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {CONTENT_FIELD_TYPES.includes(typeName) && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-content">Content</Label>
              <Textarea
                id="create-content"
                className="min-h-32 font-mono text-xs"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
          )}

          {LANGUAGE_FIELD_TYPES.includes(typeName) && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-language">Language</Label>
              <LanguageCombobox
                value={form.language}
                options={languageOptions}
                onChange={(language) => setForm({ ...form, language })}
              />
            </div>
          )}

          {URL_FIELD_TYPES.includes(typeName) && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-url">URL</Label>
              <Input
                id="create-url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-tags">Tags</Label>
            <TagInput
              id="create-tags"
              tags={form.tags}
              onChange={(tags) => setForm({ ...form, tags })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? "Creating..." : "Create item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
