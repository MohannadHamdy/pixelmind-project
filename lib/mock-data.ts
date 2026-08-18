export interface User {
  id: string
  name: string
  email: string
  isPro: boolean
  itemCount: number
  itemLimit: number
}

export interface ItemType {
  id: string
  name: string
  icon: string
}

export interface Collection {
  id: string
  name: string
  description: string
  isFavorite: boolean
  itemCount: number
  color: string
}

export interface Item {
  id: string
  title: string
  content: string
  typeId: string
  collectionId: string
  tags: string[]
  isFavorite: boolean
  isPinned: boolean
  updatedAt: string
}

export const currentUser: User = {
  id: "user_1",
  name: "Moe Hamdy",
  email: "moe@pixelmind.dev",
  isPro: false,
  itemCount: 112,
  itemLimit: 50,
}

export const itemTypes: ItemType[] = [
  { id: "type_snippet", name: "Snippet", icon: "CodeIcon" },
  { id: "type_prompt", name: "Prompt", icon: "ChatCircleIcon" },
  { id: "type_note", name: "Note", icon: "NoteIcon" },
  { id: "type_command", name: "Command", icon: "TerminalIcon" },
  { id: "type_file", name: "File", icon: "FileIcon" },
  { id: "type_image", name: "Image", icon: "ImageIcon" },
  { id: "type_url", name: "URL", icon: "LinkIcon" },
]

export const collections: Collection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Hooks, compound components, render props",
    isFavorite: true,
    itemCount: 24,
    color: "emerald",
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "LLM context primers per project",
    isFavorite: true,
    itemCount: 12,
    color: "teal",
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Scripts, pandas one-liners, CLI helpers",
    isFavorite: false,
    itemCount: 31,
    color: "violet",
  },
  {
    id: "col_shell",
    name: "Shell & DevOps",
    description: "Docker, kubectl, git recovery commands",
    isFavorite: false,
    itemCount: 18,
    color: "amber",
  },
  {
    id: "col_prompts",
    name: "Prompt Library",
    description: "System prompts and refactor prompts",
    isFavorite: true,
    itemCount: 27,
    color: "rose",
  },
  {
    id: "col_api",
    name: "API References",
    description: "Stripe, Clerk, R2 request shapes",
    isFavorite: false,
    itemCount: 9,
    color: "blue",
  },
]

export const items: Item[] = [
  {
    id: "item_1",
    title: "useDebouncedValue hook",
    content:
      "export function useDebouncedValue<T>(value: T, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}",
    typeId: "type_snippet",
    collectionId: "col_react",
    tags: ["react", "hooks", "performance"],
    isFavorite: true,
    isPinned: true,
    updatedAt: "2026-08-18T18:00:00.000Z",
  },
  {
    id: "item_2",
    title: "Senior code reviewer system prompt",
    content:
      "You are a senior staff engineer reviewing a pull request. Return findings as a prioritized list: blocker, major, nit. Always propose a concrete patch. Never restate the code.",
    typeId: "type_prompt",
    collectionId: "col_prompts",
    tags: ["review", "gpt-5-nano", "workflow"],
    isFavorite: true,
    isPinned: true,
    updatedAt: "2026-08-18T15:00:00.000Z",
  },
  {
    id: "item_3",
    title: "Reset a bad rebase",
    content: "git reflog\ngit reset --hard HEAD@{4}\ngit status",
    typeId: "type_command",
    collectionId: "col_shell",
    tags: ["git", "recovery"],
    isFavorite: false,
    isPinned: true,
    updatedAt: "2026-08-18T01:00:00.000Z",
  },
  {
    id: "item_4",
    title: "Drizzle schema conventions",
    content:
      "- singular table names (\"item\", not \"items\")\n- cuid2 primary keys via $defaultFn\n- always notNull().defaultNow() on created_at\n- $onUpdate for updated_at",
    typeId: "type_note",
    collectionId: "col_api",
    tags: ["drizzle", "postgres", "conventions"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-08-18T01:00:00.000Z",
  },
  {
    id: "item_5",
    title: "pixelmind-context.md",
    content:
      "# PixelMind context\nStack: Next.js 15, Drizzle, Neon, Clerk, R2.\nTone: minimal, dark-first, Linear-inspired.",
    typeId: "type_file",
    collectionId: "col_context",
    tags: ["context", "ai"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-08-17T02:00:00.000Z",
  },
  {
    id: "item_6",
    title: "Tailwind v4 theme cheatsheet",
    content: "https://tailwindcss.com/docs/theme",
    typeId: "type_url",
    collectionId: "col_react",
    tags: ["tailwind", "css"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-08-16T02:00:00.000Z",
  },
  {
    id: "item_7",
    title: "Dashboard shell wireframe",
    content: "wireframe-dashboard.png · 412 KB",
    typeId: "type_image",
    collectionId: "col_react",
    tags: ["design", "layout"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-08-16T02:00:00.000Z",
  },
  {
    id: "item_8",
    title: "Pandas: group and rank",
    content:
      'top = (df.sort_values("score", ascending=False)\n  .groupby("user_id")\n  .head(3)\n  .reset_index(drop=True))',
    typeId: "type_snippet",
    collectionId: "col_python",
    tags: ["python", "pandas"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-08-15T02:00:00.000Z",
  },
  {
    id: "item_9",
    title: "Docker prune everything",
    content: "docker system prune -af --volumes\ndocker builder prune -af",
    typeId: "type_command",
    collectionId: "col_shell",
    tags: ["docker", "vps"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-08-14T02:00:00.000Z",
  },
  {
    id: "item_10",
    title: "Explain-this-code prompt",
    content:
      "Explain the following code to a mid-level developer. Start with a one-sentence summary, then walk through it in numbered steps. Call out one gotcha at the end.",
    typeId: "type_prompt",
    collectionId: "col_prompts",
    tags: ["teaching", "explain"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-08-13T02:00:00.000Z",
  },
  {
    id: "item_11",
    title: "Stripe webhook handler",
    content:
      'const event = stripe.webhooks.constructEvent(body, sig, secret);\nif (event.type === "customer.subscription.updated") {\n  await db.update(users).set({ isPro: true });\n}',
    typeId: "type_snippet",
    collectionId: "col_api",
    tags: ["stripe", "billing"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-08-12T02:00:00.000Z",
  },
  {
    id: "item_12",
    title: "Neon branch per PR",
    content: "neonctl branches create --name pr-$PR_NUMBER\n# tear down on merge",
    typeId: "type_note",
    collectionId: "col_shell",
    tags: ["neon", "ci"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-08-12T02:00:00.000Z",
  },
]
