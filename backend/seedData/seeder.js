require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const samplePosts = require('./samplePosts');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample user data
const sampleUsers = [
  {
    name: "Karim Ahmed",
    email: "karim@example.com",
    password: "password123",
    phone: "+8801712345678",
    nid: "1234567890",
    address: "Gulshan, Dhaka",
    role: "renter"
  },
  {
    name: "Fatima Rahman",
    email: "fatima@example.com",
    password: "password123",
    phone: "+8801812345678",
    nid: "0987654321",
    address: "Dhanmondi, Dhaka",
    role: "renter"
  },
  {
    name: "Rahim Khan",
    email: "rahim@example.com",
    password: "password123",
    phone: "+8801912345678",
    nid: "2468101214",
    address: "Banani, Dhaka",
    role: "owner"
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    password: "password123",
    phone: "+8801612345678",
    nid: "1357911131",
    address: "Uttara, Dhaka",
    role: "owner"
  },
  {
    name: "Imran Hossain",
    email: "imran@example.com",
    password: "password123",
    phone: "+8801512345678",
    nid: "5555666677",
    address: "Mirpur, Dhaka",
    role: "student"
  }
];

// Import Data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();

    // Create users
    const createdUsers = await User.create(sampleUsers);

    // Add user references to posts
    const postsWithUsers = samplePosts.map((post, index) => ({
      ...post,
      ownerId: createdUsers[index % createdUsers.length]._id,
      approved: true,
      active: true,
      availability: {
        ...post.availability,
        availableFrom: new Date()
      }
    }));

    // Create posts
    await Post.create(postsWithUsers);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide proper command: -i (import) or -d (delete)');
  process.exit();
}
