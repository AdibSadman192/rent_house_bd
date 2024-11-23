require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const usersToCheck = [
  {
    email: 'superadmin@houserental.com',
    role: 'superadmin'
  },
  {
    email: 'admin@houserental.com',
    role: 'admin'
  },
  {
    email: 'renter@houserental.com',
    role: 'renter'
  },
  {
    email: 'alice@example.com',
    role: 'user'
  },
  {
    email: 'charlie@example.com',
    role: 'user'
  }
];

async function verifyUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/house-rental', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    console.log('\nVerifying users from info.txt...\n');
    console.log('----------------------------------------');

    for (const userToCheck of usersToCheck) {
      const user = await User.findOne({ email: userToCheck.email });
      
      if (user) {
        console.log(`✅ Found user: ${userToCheck.email}`);
        console.log(`   Role: ${user.role} (Expected: ${userToCheck.role})`);
        console.log(`   Status: ${user.status}`);
      } else {
        console.log(`❌ Missing user: ${userToCheck.email}`);
        console.log(`   Expected role: ${userToCheck.role}`);
      }
      console.log('----------------------------------------');
    }

    // Check total number of users
    const totalUsers = await User.countDocuments();
    console.log(`\nTotal users in database: ${totalUsers}`);
    
    // Get all users for detailed report
    const allUsers = await User.find({}, 'email role status');
    console.log('\nAll users in database:');
    console.log('----------------------------------------');
    allUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Status: ${user.status}`);
      console.log('----------------------------------------');
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the verification
verifyUsers();
