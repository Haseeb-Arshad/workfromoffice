const OpenAI = require('openai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.conversationHistory = new Map(); // Store conversation history by session ID
  }

  /**
   * Get or create conversation history for a session
   */
  getConversationHistory(sessionId) {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for WorkBase, a productivity workspace application. You help users with task management, productivity tips, time management, and work-related questions. Be professional, concise, and helpful. Focus on actionable advice and practical solutions.'
        }
      ]);
    }
    return this.conversationHistory.get(sessionId);
  }

  /**
   * Send a message to the AI and get a response
   */
  async chat(message, sessionId = 'default', userId = null) {
    try {
      logger.info(`AI Chat request from user ${userId || 'anonymous'}, session: ${sessionId}`);

      // Get conversation history
      const history = this.getConversationHistory(sessionId);

      // Add user message to history
      history.push({
        role: 'user',
        content: message
      });

      // Keep only last 10 messages to manage token usage
      if (history.length > 21) { // 1 system + 20 messages
        history.splice(1, history.length - 21);
      }

      // Make API call to OpenAI
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: history,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      });

      const assistantMessage = completion.choices[0].message.content;

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: assistantMessage
      });

      logger.info(`AI Chat response generated successfully`);

      return {
        success: true,
        message: assistantMessage,
        usage: completion.usage,
      };

    } catch (error) {
      logger.error(`AI Chat error: ${error.message}`);
      
      // Handle specific OpenAI errors
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable');
      }

      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Clear conversation history for a session
   */
  clearConversation(sessionId) {
    this.conversationHistory.delete(sessionId);
    logger.info(`Conversation history cleared for session: ${sessionId}`);
  }

  /**
   * Get conversation summary
   */
  async generateSummary(sessionId) {
    try {
      const history = this.getConversationHistory(sessionId);
      
      if (history.length <= 1) {
        return 'No conversation to summarize';
      }

      const summaryPrompt = {
        role: 'user',
        content: 'Please provide a brief summary of our conversation so far.'
      };

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [...history, summaryPrompt],
        temperature: 0.5,
        max_tokens: 200,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      logger.error(`Summary generation error: ${error.message}`);
      throw new Error('Failed to generate conversation summary');
    }
  }

  /**
   * Generate task suggestions based on user input
   */
  async generateTaskSuggestions(taskDescription) {
    try {
      const prompt = `Based on this task: "${taskDescription}", suggest 3-5 actionable subtasks to accomplish it. Format as a numbered list.`;

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a productivity expert helping users break down tasks into manageable steps.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 300,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      logger.error(`Task suggestion error: ${error.message}`);
      throw new Error('Failed to generate task suggestions');
    }
  }

  /**
   * Analyze productivity and provide insights
   */
  async analyzeProductivity(taskData) {
    try {
      const prompt = `Analyze this productivity data and provide 2-3 actionable insights: ${JSON.stringify(taskData)}`;

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a productivity analyst providing concise, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 250,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      logger.error(`Productivity analysis error: ${error.message}`);
      throw new Error('Failed to analyze productivity');
    }
  }
}

// Export singleton instance
module.exports = new AIService();
