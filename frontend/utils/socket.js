import io from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (!token) {
    throw new Error('Token is required for socket initialization');
  }

  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Add default error handlers
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error.message);
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.error('Socket not initialized');
  }
};

export const onEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.error('Socket not initialized');
  }
};

export const offEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  emitEvent,
  onEvent,
  offEvent,
};
