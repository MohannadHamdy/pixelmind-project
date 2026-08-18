# PixelMind

A personal hub where you can drop different snippets, commands, prompts, notes, files, images links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## ⚠️ Next.js version warning

This project uses Next.js 16, which has breaking changes vs. older Next.js versions you may have trained on (APIs, conventions, file structure). **Before writing any App Router code, check the bundled docs in `node_modules/next/dist/docs/`** (organized as `01-getting-started`, `02-guides`, `03-api-reference`, `04-glossary.md`) rather than relying on memory. Heed any deprecation notices found there.

## Commands

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — run ESLint (flat config, `eslint-config-next` core-web-vitals + typescript rules)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier write across `**/*.{ts,tsx}`

There is no test runner configured in this repo yet.

## Adding shadcn/ui components

Components are not committed in bulk — add them individually as needed:

```bash
npx shadcn@latest add button
```

This places generated components under `components/ui/` (see `components.json` for aliases: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`). Config specifics: style `base-luma`, base color `neutral`, icon library `@phosphor-icons/react`, no class prefix, CSS variables enabled in `app/globals.css`.

Import components as:

```tsx
import { Button } from "@/components/ui/button"
```

## Code style

- Prettier config (`.prettierrc`): no semicolons, double quotes, 2-space tabs, `es5` trailing commas, 80-char print width, LF line endings.
- `prettier-plugin-tailwindcss` is active — class lists get sorted automatically. It's configured to also sort classes passed to the `cn` and `cva` helpers (`tailwindFunctions`).
- Use the `cn()` helper from `@/lib/utils` (clsx + tailwind-merge) for conditional/merged class names, as done in `app/layout.tsx`.
- Path alias `@/*` maps to the repo root (see `tsconfig.json`).
- Fonts are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables (`--font-sans`, `--font-heading`, `--font-mono`); theming uses `next-themes` via `components/theme-provider.tsx`, which also wires a `d` hotkey to toggle light/dark.
