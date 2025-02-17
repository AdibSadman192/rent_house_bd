const express = require('express');
const {
  generateAgreement,
  getAgreements,
  getAgreement,
  updateAgreementStatus
} = require('../controllers/rentalAgreementController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .post(generateAgreement)
  .get(getAgreements);

router
  .route('/:id')
  .get(getAgreement)
  .put(updateAgreementStatus);

module.exports = router;