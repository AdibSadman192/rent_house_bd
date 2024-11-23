const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['success', 'error', 'warning', 'info'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['system', 'booking', 'property', 'message', 'payment', 'marketing'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  expiresAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time elapsed since notification
notificationSchema.virtual('timeElapsed').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true } }
  );
};

// Static method to create a new notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  
  // Get user preferences
  const user = await mongoose.model('User').findById(data.user)
    .select('preferences.notifications');
  
  // Check if user wants this type of notification
  if (user?.preferences?.notifications?.[data.category] === false) {
    return null;
  }
  
  await notification.save();
  return notification;
};

// Static method to get notifications with pagination
notificationSchema.statics.getNotifications = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const [notifications, total] = await Promise.all([
    this.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name email')
      .lean(),
    this.countDocuments({ user: userId })
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Pre-save middleware to set expiration
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Set default expiration to 30 days
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Pre-save middleware to validate preferences
notificationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const user = await mongoose.model('User').findById(this.user)
      .select('preferences.notifications');
    
    if (user?.preferences?.notifications?.[this.category] === false) {
      const error = new Error('User has disabled this type of notification');
      error.name = 'ValidationError';
      next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
