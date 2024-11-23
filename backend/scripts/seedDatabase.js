require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Message = require('../models/Message');

// Sample data for Bangladesh
const users = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@houserental.com',
    password: 'SuperAdmin@123',
    role: 'super-admin',
    phone: '+8801711111111',
    nid: '1234567890',
    address: 'House 12, Road 5, Block B, Gulshan-1, Dhaka',
    isVerified: true,
    security: {
      twoFactorEnabled: true,
      loginNotifications: true,
      activityAlerts: true,
      lastPasswordChange: new Date(),
      logs: []
    },
    notifications: {
      email: true,
      push: true,
      sms: true,
      preferences: {
        bookings: true,
        messages: true,
        reviews: true,
        system: true
      }
    },
    settings: {
      theme: 'light',
      language: 'bn',
      timezone: 'Asia/Dhaka'
    }
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@houserental.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+8801722222222',
    nid: '2345678901',
    address: 'House 45, Road 8, Block C, Banani DOHS, Dhaka',
    isVerified: true,
    security: {
      twoFactorEnabled: true,
      loginNotifications: true,
      activityAlerts: true,
      lastPasswordChange: new Date(),
      logs: []
    },
    notifications: {
      email: true,
      push: true,
      sms: true,
      preferences: {
        bookings: true,
        messages: true,
        reviews: true,
        system: true
      }
    },
    settings: {
      theme: 'system',
      language: 'bn',
      timezone: 'Asia/Dhaka'
    }
  },
  {
    firstName: 'Property',
    lastName: 'Renter',
    email: 'renter@houserental.com',
    password: 'Renter@123',
    role: 'renter',
    phone: '+8801733333333',
    nid: '3456789012',
    address: 'House 78, Road 11, Block F, Gulshan-2, Dhaka',
    isVerified: true,
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      activityAlerts: true,
      lastPasswordChange: new Date(),
      logs: []
    },
    notifications: {
      email: true,
      push: true,
      sms: true,
      preferences: {
        bookings: true,
        messages: true,
        reviews: true,
        system: true
      }
    },
    settings: {
      theme: 'dark',
      language: 'bn',
      timezone: 'Asia/Dhaka'
    }
  },
  {
    firstName: 'Alice',
    lastName: 'Rahman',
    email: 'alice@example.com',
    password: 'User@123',
    role: 'user',
    phone: '+8801744444444',
    nid: '4567890123',
    address: 'House 23, Road 12, Block D, Banani, Dhaka',
    isVerified: true,
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      activityAlerts: true,
      lastPasswordChange: new Date(),
      logs: []
    },
    notifications: {
      email: true,
      push: true,
      sms: true,
      preferences: {
        bookings: true,
        messages: true,
        reviews: true,
        system: true
      }
    },
    settings: {
      theme: 'system',
      language: 'bn',
      timezone: 'Asia/Dhaka'
    }
  },
  {
    firstName: 'Charlie',
    lastName: 'Ahmed',
    email: 'charlie@example.com',
    password: 'User@123',
    role: 'user',
    phone: '+8801755555555',
    nid: '5678901234',
    address: 'House 56, Road 27, Block G, Dhanmondi, Dhaka',
    isVerified: true,
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      activityAlerts: true,
      lastPasswordChange: new Date(),
      logs: []
    },
    notifications: {
      email: true,
      push: true,
      sms: true,
      preferences: {
        bookings: true,
        messages: true,
        reviews: true,
        system: true
      }
    },
    settings: {
      theme: 'light',
      language: 'bn',
      timezone: 'Asia/Dhaka'
    }
  }
];

