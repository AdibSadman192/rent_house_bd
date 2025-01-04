# Rent House BD API Documentation

## Overview
This document provides detailed information about the Rent House BD API endpoints, authentication, and usage.

## Base URL
- Development: `http://localhost:5000`
- Production: `https://api.renthousebd.com`

## Authentication
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh-token` - Refresh access token
- POST `/api/auth/logout` - User logout

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id/verify` - Verify user account

### Properties
- GET `/api/properties` - List all properties
- POST `/api/properties` - Create new property listing
- GET `/api/properties/:id` - Get property details
- PUT `/api/properties/:id` - Update property
- DELETE `/api/properties/:id` - Delete property
- GET `/api/properties/search` - Search properties

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - List user bookings
- GET `/api/bookings/:id` - Get booking details
- PUT `/api/bookings/:id` - Update booking
- DELETE `/api/bookings/:id` - Cancel booking

### Reviews
- POST `/api/reviews` - Create review
- GET `/api/reviews/property/:id` - Get property reviews
- PUT `/api/reviews/:id` - Update review
- DELETE `/api/reviews/:id` - Delete review

### Chat
- GET `/api/chat/conversations` - List conversations
- POST `/api/chat/messages` - Send message
- GET `/api/chat/messages/:conversationId` - Get conversation messages

## Error Handling
All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Rate Limiting
API requests are limited to:
- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated users

## Data Models
Detailed schema information available at `/api-docs`
