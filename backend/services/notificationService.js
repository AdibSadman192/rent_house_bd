const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  constructor() {
    this.clients = new Map(); // userId -> WebSocket
    this.pendingNotifications = new Map(); // userId -> Notification[]
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });

    this.wss.on('connection', async (ws, req) => {
      try {
        // Extract token from query string
        const token = new URL(req.url, 'http://localhost').searchParams.get('token');
        if (!token) {
          ws.close(4001, 'Authentication required');
          return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Store the connection
        this.clients.set(userId, ws);

        // Send any pending notifications
        await this.sendPendingNotifications(userId);

        // Handle client messages
        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message);
            switch (data.type) {
              case 'READ_NOTIFICATION':
                await this.handleReadNotification(userId, data.notificationId);
                break;
              case 'CLEAR_NOTIFICATIONS':
                await this.handleClearNotifications(userId);
                break;
              case 'PING':
                ws.send(JSON.stringify({ type: 'PONG' }));
                break;
            }
          } catch (error) {
            console.error('Error handling WebSocket message:', error);
          }
        });

        // Handle client disconnect
        ws.on('close', () => {
          this.clients.delete(userId);
        });

        // Send initial connection success
        ws.send(JSON.stringify({
          type: 'CONNECTED',
          message: 'Successfully connected to notification service'
        }));

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(4002, 'Authentication failed');
      }
    });
  }

  async createNotification(data) {
    try {
      // Create notification in database
      const notification = await Notification.createNotification(data);
      if (!notification) return null; // User has disabled this type of notification

      // Get user's preferences
      const user = await User.findById(data.userId)
        .select('preferences.notifications');
      
      // Check if user is connected via WebSocket
      const ws = this.clients.get(data.userId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Send notification immediately
        ws.send(JSON.stringify({
          type: 'NEW_NOTIFICATION',
          notification
        }));
      } else {
        // Store notification for later delivery
        if (!this.pendingNotifications.has(data.userId)) {
          this.pendingNotifications.set(data.userId, []);
        }
        this.pendingNotifications.get(data.userId).push(notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  async sendPendingNotifications(userId) {
    const ws = this.clients.get(userId);
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const pending = this.pendingNotifications.get(userId) || [];
    if (pending.length === 0) return;

    // Send all pending notifications
    for (const notification of pending) {
      ws.send(JSON.stringify({
        type: 'NEW_NOTIFICATION',
        notification
      }));
    }

    // Clear pending notifications
    this.pendingNotifications.delete(userId);
  }

  async handleReadNotification(userId, notificationId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId
      });

      if (notification) {
        await notification.markAsRead();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async handleClearNotifications(userId) {
    try {
      await Notification.deleteMany({ userId });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  broadcastSystemNotification(message, excludeUsers = []) {
    this.clients.forEach((ws, userId) => {
      if (excludeUsers.includes(userId)) return;
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'SYSTEM_NOTIFICATION',
          message
        }));
      }
    });
  }

  // Helper method to create different types of notifications
  async sendNotification(type, userId, data = {}) {
    const notificationTypes = Notification.TYPES;
    const template = notificationTypes[type];
    
    if (!template) {
      throw new Error(`Invalid notification type: ${type}`);
    }

    return this.createNotification({
      userId,
      ...template,
      ...data
    });
  }

  // Utility method to check if a user is connected
  isUserConnected(userId) {
    const ws = this.clients.get(userId);
    return ws && ws.readyState === WebSocket.OPEN;
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.clients.size;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

module.exports = notificationService;