// Read users from info.txt
try {
  const infoTxt = fs.readFileSync(path.join(__dirname, '../../info.txt'), 'utf8');
  
  // Split the file into sections
  const sections = infoTxt.split('\n\n');
  const infoUsers = [];
  
  // Process each section
  for (const section of sections) {
    // Skip sections that don't contain user credentials
    if (!section.includes('Email:') || !section.includes('Password:')) continue;
    
    // Extract credentials
    const emailMatch = section.match(/Email:\s*([^\n]+)/);
    const passwordMatch = section.match(/Password:\s*([^\n]+)/);
    
    if (emailMatch && passwordMatch) {
      const email = emailMatch[1].trim();
      const password = passwordMatch[1].trim();
      
      // Extract role from the section header or email
      let role = 'user';
      if (section.toLowerCase().includes('super admin') || email.includes('superadmin')) {
        role = 'super-admin';
      } else if (section.toLowerCase().includes('admin') && !section.toLowerCase().includes('super')) {
        role = 'admin';
      } else if (section.toLowerCase().includes('renter')) {
        role = 'renter';
      }
      
      // Generate a unique NID based on role
      const nidPrefix = {
        'super-admin': '1',
        'admin': '2',
        'renter': '3',
        'user': '4'
      }[role];
      const nid = `${nidPrefix}${'0'.repeat(9-email.length)}${email.length}${Date.now() % 1000000}`;
      
      // Create user object
      const user = {
        firstName: email.split('@')[0],
        lastName: 'User',
        email,
        password,
        role,
        phone: '+8801712345' + nid.slice(-3),  // Generate unique phone number
        address: `${role.charAt(0).toUpperCase() + role.slice(1)} Address, Dhaka, Bangladesh`,
        nid,
        isVerified: true,
        security: {
          twoFactorEnabled: false,
          loginNotifications: true,
          activityAlerts: true,
          lastPasswordChange: new Date(),
          logs: []
        },
        notifications: {
          email: true,
          push: true,
          sms: true,
          preferences: {
            bookings: true,
            messages: true,
            reviews: true,
            system: true
          }
        },
        settings: {
          theme: 'system',
          language: 'bn',
          timezone: 'Asia/Dhaka'
        }
      };
      infoUsers.push(user);
    }
  }
  
  // Add the parsed users to the users array
  if (infoUsers.length > 0) {
    users.push(...infoUsers);
    console.log(`Parsed ${infoUsers.length} users from info.txt`);
  } else {
    console.log('No valid users found in info.txt');
  }
} catch (error) {
  console.error('Error reading info.txt:', error.message);
}

