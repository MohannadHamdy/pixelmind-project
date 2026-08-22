"use client"

import type { KeyboardEvent } from "react"
import { useState } from "react"
import { XIcon } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { getTagColorClass } from "@/lib/tag-colors"
import { cn } from "@/lib/utils"

export function TagInput({
  id,
  tags,
  onChange,
}: {
  id: string
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const [draft, setDraft] = useState("")

  function addTag(name: string) {
    const trimmed = name.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
  }

  function removeTag(name: string) {
    onChange(tags.filter((tag) => tag !== name))
  }

  function handleDraftChange(value: string) {
    if (value.includes(",")) {
      const [newTag, ...rest] = value.split(",")
      addTag(newTag)
      setDraft(rest.join(","))
    } else {
      setDraft(value)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(draft)
      setDraft("")
    } else if (e.key === "Backspace" && !draft && tags.length) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-transparent bg-input/50 p-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn("gap-1", getTagColorClass(tag))}
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="opacity-70 hover:opacity-100"
          >
            <XIcon className="size-3" />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => handleDraftChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag, then press comma"
        className="min-w-24 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
      />
    </div>
  )
}
