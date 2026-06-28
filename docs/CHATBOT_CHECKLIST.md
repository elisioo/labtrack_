# LabTrack Chatbot - Integration Checklist

## ✅ Pre-Integration Verification

- [x] **Files Created**
  - [x] `src/components/Chatbot.tsx` - Frontend component
  - [x] `src/routes/api.chat.ts` - Backend API route
  - [x] `docs/CHATBOT_INTEGRATION.md` - Full documentation
  - [x] `docs/CHATBOT_QUICK_START.md` - Quick reference
  - [x] `docs/CHATBOT_CHECKLIST.md` - This checklist
  - [x] `CHATBOT_ARCHITECTURE.md` - Architecture overview

- [x] **Integration Points**
  - [x] ChatWidget imported in `AppShell.tsx`
  - [x] ChatWidget rendered in AppShell return statement
  - [x] API route created at `/api/chat`

- [x] **Configuration**
  - [x] BACKEND_URL updated to `/api/chat`
  - [x] System instruction customized for LabTrack
  - [x] Widget title changed to "LabTrack Assistant"

## 📋 Setup Tasks

### For Developer

- [ ] **1. Get Gemini API Key** (5 min)
  - [ ] Visit https://aistudio.google.com/app/apikey
  - [ ] Create API key
  - [ ] Copy key to clipboard

- [ ] **2. Configure Environment** (2 min)
  - [ ] Create/edit `.env` file in project root
  - [ ] Add line: `GEMINI_API_KEY=your_key_here`
  - [ ] Verify `.env` is in `.gitignore`

- [ ] **3. Install Dependencies** (3 min)
  ```bash
  npm install
  ```

- [ ] **4. Start Development Server** (1 min)
  ```bash
  npm run dev
  ```

- [ ] **5. Test Basic Functionality** (5 min)
  - [ ] Open http://localhost:3000
  - [ ] Log in to the application
  - [ ] Look for chat icon (💬) in bottom-right
  - [ ] Click to open chat
  - [ ] Send test message: "Hello"
  - [ ] Verify AI response received
  - [ ] Close and reopen chat
  - [ ] Verify messages persist during session

## 🧪 Testing Checklist

### Functional Testing

- [ ] **Widget Display**
  - [ ] Floating button appears in bottom-right corner
  - [ ] Button displays chat icon (💬)
  - [ ] Button has hover effect
  - [ ] Z-index is correct (appears above other content)

- [ ] **Open/Close Functionality**
  - [ ] Click button opens chat window
  - [ ] Chat window appears with animation
  - [ ] Close (×) button visible in header
  - [ ] Close button closes the chat
  - [ ] Opening/closing is smooth

- [ ] **Message Sending**
  - [ ] Can type in input field
  - [ ] Textarea auto-resizes with content
  - [ ] Enter key sends message
  - [ ] Shift+Enter creates new line
  - [ ] Send button is disabled when input is empty
  - [ ] Send button is disabled while sending
  - [ ] User message appears immediately
  - [ ] Typing indicator appears while waiting

- [ ] **Message Receiving**
  - [ ] AI response appears after 1-3 seconds
  - [ ] Typing indicator disappears when response arrives
  - [ ] Bot message styled differently from user message
  - [ ] Messages auto-scroll to latest
  - [ ] Long messages wrap correctly

- [ ] **Conversation Context**
  - [ ] Send: "What is LabTrack?"
  - [ ] Verify response mentions laboratory management
  - [ ] Send: "Tell me more about it"
  - [ ] Verify AI remembers previous context
  - [ ] Refresh page
  - [ ] Verify conversation is reset (expected behavior)

- [ ] **Error Handling**
  - [ ] Disconnect internet
  - [ ] Send message
  - [ ] Verify error message appears
  - [ ] Reconnect internet
  - [ ] Verify next message works

### UI/UX Testing

- [ ] **Desktop (1920x1080)**
  - [ ] Widget positioned correctly
  - [ ] Chat window size appropriate
  - [ ] Text readable
  - [ ] Buttons clickable
  - [ ] Scrolling works smoothly

- [ ] **Tablet (768x1024)**
  - [ ] Widget doesn't overlap content
  - [ ] Chat window fits screen
  - [ ] Touch interactions work
  - [ ] Virtual keyboard doesn't break layout

