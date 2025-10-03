const { google } = require('googleapis');
const logger = require('../utils/logger');

class CalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Generate OAuth2 authorization URL
   */
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      logger.info('Google Calendar tokens obtained successfully');
      return tokens;
    } catch (error) {
      logger.error(`Error getting calendar tokens: ${error.message}`);
      throw new Error('Failed to obtain calendar tokens');
    }
  }

  /**
   * Set credentials for the OAuth2 client
   */
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Refresh access token if expired
   */
  async refreshAccessToken(refreshToken) {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      logger.info('Access token refreshed successfully');
      return credentials;
    } catch (error) {
      logger.error(`Error refreshing token: ${error.message}`);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get list of events from calendar
   */
  async listEvents(tokens, timeMin, timeMax, maxResults = 50) {
    try {
      this.setCredentials(tokens);
      
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      logger.info(`Retrieved ${response.data.items?.length || 0} calendar events`);
      
      return response.data.items || [];
    } catch (error) {
      logger.error(`Error listing events: ${error.message}`);
      throw new Error('Failed to retrieve calendar events');
    }
  }

  /**
   * Get today's events
   */
  async getTodayEvents(tokens) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.listEvents(
      tokens,
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );
  }

  /**
   * Get week's events
   */
  async getWeekEvents(tokens) {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.listEvents(
      tokens,
      today.toISOString(),
      nextWeek.toISOString()
    );
  }

  /**
   * Create a new calendar event
   */
  async createEvent(tokens, eventData) {
    try {
      this.setCredentials(tokens);
      
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: eventData.summary,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        location: eventData.location || '',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      logger.info(`Event created successfully: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error(`Error creating event: ${error.message}`);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Update an existing calendar event
   */
  async updateEvent(tokens, eventId, eventData) {
    try {
      this.setCredentials(tokens);
      
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        location: eventData.location,
      };

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });

      logger.info(`Event updated successfully: ${eventId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating event: ${error.message}`);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(tokens, eventId) {
    try {
      this.setCredentials(tokens);
      
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      logger.info(`Event deleted successfully: ${eventId}`);
      return { success: true, message: 'Event deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting event: ${error.message}`);
      throw new Error('Failed to delete calendar event');
    }
  }

  /**
   * Get event by ID
   */
  async getEvent(tokens, eventId) {
    try {
      this.setCredentials(tokens);
      
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const response = await calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      return response.data;
    } catch (error) {
      logger.error(`Error getting event: ${error.message}`);
      throw new Error('Failed to retrieve calendar event');
    }
  }

  /**
   * Check if user has calendar access
   */
  async verifyAccess(tokens) {
    try {
      this.setCredentials(tokens);
      
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      await calendar.calendarList.list({
        maxResults: 1,
      });

      return true;
    } catch (error) {
      logger.error(`Calendar access verification failed: ${error.message}`);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new CalendarService();
