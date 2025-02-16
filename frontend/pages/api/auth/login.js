import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Connect to MongoDB
    console.log('API: Connecting to database...');
    await connectDB();
    console.log('API: Connected to database successfully');

    // Find user
    console.log('API: Finding user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('API: No user found with email:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    console.log('API: User found, checking password...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('API: Password match result:', isValid);
    if (!isValid) {
      console.log('API: Password does not match for user:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    console.log('API: Password verified successfully');

    // Generate tokens
    console.log('API: Generating tokens...');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
      { expiresIn: '90d' }
    );
    console.log('API: Tokens generated successfully');

    // Prepare user data (excluding sensitive information)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    // Set cookies
    const cookieOptions = {
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: 'lax'
    };

    // Set cookies in response
    res.setHeader('Set-Cookie', [
      `token=${token}; Path=/; Max-Age=${30 * 24 * 60 * 60}`,
      `refreshToken=${refreshToken}; Path=/; Max-Age=${90 * 24 * 60 * 60}`
    ]);

    console.log('API: Login successful for user:', email);

    // Send success response with user data and tokens
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData,
      token,
      refreshToken
    });

  } catch (error) {
    console.error('API: Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
