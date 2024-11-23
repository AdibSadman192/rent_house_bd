require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');

const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@houserental.com',
    password: 'SuperAdmin@123',
    role: 'super-admin',
    isVerified: true,
    nid: 'SA123456789',
    address: 'Dhaka, Bangladesh',
    phone: '+8801700000001'
  },
  {
    name: 'Admin User',
    email: 'admin@houserental.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
    nid: 'AD123456789',
    address: 'Dhaka, Bangladesh',
    phone: '+8801700000002'
  },
  {
    name: 'Property Renter',
    email: 'renter@houserental.com',
    password: 'Renter@123',
    role: 'renter',
    isVerified: true,
    nid: 'RE123456789',
    address: 'Chittagong, Bangladesh',
    phone: '+8801700000003'
  },
  {
    name: 'Alice Cooper',
    email: 'alice@example.com',
    password: 'User@123',
    role: 'user',
    isVerified: true,
    nid: 'US123456789',
    address: 'Sylhet, Bangladesh',
    phone: '+8801700000004'
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'User@123',
    role: 'user',
    isVerified: true,
    nid: 'US987654321',
    address: 'Khulna, Bangladesh',
    phone: '+8801700000005'
  },
];

const properties = [
  {
    title: 'Modern Apartment in Gulshan',
    description: 'Luxurious 3-bedroom apartment with modern amenities and stunning city views. Perfect for families or professionals.',
    address: {
      street: 'Road 103, House 7',
      area: 'Gulshan',
      city: 'Dhaka',
      state: 'Dhaka',
      zipCode: '1212',
      country: 'Bangladesh'
    },
    location: {
      type: 'Point',
      coordinates: [90.415482, 23.793445] // Longitude, Latitude for Gulshan
    },
    price: 35000,
    propertyType: 'Apartment',
    status: 'available',
    features: {
      bedrooms: 3,
      bathrooms: 2,
      size: 1800,
      furnished: true,
      parking: true,
      yearBuilt: 2020
    },
    amenities: [
      'Air Conditioning',
      'Internet',
      'Cable TV',
      'Security',
      'Generator',
      'Elevator',
      'CCTV'
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        alt: 'Modern living room with city view'
      },
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        alt: 'Spacious bedroom with natural light'
      }
    ],
    virtualTour: 'https://my.matterport.com/show/?m=example',
  },
  {
    title: 'Spacious Family House in Dhanmondi',
    description: 'Beautiful family house with garden and modern amenities. Located in a quiet neighborhood.',
    address: {
      street: 'Road 27, House 15',
      area: 'Dhanmondi',
      city: 'Dhaka',
      state: 'Dhaka',
      zipCode: '1209',
      country: 'Bangladesh'
    },
    location: {
      type: 'Point',
      coordinates: [90.373613, 23.755251] // Longitude, Latitude for Dhanmondi
    },
    price: 45000,
    propertyType: 'House',
    status: 'available',
    features: {
      bedrooms: 4,
      bathrooms: 3,
      size: 2500,
      furnished: true,
      parking: true,
      yearBuilt: 2019
    },
    amenities: [
      'Air Conditioning',
      'Internet',
      'Cable TV',
      'Security',
      'Generator',
      'CCTV',
      'Water Reserve'
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        alt: 'House front view with garden'
      },
      {
        url: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
        alt: 'Modern kitchen with island'
      }
    ]
  },
  {
    title: 'Cozy Studio in Banani',
    description: 'Modern studio apartment perfect for singles or couples. Prime location with great amenities.',
    address: {
      street: 'Road 11, House 67',
      area: 'Banani',
      city: 'Dhaka',
      state: 'Dhaka',
      zipCode: '1213',
      country: 'Bangladesh'
    },
    location: {
      type: 'Point',
      coordinates: [90.406198, 23.793883] // Longitude, Latitude for Banani
    },
    price: 20000,
    propertyType: 'Studio',
    status: 'available',
    features: {
      bedrooms: 1,
      bathrooms: 1,
      size: 800,
      furnished: true,
      parking: false,
      yearBuilt: 2021
    },
    amenities: [
      'Air Conditioning',
      'Internet',
      'Cable TV',
      'Security',
      'Elevator'
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
        alt: 'Modern studio interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb',
        alt: 'Compact kitchen space'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    console.log('Existing data cleared');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({
        ...user,
        password: hashedPassword
      });
      createdUsers.push(newUser);
      console.log(`Created user: ${user.email}`);
    }

    // Create properties and assign to renter
    const renter = createdUsers.find(user => user.role === 'renter');
    for (const property of properties) {
      await Property.create({
        ...property,
        owner: renter._id
      });
      console.log(`Created property: ${property.title}`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
