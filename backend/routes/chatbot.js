const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { processMessage, saveFeedback } = require('../controllers/chatbotController');

// Process messages
router.post('/', protect, processMessage);

// Save feedback
router.post('/feedback', protect, saveFeedback);

module.exports = router;
