require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const {
  errorHandler,
  notFound,
  handleUncaughtExceptions,
  handleUnhandledRejections,
} = require('./middleware/errorMiddleware');

// Handle uncaught exceptions
handleUncaughtExceptions();

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(mongoSanitize()); // Prevent NoSQL injections

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Regular middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'profiles')));

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const chatbotRoutes = require('./routes/chatbot');
const reviewRoutes = require('./routes/reviews');
const bookingRoutes = require('./routes/bookings');
const uploadRoutes = require('./routes/upload');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Import services
const notificationService = require('./services/notificationService');
const securityService = require('./services/securityService');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chats', chatRoutes);

// Base route
app.get('/api/', (req, res) => {
  res.json({ 
    message: 'Welcome to House Rental API',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
const initializeSocket = require('./socket');
const io = initializeSocket(server);

// Initialize WebSocket services
notificationService.initialize(server);

// Initialize security service
securityService.initialize();

// Handle unhandled promise rejections
handleUnhandledRejections(server);
