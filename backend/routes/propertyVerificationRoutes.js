const express = require('express');
const router = express.Router();
const propertyVerificationController = require('../controllers/propertyVerificationController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by property owners and admins
router.route('/:propertyId/initiate')
    .post(authorize('owner', 'admin'), propertyVerificationController.initiateVerification);

router.route('/:propertyId/details')
    .get(authorize('owner', 'admin'), propertyVerificationController.getVerificationDetails);

// Admin only routes
router.route('/:propertyId/document/:documentId/review')
    .post(authorize('admin'), propertyVerificationController.reviewDocument);

router.route('/:propertyId/status')
    .put(authorize('admin'), propertyVerificationController.updateVerificationStatus);

router.route('/stats')
    .get(authorize('admin'), propertyVerificationController.getVerificationStats);

module.exports = router;