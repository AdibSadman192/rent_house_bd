import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Starting token refresh...');
    await connectDB();

    const { refreshToken } = req.body;

    if (!refreshToken) {
      console.log('No refresh token provided');
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret');
      console.log('Refresh token verified successfully');
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Find user
    console.log('Finding user with ID:', decoded.userId);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('User not found:', decoded.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last activity
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    console.log('Updated last login time for user:', user._id);

    // Generate new tokens
    console.log('Generating new tokens...');
    const newToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '30d' }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
      { expiresIn: '90d' }
    );

    // Set new cookies
    console.log('Setting new cookies...');
    res.setHeader('Set-Cookie', [
      `token=${newToken}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict`,
      `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=7776000; SameSite=Strict`
    ]);

    // Remove sensitive data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      lastLogin: user.lastLogin
    };

    console.log('Token refresh successful for user:', user._id);
    return res.status(200).json({
      success: true,
      message: 'Session refreshed successfully',
      token: newToken,
      refreshToken: newRefreshToken,
      user: userResponse
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while refreshing the session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
