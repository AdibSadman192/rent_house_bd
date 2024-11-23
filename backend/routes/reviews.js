const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getPropertyReviews,
  getUserReviews
} = require('../controllers/reviewController');

// Get all reviews for a property
router.get('/property/:propertyId', getPropertyReviews);

// Get all reviews by a user
router.get('/user/:userId', getUserReviews);

// Protected routes
router.use(protect);

router
  .route('/')
  .get(getReviews)
  .post(authorize('tenant', 'admin'), createReview);

router
  .route('/:id')
  .get(getReview)
  .put(authorize('tenant', 'admin'), updateReview)
  .delete(authorize('tenant', 'admin'), deleteReview);

module.exports = router;
