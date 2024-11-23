const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

router.use(protect); // Protect all routes

// Base routes
router
  .route('/')
  .get(getBookings)
  .post(authorize('tenant'), createBooking);

// Single booking routes
router
  .route('/:id')
  .get(getBooking)
  .put(authorize('tenant', 'admin'), updateBooking)
  .delete(authorize('tenant', 'admin'), deleteBooking);

// Status update route
router
  .route('/:id/status')
  .put(authorize('owner', 'admin'), updateBookingStatus);

module.exports = router;
