export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Clear auth cookies
    res.setHeader('Set-Cookie', [
      'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict',
      'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
    ]);

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
