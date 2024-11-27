const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
exports.getChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    participants: req.user._id
  })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort('-updatedAt');

  res.status(200).json({
    success: true,
    data: chats
  });
});

// @desc    Get single chat
// @route   GET /api/chats/:id
// @access  Private
exports.getChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id)
    .populate('participants', 'name avatar')
    .populate('lastMessage');

  if (!chat) {
    return next(new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is part of the chat
  if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
    return next(new ErrorResponse(`Not authorized to access this chat`, 401));
  }

  res.status(200).json({
    success: true,
    data: chat
  });
});

// @desc    Create new chat
// @route   POST /api/chats
// @access  Private
exports.createChat = asyncHandler(async (req, res, next) => {
  const { participantId, propertyId } = req.body;

  // Check if chat already exists
  const existingChat = await Chat.findOne({
    participants: { $all: [req.user._id, participantId] },
    propertyId
  });

  if (existingChat) {
    return res.status(200).json({
      success: true,
      data: existingChat
    });
  }

  // Create chat
  const chat = await Chat.create({
    participants: [req.user._id, participantId],
    propertyId
  });

  res.status(201).json({
    success: true,
    data: chat
  });
});

// @desc    Get messages for a chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
exports.getChatMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorResponse(`Chat not found with id of ${chatId}`, 404));
  }

  // Make sure user is part of the chat
  if (!chat.participants.includes(req.user._id)) {
    return next(new ErrorResponse(`Not authorized to access this chat`, 401));
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: {
      path: 'sender',
      select: 'name avatar'
    }
  };

  const messages = await Message.paginate({ chat: chatId }, options);

  // Mark messages as read
  await Message.updateMany(
    {
      chat: chatId,
      sender: { $ne: req.user._id },
      read: false
    },
    {
      $set: { read: true, readAt: new Date() }
    }
  );

  res.status(200).json({
    success: true,
    data: messages
  });
});

// @desc    Send message in chat
// @route   POST /api/chats/:chatId/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', attachments = [] } = req.body;
    const senderId = req.user._id;

    // Validate chat existence
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new ErrorResponse(`Chat not found with id of ${chatId}`, 404));
    }

    // Make sure user is part of the chat
    if (!chat.participants.includes(senderId)) {
      return next(new ErrorResponse(`Not authorized to send message in this chat`, 401));
    }

    // Create message
    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content,
      type,
      attachments
    });

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.updatedAt = Date.now();
    await chat.save();

    // Populate sender info
    await message.populate('sender', 'name avatar');

    // Create notification for other participants
    const otherParticipants = chat.participants.filter(
      p => p.toString() !== senderId.toString()
    );

    await Notification.create({
      recipients: otherParticipants,
      type: 'message',
      title: `New message from ${req.user.name}`,
      message: content.substring(0, 100),
      data: {
        chatId,
        messageId: message._id
      }
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return next(new ErrorResponse(`An error occurred while sending the message. Please try again later.`, 500));
  }
});

// @desc    Delete message
// @route   DELETE /api/chats/:chatId/messages/:messageId
// @access  Private
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const { chatId, messageId } = req.params;

  const message = await Message.findOne({
    _id: messageId,
    chat: chatId
  });

  if (!message) {
    return next(new ErrorResponse(`Message not found`, 404));
  }

  // Make sure user is message sender
  if (message.sender.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse(`Not authorized to delete this message`, 401));
  }

  // Soft delete
  message.isDeleted = true;
  message.deletedAt = Date.now();
  await message.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update message
// @route   PUT /api/chats/:chatId/messages/:messageId
// @access  Private
exports.updateMessage = asyncHandler(async (req, res, next) => {
  const { chatId, messageId } = req.params;
  const { content } = req.body;

  const message = await Message.findOne({
    _id: messageId,
    chat: chatId
  });

  if (!message) {
    return next(new ErrorResponse(`Message not found`, 404));
  }

  // Make sure user is message sender
  if (message.sender.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse(`Not authorized to update this message`, 401));
  }

  // Check if message is too old to edit (e.g., 24 hours)
  const editWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  if (Date.now() - message.createdAt > editWindow) {
    return next(new ErrorResponse(`Message is too old to edit`, 400));
  }

  message.content = content;
  message.isEdited = true;
  message.editedAt = Date.now();
  await message.save();

  res.status(200).json({
    success: true,
    data: message
  });
});

// @desc    Mark chat as read
// @route   PUT /api/chats/:chatId/read
// @access  Private
exports.markChatAsRead = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorResponse(`Chat not found with id of ${chatId}`, 404));
  }

  // Make sure user is part of the chat
  if (!chat.participants.includes(req.user._id)) {
    return next(new ErrorResponse(`Not authorized to access this chat`, 401));
  }

  await Message.updateMany(
    {
      chat: chatId,
      sender: { $ne: req.user._id },
      read: false
    },
    {
      $set: { read: true, readAt: new Date() }
    }
  );

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get chat statistics
// @route   GET /api/chats/:chatId/stats
// @access  Private
exports.getChatStats = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorResponse(`Chat not found with id of ${chatId}`, 404));
  }

  // Make sure user is part of the chat
  if (!chat.participants.includes(req.user._id)) {
    return next(new ErrorResponse(`Not authorized to access this chat`, 401));
  }

  const stats = await Message.aggregate([
    { $match: { chat: chat._id } },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        totalAttachments: {
          $sum: { $size: '$attachments' }
        },
        messagesByType: {
          $push: '$type'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalMessages: 1,
        totalAttachments: 1,
        messageTypes: {
          $reduce: {
            input: '$messagesByType',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                { $literal: { $concat: ['$$this', 's'] } }
              ]
            }
          }
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {
      totalMessages: 0,
      totalAttachments: 0,
      messageTypes: {}
    }
  });
});
