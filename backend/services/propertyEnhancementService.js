const Property = require('../models/Property');
const User = require('../models/User');

class PropertyEnhancementService {
  constructor() {
    this.verificationQueue = new Map();
  }

  // Add property with verification
  async addPropertyForVerification(propertyData) {
    try {
      // Create property in pending verification state
      const property = await Property.create({
        ...propertyData,
        verificationStatus: 'pending',
        isVerified: false
      });

      // Add to verification queue
      this.verificationQueue.set(property._id.toString(), {
        addedAt: Date.now(),
        property: property
      });

      return property;
    } catch (error) {
      console.error('Error adding property for verification:', error);
      throw error;
    }
  }

  // Verify property
  async verifyProperty(propertyId, verificationData, verifierId) {
    try {
      const property = await Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Update verification status
      property.verificationStatus = verificationData.status;
      property.isVerified = verificationData.status === 'approved';
      property.verificationDetails = {
        verifiedBy: verifierId,
        verifiedAt: new Date(),
        comments: verificationData.comments,
        documents: verificationData.documents || []
      };

      await property.save();

      // Remove from verification queue
      this.verificationQueue.delete(propertyId);

      return property;
    } catch (error) {
      console.error('Error verifying property:', error);
      throw error;
    }
  }

  // Advanced search with filters
  async advancedSearch(searchCriteria) {
    try {
      const query = {};

      // Basic filters
      if (searchCriteria.price) {
        query.price = {
          $gte: searchCriteria.price.min || 0,
          $lte: searchCriteria.price.max || Number.MAX_SAFE_INTEGER
        };
      }

      if (searchCriteria.location) {
        query.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [searchCriteria.location.longitude, searchCriteria.location.latitude]
            },
            $maxDistance: searchCriteria.location.radius || 5000 // 5km default radius
          }
        };
      }

      // Property features
      if (searchCriteria.features && searchCriteria.features.length > 0) {
        query.features = { $all: searchCriteria.features };
      }

      // Verification status
      if (searchCriteria.verifiedOnly) {
        query.isVerified = true;
      }

      // Rating filter
      if (searchCriteria.minRating) {
        query.averageRating = { $gte: searchCriteria.minRating };
      }

      // Availability filter
      if (searchCriteria.availability) {
        query.availableFrom = { $lte: new Date(searchCriteria.availability.from) };
        query.availableTo = { $gte: new Date(searchCriteria.availability.to) };
      }

      // Execute search with pagination
      const page = searchCriteria.page || 1;
      const limit = searchCriteria.limit || 10;
      const skip = (page - 1) * limit;

      const properties = await Property.find(query)
        .skip(skip)
        .limit(limit)
        .sort(searchCriteria.sort || { createdAt: -1 })
        .populate('owner', 'name email rating')
        .lean();

      const total = await Property.countDocuments(query);

      return {
        properties,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  // Clean up old pending verifications
  cleanupOldPendingVerifications() {
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    for (const [propertyId, data] of this.verificationQueue.entries()) {
      if (now - data.addedAt > ONE_WEEK) {
        // Auto-reject properties that have been pending for too long
        this.verifyProperty(propertyId, {
          status: 'rejected',
          comments: 'Automatically rejected due to verification timeout'
        }, 'system');
      }
    }
  }

  // Start cleanup interval
  startCleanupInterval() {
    setInterval(() => this.cleanupOldPendingVerifications(), 24 * 60 * 60 * 1000); // Run daily
  }
}

module.exports = PropertyEnhancementService;