class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = 1000; // Start with 1 second
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;
      
      // Authenticate the connection
      const token = localStorage.getItem('token');
      if (token) {
        this.send('authenticate', { token });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.reconnectAttempts++;
      this.reconnectTimeout *= 2; // Exponential backoff
      this.connect();
    }, this.reconnectTimeout);
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(event);
        }
      }
    };
  }

  handleMessage(data) {
    const { type, payload } = data;
    const callbacks = this.subscribers.get(type);
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }

  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create a singleton instance
const wsService = new WebSocketService();

// Event types
export const WS_EVENTS = {
  PROPERTY_UPDATED: 'property_updated',
  BOOKING_CREATED: 'booking_created',
  BOOKING_UPDATED: 'booking_updated',
  CHAT_MESSAGE: 'chat_message',
  NOTIFICATION: 'notification',
  USER_ACTIVITY: 'user_activity',
  SYSTEM_ALERT: 'system_alert'
};

export default wsService;