const properties = [
  {
    title: 'মডার্ন ফ্যামিলি আপার্টমেন্ট - গুলশান',
    description: 'সুন্দর 3 বেডরুম আপার্টমেন্ট, গুলশান-2 তে অবস্থিত। সম্পূর্ণ আধুনিক সুযোগ-সুবিধা সহ।',
    address: {
      street: 'Road 103',
      houseNumber: '24',
      floor: 4,
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      area: 'Gulshan 2',
      postCode: '1212',
      country: 'Bangladesh'
    },
    location: {
      type: 'Point',
      coordinates: [90.4152, 23.7925]
    },
    price: {
      amount: 45000,
      currency: 'BDT',
      negotiable: true,
      advancePayment: 90000
    },
    propertyType: 'Apartment',
    status: 'available',
    features: {
      size: {
        value: 1800,
        unit: 'sqft'
      },
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      parking: {
        available: true,
        type: 'car'
      },
      furnished: 'semi-furnished',
      utilities: {
        electricity: true,
        gas: true,
        water: true,
        internet: true,
        maintenance: true
      },
      amenities: [
        'lift',
        'generator',
        'security',
        'cctv',
        'prayer_room'
      ]
    },
    preferences: {
      tenantType: ['family'],
      gender: 'any',
      maxOccupants: 6,
      petsAllowed: false
    },
    images: [
      {
        url: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
        alt: 'Living Room'
      },
      {
        url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
        alt: 'Kitchen'
      }
    ]
  },
  {
    title: 'স্টুডেন্ট মেস - মোহাম্মদপুর',
    description: 'ছাত্রদের জন্য আদর্শ আবাসন। মোহাম্মদপুর বাস স্ট্যান্ড থেকে ৫ মিনিটের হাঁটার দূরত্বে।',
    address: {
      street: 'Shahjahan Road',
      houseNumber: '45/A',
      floor: 2,
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Mohammadpur',
      area: 'Mohammadpur Housing',
      postCode: '1207',
      country: 'Bangladesh'
    },
    location: {
      type: 'Point',
      coordinates: [90.3596, 23.7577]
    },
    price: {
      amount: 5000,
      currency: 'BDT',
      negotiable: true,
      advancePayment: 10000
    },
    propertyType: 'Mess',
    status: 'available',
    features: {
      size: {
        value: 120,
        unit: 'sqft'
      },
      bedrooms: 1,
      bathrooms: 1,
      balconies: 0,
      parking: {
        available: true,
        type: 'bike'
      },
      furnished: 'semi-furnished',
      utilities: {
        electricity: true,
        gas: false,
        water: true,
        internet: true,
        maintenance: false
      },
      amenities: [
        'generator',
        'security'
      ]
    },
    preferences: {
      tenantType: ['student'],
      gender: 'male',
      maxOccupants: 2,
      petsAllowed: false
    },
    images: [
      {
        url: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
        alt: 'Room View'
      }
    ]
  },
  {
    title: 'বাণিজ্যিক অফিস স্পেস - মতিঝিল',
    description: 'মতিঝিলের কেন্দ্রস্থলে অবস্থিত প্রিমিয়াম অফিস স্পেস। 24/7 জেনারেটর ও লিফট সুবিধা।',
    address: {
      street: 'Dilkusha Commercial Area',
      houseNumber: '89',
      floor: 6,
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Motijheel',
      area: 'Dilkusha',
      postCode: '1000',
      country: 'Bangladesh'
    },
    location: {
      type: 'Point',
      coordinates: [90.4195, 23.7283]
    },
    price: {
      amount: 75000,
      currency: 'BDT',
      negotiable: true,
      advancePayment: 150000
    },
    propertyType: 'Office',
    status: 'available',
    features: {
      size: {
        value: 2200,
        unit: 'sqft'
      },
      bedrooms: 0,
      bathrooms: 2,
      balconies: 0,
      parking: {
        available: true,
        type: 'both'
      },
      furnished: 'fully-furnished',
      utilities: {
        electricity: true,
        gas: false,
        water: true,
        internet: true,
        maintenance: true
      },
      amenities: [
        'lift',
        'generator',
        'security',
        'cctv',
        'intercom'
      ]
    },
    preferences: {
      tenantType: ['office'],
      gender: 'any',
      maxOccupants: 30,
      petsAllowed: false
    },
    images: [
      {
        url: 'https://images.pexels.com/photos/1743555/pexels-photo-1743555.jpeg',
        alt: 'Office Space'
      }
    ]
  }
];

const posts = [
  {
    title: 'Beautiful Apartment in Gulshan',
    description: 'Spacious 3-bedroom apartment with modern amenities in Gulshan-2. Perfect for families.',
    location: 'Gulshan-2, Dhaka',
    price: 45000,
    approved: true
  },
  {
    title: 'Studio Apartment in Banani',
    description: 'Cozy studio apartment with full furnishing in Banani. Ideal for bachelors or small families.',
    location: 'Banani, Dhaka',
    price: 25000,
    approved: true
  },
  {
    title: 'Family House in Dhanmondi',
    description: 'Spacious 4-bedroom house with garden in Dhanmondi residential area. Perfect for large families.',
    location: 'Dhanmondi, Dhaka',
    price: 65000,
    approved: true
  }
];

const reviews = [
  {
    rating: 5,
    comment: 'Beautiful property with excellent amenities. The location is perfect and the owner is very cooperative.',
    status: 'approved',
    images: [
      'https://example.com/review1-image1.jpg',
      'https://example.com/review1-image2.jpg'
    ]
  },
  {
    rating: 4,
    comment: 'Great property in a prime location. Minor maintenance issues but overall a good experience.',
    status: 'approved',
    images: [
      'https://example.com/review2-image1.jpg'
    ]
  },
  {
    rating: 5,
    comment: 'Excellent property with modern amenities. The security system is top-notch.',
    status: 'approved',
    images: [
      'https://example.com/review3-image1.jpg',
      'https://example.com/review3-image2.jpg'
    ]
  }
];

