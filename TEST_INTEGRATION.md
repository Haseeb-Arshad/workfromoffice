# WorkBase Frontend-Backend Integration Test

## 🚀 Quick Test Setup

### Step 1: Start Backend Server

Open Terminal 1 and run:

```bash
cd backend
npm run dev
```

You should see:
```
WorkBase API Server running on port 5000
Environment: development  
Frontend URL: http://localhost:3000
Backend is ready to receive requests!
```

### Step 2: Start Frontend

Open Terminal 2 and run:

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Step 3: Test the Integration

1. **Open WorkBase** at `http://localhost:3000`
2. **Open AI Assistant** by clicking the AI Assistant icon on desktop
3. **Send a test message** like "Hello AI!"
4. **Check for response** - you should see either:
   - AI response from OpenAI (if API key is configured)
   - Error message indicating backend connection issues

---

## 🔧 Backend Configuration

### Required for Full AI Features:

1. **OpenAI API Key** (Required for AI chat)
   - Get from: https://platform.openai.com/api-keys
   - Add to `backend/.env`: `OPENAI_API_KEY=sk-your-key-here`

2. **Google Calendar** (Optional)
   - Setup OAuth2 credentials at: https://console.cloud.google.com/
   - Add to `backend/.env`: 
     ```
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     ```

3. **MongoDB** (Optional - backend works without it)
   - Local: Install MongoDB and start with `mongod`
   - Cloud: Use MongoDB Atlas (free tier available)
   - Add to `backend/.env`: `MONGODB_URI=mongodb://localhost:27017/workbase`

---

## 🧪 Test Endpoints Manually

### Test Backend Health

```bash
curl http://localhost:5000/health
```
Expected response:
```json
{"status": "ok", "timestamp": "2025-10-04T12:56:28.000Z"}
```

### Test AI Chat (with OpenAI key)

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello AI!", "sessionId": "test-123"}'
```

### Test AI Chat (without OpenAI key)

Should return error about missing API key.

---

## 📱 Frontend Features to Test

1. **AI Assistant Icon** - Should appear on desktop
2. **AI Chat Interface** - Should open in a window
3. **Message Sending** - Should show loading state
4. **Error Handling** - Should show helpful error messages
5. **Session Management** - Should show session ID at bottom
6. **Clear Conversation** - Should reset chat history

---

## 🐛 Troubleshooting

### Frontend can't connect to backend:
- Check backend is running on port 5000
- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Check browser console for CORS errors

### AI responses show errors:
- Verify `OPENAI_API_KEY` is set in `backend/.env`
- Check OpenAI API key has credits
- Look at backend console logs for detailed errors

### Backend won't start:
- Make sure you're in the `backend` directory
- Run `npm install` if dependencies missing
- Check port 5000 isn't already in use

---

## ✅ Expected Working Flow

1. **Start Backend**: Server starts, shows "Backend is ready!"
2. **Start Frontend**: Next.js dev server starts
3. **Open AI Assistant**: Click icon, window opens
4. **Send Message**: Type and press Enter
5. **Loading State**: Shows "AI is thinking..."
6. **Response**: Either AI response or helpful error message
7. **Session Info**: Shows session ID and backend URL at bottom

---

## 🔄 Full Integration Test Script

Create a file `test-integration.js` in the root directory:

```javascript
// Test the full integration
async function testIntegration() {
  try {
    // Test backend health
    const health = await fetch('http://localhost:5000/health');
    const healthData = await health.json();
    console.log('✅ Backend health:', healthData);
    
    // Test AI chat
    const chat = await fetch('http://localhost:5000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Test', sessionId: 'test' })
    });
    const chatData = await chat.json();
    console.log('🤖 AI Chat:', chatData.success ? '✅ Working' : '❌ Failed');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

// Run in browser console when both servers are running
testIntegration();
```

---

## 🎯 Success Criteria

✅ **Backend starts without errors**
✅ **Frontend builds and runs**  
✅ **AI Assistant appears on desktop**
✅ **Chat interface opens and is responsive**
✅ **API calls are made to backend**
✅ **Error handling works properly**
✅ **Session management functions**
✅ **UI matches original theme**

---

## 📞 Need Help?

If you encounter issues:

1. Check both terminal outputs for error messages
2. Open browser developer tools and check Console tab
3. Verify all environment variables are set correctly
4. Make sure both servers are running simultaneously
5. Test backend endpoints directly with curl

**Your WorkBase AI integration is ready to test! 🎉**