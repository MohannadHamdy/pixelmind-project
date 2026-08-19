import type { Icon } from "@phosphor-icons/react"
import {
  ChatCircleIcon,
  CodeIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
  NotePencilIcon,
  SparkleIcon,
  TerminalIcon,
} from "@phosphor-icons/react/dist/ssr"

const iconsByName: Record<string, Icon> = {
  Code: CodeIcon,
  CodeIcon: CodeIcon,
  Sparkles: SparkleIcon,
  Sparkle: SparkleIcon,
  SparkleIcon: SparkleIcon,
  ChatCircle: ChatCircleIcon,
  ChatCircleIcon: ChatCircleIcon,
  Terminal: TerminalIcon,
  TerminalIcon: TerminalIcon,
  StickyNote: NotePencilIcon,
  Note: NotePencilIcon,
  NoteIcon: NotePencilIcon,
  NotePencilIcon: NotePencilIcon,
  File: FileIcon,
  FileIcon: FileIcon,
  Image: ImageIcon,
  ImageIcon: ImageIcon,
  Link: LinkIcon,
  LinkIcon: LinkIcon,
}

export function getTypeIcon(name: string): Icon {
  return iconsByName[name] ?? FileIcon
}
