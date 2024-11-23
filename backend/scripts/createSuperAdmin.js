const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createSuperAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'super_admin' });
    if (existingAdmin) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@renthouse.com',
      password: hashedPassword,
      role: 'super_admin',
      phone: '+880123456789',
      nid: 'ADMIN123456',
      address: 'Admin Office, Dhaka',
      isVerified: true,
      status: 'active'
    });

    await superAdmin.save();
    console.log('Super admin created successfully');
    console.log('Email: admin@renthouse.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
