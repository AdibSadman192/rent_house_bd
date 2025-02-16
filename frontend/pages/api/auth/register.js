import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully');

    let { name, email, password, phone, address, role } = req.body;
    
    // Clean up input data
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    phone = phone?.trim();
    address = address?.trim();

    console.log('Registration attempt for email:', email);
    console.log('Password validation:', {
      originalLength: req.body.password?.length,
      trimmedLength: password?.length,
      hasWhitespace: /\s/.test(password),
      charCodes: Array.from(password).map(c => c.charCodeAt(0))
    });

    // Validate required fields
    if (!name || !email || !password || !phone) {
      console.log('Missing required fields:', { name, email, phone, password: !!password });
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        message: 'An account with this email already exists'
      });
    }

    // Check if phone number is already registered
    console.log('Checking for existing phone:', phone);
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      console.log('Phone number already registered:', phone);
      return res.status(400).json({
        message: 'This phone number is already registered'
      });
    }

    // Create user - password will be hashed by the model's pre-save middleware
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: role || 'user'
    });
    console.log('User created successfully:', user._id);

    // Verify the stored password
    const dbUser = await User.findById(user._id).select('+password');
    console.log('Database user verification:', {
      userId: dbUser._id,
      hasPassword: !!dbUser.password,
      passwordLength: dbUser.password?.length
    });

    // Generate tokens
    console.log('Generating tokens...');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
      { expiresIn: '90d' }
    );
    console.log('Tokens generated successfully');

    // Set cookies
    console.log('Setting cookies...');
    res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=7776000; SameSite=Strict`
    ]);

    // Remove sensitive data from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    console.log('Registration completed successfully');
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please login with your credentials.',
      token,
      refreshToken,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const errorMessages = {
        email: 'This email is already registered',
        phone: 'This phone number is already registered'
      };
      return res.status(400).json({
        success: false,
        message: errorMessages[field] || 'This information is already registered'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
