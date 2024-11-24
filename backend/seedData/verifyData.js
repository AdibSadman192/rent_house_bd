require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function verifyData() {
  try {
    // Get all users
    const users = await User.find({}).select('-password');
    console.log('\n=== Users ===');
    console.log('Total Users:', users.length);
    users.forEach(user => {
      console.log(`\nUser: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Address: ${user.address}`);
    });

    // Get all posts with owner details
    const posts = await Post.find({}).populate('ownerId', 'name email');
    console.log('\n=== Posts ===');
    console.log('Total Posts:', posts.length);
    posts.forEach(post => {
      console.log(`\nTitle: ${post.title}`);
      console.log(`Location: ${post.location.formattedAddress}`);
      console.log(`Price: ${post.price.amount} BDT`);
      console.log(`Property Type: ${post.propertyType}`);
      console.log(`Owner: ${post.ownerId.name}`);
      console.log(`Amenities: ${post.amenities.join(', ')}`);
    });

    // Get posts by area
    const areaStats = await Post.aggregate([
      {
        $group: {
          _id: '$location.address.area',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price.amount' }
        }
      }
    ]);
    
    console.log('\n=== Area Statistics ===');
    areaStats.forEach(stat => {
      console.log(`\nArea: ${stat._id}`);
      console.log(`Number of Properties: ${stat.count}`);
      console.log(`Average Price: ${Math.round(stat.avgPrice)} BDT`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

verifyData();
