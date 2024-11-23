const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^https?:\/\/.*\.(png|jpg|jpeg|gif)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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

// Prevent user from submitting more than one review per property
reviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.getAverageRating = async function(propertyId) {
  const stats = await this.aggregate([
    {
      $match: { propertyId: new mongoose.Types.ObjectId(propertyId), status: 'approved' }
    },
    {
      $group: {
        _id: '$propertyId',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Property').findByIdAndUpdate(propertyId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model('Property').findByIdAndUpdate(propertyId, {
      averageRating: 0,
      numReviews: 0
    });
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.propertyId);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.propertyId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
