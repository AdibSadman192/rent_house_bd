import { hash } from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phoneNumber, nidNumber, password, userType } = req.body;

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists. Please use a different email or try logging in.'
      });
    }

    // Check if NID is already registered
    const existingNID = await usersCollection.findOne({ nidNumber });
    if (existingNID) {
      return res.status(400).json({
        message: 'This National ID is already registered. Each person can only have one account.'
      });
    }

    // Check if phone number is already registered
    const existingPhone = await usersCollection.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({
        message: 'This phone number is already registered. Please use a different number.'
      });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const result = await usersCollection.insertOne({
      firstName,
      lastName,
      email,
      phoneNumber,
      nidNumber,
      password: hashedPassword,
      userType,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Remove password from response
    const user = {
      _id: result.insertedId,
      firstName,
      lastName,
      email,
      phoneNumber,
      nidNumber,
      userType,
      createdAt: new Date(),
    };

    return res.status(201).json({
      message: 'Welcome to RentHouse BD! Your account has been created successfully.',
      user
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const errorMessages = {
        email: 'This email is already registered. Please use a different email address.',
        nidNumber: 'This National ID is already in use. Each person can only have one account.',
        phoneNumber: 'This phone number is already registered. Please use a different number.'
      };
      return res.status(400).json({
        message: errorMessages[field] || 'This information is already registered.'
      });
    }

    // Generic error message
    return res.status(500).json({
      message: 'Unable to create your account at this time. Please try again later or contact support if the problem persists.'
    });
  }
}
