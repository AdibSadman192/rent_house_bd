require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property');
const User = require('../models/User');
const connectDB = require('../config/db');

const bangladeshiDivisions = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
  'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
];

const districts = {
  'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail'],
  'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Comilla', 'Chandpur'],
  'Rajshahi': ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj'],
  'Khulna': ['Khulna', 'Jessore', 'Kushtia', 'Bagerhat'],
  'Barishal': ['Barishal', 'Bhola', 'Patuakhali', 'Pirojpur'],
  'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  'Rangpur': ['Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha'],
  'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
};

const propertyTypes = ['Apartment', 'House', 'Duplex', 'Studio', 'Villa', 'Bachelor', 'Family'];
const validAmenities = ['lift', 'generator', 'security', 'cctv', 'intercom', 'prayer_room', 'community_hall', 'roof_access', 'gym', 'playground'];
const tenantTypes = ['family', 'bachelor', 'student', 'any'];
const genders = ['male', 'female', 'any'];

const getRandomItems = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

const generateRandomProperty = (userId) => {
  const division = bangladeshiDivisions[Math.floor(Math.random() * bangladeshiDivisions.length)];
  const district = districts[division][Math.floor(Math.random() * districts[division].length)];
  const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const randomAmenities = getRandomItems(validAmenities, Math.floor(Math.random() * 5) + 2);
  const bedrooms = Math.floor(Math.random() * 4) + 1;
  const bathrooms = Math.floor(Math.random() * 3) + 1;
  const floor = Math.floor(Math.random() * 10);

  return {
    title: `${bedrooms} Bedroom ${propertyType} in ${district}, ${division}`,
    description: `Beautiful ${bedrooms} bedroom ${propertyType.toLowerCase()} located in a prime area of ${district}, ${division}. Features include modern amenities and great location.`,
    address: {
      street: `Road ${Math.floor(Math.random() * 20) + 1}`,
      houseNumber: `${Math.floor(Math.random() * 100) + 1}`,
      floor,
      division,
      district,
      thana: `${district} Sadar`,
      area: `${district} Central`,
      postCode: `${Math.floor(Math.random() * 9000) + 1000}`,
      country: 'Bangladesh'
    },
    location: {
      coordinates: [90.4125 + (Math.random() - 0.5) * 2, 23.8103 + (Math.random() - 0.5) * 2]
    },
    features: {
      size: {
        value: Math.floor(Math.random() * 1000) + 500,
        unit: 'sqft'
      },
      bedrooms,
      bathrooms,
      balconies: Math.floor(Math.random() * 3),
      parking: {
        available: Math.random() > 0.5,
        type: ['none', 'car', 'bike', 'both'][Math.floor(Math.random() * 4)]
      },
      furnished: ['unfurnished', 'semi-furnished', 'fully-furnished'][Math.floor(Math.random() * 3)],
      utilities: {
        electricity: true,
        gas: Math.random() > 0.3,
        water: true,
        internet: Math.random() > 0.5,
        maintenance: Math.random() > 0.5
      },
      amenities: randomAmenities
    },
    price: {
      amount: Math.floor(Math.random() * 50000) + 10000,
      currency: 'BDT',
      negotiable: Math.random() > 0.3,
      advancePayment: Math.floor(Math.random() * 3) + 1
    },
    images: [
      {
        url: 'https://example.com/property-images/house1.jpg',
        alt: 'Property Front View',
        isPrimary: true
      },
      {
        url: 'https://example.com/property-images/interior1.jpg',
        alt: 'Property Interior',
        isPrimary: false
      }
    ],
    preferences: {
      tenantType: getRandomItems(tenantTypes, Math.floor(Math.random() * 2) + 1),
      gender: genders[Math.floor(Math.random() * genders.length)],
      maxOccupants: Math.floor(Math.random() * 4) + 2,
      petsAllowed: Math.random() > 0.7
    },
    propertyType,
    owner: userId,
    status: 'available',
    featured: Math.random() < 0.3, // 30% chance of being featured
    ratings: [],
    averageRating: 0,
    reviews: [],
    availability: {
      availableFrom: new Date(),
      minimumStay: 6,
      maximumStay: 12
    }
  };
};

const seedProperties = async () => {
  try {
    await connectDB();
    
    // Find or create a renter user
    let renter = await User.findOne({ role: 'renter' });
    if (!renter) {
      renter = await User.create({
        name: 'Sample Renter',
        email: 'renter@example.com',
        password: 'Password123!',
        role: 'renter',
        phone: '+8801712345678',
        address: 'Dhaka, Bangladesh'
      });
    }

    // Clear existing properties
    await Property.deleteMany({});

    // Generate 30 random properties
    const propertiesToInsert = Array(30)
      .fill(null)
      .map(() => generateRandomProperty(renter._id));

    // Insert properties
    await Property.insertMany(propertiesToInsert);

    console.log('Successfully seeded properties!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
};

seedProperties();
