const Review = require('../models/Review');
const Property = require('../models/Property');

class ReviewEnhancementService {
  constructor() {
    this.moderationQueue = new Map();
  }

  // Add review with moderation
  async addReview(reviewData) {
    try {
      // Create review in pending state
      const review = await Review.create({
        ...reviewData,
        status: 'pending'
      });

      // Add to moderation queue
      this.moderationQueue.set(review._id.toString(), {
        addedAt: Date.now(),
        review: review
      });

      return review;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Moderate review
  async moderateReview(reviewId, action, moderatorId) {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error('Review not found');
      }

      // Update review status
      review.status = action;
      review.moderatedBy = moderatorId;
      review.moderatedAt = new Date();
      await review.save();

      // Remove from moderation queue
      this.moderationQueue.delete(reviewId);

      // Update property rating if review is approved
      if (action === 'approved') {
        await this.updatePropertyRating(review.propertyId);
      }

      return review;
    } catch (error) {
      console.error('Error moderating review:', error);
      throw error;
    }
  }

  // Update property rating
  async updatePropertyRating(propertyId) {
    try {
      const reviews = await Review.find({
        propertyId: propertyId,
        status: 'approved'
      });

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Property.findByIdAndUpdate(propertyId, {
          averageRating: averageRating.toFixed(1),
          totalReviews: reviews.length
        });
      }
    } catch (error) {
      console.error('Error updating property rating:', error);
      throw error;
    }
  }

  // Get review analytics
  async getReviewAnalytics(propertyId) {
    try {
      const reviews = await Review.find({
        propertyId: propertyId,
        status: 'approved'
      });

      const analytics = {
        totalReviews: reviews.length,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        },
        sentimentBreakdown: {
          positive: 0,
          neutral: 0,
          negative: 0
        }
      };

      // Calculate rating distribution
      reviews.forEach(review => {
        analytics.ratingDistribution[review.rating]++;
        
        // Simple sentiment analysis based on rating
        if (review.rating >= 4) {
          analytics.sentimentBreakdown.positive++;
        } else if (review.rating === 3) {
          analytics.sentimentBreakdown.neutral++;
        } else {
          analytics.sentimentBreakdown.negative++;
        }
      });

      return analytics;
    } catch (error) {
      console.error('Error getting review analytics:', error);
      throw error;
    }
  }

  // Clean up old pending reviews
  cleanupOldPendingReviews() {
    const now = Date.now();
    const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

    for (const [reviewId, data] of this.moderationQueue.entries()) {
      if (now - data.addedAt > TWO_WEEKS) {
        // Auto-reject reviews that have been pending for too long
        this.moderateReview(reviewId, 'rejected', 'system');
      }
    }
  }

  // Start cleanup interval
  startCleanupInterval() {
    setInterval(() => this.cleanupOldPendingReviews(), 24 * 60 * 60 * 1000); // Run daily
  }
}

module.exports = ReviewEnhancementService;