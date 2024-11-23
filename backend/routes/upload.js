const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadAvatar } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload an image file'), false);
    }
  },
});

// Upload routes
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
