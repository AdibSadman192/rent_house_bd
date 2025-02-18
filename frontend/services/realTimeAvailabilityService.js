import io from 'socket.io-client';

class RealTimeAvailabilityService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connected = false;
  }

  connect() {
    if (this.socket) return;

    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      path: '/availability',
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Connected to availability service');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Disconnected from availability service');
    });

    this.socket.on('availability_update', (data) => {
      this.notifyListeners('update', data);
    });

    this.socket.on('booking_made', (data) => {
      this.notifyListeners('booking', data);
    });
  }

  subscribeToProperty(propertyId) {
    if (!this.connected) this.connect();
    this.socket.emit('subscribe_property', { propertyId });
  }

  unsubscribeFromProperty(propertyId) {
    if (this.socket) {
      this.socket.emit('unsubscribe_property', { propertyId });
    }
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  getPropertyAvailability(propertyId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Not connected to availability service'));
        return;
      }

      this.socket.emit('get_availability', { propertyId }, (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      });
    });
  }
}

export default new RealTimeAvailabilityService();