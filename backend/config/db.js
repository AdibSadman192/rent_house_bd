const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/house-rental';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle MongoDB connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
      // Attempt to reconnect
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        mongoose.connect(mongoURI);
      }, 5000);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        mongoose.connect(mongoURI);
      }, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB reconnected successfully');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Log more details about the error
    if (error.name === 'MongooseServerSelectionError') {
      console.error('MongoDB server selection error. Please check if MongoDB is running.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