- [ ] **Mobile (375x667)**
  - [ ] Widget visible but not intrusive
  - [ ] Chat window takes appropriate space
  - [ ] Can type on mobile keyboard
  - [ ] Scrolling works on touch

- [ ] **Different Browsers**
  - [ ] Chrome/Edge (Chromium)
  - [ ] Firefox
  - [ ] Safari (if available)

### Content Testing

Send these test messages and verify responses:

- [ ] **General Query**
  ```
  "What is LabTrack?"
  Expected: Description of lab management system
  ```

- [ ] **Feature Query**
  ```
  "What features does LabTrack have?"
  Expected: List of features (scheduling, compliance, etc.)
  ```

- [ ] **Specific Feature**
  ```
  "How do I check lab schedules?"
  Expected: Guidance on schedule viewing
  ```

- [ ] **Compliance Query**
  ```
  "Explain compliance tracking"
  Expected: Information about compliance requirements
  ```

- [ ] **Context Retention**
  ```
  1. "What is session logging?"
  2. "How do I access it?"
  Expected: Second response references first question
  ```

- [ ] **Edge Cases**
  ```
  - Empty message (should be prevented)
  - Very long message (should wrap)
  - Special characters: @#$%^&*()
  - Emojis: 😀🎉✨
  - Multiple questions in one message
  ```

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] **Code Quality**
  - [ ] No console errors in browser
  - [ ] No TypeScript errors
  - [ ] No ESLint warnings
  - [ ] Code formatted with Prettier

- [ ] **Environment Variables**
  - [ ] `.env` file not committed to git
  - [ ] `.env.example` created with placeholder
  - [ ] Production API key ready

- [ ] **Documentation**
  - [ ] All docs files created
  - [ ] README updated with chatbot info
  - [ ] Team briefed on new feature

### Vercel Deployment

- [ ] **Configuration**
  - [ ] Log into Vercel dashboard
  - [ ] Navigate to project settings
  - [ ] Go to Environment Variables
  - [ ] Add `GEMINI_API_KEY` with production key
  - [ ] Verify key is set for Production environment

- [ ] **Deploy**
  ```bash
  vercel --prod
  ```

- [ ] **Verify Deployment**
  - [ ] Visit production URL
  - [ ] Log in to application
  - [ ] Test chatbot functionality
  - [ ] Send test message
  - [ ] Verify AI response
  - [ ] Check Vercel logs for errors

### Post-Deployment

- [ ] **Monitoring**
  - [ ] Check Gemini API usage dashboard
  - [ ] Monitor Vercel function logs
  - [ ] Check error rates
  - [ ] Verify response times acceptable

- [ ] **User Testing**
  - [ ] Get feedback from team
  - [ ] Test with real user scenarios
  - [ ] Document any issues
  - [ ] Create improvement tickets

## 🐛 Known Issues / Limitations

Document any known issues here:

- [ ] **Issue 1**: _______________
  - Impact: _______________
  - Workaround: _______________
  - Fix planned: Yes/No

- [ ] **Issue 2**: _______________
  - Impact: _______________
  - Workaround: _______________
  - Fix planned: Yes/No

## 📊 Performance Metrics

Track these after deployment:

- [ ] **Response Time**
  - Average: _____ seconds
  - P95: _____ seconds
  - P99: _____ seconds

- [ ] **API Usage**
  - Requests per day: _____
  - Quota remaining: _____
  - Error rate: _____% 

- [ ] **User Engagement**
  - Daily active users: _____
  - Messages per session: _____
  - Average session duration: _____

## 🎯 Success Criteria

Mark complete when all criteria met:

- [ ] Chatbot appears on all authenticated pages
- [ ] Users can send and receive messages
- [ ] AI responses are relevant to LabTrack
- [ ] No errors in production logs
- [ ] Performance within acceptable limits
- [ ] Team trained on troubleshooting
- [ ] Documentation complete and accessible

## 📝 Sign-Off

- [ ] **Developer**: _______________  Date: _______
- [ ] **QA Tester**: _______________  Date: _______
- [ ] **Product Owner**: _______________  Date: _______

---

**Checklist Version**: 1.0.0  
**Last Updated**: 2025-06-28
