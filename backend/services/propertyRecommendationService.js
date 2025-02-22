const Property = require('../models/Property');
const User = require('../models/User');
const mongoose = require('mongoose');
const { propertyCache, userCache } = require('../utils/cacheManager');

class PropertyRecommendationService {
    constructor() {
        this.weightFactors = {
            price: 0.3,
            location: 0.25,
            amenities: 0.2,
            ratings: 0.15,
            propertyType: 0.1
        };
    }

    async generateUserPreferenceProfile(userId) {
        try {
            const cacheKey = `user_preference:${userId}`;
            const cachedProfile = await userCache.get(cacheKey);
            
            if (cachedProfile) {
                return cachedProfile;
            }

            const user = await User.findById(userId)
                .populate('viewHistory')
                .populate('savedProperties')
                .populate('bookings');

            const profile = {
                priceRange: await this._calculatePricePreference(user),
                preferredLocations: await this._analyzeLocationPreferences(user),
                preferredAmenities: await this._analyzeAmenityPreferences(user),
                propertyTypes: await this._analyzePropertyTypePreferences(user)
            };

            await userCache.set(cacheKey, profile, 3600); // Cache for 1 hour
            return profile;
        } catch (error) {
            throw new Error(`Failed to generate user preference profile: ${error.message}`);
        }
    }

    async getPersonalizedRecommendations(userId, limit = 10) {
        try {
            const cacheKey = `recommendations:${userId}:${limit}`;
            const cachedRecommendations = await propertyCache.get(cacheKey);
            
            if (cachedRecommendations) {
                return cachedRecommendations;
            }

            const userProfile = await this.generateUserPreferenceProfile(userId);
            
            // Apply collaborative filtering
            const similarUsers = await this._findSimilarUsers(userId, userProfile);
            const collaborativeScores = await this._getCollaborativeScores(similarUsers);
            
            const recommendations = await Property.aggregate([
                {
                    $match: {
                        isVerified: true,
                        isAvailable: true,
                        price: { 
                            $gte: userProfile.priceRange.min,
                            $lte: userProfile.priceRange.max
                        }
                    }
                },
                {
                    $addFields: {
                        score: {
                            $add: [
                                { $multiply: [this._calculatePriceScore("$price", userProfile.priceRange), this.weightFactors.price] },
                                { $multiply: [this._calculateLocationScore("$location", userProfile.preferredLocations), this.weightFactors.location] },
                                { $multiply: [this._calculateAmenityScore("$amenities", userProfile.preferredAmenities), this.weightFactors.amenities] },
                                { $multiply: ["$averageRating", this.weightFactors.ratings] },
                                { $multiply: [this._calculatePropertyTypeScore("$propertyType", userProfile.propertyTypes), this.weightFactors.propertyType] },
                                { $multiply: [{ $ifNull: [{ $arrayElemAt: [collaborativeScores, { $indexOfArray: [collaborativeScores.propertyId, "$_id"] }] }, 0] }, 0.2] }
                            ]
                        },
                        matchPercentage: {
                            $multiply: [{ $divide: ["$score", 5] }, 100]
                        }
                    }
                },
                { $sort: { score: -1 } },
                { $limit: limit }
            ]);

            return recommendations;
        } catch (error) {
            throw new Error(`Failed to generate recommendations: ${error.message}`);
        }
    }

    async _findSimilarUsers(userId, userProfile) {
        return await User.aggregate([
            {
                $match: {
                    _id: { $ne: mongoose.Types.ObjectId(userId) }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'viewHistory',
                    foreignField: '_id',
                    as: 'viewedProperties'
                }
            },
            {
                $addFields: {
                    similarityScore: {
                        $add: [
                            this._calculatePreferenceSimilarity("$preferences", userProfile),
                            this._calculateBehaviorSimilarity("$viewedProperties", userProfile)
                        ]
                    }
                }
            },
            { $sort: { similarityScore: -1 } },
            { $limit: 10 }
        ]);
    }

    async _getCollaborativeScores(similarUsers) {
        const propertyScores = {};
        
        for (const user of similarUsers) {
            for (const property of user.viewedProperties) {
                if (!propertyScores[property._id]) {
                    propertyScores[property._id] = 0;
                }
                propertyScores[property._id] += user.similarityScore;
            }
        }
        
        return Object.entries(propertyScores).map(([propertyId, score]) => ({
            propertyId: mongoose.Types.ObjectId(propertyId),
            score: score / similarUsers.length
        }));
    }
    async getSimilarProperties(propertyId, limit = 5) {
        try {
            const sourceProperty = await Property.findById(propertyId);
            if (!sourceProperty) {
                throw new Error('Property not found');
            }

            const similarProperties = await Property.aggregate([
                {
                    $match: {
                        _id: { $ne: sourceProperty._id },
                        isVerified: true,
                        isAvailable: true,
                        propertyType: sourceProperty.propertyType
                    }
                },
                {
                    $addFields: {
                        similarity: {
                            $add: [
                                this._calculatePriceSimilarity("$price", sourceProperty.price),
                                this._calculateLocationSimilarity("$location", sourceProperty.location),
                                this._calculateAmenitySimilarity("$amenities", sourceProperty.amenities)
                            ]
                        }
                    }
                },
                { $sort: { similarity: -1 } },
                { $limit: limit }
            ]);

            return similarProperties;
        } catch (error) {
            throw new Error(`Failed to find similar properties: ${error.message}`);
        }
    }

    async _calculatePricePreference(user) {
        const viewedProperties = user.viewHistory || [];
        const savedProperties = user.savedProperties || [];
        const bookings = user.bookings || [];

        const prices = [...viewedProperties, ...savedProperties, ...bookings]
            .map(item => item.price)
            .filter(price => price != null);

        return {
            min: Math.min(...prices) * 0.8,
            max: Math.max(...prices) * 1.2,
            average: prices.reduce((a, b) => a + b, 0) / prices.length
        };
    }

    _calculatePriceScore(price, priceRange) {
        if (price >= priceRange.min && price <= priceRange.max) {
            return 1 - Math.abs(price - priceRange.average) / priceRange.average;
        }
        return 0;
    }

    async _analyzeLocationPreferences(user) {
        // Implementation for location preference analysis
        return [];
    }

    async _analyzeAmenityPreferences(user) {
        // Implementation for amenity preference analysis
        return [];
    }

    async _analyzePropertyTypePreferences(user) {
        // Implementation for property type preference analysis
        return [];
    }

    _calculateLocationScore(location, preferredLocations) {
        // Implementation for location score calculation
        return 1;
    }

    _calculateAmenityScore(amenities, preferredAmenities) {
        // Implementation for amenity score calculation
        return 1;
    }

    _calculatePropertyTypeScore(propertyType, preferredTypes) {
        // Implementation for property type score calculation
        return 1;
    }

    _calculatePriceSimilarity(price1, price2) {
        return 1 - Math.abs(price1 - price2) / Math.max(price1, price2);
    }

    _calculateLocationSimilarity(location1, location2) {
        // Implementation for location similarity calculation
        return 1;
    }

    _calculateAmenitySimilarity(amenities1, amenities2) {
        // Implementation for amenity similarity calculation
        return 1;
    }
}

module.exports = new PropertyRecommendationService();