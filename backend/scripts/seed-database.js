const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const faker = require('@faker-js/faker').faker;
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Bangladeshi Specific Data
const BANGLADESHI_CITIES = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
  'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
];

const DISTRICTS = {
  'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Munshiganj'],
  'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Comilla'],
  'Rajshahi': ['Rajshahi', 'Natore', 'Pabna'],
  'Khulna': ['Khulna', 'Jessore', 'Satkhira'],
  'Barishal': ['Barishal', 'Bhola', 'Patuakhali'],
  'Sylhet': ['Sylhet', 'Habiganj', 'Moulvi Bazar'],
  'Rangpur': ['Rangpur', 'Dinajpur', 'Kurigram'],
  'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona']
};

const THANAS = {
  'Dhaka': ['Mirpur', 'Dhanmondi', 'Gulshan', 'Mohammadpur', 'Uttara'],
  'Chittagong': ['Kotwali', 'Panchlaish', 'Bayazid'],
  // Add more thanas for other districts
};

const PROPERTY_TYPES = [
  'Apartment', 'House', 'Duplex', 'Studio', 
  'Villa', 'Office', 'Shop', 'Warehouse', 
  'Bachelor', 'Family', 'Sublet', 'Mess', 'Hostel'
];

const generateBangladeshiPhoneNumber = () => {
  const prefixes = ['017', '018', '019', '015', '016', '013', '014'];
  const prefix = faker.helpers.arrayElement(prefixes);
  const number = faker.string.numeric(8);
  return `+88${prefix}${number}`;
};

const generateNID = () => {
  return faker.string.numeric(10);
};

const isValidImageUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && 
           (parsedUrl.hostname === 'images.unsplash.com' || 
            parsedUrl.hostname === 'unsplash.com');
  } catch (error) {
    return false;
  }
};

const generatePropertyImages = () => {
  const imageCount = faker.number.int({min: 3, max: 6});
  const images = [];

  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  for (let i = 0; i < imageCount; i++) {
    const extension = faker.helpers.arrayElement(imageExtensions);
    images.push({
      url: `https://images.unsplash.com/photo-${faker.string.numeric(16)}.${extension}`,
      alt: `Property Image ${i + 1}`
    });
  }

  return images;
};

const generateBangladeshCoordinates = () => {
  // Geographical boundaries of Bangladesh
  const minLat = 20.670;
  const maxLat = 26.635;
  const minLon = 88.085;
  const maxLon = 92.673;

  // Generate random coordinates within Bangladesh
  const latitude = faker.number.float({
    min: minLat, 
    max: maxLat, 
    precision: 0.001
  });

  const longitude = faker.number.float({
    min: minLon, 
    max: maxLon, 
    precision: 0.001
  });

  return { latitude, longitude };
};

