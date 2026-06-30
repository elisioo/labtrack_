# 🚨 Fix "This page didn't load" on Vercel

## The Problem
Your app works locally but fails on Vercel production. This is usually because:
1. Environment variables (GEMINI_API_KEY) aren't set in Vercel
2. Build errors during deployment
3. Server function compatibility issues

---

## Step 1: Set Environment Variables in Vercel

### Go to Vercel Dashboard:
1. Visit: https://vercel.com/dashboard
2. Click your `labtrack` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `GEMINI_API_KEY` | Your new Gemini API key | Production, Preview, Development |
| `PORT` | 3000 | Production, Preview, Development |

### How to Add:
- Click **"Add New"**
- Name: `GEMINI_API_KEY`
- Value: Paste your API key
- Select: **Production, Preview, Development** (all 3 checkboxes)
- Click **Save**

---

## Step 2: Check Deployment Logs

### In Vercel Dashboard:
1. Go to your project
2. Click **"Deployments"** tab
3. Click the latest deployment
4. Click **"View Build Logs"**

### Look for errors like:
- ❌ `Module not found`
- ❌ `Cannot find module '@tanstack/react-start'`
- ❌ `Build failed`
- ❌ TypeScript errors

**If you see errors, copy them and show me!**

---

## Step 3: Redeploy After Adding Environment Variables

After setting environment variables:

### Option A: Redeploy from Dashboard
1. Go to **Deployments**
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**

### Option B: Push to GitHub
```powershell
# Make a small change (like adding a space)
# Then commit and push
git add .
git commit -m "Trigger redeploy"
git push origin main
```

Vercel will automatically redeploy!

---

## Step 4: Check for Server Function Issues

The `createServerFn` approach might not work on Vercel. Let's check if we need to create a fallback API route.

### Test the deployment:
1. Go to: `https://your-app.vercel.app`
2. Open browser console (F12)
3. Try to use the app
4. Look for errors in console

### Common errors:
- `createServerFn is not a function` → Need to update TanStack Start
- `500 Internal Server Error` → Check Vercel logs
- `Cannot read property of undefined` → Environment variable not set

---

## Step 5: Alternative - Create Vercel Serverless Function

If server functions don't work, we can create a Vercel API route:

### Create `api/chat.ts` (Vercel Serverless Function)
```powershell
# Create api folder
New-Item -ItemType Directory -Path api -Force

# Create API file
New-Item -ItemType File -Path api\chat.ts
```

Then we'll add the code for a standard Vercel serverless function.

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Environment variables set in Vercel dashboard
- [ ] `GEMINI_API_KEY` is present in all environments (Prod, Preview, Dev)
- [ ] Redeployed after adding env vars
- [ ] Build logs show "Build Completed"
- [ ] No errors in browser console (F12)
- [ ] Can access the homepage
- [ ] Chatbot button appears

---

## Most Likely Issue

**Environment variables not set in Vercel!**

Your local `.env` file doesn't get deployed to Vercel (it's in `.gitignore`). You MUST set them in Vercel dashboard.

---

## Next Steps

1. **Set `GEMINI_API_KEY` in Vercel dashboard** (Settings → Environment Variables)
2. **Redeploy** (click Redeploy or push to GitHub)
3. **Check deployment logs** for errors
4. **Test the app** at your Vercel URL

If it still doesn't work, show me:
- Vercel build logs (from the Deployments tab)
- Browser console errors (F12 → Console)
- Your Vercel URL

---

## Common Vercel Deployment Issues

### Issue: "This page didn't load"
**Fix:** Usually a build error or missing env vars

### Issue: Homepage loads but chatbot doesn't work
**Fix:** GEMINI_API_KEY not set

### Issue: Build fails
**Fix:** Check dependencies in package.json

### Issue: 404 on all routes
**Fix:** Check vercel.json configuration

---

Start with Step 1 (environment variables) and let me know what you find! 🚀
