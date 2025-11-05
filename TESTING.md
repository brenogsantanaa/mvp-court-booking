# Testing Guide

## Quick Start (5 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

**Option A: Supabase (Recommended for quick testing)**
1. Go to [supabase.com](https://supabase.com)
2. Create a free project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Create `.env` file in project root:
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Option B: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database:
```bash
createdb mvp
```
3. Create `.env` file:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/mvp"
```

### 3. Run Database Migrations
```bash
npx prisma migrate dev -n init
```
This creates all tables in your database.

### 4. Seed the Database
```bash
npm run seed
```
This adds:
- 9 sports (soccer, tennis, basketball, etc.)
- 4 demo venues (2 in SP, 2 in RJ)
- Multiple courts with realistic data

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing Checklist

### ✅ Home Page (`/`)
- [ ] See "Buscar Quadras" and "Área do Proprietário" links
- [ ] Click "Buscar Quadras" → goes to `/map`
- [ ] Click "Área do Proprietário" → goes to `/owner`

### ✅ Search/Map Page (`/map`)
- [ ] Default shows São Paulo courts
- [ ] Click "Rio de Janeiro" → filters change
- [ ] Click sport filter chips (Futebol, Tênis, etc.) → filters update
- [ ] See court cards with:
  - Venue name
  - Sport name
  - Price (R$ format)
  - Address
  - Badges (Coberto/Descoberto, Iluminação)
- [ ] Click "Ver horários" → goes to court detail page

### ✅ Court Details Page (`/court/[id]`)
- [ ] See venue information
- [ ] See court details (price, hours, features)
- [ ] See availability grid with hour slots
- [ ] Available slots are green, unavailable are gray
- [ ] Click an available slot → shows booking panel
- [ ] Click "Reservar" → creates booking, redirects to checkout

### ✅ Checkout Page (`/checkout/[bookingId]`)
- [ ] See booking confirmation
- [ ] See booking details (court, time, price)
- [ ] Status shows "Pendente" (yellow badge)
- [ ] Click "Voltar para busca" → returns to map

### ✅ Owner Dashboard (`/owner`)
- [ ] See two forms side by side

**Create Venue Form:**
- [ ] Fill in name, address, city
- [ ] Submit → venue appears in list below
- [ ] New venue appears in dropdown for adding courts

**Add Court Form:**
- [ ] Select a venue from dropdown
- [ ] Select a sport
- [ ] Set hours (e.g., 07:00 - 22:00)
- [ ] Set price (e.g., 150.00)
- [ ] Check "Coberto" or "Iluminação"
- [ ] Submit → court appears under venue in list

### ✅ Booking Flow End-to-End
1. [ ] Go to `/map`
2. [ ] Select a city and sport
3. [ ] Click "Ver horários" on a court
4. [ ] Select an available time slot
5. [ ] Click "Reservar"
6. [ ] See confirmation page
7. [ ] Go back to same court → booked slot now shows as unavailable

### ✅ API Endpoints (using curl or browser)

**GET /api/sports**
```bash
curl http://localhost:3000/api/sports
```
Should return array of 9 sports.

**GET /api/search?city=São Paulo&sport=soccer**
```bash
curl "http://localhost:3000/api/search?city=São%20Paulo&sport=soccer"
```
Should return courts in São Paulo for soccer.

**GET /api/courts/[courtId]/availability?date=2024-01-15**
```bash
# Get a court ID from the search results first
curl "http://localhost:3000/api/courts/[COURT_ID]/availability?date=2024-01-15"
```
Should return slots with availability.

**POST /api/bookings**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "courtId": "[COURT_ID]",
    "startTs": "2024-01-15T10:00:00Z",
    "endTs": "2024-01-15T11:00:00Z"
  }'
```
Should create a booking and return booking object.

---

## Common Issues & Solutions

### ❌ "Cannot find module '@prisma/client'"
**Solution:** Run `npm install` again, then `npx prisma generate`

### ❌ "P1001: Can't reach database server"
**Solution:** 
- Check your `.env` file has correct `DATABASE_URL`
- Make sure database is running
- For Supabase: Check connection string format

### ❌ "Table does not exist"
**Solution:** Run `npx prisma migrate dev -n init`

### ❌ "No sports found" or empty search results
**Solution:** Run `npm run seed` to populate database

### ❌ Port 3000 already in use
**Solution:** 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

---

## Database Inspection

### View data in Prisma Studio
```bash
npx prisma studio
```
Opens browser at http://localhost:5555 - visual database editor!

### Check tables directly
```bash
# Connect to PostgreSQL
psql $DATABASE_URL

# List tables
\dt

# View sports
SELECT * FROM "Sport";

# View venues
SELECT * FROM "Venue";

# View courts
SELECT * FROM "Court";

# View bookings
SELECT * FROM "Booking";
```

---

## Testing Different Scenarios

### 1. **Test Conflict Detection**
- Book a slot at 10:00-11:00
- Try to book the same slot again → should get 409 error

### 2. **Test Multiple Cities**
- Search São Paulo → see SP venues
- Search Rio de Janeiro → see RJ venues

### 3. **Test Sport Filtering**
- Search without sport → see all sports
- Filter by "Futebol" → only see soccer courts

### 4. **Test Owner Flow**
- Create a new venue
- Add multiple courts to that venue
- Search for your new venue → should appear in results

### 5. **Test Availability**
- Book a slot
- Go back to same court on same date
- That slot should be grayed out (unavailable)

---

## Next Steps After Testing

Once everything works:
1. ✅ Add real map integration (Google Maps, Mapbox)
2. ✅ Add user authentication (NextAuth, Clerk)
3. ✅ Add payment integration (PIX, Stripe)
4. ✅ Add email notifications
5. ✅ Add booking cancellation
6. ✅ Add reviews/ratings

---

## Quick Test Script

```bash
#!/bin/bash
# quick-test.sh

echo "🚀 Starting MVP Test..."

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo "📊 Running migrations..."
npx prisma migrate dev -n init

echo "🌱 Seeding database..."
npm run seed

echo "✅ Setup complete! Starting dev server..."
echo "👉 Open http://localhost:3000"
npm run dev
```

