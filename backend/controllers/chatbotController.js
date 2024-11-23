const { catchAsync } = require('../utils/errorHandler');

// Process user message and return a response
exports.processMessage = catchAsync(async (req, res) => {
  const { message } = req.body;
  
  // Basic responses for demonstration
  const responses = [
    "I can help you find the perfect rental property in Bangladesh.",
    "Would you like to search for properties in a specific area?",
    "I can show you properties within your budget.",
    "Let me know what features you're looking for in a rental property.",
    "I can help you schedule property viewings.",
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.status(200).json({
    success: true,
    data: {
      message: randomResponse,
      timestamp: new Date(),
    }
  });
});

// Save user feedback about chatbot responses
exports.saveFeedback = catchAsync(async (req, res) => {
  const { userMessage, botResponse, isHelpful } = req.body;
  
  // Log feedback for now, can be stored in DB later
  console.log('Feedback received:', {
    userId: req.user._id,
    userMessage,
    botResponse,
    isHelpful,
    timestamp: new Date(),
  });
  
  res.status(200).json({
    success: true,
    message: 'Feedback received successfully'
  });
});
