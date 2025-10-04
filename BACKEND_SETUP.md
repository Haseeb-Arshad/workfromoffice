# WorkBase Backend Setup Guide

Complete guide to set up and integrate the WorkBase Node.js backend with your frontend application.

## 🎯 Overview

The backend provides:
- **AI Chat Assistant** using OpenAI GPT-3.5/4
- **Google Calendar Integration** with OAuth2
- **RESTful API** for all frontend features
- **Security & Rate Limiting**
- **MongoDB Database** for data persistence

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher)
2. **MongoDB** (Local installation or MongoDB Atlas account)
3. **OpenAI API Key** (from https://platform.openai.com/)
4. **Google Cloud Project** with Calendar API enabled

---

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Whitelist your IP address

### 3. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy the key (starts with `sk-`)

### 4. Set Up Google Calendar API

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret

### 5. Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/workbase

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Google Calendar
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 6. Start the Backend Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## 🔧 Frontend Integration

### 1. Create Frontend Environment File

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Use the API Utility

The API utility is already created at `infrastructure/lib/api.ts`.

**Example: AI Chat**
```typescript
import { aiApi } from '@/infrastructure/lib/api';

const response = await aiApi.chat('Hello AI!', sessionId);
console.log(response.data.message);
```

**Example: Calendar**
```typescript
import { calendarApi } from '@/infrastructure/lib/api';

// Get auth URL
const { data } = await calendarApi.getAuthUrl();
window.location.href = data.authUrl;

// Get today's events
const events = await calendarApi.getTodayEvents(tokens);
```

---

## 📡 API Endpoints Reference

### Health Check
```
GET /health
```

### AI Assistant
```
POST   /api/ai/chat                      # Send message
POST   /api/ai/clear                     # Clear history
GET    /api/ai/summary/:sessionId        # Get summary
POST   /api/ai/task-suggestions          # Generate tasks
POST   /api/ai/analyze-productivity      # Analyze data
```

### Google Calendar
```
GET    /api/calendar/auth-url            # Get OAuth URL
POST   /api/calendar/callback            # OAuth callback
GET    /api/calendar/events              # List events
GET    /api/calendar/events/today        # Today's events
POST   /api/calendar/events              # Create event
PUT    /api/calendar/events/:eventId     # Update event
DELETE /api/calendar/events/:eventId     # Delete event
```

---

## 🧪 Testing the Backend

### Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### Test AI Chat
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "sessionId": "test-123"}'
```

### Test Calendar Auth URL
```bash
curl http://localhost:5000/api/calendar/auth-url
```

---

## 🔐 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Request sanitization
- **Error Handling**: Secure error messages
- **Environment Variables**: Sensitive data protection

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js       # AI endpoints
│   │   └── calendarController.js # Calendar endpoints
│   ├── services/
│   │   ├── aiService.js          # OpenAI integration
│   │   └── calendarService.js    # Google Calendar integration
│   ├── middleware/               # Custom middleware
│   ├── models/                   # Database models
│   ├── utils/
│   │   └── logger.js             # Winston logger
│   └── server.js                 # Main server file
├── logs/                         # Log files
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json
└── README.md
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Ensure MongoDB service is started

### OpenAI API Error
- Verify API key is correct
- Check account has credits
- Ensure no rate limiting

### Google Calendar Error
- Verify OAuth credentials
- Check redirect URI matches exactly
- Ensure Calendar API is enabled

### CORS Error
- Verify `FRONTEND_URL` in `.env`
- Check frontend is running on correct port
- Ensure credentials are enabled

---

## 📊 Monitoring

### View Logs
```bash
# Development (console)
npm run dev

# Production logs
tail -f logs/combined.log
tail -f logs/error.log
```

### Check Server Status
```bash
curl http://localhost:5000/health
```

---

## 🚢 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Set secure JWT secret
4. Configure production domain in CORS

### Run in Production
```bash
npm start
```

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start src/server.js --name workbase-api
pm2 save
pm2 startup
```

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

---

## 💡 Tips

1. **Development**: Use `npm run dev` for hot-reload
2. **API Testing**: Use Postman or Thunder Client
3. **Debugging**: Check `logs/error.log` for errors
4. **Performance**: Monitor API response times
5. **Security**: Rotate JWT secret regularly

---

## 🆘 Support

If you encounter issues:
1. Check logs in `logs/` directory
2. Verify all environment variables are set
3. Ensure all services (MongoDB, etc.) are running
4. Review API documentation above

---

## ✅ Checklist

Before deploying:
- [ ] MongoDB is configured and running
- [ ] OpenAI API key is valid
- [ ] Google Calendar OAuth is set up
- [ ] Environment variables are configured
- [ ] Backend starts without errors
- [ ] Health endpoint responds
- [ ] AI chat works
- [ ] Calendar integration works
- [ ] CORS is properly configured
- [ ] Logs are being written

---

**Your WorkBase backend is now ready! 🎉**
