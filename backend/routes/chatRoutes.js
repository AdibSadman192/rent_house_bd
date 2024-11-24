const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getChats,
    getChat,
    createChat,
    getChatMessages,
    sendMessage,
    deleteMessage
} = require('../controllers/chatController');

// Chat routes
router.route('/')
    .get(protect, getChats)
    .post(protect, createChat);

router.route('/:id')
    .get(protect, getChat);

// Message routes
router.route('/:chatId/messages')
    .get(protect, getChatMessages)
    .post(protect, sendMessage);

router.route('/:chatId/messages/:messageId')
    .delete(protect, deleteMessage);

module.exports = router;
