const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an owner']
  },
  approved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
postSchema.index({ ownerId: 1, createdAt: -1 });
postSchema.index({ approved: 1, createdAt: -1 });
postSchema.index({ location: 'text', title: 'text', description: 'text' });

// Populate owner details when querying posts
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'ownerId',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Post', postSchema);
