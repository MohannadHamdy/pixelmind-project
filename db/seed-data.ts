export interface SeedItemType {
  id: string
  name: string
  icon: string
  color: string
}

export interface SeedCollection {
  id: string
  name: string
  description: string
}

export interface SeedItem {
  id: string
  title: string
  typeId: string
  collectionId: string
  contentType: "text" | "file"
  content: string | null
  url: string | null
  language: string | null
  tags: string[]
}

export const itemTypes: SeedItemType[] = [
  { id: "type_snippet", name: "snippet", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_command", name: "command", icon: "Terminal", color: "#f97316" },
  { id: "type_note", name: "note", icon: "StickyNote", color: "#fde047" },
  { id: "type_file", name: "file", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "image", icon: "Image", color: "#ec4899" },
  { id: "type_link", name: "link", icon: "Link", color: "#10b981" },
]

export const collections: SeedCollection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
  },
  {
    id: "col_ai_workflows",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
  },
  {
    id: "col_devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
  },
  {
    id: "col_terminal_commands",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
  },
  {
    id: "col_design_resources",
    name: "Design Resources",
    description: "UI/UX resources and references",
  },
]

export const items: SeedItem[] = [
  // React Patterns
  {
    id: "item_react_hooks",
    title: "Custom hooks: useDebounce & useLocalStorage",
    typeId: "type_snippet",
    collectionId: "col_react_patterns",
    contentType: "text",
    content: `import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : initialValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}`,
    url: null,
    language: "typescript",
    tags: ["react", "hooks"],
  },
  {
    id: "item_react_compound",
    title: "Compound component pattern with Context",
    typeId: "type_snippet",
    collectionId: "col_react_patterns",
    contentType: "text",
    content: `import { createContext, useContext, useState, type ReactNode } from "react"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs.* must be used within <Tabs>")
  return ctx
}

export function Tabs({
  defaultTab,
  children,
}: {
  defaultTab: string
  children: ReactNode
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.Tab = function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext()
  return (
    <button data-active={activeTab === id} onClick={() => setActiveTab(id)}>
      {children}
    </button>
  )
}

Tabs.Panel = function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabsContext()
  return activeTab === id ? <div>{children}</div> : null
}`,
    url: null,
    language: "typescript",
    tags: ["react", "context", "compound-components"],
  },
  {
    id: "item_react_utils",
    title: "Array & object utility functions",
    typeId: "type_snippet",
    collectionId: "col_react_patterns",
    contentType: "text",
    content: `export function groupBy<T, K extends string | number>(
  items: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const group = key(item)
      acc[group] = acc[group] ?? []
      acc[group].push(item)
      return acc
    },
    {} as Record<K, T[]>
  )
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key]
      return acc
    },
    {} as Pick<T, K>
  )
}

export function uniqueBy<T, K>(items: T[], key: (item: T) => K): T[] {
  const seen = new Set<K>()
  return items.filter((item) => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}`,
    url: null,
    language: "typescript",
    tags: ["typescript", "utilities"],
  },

  // AI Workflows
  {
    id: "item_ai_review",
    title: "Code review prompt",
    typeId: "type_prompt",
    collectionId: "col_ai_workflows",
    contentType: "text",
    content:
      "You are a senior staff engineer reviewing a pull request. Return findings as a prioritized list: blocker, major, nit. For each finding, cite the file and line, explain the risk, and propose a concrete patch. Never restate the code without adding insight.",
    url: null,
    language: null,
    tags: ["review", "gpt-5-nano"],
  },
  {
    id: "item_ai_docs",
    title: "Documentation generation prompt",
    typeId: "type_prompt",
    collectionId: "col_ai_workflows",
    contentType: "text",
    content:
      "Generate documentation for the following code. Include: a one-sentence summary, a description of parameters and return values, one usage example, and any notable edge cases or gotchas. Write for a developer who has never seen this code before.",
    url: null,
    language: null,
    tags: ["docs", "gpt-5-nano"],
  },
  {
    id: "item_ai_refactor",
    title: "Refactoring assistance prompt",
    typeId: "type_prompt",
    collectionId: "col_ai_workflows",
    contentType: "text",
    content:
      "Review the following code for refactoring opportunities. Focus on: reducing duplication, improving naming, simplifying control flow, and extracting reusable logic. For each suggestion, explain the tradeoff and show a before/after snippet. Do not change behavior.",
    url: null,
    language: null,
    tags: ["refactoring", "gpt-5-nano"],
  },

  // DevOps
  {
    id: "item_devops_dockerfile",
    title: "Multi-stage Dockerfile for Next.js",
    typeId: "type_snippet",
    collectionId: "col_devops",
    contentType: "text",
    content: `FROM node:22-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`,
    url: null,
    language: "dockerfile",
    tags: ["docker", "ci-cd"],
  },
  {
    id: "item_devops_deploy",
    title: "Deploy to production VPS",
    typeId: "type_command",
    collectionId: "col_devops",
    contentType: "text",
    content: `git pull origin main
pnpm install --frozen-lockfile
pnpm build
pm2 reload pixelmind --update-env`,
    url: null,
    language: null,
    tags: ["deploy", "vps"],
  },
  {
    id: "item_devops_hostinger",
    title: "Hostinger VPS docs",
    typeId: "type_link",
    collectionId: "col_devops",
    contentType: "text",
    content: null,
    url: "https://www.hostinger.com/tutorials/vps",
    language: null,
    tags: ["hosting", "docs"],
  },
  {
    id: "item_devops_r2",
    title: "Cloudflare R2 docs",
    typeId: "type_link",
    collectionId: "col_devops",
    contentType: "text",
    content: null,
    url: "https://developers.cloudflare.com/r2/",
    language: null,
    tags: ["storage", "docs"],
  },

  // Terminal Commands
  {
    id: "item_term_git",
    title: "Undo last commit, keep changes staged",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    contentType: "text",
    content: "git reset --soft HEAD~1",
    url: null,
    language: null,
    tags: ["git"],
  },
  {
    id: "item_term_docker",
    title: "Remove stopped containers and dangling images",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    contentType: "text",
    content: `docker container prune -f
docker image prune -f`,
    url: null,
    language: null,
    tags: ["docker"],
  },
  {
    id: "item_term_process",
    title: "Find and kill process on a port",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    contentType: "text",
    content: "lsof -ti:3000 | xargs kill -9",
    url: null,
    language: null,
    tags: ["process-management"],
  },
  {
    id: "item_term_pnpm",
    title: "Update all pnpm dependencies interactively",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    contentType: "text",
    content: `pnpm outdated
pnpm update -i --latest`,
    url: null,
    language: null,
    tags: ["pnpm", "package-manager"],
  },

  // Design Resources
  {
    id: "item_design_tailwind",
    title: "Tailwind CSS docs",
    typeId: "type_link",
    collectionId: "col_design_resources",
    contentType: "text",
    content: null,
    url: "https://tailwindcss.com/docs",
    language: null,
    tags: ["css", "tailwind"],
  },
  {
    id: "item_design_shadcn",
    title: "shadcn/ui",
    typeId: "type_link",
    collectionId: "col_design_resources",
    contentType: "text",
    content: null,
    url: "https://ui.shadcn.com",
    language: null,
    tags: ["components"],
  },
  {
    id: "item_design_material",
    title: "Material Design 3",
    typeId: "type_link",
    collectionId: "col_design_resources",
    contentType: "text",
    content: null,
    url: "https://m3.material.io",
    language: null,
    tags: ["design-system"],
  },
  {
    id: "item_design_phosphor",
    title: "Phosphor Icons",
    typeId: "type_link",
    collectionId: "col_design_resources",
    contentType: "text",
    content: null,
    url: "https://phosphoricons.com",
    language: null,
    tags: ["icons"],
  },
]
