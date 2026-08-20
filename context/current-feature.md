# Current Feature

## Status

Completed

## Goals

Address findings from code-scanner review (2026-08-20):

- **Critical**
  - Replace soft `auth()` + `if (!userId) return null` checks with `auth.protect()` in dashboard/profile server components so unauthenticated access hard-fails instead of silently rendering nothing
  - Wrap Clerk webhook handler DB writes in try/catch with logging so failures don't retry silently
- **Warnings**
  - Dedupe redundant `getDashboardStats`/data fetches across layout/page/components via React `cache()`
  - Add `loading.tsx` skeletons for dashboard and profile routes
  - Rewrite `getAllCollectionsWithCounts` / `getRecentCollections` to use SQL aggregation instead of pulling full item rows
  - Make account deletion delete the DB user row synchronously (via server action) before calling Clerk's `user.delete()`, instead of relying solely on the async webhook
  - (Skipped per instruction: dead code removal, non-functional button states)
- **Suggestions**
  - Simplify dominant-type reduction in collections query (folded into the SQL rewrite)
  - Split `AppSidebar` into smaller subcomponents
  - Extract shared markup between `ItemCard` grid/list views
  - Name the magic gradient alpha hex values
- **Extra**
  - Add a Next.js `error.tsx` error boundary

## Notes

Following up on code-scanner agent output from this session.

## History

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: route, layout, top bar, placeholders
- Dashboard UI Phase 2: collapsible Shadcn sidebar (collections, types, tags as collapsible groups), user avatar footer, mobile drawer
- Dashboard UI Phase 3: recent collections, pinned items, recent items, stats cards (mock data)
- Drizzle + Neon PostgreSQL Setup: schema, migrations, Clerk webhook user sync, seed script
- Clerk Auth Initial Setup: ClerkProvider, proxy.ts middleware, sign-in/sign-up pages, dashboard route protection, landing page and sidebar auth controls
- Seed data script: populated sample item types, collections, and items for development and demos
- Dashboard Collections: replaced mock collection cards with real data fetched from Neon via Drizzle (lib/db/collections.ts), border/gradient color and small type icons derived from each collection's most-used item type
- Dashboard Items (context/features/dashboard-items-spec.md): replaced mock pinned/recent items and stats with real data (lib/db/items.ts); sidebar collections, types, tags, and counts now also fetched from Neon (lib/db/item-types.ts, lib/db/tags.ts, lib/db/users.ts); sidebar polish — count badges use shadcn Badge in the theme's primary color, single sidebar-toggle trigger (left-arrow icon in sidebar when open, header icon when collapsed), opaque search input background
- Header UI changes (context/features/header-spec.md): AI ghost button, working Grid/List view switcher (synced via `view` URL search param, flows through pinned/recent item sections into ItemCard's list-row layout), custom light/dark segmented toggle (no dropdown, matches bordered pill style), New button moved to the far right — all grouped together on the right side of the top bar; fixed `grid-noise` background utility in app/globals.css to use `color-mix` with `var(--foreground)` instead of a hardcoded white line color, so the grid pattern is visible in light mode too
- Add Pro badge to sidebar (context/features/add-pro-badge-spec.md): "File" and "Image" item types in the sidebar Types section now show a bold, uppercase "Pro" badge (ShadCN Badge, `secondary` variant) that turns primary-colored on row hover
- Profile page (context/features/profile-spec.md): `/profile` route with usage stats (total items/collections, per-type breakdown via lib/db/items.ts `getItemCountsByType`) and a "Joined" date; account/security management (name, avatar, email, connected accounts, password) delegated to an embedded Clerk `<UserProfile>` themed with `@clerk/ui`'s shadcn theme to match app styling; custom delete-account dialog with typed confirmation, redirects to `/` after deletion; sidebar polish — brand logo links to `/dashboard`, "All items" highlight is now route-aware via `usePathname`, gear icon links to `/profile`
- Code-scanner findings fixup: `auth.protect()` replaces soft auth checks across dashboard/profile server components; Clerk webhook DB writes wrapped in try/catch with logging; all `lib/db/*` query functions wrapped in React `cache()` to dedupe repeated per-request fetches; `getAllCollectionsWithCounts`/`getRecentCollections` rewritten to use SQL aggregation instead of pulling full item rows; `loading.tsx` skeletons added for `/dashboard` and `/profile`; account deletion now deletes the DB user row synchronously via a new server action (`actions/account.ts`) before calling Clerk's `user.delete()`; `AppSidebar` split into `components/dashboard/sidebar/*` subcomponents; `ItemCard` grid/list views share `ItemTagList`/`ItemStatusIcons`; gradient alpha magic numbers named; added `app/error.tsx` error boundary
