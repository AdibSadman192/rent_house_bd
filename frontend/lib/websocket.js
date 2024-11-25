import { io } from 'socket.io-client';

class WebSocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connected = false;
    this.pendingMessages = new Set();
  }

  connect(token) {
    if (this.socket) {
      return;
    }

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      this.connected = true;
      this.processPendingMessages();
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (!this.connected) {
      this.pendingMessages.add({ event, data });
      return;
    }

    this.socket.emit(event, data);
  }

  processPendingMessages() {
    for (const message of this.pendingMessages) {
      this.socket.emit(message.event, message.data);
    }
    this.pendingMessages.clear();
  }
}

const wsManager = new WebSocketManager();

export const WS_EVENTS = {
  PROPERTY_UPDATED: 'property_updated',
  BOOKING_CREATED: 'booking_created',
  BOOKING_UPDATED: 'booking_updated',
  CHAT_MESSAGE: 'chat_message',
  NOTIFICATION: 'notification',
  USER_ACTIVITY: 'user_activity',
  SYSTEM_ALERT: 'system_alert'
};

export default wsManager;
