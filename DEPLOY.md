# Deploy to Vercel - Step by Step Guide

## Step 1: Commit Your Code

```bash
git add .
git commit -m "Initial MVP - Court booking system"
```

## Step 2: Push to GitHub

### If you don't have a GitHub repo yet:

1. Go to https://github.com/new
2. Create a new repository:
   - Name: `mvp-court-booking` (or any name)
   - Make it **Public** (or Private if you prefer)
   - **Don't** initialize with README
   - Click "Create repository"

3. Copy the commands GitHub shows you (or use these):
```bash
git remote add origin https://github.com/YOUR_USERNAME/mvp-court-booking.git
git branch -M main
git push -u origin main
```

### If you already have a GitHub repo:
```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "Add New..." → "Project"
5. Import your repository:
   - Find `mvp-court-booking` (or your repo name)
   - Click "Import"
6. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
7. **IMPORTANT**: Add Environment Variable:
   - Click "Environment Variables"
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:BrenoFazenda123@db.fwoitgvlaarpqpnjvanj.supabase.co:5432/postgres`
   - Click "Add"
8. Click "Deploy"
9. Wait 2-3 minutes for deployment

## Step 4: Run Database Migrations on Vercel

After deployment, you need to run migrations on production:

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations
npx prisma migrate deploy
```

### Option B: Using Supabase Dashboard
Go to Supabase → SQL Editor and run:
```sql
-- Copy the SQL from prisma/migrations/[latest]/migration.sql
-- Paste and run it in Supabase SQL Editor
```

### Option C: Add Post-Deploy Script
We can add a script to auto-run migrations on deploy (I'll set this up for you).

## Step 5: Seed Production Database (Optional)

If you want demo data in production:
```bash
# Run seed script (you can do this locally pointing to production DB)
# Or manually add data via Supabase dashboard
```

## Step 6: Your Site is Live! 🎉

Vercel will give you a URL like: `https://mvp-court-booking.vercel.app`

Share this URL with anyone!

---

## Troubleshooting

**Build fails on Vercel:**
- Check that `DATABASE_URL` environment variable is set
- Make sure Prisma generates client: `npx prisma generate` should be in build

**Database connection errors:**
- Check Supabase allows connections from Vercel IPs
- Verify `DATABASE_URL` is correct in Vercel environment variables

**Migrations not running:**
- Run `npx prisma migrate deploy` manually
- Or add postinstall script to package.json

