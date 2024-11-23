const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/properties');
  },
  filename: function(req, file, cb) {
    // Create unique filename: timestamp-originalname
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow only images
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB max file size
  }
});

module.exports = upload;
