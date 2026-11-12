# Content management (Sanity)

Products, homepage text and contact details are edited in **Sanity Studio** at **`/studio`**
(e.g. https://www.rigoled.com/studio). Page layout and design stay in code.

- Sanity project: **Rigoled** · ID `g85itbkg` · dataset `production` — manage at https://www.sanity.io/manage/project/g85itbkg
- Studio config: `sanity.config.ts` · editing forms: `sanity/schemaTypes/` · sidebar: `sanity/structure.ts`
- Website data: `lib/catalog.ts` (products) and `lib/content.ts` (homepage + site settings)

## What editors can change

| In the Studio | Changes on the website |
|---|---|
| Products by category → Indoor/Outdoor → category → series | Category pages, product pages, menus, sitemap |
| Series → Versions & specs | Description, photos, card picture, features, key specs, models/spec table |
| Series → "Hide from website" | Hides a series without deleting it |
| Homepage | Featured products, Why RIGO, stats, About, journey, FAQ |
| Site settings | Phone, WhatsApp, emails, Instagram, WeChat (header, footer, buttons, legal pages) |

New series and categories get their own pages automatically — no redeploy needed.

## One-time setup on Vercel

1. **Environment variables** (Project → Settings → Environment Variables), for Production and Preview:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `g85itbkg`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `SANITY_REVALIDATE_SECRET` = the same value as in your local `.env.local`
2. **Webhook so changes appear instantly** — https://www.sanity.io/manage/project/g85itbkg → API → Webhooks → *Create webhook*:
   - Name: `Revalidate website` · URL: `https://www.rigoled.com/api/revalidate`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Filter: `_type in ["category", "series", "homePage", "siteSettings"]`
   - Projection: `{_type}` · HTTP method: POST
   - Secret: the `SANITY_REVALIDATE_SECRET` value
   
   Without the webhook, published changes still appear within about 5 minutes.
3. **Allowed websites (CORS)** — already added: `http://localhost:3000` and `https://www.rigoled.com` (with credentials).
   Add any other address you open the Studio on (e.g. a Vercel preview URL) under API → CORS origins.

## Giving the client access

https://www.sanity.io/manage/project/g85itbkg → **Members → Invite** → client's email → role **Editor**.
They accept the email invite, create their own login, then open **www.rigoled.com/studio**.
Don't share your own login.

## Re-importing the original data

`scripts/migrate-to-sanity.mts` imported the old JSON catalogue (`data/*.json` via `lib/legacy-catalog.ts`).
It only creates missing documents, so it never overwrites edits. `--force` replaces everything with the JSON data
(only use it to start over).
