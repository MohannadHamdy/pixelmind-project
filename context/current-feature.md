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
