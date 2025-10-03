# WorkBase Backend API

Node.js backend server for WorkBase application providing AI assistant and Google Calendar integration.

## Features

- 🤖 **AI Assistant** - OpenAI-powered chatbot for productivity assistance
- 📅 **Google Calendar Integration** - Full calendar CRUD operations with OAuth2
- 🔒 **Security** - Rate limiting, CORS, Helmet security headers
- 📊 **Logging** - Winston logger with file and console output
- 💾 **Database** - MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: OpenAI GPT-3.5/4
- **Calendar**: Google Calendar API
- **Database**: MongoDB
- **Logging**: Winston
- **Security**: Helmet, express-rate-limit, CORS

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Get from Google Cloud Console
- `MONGODB_URI` - Your MongoDB connection string

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Run the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### AI Assistant
- `POST /api/ai/chat` - Send message to AI
- `POST /api/ai/clear` - Clear conversation history
- `GET /api/ai/summary/:sessionId` - Get conversation summary
- `POST /api/ai/task-suggestions` - Generate task breakdown
- `POST /api/ai/analyze-productivity` - Analyze productivity data

### Google Calendar
- `GET /api/calendar/auth-url` - Get OAuth authorization URL
- `POST /api/calendar/callback` - Handle OAuth callback
- `GET /api/calendar/events` - List calendar events
- `GET /api/calendar/events/today` - Get today's events
- `POST /api/calendar/events` - Create new event
- `PUT /api/calendar/events/:eventId` - Update event
- `DELETE /api/calendar/events/:eventId` - Delete event

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   │   └── database.js # MongoDB connection
│   ├── controllers/    # Route controllers
│   │   ├── aiController.js
│   │   └── calendarController.js
│   ├── services/       # Business logic
│   │   ├── aiService.js
│   │   └── calendarService.js
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── utils/          # Utility functions
│   │   └── logger.js
│   └── server.js       # Main server file
├── logs/               # Log files
├── .env                # Environment variables
├── .env.example        # Environment template
├── package.json
└── README.md
```

## API Request Examples

### AI Chat
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me plan my work day",
    "sessionId": "user-123"
  }'
```

### Get Calendar Auth URL
```bash
curl http://localhost:5000/api/calendar/auth-url
```

### Get Today's Events
```bash
curl http://localhost:5000/api/calendar/events/today \
  -H "Content-Type: application/json" \
  -d '{"tokens": {...}}'
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Request payload validation
- **Error Handling**: Centralized error handling

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error level logs
- `combined.log` - All logs

Console output in development mode.

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/workbase |
| JWT_SECRET | JWT signing secret | - |
| OPENAI_API_KEY | OpenAI API key | - |
| OPENAI_MODEL | OpenAI model | gpt-3.5-turbo |
| GOOGLE_CLIENT_ID | Google OAuth client ID | - |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | - |
| FRONTEND_URL | Frontend application URL | http://localhost:3000 |

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC
