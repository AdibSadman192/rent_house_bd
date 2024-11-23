require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const users = [
  {
    name: 'John Super Admin',
    email: 'superadmin@houserental.com',
    password: 'SuperAdmin@123',
    role: 'super-admin',
    nid: 'SA123456789',
    address: '123 Admin Street, Admin City',
    isVerified: true,
  },
  {
    name: 'Jane Admin',
    email: 'admin@houserental.com',
    password: 'Admin@123',
    role: 'admin',
    nid: 'AD123456789',
    address: '456 Admin Lane, Admin City',
    isVerified: true,
  },
  {
    name: 'Bob Renter',
    email: 'renter@houserental.com',
    password: 'Renter@123',
    role: 'renter',
    nid: 'RT123456789',
    address: '789 Renter Road, Renter City',
    isVerified: true,
  },
  {
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'User@123',
    role: 'user',
    nid: 'US123456789',
    address: '321 User Avenue, User City',
    isVerified: true,
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'User@123',
    role: 'user',
    nid: 'US987654321',
    address: '654 User Boulevard, User City',
    isVerified: true,
  }
];

async function generateUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({
        ...user,
        password: hashedPassword
      });
      createdUsers.push({ ...user, _id: newUser._id });
    }
    console.log('Created users');

    // Generate info.txt content
    const infoContent = `
House Rental Platform - User Credentials
======================================

🔐 Login Information
-------------------
All users can log in through the same login page at /auth/login
The system will automatically detect the user's role and redirect them accordingly.

📝 Registration
--------------
- Only users and renters can register through the public registration page
- Admin accounts can only be created by the Super Admin through the dashboard
- Renter accounts need verification by an admin before they can access the platform

🔑 Sample Account Credentials
---------------------------

Super Admin
----------
Email: ${users.find(u => u.role === 'super-admin').email}
Password: ${users.find(u => u.role === 'super-admin').password}
Access: Full platform control, can create/manage admin accounts

Admin
-----
Email: ${users.find(u => u.role === 'admin').email}
Password: ${users.find(u => u.role === 'admin').password}
Access: Platform management, user verification, content moderation

Renter
------
Email: ${users.find(u => u.role === 'renter').email}
Password: ${users.find(u => u.role === 'renter').password}
Access: Property listing, booking management, messaging

Regular Users
------------
1. Email: ${users.find(u => u.role === 'user' && u.email === 'alice@example.com').email}
   Password: ${users.find(u => u.role === 'user' && u.email === 'alice@example.com').password}

2. Email: ${users.find(u => u.role === 'user' && u.email === 'charlie@example.com').email}
   Password: ${users.find(u => u.role === 'user' && u.email === 'charlie@example.com').password}
Access: Property browsing, booking, reviews, messaging

⚠️ Security Notice
----------------
Please change these passwords after first login for security purposes.
These are sample accounts for testing purposes only.

🔒 Role-Based Access Control
-------------------------
1. Super Admin
   - Create, manage, and delete admin accounts
   - Full platform management
   - Access all features

2. Admin
   - Verify renter accounts
   - Moderate content and reviews
   - Manage user reports
   - Platform monitoring

3. Renter
   - List properties
   - Manage bookings
   - Respond to inquiries
   - Update property details
   - View booking analytics

4. User
   - Browse properties
   - Make bookings
   - Leave reviews
   - Message renters
   - Manage personal bookings

Generated on: ${new Date().toLocaleString()}
`;

    // Write to info.txt in the root directory
    const infoPath = path.join(__dirname, '../../info.txt');
    fs.writeFileSync(infoPath, infoContent);
    console.log('Generated info.txt with credentials');

    console.log('User generation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error generating users:', error);
    process.exit(1);
  }
}

generateUsers();
