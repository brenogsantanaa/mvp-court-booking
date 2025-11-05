# 🚀 Deploy to Vercel - Quick Steps

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `mvp-court-booking` (or any name you like)
   - **Description**: "Court booking system for sports venues"
   - **Visibility**: Public (or Private - your choice)
   - **DO NOT** check "Add README" or any other options
3. Click **"Create repository"**

## Step 2: Push Code to GitHub

After creating the repo, GitHub will show you commands. Use these:

```bash
# Remove the placeholder remote
git remote remove origin

# Add your real GitHub repo (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mvp-court-booking.git

# Push to GitHub
git push -u origin main
```

You'll be asked to enter your GitHub username and password (or personal access token).

## Step 3: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login**:
   - Click "Sign Up"
   - Choose **"Continue with GitHub"**
   - Authorize Vercel to access your GitHub account

3. **Import Project**:
   - Click **"Add New..."** → **"Project"**
   - Find your repository `mvp-court-booking`
   - Click **"Import"**

4. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (should be default)
   - **Output Directory**: `.next` (should be default)

5. **Add Environment Variable** (CRITICAL!):
   - Scroll down to **"Environment Variables"**
   - Click to expand
   - Add new variable:
     - **Name**: `DATABASE_URL`
     - **Value**: `postgresql://postgres:BrenoFazenda123@db.fwoitgvlaarpqpnjvanj.supabase.co:5432/postgres`
     - **Environment**: Check all (Production, Preview, Development)
     - Click **"Add"**

6. **Deploy**:
   - Click **"Deploy"** button
   - Wait 2-3 minutes for build to complete

## Step 4: Run Database Migrations

After deployment completes, you need to run migrations on your production database.

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project (choose your project when prompted)
vercel link

# Run migrations on production
npx prisma migrate deploy
```

### Option B: Manual SQL in Supabase

1. Go to your Supabase dashboard
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**
4. Open the file: `prisma/migrations/[latest-folder]/migration.sql`
5. Copy all the SQL content
6. Paste into Supabase SQL Editor
7. Click **"Run"**

## Step 5: Seed Production Database (Optional)

If you want demo data on your live site, you can run:

```bash
# Point to production database (make sure DATABASE_URL is set)
npm run seed
```

Or manually add data through Supabase dashboard.

## ✅ Done!

Your site will be live at: `https://mvp-court-booking.vercel.app` (or similar)

You can:
- Share the URL with anyone
- Customize the domain in Vercel settings
- Make future updates by just pushing to GitHub (auto-deploys!)

---

## 🔐 Security Note

Your database password is visible in the connection string. For production:
1. Consider creating a separate Supabase project for production
2. Use Supabase's connection pooling
3. Set up proper database access controls

---

## 🐛 Troubleshooting

**Build fails?**
- Check that `DATABASE_URL` environment variable is set in Vercel
- Check Vercel build logs for errors

**Can't connect to database?**
- Verify Supabase project is active
- Check connection string is correct
- Make sure migrations ran successfully

**404 errors?**
- Make sure migrations ran on production database
- Check that seed data was added (if needed)

