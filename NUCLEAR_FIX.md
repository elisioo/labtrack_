# 🚨 NUCLEAR OPTION - Complete Git Reset

## The Problem
GitHub detected API keys (Groq + Gemini) in commit `6f7cef1` and is blocking ALL pushes.

## The Solution
Completely delete Git history and start fresh.

## ⚠️ BEFORE YOU START

1. **Your code is safe** - this only affects Git history, not your files
2. **You'll lose commit history** - but you can push successfully
3. **Regenerate ALL API keys** - they've been exposed:
   - Groq API Key: https://console.groq.com/keys
   - Gemini API Key: https://makersuite.google.com/app/apikey

---

## Execute These Commands (Copy & Paste)

```powershell
# Step 1: Delete all Git history
Remove-Item -Recurse -Force .git

# Step 2: Initialize fresh Git repo
git init

# Step 3: Add all files (except .env - it's in .gitignore)
git add .

# Step 4: Create first commit (without secrets!)
git commit -m "Initial commit - LabTrack system without secrets"

# Step 5: Set main branch
git branch -M main

# Step 6: Add remote
git remote add origin https://github.com/elisioo/labtrack_.git

# Step 7: Force push (overwrites GitHub completely)
git push -f origin main
```

---

## After Push Succeeds

### 1. Regenerate BOTH API Keys

**Groq API:**
- Go to https://console.groq.com/keys
- Delete the old key
- Create new key
- Update `.env`

**Gemini API:**
- Go to https://makersuite.google.com/app/apikey
- Delete the old key
- Create new key
- Update `.env`

### 2. Update `.env` File
```env
GEMINI_API_KEY=your_new_gemini_key_here
GROQ_API_KEY=your_new_groq_key_here
PORT=3000
```

### 3. Verify .env is Not Tracked
```powershell
git status
# Should NOT show .env
```

---

## Why This Works

- Deletes entire `.git` folder (all history gone)
- Creates brand new Git repo
- `.gitignore` already has `.env` in it
- New commit has NO secrets
- Force push overwrites GitHub completely
- GitHub's secret scanner won't find anything

---

## What You Lose

- ❌ All commit history
- ❌ All branches (except main)
- ❌ All tags

## What You Keep

- ✅ All your code
- ✅ All your files
- ✅ Ability to push to GitHub
- ✅ Fresh start without secrets

---

## Alternative (If You Want to Keep History)

Visit this URL GitHub provided:
https://github.com/elisioo/labtrack_/security/secret-scanning/unblock-secret/3FlWpCz6qT4FfljOCaTxrv5nc82

Click "Allow secret" - BUT you MUST regenerate your keys immediately after!

---

## Execute Now

Copy and paste all 7 commands above. It takes 10 seconds.

After push succeeds:
1. ✅ Regenerate Groq key
2. ✅ Regenerate Gemini key  
3. ✅ Update `.env`
4. ✅ Continue developing!

Your code is safe. Your secrets will be safe. Your Git will be clean. 🚀
