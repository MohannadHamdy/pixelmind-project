"use client"

import { useState } from "react"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function LanguageCombobox({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const canCreate =
    query.trim().length > 0 &&
    !options.some(
      (option) => option.toLowerCase() === query.trim().toLowerCase()
    )

  function handleSelect(next: string) {
    onChange(next)
    setQuery("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start font-normal"
          />
        }
      >
        {value || "Select a language"}
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Command>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search or add a language..."
          />
          <CommandList>
            <CommandEmpty>
              {canCreate ? (
                <button
                  type="button"
                  onClick={() => handleSelect(query.trim())}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium"
                >
                  <PlusIcon className="size-4" /> Add “{query.trim()}”
                </button>
              ) : (
                "No languages found"
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  data-checked={value === option}
                  onSelect={() => handleSelect(option)}
                >
                  {option}
                </CommandItem>
              ))}
              {canCreate && (
                <CommandItem
                  value={`create-${query}`}
                  onSelect={() => handleSelect(query.trim())}
                >
                  <PlusIcon className="mr-2 size-4" />
                  Add “{query.trim()}”
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
