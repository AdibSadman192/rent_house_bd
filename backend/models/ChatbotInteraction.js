const mongoose = require('mongoose');

const chatbotInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  botResponse: {
    type: String,
    required: true,
  },
  intent: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  contexts: [{
    name: String,
    parameters: Map,
    lifespanCount: Number,
  }],
  successful: {
    type: Boolean,
    required: true,
  },
  handedOffToHuman: {
    type: Boolean,
    default: false,
  },
  humanResponse: {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String,
    timestamp: Date,
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    timestamp: Date,
  },
  metadata: {
    platform: String,
    userAgent: String,
    language: String,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Indexes for analytics queries
chatbotInteractionSchema.index({ intent: 1, timestamp: -1 });
chatbotInteractionSchema.index({ successful: 1, timestamp: -1 });
chatbotInteractionSchema.index({ confidence: 1 });
chatbotInteractionSchema.index({ 'feedback.rating': 1 });

// Virtual for response time if handed off to human
chatbotInteractionSchema.virtual('humanResponseTime').get(function() {
  if (this.handedOffToHuman && this.humanResponse) {
    return this.humanResponse.timestamp - this.timestamp;
  }
  return null;
});

// Methods
chatbotInteractionSchema.methods.addFeedback = async function(rating, comment) {
  this.feedback = {
    rating,
    comment,
    timestamp: new Date(),
  };
  return this.save();
};

chatbotInteractionSchema.methods.handoffToHuman = async function(agentId) {
  this.handedOffToHuman = true;
  if (agentId) {
    this.humanResponse = {
      agentId,
      timestamp: new Date(),
    };
  }
  return this.save();
};

// Statics
chatbotInteractionSchema.statics.getIntentPerformance = async function(intent, timeRange = '7d') {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(timeRange));

  return this.aggregate([
    {
      $match: {
        intent,
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalInteractions: { $sum: 1 },
        successfulInteractions: {
          $sum: { $cond: ['$successful', 1, 0] },
        },
        averageConfidence: { $avg: '$confidence' },
        handoffs: {
          $sum: { $cond: ['$handedOffToHuman', 1, 0] },
        },
        averageRating: { $avg: '$feedback.rating' },
      },
    },
  ]);
};

chatbotInteractionSchema.statics.getFeedbackSummary = async function(timeRange = '7d') {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(timeRange));

  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate },
        'feedback.rating': { $exists: true },
      },
    },
    {
      $group: {
        _id: '$intent',
        averageRating: { $avg: '$feedback.rating' },
        totalFeedback: { $sum: 1 },
        ratings: {
          $push: {
            rating: '$feedback.rating',
            comment: '$feedback.comment',
          },
        },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
  ]);
};

const ChatbotInteraction = mongoose.model('ChatbotInteraction', chatbotInteractionSchema);

module.exports = ChatbotInteraction;