const messages = [
  {
    content: 'Hi, I am interested in your property. Is it still available?',
    type: 'text',
    formatting: {
      bold: [],
      italic: [],
      code: [],
      link: []
    }
  },
  {
    content: 'Yes, the property is available. Would you like to schedule a viewing?',
    type: 'text',
    formatting: {
      bold: [],
      italic: [],
      code: [],
      link: []
    }
  },
  {
    content: 'Great! When would be a good time to visit?',
    type: 'text',
    formatting: {
      bold: [],
      italic: [],
      code: [],
      link: []
    }
  }
];

// Seed Database Function
const seedDatabase = async () => {
  try {
    console.log('Attempting to connect to MongoDB at:', process.env.MONGODB_URI);
    await connectDB();
    console.log('Connected to MongoDB successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Post.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    console.log('Existing data cleared');

    // Create users
    console.log('Creating users...');
    const hashedUsers = await Promise.all(users.map(async user => ({
      ...user,
      password: await bcrypt.hash(user.password, 10)
    })));
    
    // Create users one by one to handle duplicates
    for (const user of hashedUsers) {
      try {
        await User.create(user);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Skipping duplicate user: ${user.email}`);
          continue;
        }
        throw error;
      }
    }
    console.log(`Created ${hashedUsers.length} users`);

    // Create properties
    console.log('Creating properties...');
    const createdProperties = [];
    try {
      for (const property of properties) {
        const newProperty = await Property.create({
          ...property,
          owner: (await User.findOne({ role: 'super-admin' }))._id
        });
        createdProperties.push(newProperty);
      }
      console.log(`Created ${createdProperties.length} properties`);
    } catch (error) {
      throw new Error(`Error creating properties: ${error.message}`);
    }

    // Create posts
    console.log('Creating posts...');
    try {
      for (const post of posts) {
        await Post.create({
          ...post,
          ownerId: (await User.findOne({ role: 'super-admin' }))._id
        });
      }
      console.log(`Created ${posts.length} posts`);
    } catch (error) {
      throw new Error(`Error creating posts: ${error.message}`);
    }

    // Create reviews
    console.log('Creating reviews...');
    try {
      const usedCombinations = new Set(); // Track user-property combinations
      for (const review of reviews) {
        let property, reviewer, combinationKey;
        
        // Keep trying until we find a unique user-property combination
        do {
          property = createdProperties[Math.floor(Math.random() * createdProperties.length)];
          do {
            reviewer = await User.findOne({ role: 'user' });
          } while (reviewer._id.equals(property.owner));
          
          combinationKey = `${property._id}-${reviewer._id}`;
        } while (usedCombinations.has(combinationKey));
        
        usedCombinations.add(combinationKey);

        await Review.create({
          ...review,
          propertyId: property._id,
          userId: reviewer._id
        });
      }
      console.log(`Created ${reviews.length} reviews`);
    } catch (error) {
      throw new Error(`Error creating reviews: ${error.message}`);
    }

    // Create messages
    console.log('Creating messages...');
    try {
      const usedCombinations = new Set(); // Track sender-recipient combinations
      for (const message of messages) {
        let property, sender, recipient, combinationKey;
        
        // Keep trying until we find a unique sender-recipient combination
        do {
          property = createdProperties[Math.floor(Math.random() * createdProperties.length)];
          do {
            sender = await User.findOne({ role: 'user' });
            do {
              recipient = await User.findOne({ role: 'user' });
            } while (recipient._id.equals(sender._id));
          } while (sender._id.equals(property.owner) && recipient._id.equals(property.owner));
          
          combinationKey = `${sender._id}-${recipient._id}`;
        } while (usedCombinations.has(combinationKey));
        
        usedCombinations.add(combinationKey);

        // Create chatId by sorting and concatenating user IDs
        const chatId = [sender._id, recipient._id].sort().join('_');

        await Message.create({
          ...message,
          sender: sender._id,
          recipient: recipient._id,
          propertyId: property._id,
          chatId
        });
      }
      console.log(`Created ${messages.length} messages`);
    } catch (error) {
      throw new Error(`Error creating messages: ${error.message}`);
    }

    console.log('Database seeded successfully! 🌱');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
