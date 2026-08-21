# Item Drawer

## Overview

Right-side slide-in drawer that opens when clicking an item card. This is the item detail view — there is no separate item page.

## Requirements

- Use shadcn Sheet component, opens from the right
- Clicking an ItemCard opens the drawer with that item's full data
- Works on both dashboard and items list pages
- Action bar with Favorite (star icon, yellow when active), Pin, Copy, Edit (pencil icon), and Delete (trash icon, right-aligned) — see screenshot for layout
- The extras like the code editor and item-specific stuff will come later. For now, let's just work on the drawer details display.
- Client wrapper component to manage drawer state since pages are server components
- Should feel snappy — fetch on click, no page navigation
- Item drawer should be draggable to make it wider, with the latest position i dragged to being saved in localStorage

## Data Fetching

- Card data (title, description, tags, etc.) is fetched by the server component as before
- Full item detail (content, collections, language, etc.) is fetched on click via API route (`/api/items/[id]`) (I'm unsure about this, do I need an API endpoint just to fetch this? i should be able to easily user server actions for that? if yes, don't use API routes, and fetch through server actions)
- Query function lives in `lib/db/items.ts`, API route calls it with auth check (same point about API endpoints as above)
- Drawer shows a skeleton/loading state while fetching

## Reference

See `context/screenshots/dashboard-ui-drawer.png` for the visual design.
