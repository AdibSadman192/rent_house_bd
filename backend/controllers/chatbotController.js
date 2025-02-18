const { catchAsync } = require('../utils/errorHandler');
const AIChatbotService = require('../services/aiChatbotService');
const ChatbotInteraction = require('../models/ChatbotInteraction');

const chatbotService = new AIChatbotService();

// Process user message and return an AI-powered response
exports.processMessage = catchAsync(async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  // Get AI-powered response
  const response = await chatbotService.processMessage(userId, message);
  
  res.status(200).json({
    success: true,
    data: {
      message: response,
      timestamp: new Date(),
    }
  });
});

// Save user feedback about chatbot responses
exports.saveFeedback = catchAsync(async (req, res) => {
  const { userMessage, botResponse, isHelpful } = req.body;
  const userId = req.user._id;

  // Store feedback in database
  await ChatbotInteraction.create({
    user: userId,
    userMessage,
    botResponse,
    isHelpful,
    timestamp: new Date()
  });

  // Update analytics
  await chatbotService.updateAnalytics(userId, isHelpful);
  
  res.status(200).json({
    success: true,
    message: 'Feedback saved successfully'
  });
});
