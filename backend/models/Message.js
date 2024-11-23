const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const attachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'file', 'voice', 'link'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  filename: String,
  filesize: Number,
  mimeType: String,
  duration: Number, // For voice messages
  thumbnail: String, // For images
  metadata: {
    title: String,    // For link previews
    description: String,
    image: String,
    siteName: String,
  },
});

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: function() {
      // Content is required unless it's a voice message or file
      return !this.attachments || this.attachments.length === 0;
    },
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  chatId: {
    type: String, // Composite key of sorted user IDs for direct chats or group ID
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['text', 'system', 'notification'],
    default: 'text',
  },
  formatting: {
    bold: [{ start: Number, end: Number }],
    italic: [{ start: Number, end: Number }],
    code: [{ start: Number, end: Number }],
    link: [{
      start: Number,
      end: Number,
      url: String,
    }],
  },
  attachments: [attachmentSchema],
  reactions: [reactionSchema],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  deliveryStatus: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  read: {
    type: Boolean,
    default: false,
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  }],
  readAt: Date,
  expiresAt: Date,
  isBookmarked: {
    type: Boolean,
    default: false,
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isEdited: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    clientId: String, // For message syncing
    deviceInfo: {
      type: String,
      platform: String,
    },
  },
});

// Indexes for efficient queries
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ propertyId: 1 });
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
messageSchema.index({ 'reactions.user': 1 });
messageSchema.index({ isBookmarked: 1 });
messageSchema.index({ isReported: 1 });
messageSchema.index({ 'readBy.user': 1 });

// Virtual for reaction counts
messageSchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.reactions.forEach(reaction => {
    counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
  });
  return counts;
});

// Method to check if message is expired
messageSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() >= this.expiresAt;
};

// Method to add reaction
messageSchema.methods.addReaction = async function(userId, emoji) {
  const existingReaction = this.reactions.find(
    r => r.user.toString() === userId.toString()
  );
  
  if (existingReaction) {
    existingReaction.emoji = emoji;
    existingReaction.createdAt = new Date();
  } else {
    this.reactions.push({ user: userId, emoji });
  }
  
  return this.save();
};

// Method to remove reaction
messageSchema.methods.removeReaction = async function(userId) {
  this.reactions = this.reactions.filter(
    r => r.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to mark as read
messageSchema.methods.markAsRead = async function(userId) {
  if (!this.readBy.some(r => r.user.toString() === userId.toString())) {
    this.readBy.push({ user: userId });
    this.read = true;
    this.readAt = new Date();
    this.deliveryStatus = 'read';
    return this.save();
  }
  return this;
};

// Method to edit message
messageSchema.methods.edit = async function(newContent) {
  if (this.content !== newContent) {
    this.editHistory.push({ content: this.content });
    this.content = newContent;
    this.isEdited = true;
    return this.save();
  }
  return this;
};

// Pre-save middleware
messageSchema.pre('save', function(next) {
  if (this.isExpired()) {
    next(new Error('Cannot save expired message'));
  } else {
    // Generate chatId if not exists
    if (!this.chatId) {
      const participants = [this.sender, this.recipient].sort();
      this.chatId = participants.join('_');
    }
    next();
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
