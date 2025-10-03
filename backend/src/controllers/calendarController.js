const calendarService = require('../services/calendarService');
const logger = require('../utils/logger');

/**
 * Get Google Calendar OAuth URL
 */
exports.getAuthUrl = (req, res) => {
  try {
    const authUrl = calendarService.getAuthUrl();
    res.json({
      success: true,
      data: { authUrl }
    });
  } catch (error) {
    logger.error(`Get auth URL error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate authorization URL'
    });
  }
};

/**
 * Handle OAuth callback and exchange code for tokens
 */
exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required'
      });
    }

    const tokens = await calendarService.getTokens(code);

    // Store tokens in session or database (implement based on your auth strategy)
    req.session.calendarTokens = tokens;

    res.json({
      success: true,
      message: 'Calendar connected successfully',
      data: { tokens }
    });

  } catch (error) {
    logger.error(`OAuth callback error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to connect calendar'
    });
  }
};

/**
 * Get calendar events
 */
exports.getEvents = async (req, res) => {
  try {
    const { timeMin, timeMax, maxResults } = req.query;
    const tokens = req.session.calendarTokens || req.body.tokens;

    if (!tokens) {
      return res.status(401).json({
        success: false,
        error: 'Calendar not connected'
      });
    }

    const events = await calendarService.listEvents(
      tokens,
      timeMin,
      timeMax,
      parseInt(maxResults) || 50
    );

    res.json({
      success: true,
      data: { events }
    });

  } catch (error) {
    logger.error(`Get events error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve calendar events'
    });
  }
};

/**
 * Get today's events
 */
exports.getTodayEvents = async (req, res) => {
  try {
    const tokens = req.session.calendarTokens || req.body.tokens;

    if (!tokens) {
      return res.status(401).json({
        success: false,
        error: 'Calendar not connected'
      });
    }

    const events = await calendarService.getTodayEvents(tokens);

    res.json({
      success: true,
      data: { events, count: events.length }
    });

  } catch (error) {
    logger.error(`Get today events error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve today\'s events'
    });
  }
};

/**
 * Create calendar event
 */
exports.createEvent = async (req, res) => {
  try {
    const tokens = req.session.calendarTokens || req.body.tokens;
    const eventData = req.body;

    if (!tokens) {
      return res.status(401).json({
        success: false,
        error: 'Calendar not connected'
      });
    }

    const event = await calendarService.createEvent(tokens, eventData);

    res.json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });

  } catch (error) {
    logger.error(`Create event error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
};

/**
 * Update calendar event
 */
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const tokens = req.session.calendarTokens || req.body.tokens;
    const eventData = req.body;

    if (!tokens) {
      return res.status(401).json({
        success: false,
        error: 'Calendar not connected'
      });
    }

    const event = await calendarService.updateEvent(tokens, eventId, eventData);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });

  } catch (error) {
    logger.error(`Update event error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to update event'
    });
  }
};

/**
 * Delete calendar event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const tokens = req.session.calendarTokens || req.body.tokens;

    if (!tokens) {
      return res.status(401).json({
        success: false,
        error: 'Calendar not connected'
      });
    }

    await calendarService.deleteEvent(tokens, eventId);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    logger.error(`Delete event error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    });
  }
};
