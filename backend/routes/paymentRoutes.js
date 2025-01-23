const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  initializePayment,
  paymentCallback,
  getPaymentHistory,
  getPaymentDetails
} = require('../controllers/paymentController');

// Protect routes except callback
router.post('/callback/:gateway', paymentCallback);

router.use(protect);

router.route('/initialize')
  .post(initializePayment);

router.route('/history')
  .get(getPaymentHistory);

router.route('/:id')
  .get(getPaymentDetails);

module.exports = router;
