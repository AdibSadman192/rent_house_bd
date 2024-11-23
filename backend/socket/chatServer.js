const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

function initializeChatServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Store active users
  const activeUsers = new Map();
  const userSockets = new Map();

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const propertyId = socket.handshake.query.propertyId;

    // Add user to active users
    activeUsers.set(userId, socket.user);
    
    // Store socket reference
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket);

    // Join property-specific room
    if (propertyId) {
      socket.join(`property:${propertyId}`);
    }

    console.log(`User connected: ${userId} for property: ${propertyId}`);

    // Handle new message
    socket.on('message', async (messageData) => {
      try {
        const { content, recipient, propertyId, expiresAt } = messageData;

        // Create and save message
        const message = new Message({
          content,
          sender: socket.user._id,
          recipient,
          propertyId,
          expiresAt,
        });
        await message.save();

        // Broadcast to property room
        io.to(`property:${propertyId}`).emit('message', {
          ...message.toJSON(),
          sender: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar,
          },
        });

        // Schedule message expiration
        if (expiresAt) {
          const expiryTime = new Date(expiresAt).getTime() - Date.now();
          setTimeout(async () => {
            await Message.deleteOne({ _id: message._id });
            io.to(`property:${propertyId}`).emit('messageExpired', message._id);
          }, expiryTime);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle typing events
    socket.on('typing', ({ propertyId, recipientId }) => {
      socket.to(`property:${propertyId}`).emit('typing', {
        userId: socket.user._id,
        username: socket.user.name,
      });
    });

    socket.on('stopTyping', ({ propertyId, recipientId }) => {
      socket.to(`property:${propertyId}`).emit('stopTyping', {
        userId: socket.user._id,
      });
    });

    // Handle message deletion
    socket.on('messageDeleted', async ({ messageId, propertyId, recipientId }) => {
      try {
        await Message.deleteOne({
          _id: messageId,
          sender: socket.user._id,
        });

        io.to(`property:${propertyId}`).emit('messageDeleted', messageId);
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', 'Failed to delete message');
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove socket reference
      const userSocketSet = userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.delete(socket);
        if (userSocketSet.size === 0) {
          userSockets.delete(userId);
          activeUsers.delete(userId);
        }
      }

      console.log(`User disconnected: ${userId}`);
    });
  });

  // Periodic cleanup of expired messages
  setInterval(async () => {
    try {
      const expiredMessages = await Message.find({
        expiresAt: { $lte: new Date() },
      });

      for (const message of expiredMessages) {
        await Message.deleteOne({ _id: message._id });
        io.to(`property:${message.propertyId}`).emit('messageExpired', message._id);
      }
    } catch (error) {
      console.error('Error cleaning up expired messages:', error);
    }
  }, 60000); // Check every minute

  return io;
}

module.exports = initializeChatServer;
