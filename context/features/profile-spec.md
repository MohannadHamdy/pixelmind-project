# Profile Page

## Overview

Create the profile page with user info, stats, change password and delete account.

## Requirements

- Create profile page at `/profile` route
- Display user info: email, name, avatar (Google or initials), account creation date
- Show usage stats: total items, total collections, breakdown by item type
- Add account actions: change password (email users only), delete account with confirmation
- Follow existing codebase patterns for data fetching and components

## Notes

- Avatar logic: Use default avatar from OAuth (Google) if available, otherwise generate initials from name/email
- Change password button should only appear for users who signed up with email/password (not Google OAuth)
- Delete account needs confirmation dialog to prevent accidental deletion
- If the user chose to delete their account, make sure we redirect to the homepage after deletion
- Item type breakdown should show counts for each type (snippets, prompts, notes, commands, links, files, images)
- Route should be protected (require authentication)
- Note we will be getting all this from Clerk

```

```
