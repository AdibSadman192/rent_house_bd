import { prisma } from '../../../lib/prisma';
import { hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update the user's password
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send success response
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}
