const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');
const Message = require('../models/Message');
const Settings = require('../models/Settings');

class ChatbotService {
  constructor() {
    // Initialize Dialogflow client with credentials
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    this.sessionClient = new dialogflow.SessionsClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  // Process user message and get chatbot response
  async processMessage(message, userId, context = {}) {
    try {
      // Create a unique session ID for this conversation
      const sessionId = `${userId}-${uuidv4()}`;
      const sessionPath = this.sessionClient.projectAgentSessionPath(
        this.projectId,
        sessionId
      );

      // Create the text request
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: 'en-US',
          },
        },
        queryParams: {
          contexts: this._formatContexts(context),
        },
      };

      // Send request to Dialogflow
      const responses = await this.sessionClient.detectIntent(request);
      const result = responses[0].queryResult;

      // Save the interaction for training
      await this._saveInteraction(userId, message, result);

      return this._formatResponse(result);
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  // Format contexts for Dialogflow
  _formatContexts(context) {
    return Object.entries(context).map(([name, params]) => ({
      name: `projects/${this.projectId}/agent/sessions/-/contexts/${name}`,
      lifespanCount: 5,
      parameters: params,
    }));
  }

  // Format response from Dialogflow
  _formatResponse(result) {
    return {
      text: result.fulfillmentText,
      intent: result.intent.displayName,
      confidence: result.intentDetectionConfidence,
      parameters: result.parameters,
      contexts: result.outputContexts,
      action: result.action,
      source: 'dialogflow',
    };
  }

  // Save interaction for training
  async _saveInteraction(userId, userMessage, result) {
    try {
      const interaction = {
        userId,
        userMessage,
        botResponse: result.fulfillmentText,
        intent: result.intent.displayName,
        confidence: result.intentDetectionConfidence,
        timestamp: new Date(),
        successful: result.intentDetectionConfidence > 0.7,
      };

      // Save to database for training
      await ChatbotInteraction.create(interaction);
    } catch (error) {
      console.error('Error saving interaction:', error);
    }
  }

  // Train chatbot with new examples
  async trainWithExamples(examples) {
    try {
      const intentsClient = new dialogflow.IntentsClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      for (const example of examples) {
        const intent = {
          displayName: example.intent,
          trainingPhrases: example.phrases.map(phrase => ({
            type: 'EXAMPLE',
            parts: [{ text: phrase }],
          })),
          messages: [
            {
              text: {
                text: [example.response],
              },
            },
          ],
        };

        await intentsClient.createIntent({
          parent: `projects/${this.projectId}/agent`,
          intent,
        });
      }

      return { success: true, message: 'Training examples added successfully' };
    } catch (error) {
      console.error('Error training chatbot:', error);
      throw error;
    }
  }

  // Get chatbot analytics
  async getAnalytics(startDate, endDate) {
    try {
      const pipeline = [
        {
          $match: {
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: {
              intent: '$intent',
              successful: '$successful',
            },
            count: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' },
          },
        },
        {
          $group: {
            _id: '$_id.intent',
            total: { $sum: '$count' },
            successful: {
              $sum: {
                $cond: [{ $eq: ['$_id.successful', true] }, '$count', 0],
              },
            },
            failed: {
              $sum: {
                $cond: [{ $eq: ['$_id.successful', false] }, '$count', 0],
              },
            },
            avgConfidence: { $avg: '$avgConfidence' },
          },
        },
      ];

      const results = await ChatbotInteraction.aggregate(pipeline);

      // Calculate overall statistics
      const totalInteractions = results.reduce((sum, r) => sum + r.total, 0);
      const successfulInteractions = results.reduce((sum, r) => sum + r.successful, 0);

      return {
        intents: results,
        summary: {
          totalInteractions,
          successRate: (successfulInteractions / totalInteractions) * 100,
          uniqueIntents: results.length,
        },
      };
    } catch (error) {
      console.error('Error getting chatbot analytics:', error);
      throw error;
    }
  }

  // Get suggested improvements
  async getSuggestedImprovements() {
    try {
      // Find intents with low confidence
      const lowConfidenceIntents = await ChatbotInteraction.aggregate([
        {
          $group: {
            _id: '$intent',
            avgConfidence: { $avg: '$confidence' },
            count: { $sum: 1 },
            failedCount: {
              $sum: {
                $cond: [{ $lt: ['$confidence', 0.7] }, 1, 0],
              },
            },
          },
        },
        {
          $match: {
            $or: [
              { avgConfidence: { $lt: 0.8 } },
              { failedCount: { $gt: 10 } },
            ],
          },
        },
      ]);

      // Find common user messages that failed
      const failedMessages = await ChatbotInteraction.aggregate([
        {
          $match: {
            confidence: { $lt: 0.7 },
          },
        },
        {
          $group: {
            _id: '$userMessage',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      return {
        lowConfidenceIntents,
        failedMessages,
        suggestions: [
          ...lowConfidenceIntents.map(intent => ({
            type: 'intent',
            message: `Intent "${intent._id}" has low confidence (${Math.round(intent.avgConfidence * 100)}%). Consider adding more training examples.`,
            priority: intent.failedCount > 20 ? 'high' : 'medium',
          })),
          ...failedMessages.map(msg => ({
            type: 'message',
            message: `Common failed message: "${msg._id}" (${msg.count} times). Consider creating a new intent for this.`,
            priority: msg.count > 5 ? 'high' : 'medium',
          })),
        ],
      };
    } catch (error) {
      console.error('Error getting improvement suggestions:', error);
      throw error;
    }
  }

  // Handle fallback responses
  async handleFallback(userMessage, userId) {
    try {
      // Save the fallback interaction
      await ChatbotInteraction.create({
        userId,
        userMessage,
        botResponse: 'Fallback triggered',
        intent: 'fallback',
        confidence: 0,
        timestamp: new Date(),
        successful: false,
      });

      // Get a human admin if available
      const settings = await Settings.getInstance();
      if (settings.chatbot.enableLiveHandoff) {
        // TODO: Implement live handoff to admin
        return {
          text: "I'm not sure how to help with that. Let me connect you with a human agent.",
          action: 'handoff',
        };
      }

      return {
        text: "I apologize, but I'm not sure how to help with that. Would you like to try rephrasing your question or speak with a human agent?",
        action: 'suggest_rephrase',
      };
    } catch (error) {
      console.error('Error handling fallback:', error);
      throw error;
    }
  }
}

module.exports = new ChatbotService();
