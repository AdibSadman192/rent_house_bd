import { connectToDatabase } from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, rememberMe } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // Verify Google token
    let ticket;
    try {
      ticket = await verify(token, GOOGLE_CLIENT_ID);
    } catch (error) {
      console.error('Google token verification error:', error);
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const { email, name, picture } = ticket.getPayload();

    if (!email) {
      return res.status(400).json({ message: 'Email is required from Google account' });
    }

    // Connect to MongoDB
    let db;
    try {
      const connection = await connectToDatabase();
      db = connection.db;
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ message: 'Database connection failed' });
    }

    const usersCollection = db.collection('users');

    // Check if user exists
    let user;
    try {
      user = await usersCollection.findOne({ email });
    } catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ message: 'Error finding user' });
    }

    if (!user) {
      // Create new user if doesn't exist
      const newUser = {
        email,
        name,
        profileImage: picture,
        userType: 'user',
        createdAt: new Date(),
        authProvider: 'google',
        lastLogin: new Date(),
        loginCount: 1
      };

      try {
        const result = await usersCollection.insertOne(newUser);
        user = newUser;
        user._id = result.insertedId;
      } catch (error) {
        console.error('User creation error:', error);
        return res.status(500).json({ message: 'Error creating new user' });
      }
    } else {
      // Update existing user's login information
      try {
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              lastLogin: new Date(),
              profileImage: picture || user.profileImage // Update profile image if new one available
            },
            $inc: { loginCount: 1 }
          }
        );
      } catch (error) {
        console.error('User update error:', error);
        // Don't return error here as user can still login
      }
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
        rememberMe: !!rememberMe
      },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    // Remove sensitive data before sending response
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: jwtToken
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred during Google login. Please try again.'
    });
  }
}
