const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  uploadPropertyDocument,
  verifyPropertyDocument,
  uploadNIDVerification,
  verifyNIDDocuments,
  createRentalAgreement,
  updateAgreementStatus,
  getPropertyDocuments,
  getUserVerificationStatus
} = require('../controllers/documentController');

// Protect all routes
router.use(protect);

// Property document routes
router.route('/property')
  .post(uploadPropertyDocument);

router.route('/property/:propertyId')
  .get(getPropertyDocuments);

router.route('/property/:id/verify')
  .put(authorize(['admin', 'super-admin']), verifyPropertyDocument);

// NID verification routes
router.route('/nid')
  .post(uploadNIDVerification)
  .get(getUserVerificationStatus);

router.route('/nid/:id/verify')
  .put(authorize(['admin', 'super-admin']), verifyNIDDocuments);

// Rental agreement routes
router.route('/agreement')
  .post(createRentalAgreement);

router.route('/agreement/:id')
  .put(updateAgreementStatus);

module.exports = router;
