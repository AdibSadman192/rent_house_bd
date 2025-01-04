# Real-time Chat System

## Overview
The chat system enables real-time communication between tenants and property owners using Socket.IO.

## Features
- Real-time messaging
- Message history
- File sharing
- Read receipts
- Typing indicators
- Online/offline status

## Technical Implementation

### WebSocket Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: userToken
  }
});
```

### Event Handling
1. Connection Events
```javascript
socket.on('connect', () => {
  console.log('Connected to chat server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from chat server');
});
```

2. Message Events
```javascript
// Send message
socket.emit('send_message', {
  recipientId: 'user123',
  content: 'Hello!',
  type: 'text'
});

// Receive message
socket.on('receive_message', (message) => {
  console.log('New message:', message);
});
```

3. Status Events
```javascript
socket.on('user_status', ({ userId, status }) => {
  console.log(`User ${userId} is ${status}`);
});
```

## Database Schema

### Message Collection
```javascript
{
  sender: ObjectId,
  recipient: ObjectId,
  content: String,
  type: String, // 'text', 'image', 'file'
  read: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Collection
```javascript
{
  participants: [ObjectId],
  lastMessage: ObjectId,
  unreadCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### GET /api/chat/conversations
Get user's conversations

### GET /api/chat/messages/:conversationId
Get messages for a conversation

### POST /api/chat/messages
Send a new message

### PUT /api/chat/messages/:messageId/read
Mark message as read

## Security Considerations

1. Authentication
- JWT token validation for WebSocket connections
- User authorization for accessing conversations

2. Rate Limiting
- Message rate limiting to prevent spam
- Connection rate limiting

3. Data Validation
- Message content sanitization
- File type and size validation

## Error Handling

1. Connection Errors
```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

2. Message Errors
```javascript
socket.on('message_error', (error) => {
  console.error('Message error:', error);
});
```

## Performance Optimization

1. Message Pagination
- Load messages in chunks
- Infinite scroll implementation

2. Connection Management
- Heartbeat mechanism
- Reconnection strategy

3. Caching
- Message cache
- User status cache

## Testing

1. Unit Tests
```javascript
describe('Chat Service', () => {
  it('should send message', async () => {
    // Test implementation
  });
  
  it('should receive message', async () => {
    // Test implementation
  });
});
```

2. Integration Tests
```javascript
describe('Chat API', () => {
  it('should get conversations', async () => {
    // Test implementation
  });
  
  it('should get messages', async () => {
    // Test implementation
  });
});
```
