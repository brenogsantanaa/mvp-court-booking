# Quick Start Guide

## ✅ Step 1: Node.js Installed ✓
You already have Node.js v24.11.0 installed!

## 🔧 Step 2: Set Up Database

You need a PostgreSQL database. Two options:

### Option A: Supabase (Free, Easiest) ⭐ Recommended

1. Go to https://supabase.com
2. Click "Start your project" → Sign up (free)
3. Create a new project:
   - Name: `mvp-courts` (or any name)
   - Database password: **Save this password!**
   - Region: Choose closest to you
   - Wait 2 minutes for project to create

4. Get your connection string:
   - Go to **Settings** → **Database**
   - Scroll to "Connection string"
   - Click "URI" tab
   - Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)

5. Create `.env` file in project root:
   ```bash
   # In your terminal, run:
   echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"' > .env
   ```
   
   Or manually create `.env` file and paste:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"
   ```
   
   **Replace `YOUR_PASSWORD` with your actual Supabase password!**

### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:
```bash
createdb mvp
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/mvp"' > .env
```

## 🗄️ Step 3: Run Database Migrations

```bash
npx prisma migrate dev -n init
```

This creates all the tables in your database.

## 🌱 Step 4: Seed the Database

```bash
npm run seed
```

This adds:
- 9 sports (soccer, tennis, basketball, etc.)
- 4 demo venues with courts

## 🚀 Step 5: Start the App!

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

---

## 🐛 Troubleshooting

**"Can't reach database server"**
- Check your `.env` file has the correct `DATABASE_URL`
- Make sure you replaced `YOUR_PASSWORD` with actual password
- For Supabase: Wait 2-3 minutes after creating project

**"Table does not exist"**
- Run `npx prisma migrate dev -n init` again

**"No data showing"**
- Run `npm run seed` to add demo data

