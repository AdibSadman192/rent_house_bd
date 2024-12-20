const { catchAsync, NotFoundError, AuthorizationError } = require('../utils/errorHandler');
const Review = require('../models/Review');

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
exports.createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate property existence
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }

    // Check if user has already reviewed the property
    const existingReview = await Review.findOne({ propertyId: propertyId, userId: userId });
    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this property'
      });
    }

    // Add review
    req.body.userId = req.user.id;
    req.body.propertyId = req.params.propertyId;
    
    const review = await Review.create(req.body);
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      message: 'An error occurred while adding the review. Please try again later.',
      error: error.message
    });
  }
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
