// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Helper Functions
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// AI Assistant API
export const aiApi = {
  async chat(message: string, sessionId?: string) {
    return apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  },

  async clearConversation(sessionId: string) {
    return apiRequest('/api/ai/clear', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },

  async generateSummary(sessionId: string) {
    return apiRequest(`/api/ai/summary/${sessionId}`);
  },

  async generateTaskSuggestions(taskDescription: string) {
    return apiRequest('/api/ai/task-suggestions', {
      method: 'POST',
      body: JSON.stringify({ taskDescription }),
    });
  },

  async analyzeProductivity(taskData: any) {
    return apiRequest('/api/ai/analyze-productivity', {
      method: 'POST',
      body: JSON.stringify({ taskData }),
    });
  },
};

// Google Calendar API
export const calendarApi = {
  async getAuthUrl() {
    return apiRequest('/api/calendar/auth-url');
  },

  async handleCallback(code: string) {
    return apiRequest('/api/calendar/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  async getEvents(tokens: any, timeMin?: string, timeMax?: string, maxResults?: number) {
    const params = new URLSearchParams();
    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);
    if (maxResults) params.append('maxResults', maxResults.toString());

    return apiRequest(`/api/calendar/events?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.stringify(tokens)}`,
      },
    });
  },

  async getTodayEvents(tokens: any) {
    return apiRequest('/api/calendar/events/today', {
      method: 'POST',
      body: JSON.stringify({ tokens }),
    });
  },

  async createEvent(tokens: any, eventData: {
    summary: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    timeZone?: string;
  }) {
    return apiRequest('/api/calendar/events', {
      method: 'POST',
      body: JSON.stringify({ tokens, ...eventData }),
    });
  },

  async updateEvent(tokens: any, eventId: string, eventData: {
    summary?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    timeZone?: string;
  }) {
    return apiRequest(`/api/calendar/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({ tokens, ...eventData }),
    });
  },

  async deleteEvent(tokens: any, eventId: string) {
    return apiRequest(`/api/calendar/events/${eventId}`, {
      method: 'DELETE',
      body: JSON.stringify({ tokens }),
    });
  },
};

// Health Check
export const healthCheck = async () => {
  return apiRequest('/health');
};

export default {
  aiApi,
  calendarApi,
  healthCheck,
};
