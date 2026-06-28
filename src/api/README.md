# LabTrack Chatbot API

## ⚠️ DEPRECATED - This standalone server is no longer needed

The chatbot API has been integrated directly into the TanStack Start application as an API route.

## New Architecture

The chatbot now uses:
- **API Route**: `src/routes/api.chat.ts` - Handles chat requests server-side
- **Component**: `src/components/Chatbot.tsx` - UI component integrated in AppShell
- **Environment**: Variables loaded from `.env` at project root

## Benefits of New Architecture

1. **Single Server**: No need to run a separate Node.js server
2. **Better Integration**: Direct access to environment variables and app context
3. **Simpler Deployment**: Works seamlessly with Vercel/production deployments
4. **Type Safety**: Full TypeScript support throughout the stack

## Migration Notes

If you were previously running `node src/api/server.js`, you can now:
1. Stop the standalone server
2. Just run `npm run dev` for the entire application
3. The chatbot will work automatically at `/api/chat`

## Old Files (Can be deleted)

- `src/api/server.js` - Standalone Express server (no longer needed)
- `src/api/package.json` - Dependencies (now in main package.json)

## Environment Setup

Ensure your `.env` file at the project root contains:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey
