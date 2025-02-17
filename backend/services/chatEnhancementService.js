const Message = require('../models/Message');
const Chat = require('../models/Chat');

class ChatEnhancementService {
  constructor(io) {
    this.io = io;
    this.typingUsers = new Map(); // Store typing status
  }

  // Handle typing indicator
  setTypingStatus(chatId, userId, isTyping) {
    const chatKey = `chat:${chatId}`;
    
    if (isTyping) {
      this.typingUsers.set(`${chatKey}:${userId}`, Date.now());
    } else {
      this.typingUsers.delete(`${chatKey}:${userId}`);
    }

    // Emit typing status to chat participants
    this.io.to(chatKey).emit('typing_status', {
      chatId,
      userId,
      isTyping
    });
  }

  // Handle read receipts
  async markMessagesAsRead(chatId, userId) {
    try {
      // Update all unread messages in the chat for this user
      const updatedMessages = await Message.updateMany(
        {
          chat: chatId,
          'readBy.user': { $ne: userId },
          sender: { $ne: userId }
        },
        {
          $push: {
            readBy: {
              user: userId,
              readAt: new Date()
            }
          }
        }
      );

      if (updatedMessages.nModified > 0) {
        // Notify other participants about read status
        this.io.to(`chat:${chatId}`).emit('messages_read', {
          chatId,
          userId,
          timestamp: new Date()
        });
      }

      return updatedMessages;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Clean up typing indicators older than 5 seconds
  cleanupTypingStatus() {
    const now = Date.now();
    for (const [key, timestamp] of this.typingUsers.entries()) {
      if (now - timestamp > 5000) {
        const [chatKey, userId] = key.split(':');
        this.typingUsers.delete(key);
        this.io.to(chatKey).emit('typing_status', {
          chatId: chatKey.replace('chat:', ''),
          userId,
          isTyping: false
        });
      }
    }
  }

  // Start cleanup interval
  startCleanupInterval() {
    setInterval(() => this.cleanupTypingStatus(), 5000);
  }
}

module.exports = ChatEnhancementService;