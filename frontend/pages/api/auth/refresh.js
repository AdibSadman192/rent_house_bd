import { connectToDatabase } from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the existing token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Token is expired, but we can still decode it to get the user info
        decoded = jwt.decode(token);
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ 
      _id: decoded.userId,
      email: decoded.email 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last activity
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastActivity: new Date(),
          lastTokenRefresh: new Date()
        }
      }
    );

    // Create new token
    const newToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
        rememberMe: decoded.rememberMe
      },
      JWT_SECRET,
      { expiresIn: decoded.rememberMe ? '30d' : '7d' }
    );

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Session refreshed successfully',
      token: newToken,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    return res.status(500).json({
      message: 'An error occurred while refreshing the session'
    });
  }
}