// Comprehensive MongoDB Connection Function
const connectDB = async (retries = 5) => {
  const MONGODB_URIS = [
    process.env.MONGODB_URI,
    'mongodb://localhost:27017/renthousebd',
    'mongodb://127.0.0.1:27017/renthousebd',
    'mongodb://0.0.0.0:27017/renthousebd'
  ].filter(Boolean);

  for (const uri of MONGODB_URIS) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔍 Attempt ${attempt}: Connecting to MongoDB at ${uri}`);
        
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000
        });

        console.log(`✅ Successfully connected to MongoDB at ${uri}`);
        return true;
      } catch (error) {
        console.error(`❌ Connection Attempt Failed (${attempt}/${retries}):`, {
          uri,
          errorName: error.name,
          errorMessage: error.message,
          errorCode: error.code
        });

        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  console.error('❌ All MongoDB connection attempts failed');
  return false;
};

const generateBookings = async (users, properties) => {
  const bookings = [];
  const bookingCount = faker.number.int({min: 20, max: 30});

  // Ensure we have enough users to create bookings
  const propertyOwners = users.filter(user => user.role === 'owner');
  const propertyRenters = users.filter(user => user.role === 'renter');

  for (let i = 0; i < bookingCount; i++) {
    // Randomly select a property
    const property = properties[Math.floor(Math.random() * properties.length)];
    
    // Find the owner of the property
    const owner = propertyOwners.find(u => u._id.toString() === property.owner.toString());
    
    // Select a random renter different from the owner
    const renter = propertyRenters[Math.floor(Math.random() * propertyRenters.length)];

    // Generate start and end dates
    const startDate = faker.date.between({
      from: new Date('2022-01-01'),
      to: new Date('2024-01-01')
    });
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + faker.number.int({min: 3, max: 12}));

    // Calculate total amount based on property price and duration
    const durationMonths = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
    const totalAmount = property.price.amount * durationMonths;
    const depositAmount = property.price.amount;

    const booking = {
      property: property._id,
      renter: renter._id,
      owner: owner._id,
      startDate,
      endDate,
      totalAmount,
      depositAmount,
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected', 'cancelled', 'completed']),
      paymentStatus: faker.helpers.arrayElement(['pending', 'partial', 'completed', 'refunded']),
      depositPaid: faker.datatype.boolean(),
      documents: generateBookingDocuments(),
      moveInDetails: generateMoveInDetails()
    };

    bookings.push(booking);
  }

  return bookings;
};

const generateBookingDocuments = () => {
  const documentCount = faker.number.int({min: 1, max: 3});
  const documents = [];

  const documentTypes = ['id', 'proof_of_income', 'rental_agreement', 'other'];

  for (let i = 0; i < documentCount; i++) {
    documents.push({
      type: faker.helpers.arrayElement(documentTypes),
      url: faker.internet.url() + '/' + faker.system.fileName(),
      verified: faker.datatype.boolean()
    });
  }

  return documents;
};

const generateMoveInDetails = () => {
  return {
    preferredTime: faker.helpers.arrayElement(['morning', 'afternoon', 'evening']),
    specialRequests: faker.lorem.sentence(),
    parkingRequired: faker.datatype.boolean(),
    movingCompany: faker.datatype.boolean() ? {
      name: faker.company.name(),
      contact: faker.phone.number()
    } : null
  };
};

const seedDatabase = async () => {
  try {
    // Ensure MongoDB connection
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});

    // Create Users
    const owners = [];
    const renters = [];

    // Create Owners
    for (let i = 0; i < 10; i++) {
      const owner = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('OwnerPass123!', 10),
        phone: generateBangladeshiPhoneNumber(),
        nid: generateNID(),
        role: 'owner',
        address: `${faker.location.streetAddress()}, ${BANGLADESHI_CITIES[Math.floor(Math.random() * BANGLADESHI_CITIES.length)]}`
      });
      await owner.save();
      owners.push(owner);
    }

    // Create Renters
    for (let i = 0; i < 20; i++) {
      const renter = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('RenterPass123!', 10),
        phone: generateBangladeshiPhoneNumber(),
        nid: generateNID(),
        role: 'renter',
        address: `${faker.location.streetAddress()}, ${BANGLADESHI_CITIES[Math.floor(Math.random() * BANGLADESHI_CITIES.length)]}`
      });
      await renter.save();
      renters.push(renter);
    }

    // Create Properties
    const properties = [];
    for (let i = 0; i < 50; i++) {
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const coordinates = generateBangladeshCoordinates();
      const division = BANGLADESHI_CITIES[Math.floor(Math.random() * BANGLADESHI_CITIES.length)];

      const property = new Property({
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        address: {
          street: faker.location.streetAddress(),
          houseNumber: faker.number.int({min: 1, max: 500}).toString(),
          floor: faker.number.int({min: 0, max: 20}),
          division: division,
          district: DISTRICTS[division][Math.floor(Math.random() * DISTRICTS[division].length)],
          thana: 'Central',
          area: `${division} Area`,
          postCode: faker.number.int({min: 1000, max: 9999}).toString(),
          country: 'Bangladesh'
        },
        owner: owner._id,
        propertyType: faker.helpers.arrayElement(['Apartment', 'House', 'Duplex', 'Studio', 'Villa']),
        location: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude]
        },
        price: {
          amount: faker.number.int({min: 5000, max: 100000}),
          currency: 'BDT',
          negotiable: faker.datatype.boolean(),
          advancePayment: faker.number.int({min: 10000, max: 50000})
        },
        status: faker.helpers.arrayElement(['available', 'rented', 'maintenance', 'inactive']),
        features: {
          size: {
            value: faker.number.int({min: 500, max: 5000}),
            unit: faker.helpers.arrayElement(['sqft', 'katha', 'bigha'])
          },
          bedrooms: faker.number.int({min: 1, max: 5}),
          bathrooms: faker.number.int({min: 1, max: 3}),
          balconies: faker.number.int({min: 0, max: 2}),
          parking: {
            available: faker.datatype.boolean(),
            type: faker.helpers.arrayElement(['car', 'bike', 'both', 'none'])
          },
          furnished: faker.helpers.arrayElement(['unfurnished', 'semi-furnished', 'fully-furnished']),
          utilities: {
            electricity: faker.datatype.boolean(),
            gas: faker.datatype.boolean(),
            water: faker.datatype.boolean()
          }
        },
        images: generatePropertyImages()
      });
      await property.save();
      properties.push(property);
    }

    // Create Bookings
    const bookings = await generateBookings([...owners, ...renters], properties);
    for (const booking of bookings) {
      const newBooking = new Booking(booking);
      await newBooking.save();
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the seeding script
seedDatabase();
