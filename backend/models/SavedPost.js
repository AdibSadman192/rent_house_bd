const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  collections: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate saves
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });
// Index for faster queries
savedPostSchema.index({ userId: 1, createdAt: -1 });

// Populate post details when querying saved posts
savedPostSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'postId',
    select: '-__v'
  });
  next();
});

// Update post stats after save/remove
savedPostSchema.post('save', async function() {
  await this.model('Post').findByIdAndUpdate(
    this.postId,
    { $inc: { 'stats.saves': 1 } }
  );
});

savedPostSchema.post('remove', async function() {
  await this.model('Post').findByIdAndUpdate(
    this.postId,
    { $inc: { 'stats.saves': -1 } }
  );
});

module.exports = mongoose.model('SavedPost', savedPostSchema);
