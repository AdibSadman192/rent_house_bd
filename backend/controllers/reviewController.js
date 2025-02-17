const { catchAsync, NotFoundError, AuthorizationError } = require('../utils/errorHandler');
const Review = require('../models/Review');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// Get all reviews
exports.getReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find()
    .populate('userId', 'name avatar')
    .populate('propertyId', 'title images location');
    
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// Get single review
exports.getReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('userId', 'name avatar')
    .populate('propertyId', 'title images location');
    
  if (!review) {
    throw new NotFoundError('Review not found');
  }
  
  res.status(200).json({
    success: true,
    data: review
  });
});

// Create review
exports.createReview = catchAsync(async (req, res) => {
  const { propertyId, rating, comment, aspects } = req.body;
  const userId = req.user.id;
  
  // Validate property existence and booking
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property not found');
  }
  
  // Check if user has already reviewed the property
  const existingReview = await Review.findOne({ propertyId, userId });
  if (existingReview) {
    throw new Error('You have already reviewed this property');
  }
  
  // Create review with detailed ratings
  const review = await Review.create({
    userId,
    propertyId,
    rating,
    comment,
    aspects: aspects || {},
    status: 'active',
    helpful: [],
    reported: false,
    media: req.body.media || [],
    verified: false
  });
  
  // Update property ratings
  await updatePropertyRatings(propertyId);
  
  // Send notification to property owner
  await Notification.create({
    recipients: [property.owner],
    type: 'review',
    title: 'New Review Received',
    message: `Your property received a new ${rating}-star review`,
    data: { reviewId: review._id, propertyId }
  });
  
  res.status(201).json({
    success: true,
    data: review
  });
});

// Helper function to update property ratings
const updatePropertyRatings = async (propertyId) => {
  const reviews = await Review.find({ propertyId, status: 'active' });
  
  const ratings = {
    overall: 0,
    aspects: {
      location: 0,
      cleanliness: 0,
      communication: 0,
      accuracy: 0,
      value: 0
    }
  };
  
  reviews.forEach(review => {
    ratings.overall += review.rating;
    Object.keys(review.aspects).forEach(aspect => {
      ratings.aspects[aspect] += review.aspects[aspect] || 0;
    });
  });
  
  const count = reviews.length;
  ratings.overall = count > 0 ? ratings.overall / count : 0;
  
  Object.keys(ratings.aspects).forEach(aspect => {
    ratings.aspects[aspect] = count > 0 ? ratings.aspects[aspect] / count : 0;
  });
  
  await Property.findByIdAndUpdate(propertyId, {
    ratings,
    reviewCount: count
  });
};
// Update review
exports.updateReview = catchAsync(async (req, res) => {
  let review = await Review.findById(req.params.id);
  
  if (!review) {
    throw new NotFoundError('Review not found');
  }
  
  // Make sure review belongs to user or user is admin
  if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AuthorizationError('Not authorized to update this review');
  }
  
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: review
  });
});

// Delete review
exports.deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    throw new NotFoundError('Review not found');
  }
  
  // Make sure review belongs to user or user is admin
  if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AuthorizationError('Not authorized to delete this review');
  }
  
  await review.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get reviews for a property
exports.getPropertyReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ propertyId: req.params.propertyId })
    .populate('userId', 'name avatar');
    
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// Get reviews by a user
exports.getUserReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ userId: req.params.userId })
    .populate('propertyId', 'title images location');
    
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});
