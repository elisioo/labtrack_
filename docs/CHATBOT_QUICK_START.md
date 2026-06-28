# LabTrack Chatbot - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Get API Key (2 minutes)
```
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
```

### 2. Configure Environment (1 minute)
Create/edit `.env` in project root:
```env
GEMINI_API_KEY=paste_your_key_here
```

### 3. Run Application (1 minute)
```bash
npm run dev
```

### 4. Test Chatbot (1 minute)
```
1. Open http://localhost:3000
2. Look for chat icon (💬) in bottom-right corner
3. Click to open
4. Send: "What is LabTrack?"
5. ✅ You should get an AI response!
```

## 📁 File Structure (What You Need to Know)

```
✅ Already Integrated (No changes needed)
├── src/components/Chatbot.tsx      ✓ UI component
├── src/routes/api.chat.ts          ✓ Backend API
└── src/components/AppShell.tsx     ✓ Integration point

⚙️ Configuration (You may customize)
├── .env                             📝 Add your API key here
└── src/routes/api.chat.ts          📝 Customize AI behavior

❌ Deprecated (Can be deleted)
└── src/api/server.js                🗑️ Old standalone server
```

## 🎯 Quick Customization

### Change AI Personality
Edit `src/routes/api.chat.ts` line ~6:
```typescript
const SYSTEM_INSTRUCTION = `You are [Your Custom Description]`;
```

### Change Widget Title
Edit `src/components/Chatbot.tsx` line ~139:
```typescript
<div style={styles.headerName}>Your Custom Name</div>
```

### Change Widget Color
Edit `src/components/Chatbot.tsx` line ~218:
```typescript
header: {
  background: "#your-color-here", // e.g., "#0d9488" for teal
}
```

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
# 1. Add API key in Vercel Dashboard
Settings → Environment Variables → Add:
GEMINI_API_KEY = your_key_here

# 2. Deploy
vercel --prod
```

### Other Platforms
Set `GEMINI_API_KEY` environment variable in your hosting platform's dashboard.

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| No chat icon appears | Check that `<ChatWidget />` is in `AppShell.tsx` |
| "AI service not configured" | Add `GEMINI_API_KEY` to `.env` file |
| "Connection error" | Verify API key is correct and has quota |
| Widget appears but no response | Check browser console and server logs |

## 📞 Quick Test Commands

Paste these into the chat to verify it's working:

```
✅ Basic Test
"Hello, are you working?"

✅ LabTrack Specific
"What features does LabTrack have?"

✅ Context Test
"What is laboratory compliance?"
"How do I track it?" (should remember previous question)
```

## 🎨 Visual Customization Cheat Sheet

All styling in `src/components/Chatbot.tsx` (lines 218+):

```typescript
// Widget size & position
chatBox: { width: 360, height: 480 }          // Size
widget: { bottom: 24, right: 24 }             // Position

// Colors
header: { background: "#1a73e8" }             // Header color
msgUser: { background: "#1a73e8" }            // User message
msgBot: { background: "#fff" }                // Bot message

// Sizes
toggleBtn: { width: 56, height: 56 }          // Float button
avatar: { width: 36, height: 36 }             // Avatar size
```

## 📊 Monitoring Usage

Check your Gemini API usage:
https://aistudio.google.com/app/apikey

Free tier: 15 requests/minute, 1M tokens/day

---

**Need more details?** See `CHATBOT_INTEGRATION.md` for full documentation.
