import { connectToDatabase } from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { accessToken, rememberMe } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Facebook access token is required' });
    }

    // Verify Facebook token
    let response;
    try {
      response = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`
      );
      const verification = await response.json();
      
      if (!verification.data?.is_valid) {
        return res.status(401).json({ message: 'Invalid Facebook token' });
      }
    } catch (error) {
      console.error('Facebook token verification error:', error);
      return res.status(401).json({ message: 'Failed to verify Facebook token' });
    }

    // Get user data from Facebook
    try {
      response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      const data = await response.json();

      if (!data.email) {
        return res.status(400).json({ 
          message: 'Email permission is required. Please allow email access and try again.' 
        });
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
        user = await usersCollection.findOne({ email: data.email });
      } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ message: 'Error finding user' });
      }

      if (!user) {
        // Create new user if doesn't exist
        const newUser = {
          email: data.email,
          name: data.name,
          profileImage: data.picture?.data?.url,
          userType: 'user',
          createdAt: new Date(),
          authProvider: 'facebook',
          lastLogin: new Date(),
          loginCount: 1,
          facebookId: data.id
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
                profileImage: data.picture?.data?.url || user.profileImage,
                facebookId: data.id
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
      const token = jwt.sign(
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
        token
      });
    } catch (error) {
      console.error('Facebook data fetch error:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch user data from Facebook' 
      });
    }
  } catch (error) {
    console.error('Facebook login error:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred during Facebook login. Please try again.'
    });
  }
}
