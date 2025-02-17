const Property = require('../models/Property');
const User = require('../models/User');
const mongoose = require('mongoose');

class PropertyVerificationService {
    constructor() {
        this.verificationStates = ['pending', 'in_review', 'approved', 'rejected'];
    }

    async initiateVerification(propertyId, documents) {
        try {
            const property = await Property.findById(propertyId);
            if (!property) {
                throw new Error('Property not found');
            }

            property.verificationStatus = 'pending';
            property.verificationDocuments = documents.map(doc => ({
                type: doc.type,
                url: doc.url,
                uploadedAt: new Date(),
                status: 'pending'
            }));

            await property.save();
            return property;
        } catch (error) {
            throw new Error(`Verification initiation failed: ${error.message}`);
        }
    }

    async reviewDocument(propertyId, documentId, reviewData) {
        try {
            const property = await Property.findById(propertyId);
            if (!property) {
                throw new Error('Property not found');
            }

            const document = property.verificationDocuments.id(documentId);
            if (!document) {
                throw new Error('Document not found');
            }

            document.status = reviewData.status;
            document.reviewedAt = new Date();
            document.reviewedBy = reviewData.reviewerId;
            document.comments = reviewData.comments;

            await property.save();
            return document;
        } catch (error) {
            throw new Error(`Document review failed: ${error.message}`);
        }
    }

    async updateVerificationStatus(propertyId, status, reviewerId, comments) {
        try {
            if (!this.verificationStates.includes(status)) {
                throw new Error('Invalid verification status');
            }

            const property = await Property.findById(propertyId);
            if (!property) {
                throw new Error('Property not found');
            }

            property.verificationStatus = status;
            property.verificationHistory.push({
                status,
                reviewerId,
                comments,
                timestamp: new Date()
            });

            if (status === 'approved') {
                property.isVerified = true;
                property.verifiedAt = new Date();
                property.verifiedBy = reviewerId;
            }

            await property.save();
            return property;
        } catch (error) {
            throw new Error(`Status update failed: ${error.message}`);
        }
    }

    async getVerificationDetails(propertyId) {
        try {
            const property = await Property.findById(propertyId)
                .populate('verificationHistory.reviewerId', 'name email')
                .select('verificationStatus verificationDocuments verificationHistory isVerified verifiedAt verifiedBy');

            if (!property) {
                throw new Error('Property not found');
            }

            return property;
        } catch (error) {
            throw new Error(`Failed to get verification details: ${error.message}`);
        }
    }

    async getVerificationStats() {
        try {
            const stats = await Property.aggregate([
                {
                    $group: {
                        _id: '$verificationStatus',
                        count: { $sum: 1 },
                        averageProcessingTime: {
                            $avg: {
                                $subtract: ['$verifiedAt', '$createdAt']
                            }
                        }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            throw new Error(`Failed to get verification stats: ${error.message}`);
        }
    }
}

module.exports = new PropertyVerificationService();