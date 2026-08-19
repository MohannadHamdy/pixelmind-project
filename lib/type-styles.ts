import {
  ChatCircleIcon,
  CodeIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
  NoteIcon,
  TerminalIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { Icon } from "@phosphor-icons/react"

export const typeStyles: Record<string, { icon: Icon; className: string }> = {
  type_snippet: { icon: CodeIcon, className: "text-emerald-500" },
  type_prompt: { icon: ChatCircleIcon, className: "text-blue-500" },
  type_note: { icon: NoteIcon, className: "text-amber-500" },
  type_command: { icon: TerminalIcon, className: "text-violet-500" },
  type_file: { icon: FileIcon, className: "text-rose-500" },
  type_image: { icon: ImageIcon, className: "text-sky-500" },
  type_url: { icon: LinkIcon, className: "text-emerald-500" },
}

export function getTypeStyle(typeId: string) {
  return typeStyles[typeId] ?? { icon: FileIcon, className: "" }
}
