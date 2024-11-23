const mongoose = require('mongoose');

const propertyAnalyticsSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  views: {
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 },
    byDate: [{
      date: Date,
      count: Number,
      uniqueCount: Number
    }]
  },
  inquiries: {
    total: { type: Number, default: 0 },
    converted: { type: Number, default: 0 },
    bySource: [{
      source: String,
      count: Number,
      conversionRate: Number
    }]
  },
  searchAppearances: {
    total: { type: Number, default: 0 },
    byKeyword: [{
      keyword: String,
      count: Number,
      position: Number
    }]
  },
  engagement: {
    averageTimeOnPage: Number,
    bounceRate: Number,
    favoriteCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 }
  },
  pricing: {
    priceHistory: [{
      price: Number,
      date: Date,
      reason: String
    }],
    marketComparison: {
      averageAreaPrice: Number,
      percentDifference: Number,
      lastUpdated: Date
    }
  },
  availability: {
    totalDaysListed: { type: Number, default: 0 },
    occupancyRate: Number,
    seasonalDemand: [{
      season: String,
      demandScore: Number,
      averageInquiries: Number
    }]
  },
  performance: {
    score: { type: Number, min: 0, max: 100 },
    factors: [{
      name: String,
      impact: Number,
      recommendation: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
propertyAnalyticsSchema.index({ propertyId: 1 });
propertyAnalyticsSchema.index({ 'views.total': -1 });
propertyAnalyticsSchema.index({ 'performance.score': -1 });
propertyAnalyticsSchema.index({ 'inquiries.total': -1 });

// Virtual for calculating conversion rate
propertyAnalyticsSchema.virtual('conversionRate').get(function() {
  return this.inquiries.total > 0 
    ? (this.inquiries.converted / this.inquiries.total) * 100 
    : 0;
});

// Method to update views
propertyAnalyticsSchema.methods.trackView = async function(userId, isUnique = false) {
  this.views.total += 1;
  if (isUnique) {
    this.views.unique += 1;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayStats = this.views.byDate.find(
    stat => stat.date.getTime() === today.getTime()
  );
  
  if (dayStats) {
    dayStats.count += 1;
    if (isUnique) dayStats.uniqueCount += 1;
  } else {
    this.views.byDate.push({
      date: today,
      count: 1,
      uniqueCount: isUnique ? 1 : 0
    });
  }
  
  return this.save();
};

// Method to calculate and update performance score
propertyAnalyticsSchema.methods.updatePerformanceScore = async function() {
  const weights = {
    views: 0.3,
    inquiries: 0.25,
    engagement: 0.2,
    availability: 0.15,
    pricing: 0.1
  };
  
  const viewsScore = Math.min((this.views.total / 100) * 100, 100);
  const inquiriesScore = Math.min((this.inquiries.total / 20) * 100, 100);
  const engagementScore = Math.min(
    ((this.engagement.favoriteCount + this.engagement.shareCount) / 50) * 100, 
    100
  );
  
  this.performance.score = 
    (viewsScore * weights.views) +
    (inquiriesScore * weights.inquiries) +
    (engagementScore * weights.engagement);
    
  // Add performance factors and recommendations
  this.performance.factors = [];
  
  if (viewsScore < 50) {
    this.performance.factors.push({
      name: 'Low Visibility',
      impact: -10,
      recommendation: 'Consider improving property photos and description'
    });
  }
  
  if (this.inquiries.total > 0 && this.conversionRate < 20) {
    this.performance.factors.push({
      name: 'Low Conversion Rate',
      impact: -15,
      recommendation: 'Review pricing strategy and property amenities'
    });
  }
  
  return this.save();
};

// Static method to get top performing properties
propertyAnalyticsSchema.statics.getTopPerforming = async function(limit = 10) {
  return this.find()
    .sort({ 'performance.score': -1 })
    .limit(limit)
    .populate('propertyId');
};

// Static method to get market insights
propertyAnalyticsSchema.statics.getMarketInsights = async function(area) {
  return this.aggregate([
    {
      $lookup: {
        from: 'properties',
        localField: 'propertyId',
        foreignField: '_id',
        as: 'property'
      }
    },
    {
      $match: {
        'property.area': area
      }
    },
    {
      $group: {
        _id: null,
        averagePrice: { $avg: '$pricing.marketComparison.averageAreaPrice' },
        totalProperties: { $sum: 1 },
        averageViewsPerProperty: { $avg: '$views.total' },
        averageInquiriesPerProperty: { $avg: '$inquiries.total' },
        averageOccupancyRate: { $avg: '$availability.occupancyRate' }
      }
    }
  ]);
};

const PropertyAnalytics = mongoose.model('PropertyAnalytics', propertyAnalyticsSchema);

module.exports = PropertyAnalytics;
