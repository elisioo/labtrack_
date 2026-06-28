# LabTrack AI Chatbot Integration Guide

## 📋 Overview

The LabTrack AI Chatbot provides intelligent assistance to users for laboratory management queries using Google's Gemini AI. It's fully integrated into the application with no external dependencies.

## 🏗️ Architecture

### File Structure

```
labtrack/
├── .env                              # Environment variables (GEMINI_API_KEY)
├── src/
│   ├── components/
│   │   └── Chatbot.tsx              # Chat UI component (React)
│   ├── routes/
│   │   ├── api.chat.ts              # API route handler (TanStack Start)
│   │   └── _app.tsx                 # App shell (includes Chatbot)
│   └── api/
│       ├── server.js                # [DEPRECATED] Old standalone server
│       └── README.md                # Migration notes
└── docs/
    └── CHATBOT_INTEGRATION.md       # This file
```

### Components

#### 1. **Chatbot.tsx** (Frontend)
- **Location**: `src/components/Chatbot.tsx`
- **Technology**: React with TypeScript
- **Features**:
  - Floating chat widget (bottom-right corner)
  - Message history with conversation context
  - Typing indicators
  - Auto-scrolling messages
  - Responsive textarea input
  - Error handling

#### 2. **api.chat.ts** (Backend API Route)
- **Location**: `src/routes/api.chat.ts`
- **Technology**: TanStack Start API route
- **Features**:
  - Processes chat messages
  - Integrates with Google Gemini AI
  - System instruction for LabTrack context
  - Conversation history management
  - Error handling and validation

#### 3. **AppShell Integration**
- **Location**: `src/components/AppShell.tsx`
- **Integration**: ChatWidget imported and rendered globally
- **Visibility**: Available on all authenticated pages

## 🚀 Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### 2. Configure Environment Variables

Create or update `.env` file in the project root:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: 
- Never commit `.env` to version control
- The `.env` file is already in `.gitignore`
- For production, set environment variables in Vercel dashboard

### 3. Install Dependencies

All required dependencies are already in `package.json`. If needed:

```bash
npm install
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# The chatbot will be available at http://localhost:3000
```

## 🎨 Customization

### Modify System Instructions

Edit `src/routes/api.chat.ts`:

```typescript
const SYSTEM_INSTRUCTION = `You are LabTrack Assistant...
[Customize the AI's behavior and knowledge here]
`;
```

### Customize UI Styling

Edit `src/components/Chatbot.tsx`:

```typescript
const styles: Record<string, React.CSSProperties> = {
  header: {
    background: "#1a73e8", // Change header color
    // ... other styles
  },
  // ... modify other style properties
};
```

### Change Widget Position

In `Chatbot.tsx`, modify:

```typescript
const styles = {
  widget: {
    position: "fixed",
    bottom: 24,  // Distance from bottom
    right: 24,   // Distance from right
    // Change to: left: 24 for left side
  }
};
```

## 🔧 API Configuration

### Request Format

**Endpoint**: `POST /api/chat`

**Body**:
```json
{
  "messages": [
    { "role": "user", "content": "How do I check lab schedules?" },
    { "role": "assistant", "content": "To check lab schedules..." },
    { "role": "user", "content": "Thank you!" }
  ]
}
```

### Response Format

**Success**:
```json
{
  "reply": "You're welcome! Let me know if you need help with anything else."
}
```

**Error**:
```json
{
  "error": "Error message here"
}
```

### Gemini Configuration

Current settings in `api.chat.ts`:

```typescript
generationConfig: {
  temperature: 0.7,      // Creativity (0-1)
  maxOutputTokens: 512,  // Max response length
  topP: 0.95,           // Nucleus sampling
  topK: 40,             // Top-k sampling
}
```

## 🚢 Deployment

### Vercel Deployment

1. **Set Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_key_here`

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Verify**:
   - Chat widget should appear on all pages
   - Test by sending a message
   - Check Vercel logs for any errors

### Environment Variables by Environment

```bash
# Development (.env.local)
GEMINI_API_KEY=your_dev_key

# Production (Vercel Dashboard)
GEMINI_API_KEY=your_prod_key
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Chatbot widget appears in bottom-right corner
- [ ] Click to open chat interface
- [ ] Send a test message
- [ ] Receive AI response
- [ ] Check conversation history maintains context
- [ ] Test error handling (invalid API key)
- [ ] Test on mobile viewport
- [ ] Test with multiple messages
- [ ] Close and reopen widget

### Common Test Messages

```
1. "What is LabTrack?"
2. "How do I view my schedule?"
3. "Explain compliance tracking"
4. "What are session logs?"
5. "How do I check room occupancy?"
```

## 🐛 Troubleshooting

### Issue: "AI service not configured"
**Solution**: Ensure `GEMINI_API_KEY` is set in `.env` file

### Issue: "Connection error"
**Solution**: 
- Check internet connection
- Verify API key is valid
- Check Gemini API status

### Issue: Chatbot doesn't appear
**Solution**:
- Verify `<ChatWidget />` is in `AppShell.tsx`
- Check browser console for errors
- Ensure you're on an authenticated page

### Issue: "No response from AI"
**Solution**:
- Check Gemini API quotas
- Verify API key permissions
- Check server logs for detailed errors

## 📊 Monitoring

### Check Gemini API Usage

Visit: https://aistudio.google.com/app/apikey

- Monitor API calls
- Check remaining quota
- Review error rates

### Server Logs

Development:
```bash
npm run dev
# Check console output
```

Production (Vercel):
```bash
vercel logs
# Or check Vercel Dashboard → Logs
```

## 🔒 Security Best Practices

1. **Never expose API keys**:
   - Don't commit `.env` to git
   - Don't log API keys
   - Don't send keys to frontend

2. **Rate Limiting** (Future Enhancement):
   - Add rate limiting to `/api/chat`
   - Prevent abuse

3. **Input Validation**:
   - Already validates message format
   - Consider adding content filtering

4. **CORS** (if needed):
   - Currently not needed (same-origin)
   - Configure if adding external consumers

## 📈 Future Enhancements

- [ ] Add message persistence (database)
- [ ] User-specific conversation history
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] File attachment support
- [ ] Integration with LabTrack data (real-time queries)
- [ ] Analytics dashboard for chatbot usage
- [ ] Feedback mechanism (thumbs up/down)
- [ ] Suggested questions/prompts
- [ ] Rich message formatting (markdown)

## 📚 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [TanStack Start Documentation](https://tanstack.com/start)
- [React Best Practices](https://react.dev/)

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Test with simple messages
4. Contact development team

---

**Last Updated**: 2025-06-28
**Version**: 1.0.0
