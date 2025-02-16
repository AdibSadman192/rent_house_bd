import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    await connectDB();

    const { name, email, phone, address, nid } = req.body;

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already in use
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Check if NID is being changed and if it's already in use
    if (nid && nid !== user.nid) {
      const nidExists = await User.findOne({ nid });
      if (nidExists) {
        return res.status(400).json({ message: 'National ID already registered' });
      }
    }

    // Update user
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    if (nid) {
      user.nid = nid;
    }

    await user.save();

    // Return updated user without sensitive information
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      nid: user.nid,
      role: user.role,
    };

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
}
