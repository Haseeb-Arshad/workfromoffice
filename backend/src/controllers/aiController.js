const aiService = require('../services/aiService');
const logger = require('../utils/logger');

/**
 * Handle AI chat message
 */
exports.chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const userId = req.user?.id || null;
    const session = sessionId || `user-${userId || 'anonymous'}-${Date.now()}`;

    const response = await aiService.chat(message, session, userId);

    res.json({
      success: true,
      data: {
        message: response.message,
        sessionId: session,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    logger.error(`AI Chat controller error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process AI request'
    });
  }
};

/**
 * Clear conversation history
 */
exports.clearConversation = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    aiService.clearConversation(sessionId);

    res.json({
      success: true,
      message: 'Conversation cleared successfully'
    });

  } catch (error) {
    logger.error(`Clear conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation'
    });
  }
};

/**
 * Generate conversation summary
 */
exports.generateSummary = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    const summary = await aiService.generateSummary(sessionId);

    res.json({
      success: true,
      data: {
        summary,
        sessionId
      }
    });

  } catch (error) {
    logger.error(`Generate summary error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate summary'
    });
  }
};

/**
 * Generate task suggestions
 */
exports.generateTaskSuggestions = async (req, res) => {
  try {
    const { taskDescription } = req.body;

    if (!taskDescription) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    const suggestions = await aiService.generateTaskSuggestions(taskDescription);

    res.json({
      success: true,
      data: {
        suggestions,
        taskDescription
      }
    });

  } catch (error) {
    logger.error(`Task suggestions error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate task suggestions'
    });
  }
};

/**
 * Analyze productivity
 */
exports.analyzeProductivity = async (req, res) => {
  try {
    const { taskData } = req.body;

    if (!taskData) {
      return res.status(400).json({
        success: false,
        error: 'Task data is required'
      });
    }

    const analysis = await aiService.analyzeProductivity(taskData);

    res.json({
      success: true,
      data: {
        analysis,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error(`Productivity analysis error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze productivity'
    });
  }
};
