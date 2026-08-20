# Current Feature

## Status

Completed

## Goals

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

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
