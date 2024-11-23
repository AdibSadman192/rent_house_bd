const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const chatService = require('../services/chatService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Get chat messages
router.get('/:propertyId/:recipientId', auth, async (req, res) => {
  try {
    const { propertyId, recipientId } = req.params;
    const userId = req.user._id;

    // Create chatId from sorted user IDs
    const chatId = [userId, recipientId].sort().join('_');

    const messages = await Message.find({
      propertyId,
      chatId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('replyTo', 'content');

    // Mark messages as read
    await Message.updateMany(
      {
        chatId,
        recipient: userId,
        read: false,
      },
      {
        $set: {
          read: true,
          readAt: new Date(),
          deliveryStatus: 'read',
        },
        $addToSet: {
          readBy: { user: userId, readAt: new Date() },
        },
      }
    );

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Upload file attachment
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let attachment;
    const fileType = req.body.type || 'file';

    switch (fileType) {
      case 'image':
        attachment = await chatService.processImage(file);
        break;
      case 'voice':
        attachment = await chatService.processVoiceMessage(file);
        break;
      default:
        attachment = await chatService.processFile(file);
    }

    res.json({ attachment });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Get link preview
router.post('/link-preview', auth, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const preview = await chatService.getLinkPreview(url);
    res.json(preview);
  } catch (error) {
    console.error('Error generating link preview:', error);
    res.status(500).json({ message: 'Error generating link preview' });
  }
});

// Add reaction to message
router.post('/messages/:messageId/reactions', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.addReaction(userId, emoji);
    res.json({ message: 'Reaction added' });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ message: 'Error adding reaction' });
  }
});

// Remove reaction from message
router.delete('/messages/:messageId/reactions', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.removeReaction(userId);
    res.json({ message: 'Reaction removed' });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Error removing reaction' });
  }
});

// Edit message
router.put('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if message is too old to edit (e.g., 24 hours)
    const editWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - message.createdAt > editWindow) {
      return res.status(400).json({ message: 'Message is too old to edit' });
    }

    await message.edit(content);
    res.json({ message: 'Message updated' });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ message: 'Error editing message' });
  }
});

// Delete message
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
});

// Get chat analytics
router.get('/:chatId/analytics', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { timeRange } = req.query;

    const analytics = await chatService.getChatAnalytics(chatId, timeRange);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching chat analytics:', error);
    res.status(500).json({ message: 'Error fetching chat analytics' });
  }
});

// Export chat history
router.get('/:chatId/export', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { format = 'json' } = req.query;

    const data = await chatService.exportChatHistory(chatId, format);
    
    const filename = `chat-export-${chatId}-${Date.now()}.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
    res.send(data);
  } catch (error) {
    console.error('Error exporting chat history:', error);
    res.status(500).json({ message: 'Error exporting chat history' });
  }
});

// Report message
router.post('/messages/:messageId/report', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user has already reported this message
    if (message.reports.some(report => report.user.toString() === userId.toString())) {
      return res.status(400).json({ message: 'You have already reported this message' });
    }

    message.isReported = true;
    message.reports.push({
      user: userId,
      reason,
    });

    await message.save();
    res.json({ message: 'Message reported' });
  } catch (error) {
    console.error('Error reporting message:', error);
    res.status(500).json({ message: 'Error reporting message' });
  }
});

// Toggle message bookmark
router.post('/messages/:messageId/bookmark', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isBookmarked = !message.isBookmarked;
    await message.save();

    res.json({
      message: message.isBookmarked ? 'Message bookmarked' : 'Message unbookmarked',
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Error toggling bookmark' });
  }
});

module.exports = router;
