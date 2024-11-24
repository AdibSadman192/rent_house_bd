# Rent House BD - Backend

This is the backend service for the Rent House BD application, providing APIs for property rental management and user authentication.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Multer for file uploads
- Socket.IO for real-time chat

## Features

### Authentication & Authorization
- [x] User registration with role-based access
- [x] JWT-based authentication
- [x] Token refresh mechanism
- [x] Password reset functionality
- [x] Email verification
- [x] Role-based access control (User, Renter, Admin, SuperAdmin)

### Property Management
- [x] CRUD operations for properties
- [x] Property search with filters
- [x] Image upload and management
- [x] Property verification system
- [x] Property reviews and ratings

### User Management
- [x] User profile management
- [x] Booking history
- [x] Property owner dashboard
- [x] Admin dashboard
- [x] User activity logs

### Chat System
- [x] Real-time messaging between users and property owners
- [x] Message history
- [x] Notification system
- [x] Online status tracking

### Payment Integration
- [x] Payment gateway integration
- [x] Booking payment processing
- [x] Payment history
- [x] Refund management

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET /api/auth/verify-email/:token
```

### Users
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/bookings
GET /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
```

### Properties
```
GET /api/properties
GET /api/properties/:id
POST /api/properties
PUT /api/properties/:id
DELETE /api/properties/:id
POST /api/properties/:id/reviews
GET /api/properties/:id/reviews
```

### Bookings
```
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
PUT /api/bookings/:id
DELETE /api/bookings/:id
```

### Chat
```
GET /api/chats
GET /api/chats/:id
POST /api/chats
GET /api/chats/:id/messages
POST /api/chats/:id/messages
```

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js     # Database configuration
│   │   ├── passport.js     # Passport.js configuration
│   │   └── roles.js        # Role definitions and permissions
│   ├── controllers/
│   │   ├── auth.js         # Authentication controllers
│   │   ├── user.js         # User management
│   │   ├── property.js     # Property operations
│   │   ├── booking.js      # Booking management
│   │   ├── chat.js         # Chat functionality
│   │   └── payment.js      # Payment processing
│   ├── middleware/
│   │   ├── auth.js         # Authentication middleware
│   │   ├── upload.js       # File upload middleware
│   │   ├── validate.js     # Request validation
│   │   └── error.js        # Error handling
│   ├── models/
│   │   ├── User.js         # User model
│   │   ├── Property.js     # Property model
│   │   ├── Booking.js      # Booking model
│   │   ├── Chat.js         # Chat model
│   │   └── Message.js      # Message model
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── user.js         # User routes
│   │   ├── property.js     # Property routes
│   │   ├── booking.js      # Booking routes
│   │   ├── chat.js         # Chat routes
│   │   └── payment.js      # Payment routes
│   ├── services/
│   │   ├── email.js        # Email service
│   │   ├── storage.js      # File storage service
│   │   ├── payment.js      # Payment service
│   │   └── socket.js       # WebSocket service
│   ├── utils/
│   │   ├── validation.js   # Validation helpers
│   │   ├── errors.js       # Error classes
│   │   ├── logger.js       # Logging utility
│   │   └── helpers.js      # General helpers
│   └── app.js              # Express app setup
├── tests/
│   ├── integration/        # Integration tests
│   │   ├── auth.test.js
│   │   ├── property.test.js
│   │   └── booking.test.js
│   ├── unit/              # Unit tests
│   │   ├── models/
│   │   ├── controllers/
│   │   └── services/
│   └── setup.js           # Test configuration
├── uploads/               # Temporary file uploads
├── logs/                 # Application logs
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── README.md            # Project documentation
└── server.js            # Application entry point
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rent_house_bd
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/rent_house_bd.git
cd rent_house_bd/backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB
```bash
# Make sure MongoDB is running locally or update MONGODB_URI in .env
```

5. Run the development server
```bash
npm run dev
```

## Database Schema

### User
- _id: ObjectId
- email: String
- password: String (hashed)
- role: String (enum: ['user', 'renter', 'admin', 'superadmin'])
- name: String
- phone: String
- verified: Boolean
- createdAt: Date
- updatedAt: Date

### Property
- _id: ObjectId
- owner: ObjectId (ref: User)
- title: String
- description: String
- price: Number
- location: {
  address: String,
  city: String,
  coordinates: [Number]
}
- features: [String]
- images: [String]
- status: String (enum: ['available', 'rented', 'pending'])
- createdAt: Date
- updatedAt: Date

### Booking
- _id: ObjectId
- property: ObjectId (ref: Property)
- user: ObjectId (ref: User)
- startDate: Date
- endDate: Date
- status: String (enum: ['pending', 'confirmed', 'cancelled'])
- paymentStatus: String
- amount: Number
- createdAt: Date
- updatedAt: Date

### Chat
- _id: ObjectId
- participants: [ObjectId] (ref: User)
- property: ObjectId (ref: Property)
- lastMessage: Date
- createdAt: Date
- updatedAt: Date

### Message
- _id: ObjectId
- chat: ObjectId (ref: Chat)
- sender: ObjectId (ref: User)
- content: String
- readBy: [ObjectId] (ref: User)
- createdAt: Date
- updatedAt: Date

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
