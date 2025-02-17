const PropertyVerificationService = require('../services/propertyVerificationService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

class PropertyVerificationController {
    // Initiate property verification
    initiateVerification = asyncHandler(async (req, res) => {
        const { propertyId } = req.params;
        const { documents } = req.body;

        const property = await PropertyVerificationService.initiateVerification(propertyId, documents);
        res.status(200).json({
            success: true,
            data: property
        });
    });

    // Review a verification document
    reviewDocument = asyncHandler(async (req, res) => {
        const { propertyId, documentId } = req.params;
        const reviewData = {
            status: req.body.status,
            comments: req.body.comments,
            reviewerId: req.user.id
        };

        const document = await PropertyVerificationService.reviewDocument(propertyId, documentId, reviewData);
        res.status(200).json({
            success: true,
            data: document
        });
    });

    // Update verification status
    updateVerificationStatus = asyncHandler(async (req, res) => {
        const { propertyId } = req.params;
        const { status, comments } = req.body;

        const property = await PropertyVerificationService.updateVerificationStatus(
            propertyId,
            status,
            req.user.id,
            comments
        );

        res.status(200).json({
            success: true,
            data: property
        });
    });

    // Get verification details
    getVerificationDetails = asyncHandler(async (req, res) => {
        const { propertyId } = req.params;

        const details = await PropertyVerificationService.getVerificationDetails(propertyId);
        res.status(200).json({
            success: true,
            data: details
        });
    });

    // Get verification statistics
    getVerificationStats = asyncHandler(async (req, res) => {
        const stats = await PropertyVerificationService.getVerificationStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    });
}

module.exports = new PropertyVerificationController();