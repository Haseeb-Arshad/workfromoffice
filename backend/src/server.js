require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/database');
const logger = require('./utils/logger');

// Controllers
const aiController = require('./controllers/aiController');
const calendarController = require('./controllers/calendarController');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Routes
app.post('/api/ai/chat', aiController.chat);
app.post('/api/ai/clear', aiController.clearConversation);
app.get('/api/ai/summary/:sessionId', aiController.generateSummary);
app.post('/api/ai/task-suggestions', aiController.generateTaskSuggestions);
app.post('/api/ai/analyze-productivity', aiController.analyzeProductivity);

// Calendar Routes
app.get('/api/calendar/auth-url', calendarController.getAuthUrl);
app.post('/api/calendar/callback', calendarController.handleCallback);
app.get('/api/calendar/events', calendarController.getEvents);
app.get('/api/calendar/events/today', calendarController.getTodayEvents);
app.post('/api/calendar/events', calendarController.createEvent);
app.put('/api/calendar/events/:eventId', calendarController.updateEvent);
app.delete('/api/calendar/events/:eventId', calendarController.deleteEvent);

// Error Handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start Server
const startServer = async () => {
  try {
    // Connect to Database
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.info(`WorkBase API Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
