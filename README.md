# MVP - Court Booking System

A Next.js application for booking sports courts in São Paulo and Rio de Janeiro.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** + **PostgreSQL** (Supabase)
- **SWR** for data fetching
- **Zod** for validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your database:
   - Create a PostgreSQL database (or use Supabase)
   - Copy `.env.example` to `.env` and update `DATABASE_URL`

3. Run Prisma migrations:
```bash
npx prisma migrate dev -n init
```

4. Seed the database:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

## Features

- ✅ Search courts by city and sport
- ✅ View court availability with hourly slots
- ✅ Create bookings with conflict validation
- ✅ Owner dashboard to create venues and courts
- ✅ Support for multiple sports (soccer, tennis, basketball, etc.)

## Project Structure

- `/app/api/*` - API route handlers with Zod validation
- `/app/map` - Search page with filters
- `/app/court/[id]` - Court details and booking
- `/app/owner` - Owner dashboard
- `/components` - React components
- `/lib` - Utilities (Prisma client, hooks)
- `/prisma` - Database schema and seeds

## Adding New Sports

To add a new sport:

1. Append `{ slug, name }` to the `SPORTS` array in `prisma/seed.ts`
2. Run `npm run seed`
3. The sport will automatically appear in all filters and forms

## API Endpoints

- `GET /api/sports` - List all sports
- `GET /api/search?city=...&sport=...` - Search courts
- `GET /api/courts/[id]/availability?date=...` - Get available slots
- `POST /api/bookings` - Create a booking
- `POST /api/venues` - Create a venue
- `POST /api/courts` - Create a court

## Notes

- User authentication is stubbed (placeholder users)
- Payments are pending (status=PENDING), PIX integration coming soon
- Map integration is a placeholder for now

