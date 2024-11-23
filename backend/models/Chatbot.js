const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous users
  },
  sessionId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  query: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  successful: {
    type: Boolean,
    required: true,
    default: false
  },
  handedOffToHuman: {
    type: Boolean,
    required: true,
    default: false
  },
  responseTime: {
    type: Number, // in milliseconds
    required: true
  },
  response: {
    type: String,
    required: true
  },
  feedback: {
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: false
    },
    comment: {
      type: String,
      required: false
    },
    timestamp: {
      type: Date,
      required: false
    }
  },
  context: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: false
  },
  metadata: {
    browser: String,
    os: String,
    device: String,
    location: {
      country: String,
      city: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
chatbotSchema.index({ timestamp: -1 });
chatbotSchema.index({ userId: 1, timestamp: -1 });
chatbotSchema.index({ sessionId: 1, timestamp: -1 });
chatbotSchema.index({ intent: 1 });
chatbotSchema.index({ successful: 1 });
chatbotSchema.index({ handedOffToHuman: 1 });
chatbotSchema.index({ 'feedback.rating': 1 });

// Virtual for calculating response success rate
chatbotSchema.virtual('successRate').get(function() {
  return this.successful ? 1 : 0;
});

// Static method to get analytics for a time range
chatbotSchema.statics.getAnalytics = async function(startDate, endDate) {
  const analytics = await this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalInteractions: { $sum: 1 },
        successfulInteractions: { $sum: { $cond: ['$successful', 1, 0] } },
        averageConfidence: { $avg: '$confidence' },
        averageResponseTime: { $avg: '$responseTime' },
        humanHandoffs: { $sum: { $cond: ['$handedOffToHuman', 1, 0] } },
        feedbackCount: {
          $sum: { $cond: [{ $ifNull: ['$feedback.rating', false] }, 1, 0] }
        },
        averageFeedback: { $avg: '$feedback.rating' }
      }
    },
    {
      $project: {
        _id: 0,
        totalInteractions: 1,
        successfulInteractions: 1,
        successRate: {
          $divide: ['$successfulInteractions', '$totalInteractions']
        },
        averageConfidence: 1,
        averageResponseTime: 1,
        humanHandoffs: 1,
        feedbackStats: {
          count: '$feedbackCount',
          average: '$averageFeedback'
        }
      }
    }
  ]);

  return analytics[0] || null;
};

// Method to add feedback to an interaction
chatbotSchema.methods.addFeedback = async function(rating, comment) {
  this.feedback = {
    rating,
    comment,
    timestamp: new Date()
  };
  return this.save();
};

// Middleware to ensure required fields
chatbotSchema.pre('save', function(next) {
  if (!this.sessionId) {
    this.sessionId = mongoose.Types.ObjectId().toString();
  }
  next();
});

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

module.exports = Chatbot;
