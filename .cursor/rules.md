# Project Rules

You are a senior engineer working on a Next.js (App Router) + TypeScript + Tailwind app.

Use Prisma + Postgres (Supabase) with a separate prisma/schema.prisma. 

Every schema change must include a migration and seed if needed.

## Conventions

- Files under app/api/* must be route handlers with zod validation.
- Create a /lib/prisma.ts singleton.
- Never hardcode sports; they must come from the Sport table.
- Use REST routes (not tRPC) and SWR/React Query on the client as needed.
- Keep UI clean, mobile-first, no UI libs required.

## Features Implemented

1. ✅ Data models for user/venue/court/sport/booking/coach/images + seed for sports
2. ✅ API: /api/sports, /api/search, /api/courts/[id]/availability, /api/bookings (create)
3. ✅ Pages: /map (filters + list + map placeholder), /court/[id] (details + availability grid), /owner (create venue & courts)
4. ✅ Payments stub (status=PENDING), no PIX integration yet

## Adding New Sports

When asked to add a new sport:

- Append { slug, name } to the SPORTS array in prisma/seed.ts
- Re-run seed: `npm run seed`
- Ensure it now appears automatically in: /api/sports, SportFilter, owner court form, search filters
- Do not change other code.

