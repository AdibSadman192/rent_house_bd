const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesInRadius,
  addPropertyRating,
  updateRealTimeStatus,
  getNearbyProperties
} = require('../controllers/propertyController');
const {
  uploadPropertyImages,
  deletePropertyImage
} = require('../controllers/imageController');

// Public routes
router.get('/radius/:zipcode/:distance', getPropertiesInRadius);
router.get('/nearby', getNearbyProperties);
router.get('/search', getProperties); 
router.get('/', getProperties);
router.get('/:id', getProperty);

// Protected routes
router.use(protect);

// Real-time status routes
router.put('/:id/status', authorize('renter', 'admin'), updateRealTimeStatus);

// Renter routes
router.post('/', authorize('renter', 'admin'), createProperty);
router.put('/:id', authorize('renter', 'admin'), updateProperty);
router.delete('/:id', authorize('renter', 'admin'), deleteProperty);

// Image upload routes
router.post(
  '/:id/images',
  authorize('renter', 'admin'),
  upload.array('images', 10),
  uploadPropertyImages
);
router.delete(
  '/:id/images/:imageId',
  authorize('renter', 'admin'),
  deletePropertyImage
);

// Rating route
router.post('/:id/ratings', addPropertyRating);

module.exports = router;
