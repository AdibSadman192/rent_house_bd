// Bangladesh divisions
const divisions = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Sylhet',
  'Rangpur',
  'Mymensingh'
];

// Popular areas by division
const areasByDivision = {
  Dhaka: [
    'Gulshan',
    'Banani',
    'Dhanmondi',
    'Uttara',
    'Bashundhara',
    'Mirpur',
    'Mohammadpur',
    'Motijheel',
    'Baridhara',
    'Niketan',
    'Tejgaon',
    'Rampura',
    'Badda',
    'Khilgaon'
  ],
  Chittagong: [
    'Agrabad',
    'Nasirabad',
    'Khulshi',
    'GEC Circle',
    'Chawkbazar',
    'Patenga',
    'Halishahar'
  ],
  Sylhet: [
    'Zindabazar',
    'Upashahar',
    'Amberkhana',
    'Shibganj',
    'Tilagor'
  ],
  Rajshahi: [
    'Shaheb Bazar',
    'Uposhohor',
    'Kazla',
    'Vodra'
  ],
  Khulna: [
    'Boyra',
    'Sonadanga',
    'Khalishpur',
    'Daulatpur'
  ],
  Barisal: [
    'Sadar Road',
    'Nattullabad',
    'Rupatoli',
    'Amtala'
  ],
  Rangpur: [
    'Modern More',
    'Dhap',
    'Jahaj Company More',
    'Shapla Chottor'
  ],
  Mymensingh: [
    'Ganginar Par',
    'Chorpara',
    'Valuka',
    'Muktagacha'
  ]
};

// Property types common in Bangladesh
const propertyTypes = [
  {
    type: 'Apartment',
    description: 'Modern living spaces in residential buildings',
    priceRange: { min: 15000, max: 150000 }
  },
  {
    type: 'Family House',
    description: 'Independent houses perfect for families',
    priceRange: { min: 25000, max: 200000 }
  },
  {
    type: 'Bachelor Mess',
    description: 'Shared accommodations for single professionals',
    priceRange: { min: 5000, max: 15000 }
  },
  {
    type: 'Sublet',
    description: 'Temporary rental arrangements',
    priceRange: { min: 8000, max: 25000 }
  },
  {
    type: 'Duplex',
    description: 'Two-story apartments with modern amenities',
    priceRange: { min: 35000, max: 250000 }
  },
  {
    type: 'Studio Apartment',
    description: 'Compact living spaces for individuals',
    priceRange: { min: 12000, max: 40000 }
  },
  {
    type: 'Penthouse',
    description: 'Luxury apartments on top floors',
    priceRange: { min: 80000, max: 500000 }
  },
  {
    type: 'Villa',
    description: 'Exclusive independent houses with premium features',
    priceRange: { min: 100000, max: 1000000 }
  }
];

// Common amenities in Bangladesh with icons and descriptions
const amenities = [
  {
    name: 'Generator',
    icon: 'ElectricBolt',
    description: '24/7 power backup'
  },
  {
    name: 'Lift',
    icon: 'Elevator',
    description: 'Modern elevator service'
  },
  {
    name: 'Security',
    icon: 'Security',
    description: '24/7 security service'
  },
  {
    name: 'Parking',
    icon: 'LocalParking',
    description: 'Dedicated parking space'
  },
  {
    name: 'Gas Connection',
    icon: 'LocalFireDepartment',
    description: 'Direct gas line connection'
  },
  {
    name: 'CCTV',
    icon: 'Videocam',
    description: 'Security camera surveillance'
  },
  {
    name: 'Water Reserve',
    icon: 'Water',
    description: 'Underground water tank'
  },
  {
    name: 'Internet',
    icon: 'Wifi',
    description: 'High-speed internet ready'
  },
  {
    name: 'Gym',
    icon: 'FitnessCenter',
    description: 'Fitness center access'
  },
  {
    name: 'Swimming Pool',
    icon: 'Pool',
    description: 'Access to swimming pool'
  },
  {
    name: 'Garden',
    icon: 'Yard',
    description: 'Landscaped garden area'
  },
  {
    name: 'Prayer Room',
    icon: 'Place',
    description: 'Dedicated prayer space'
  }
];

// Sample property images
const sampleImages = [
  '/images/properties/property1.jpg',
  '/images/properties/property2.jpg',
  '/images/properties/property3.jpg',
  '/images/properties/property4.jpg',
  '/images/properties/property5.jpg'
];

// Generate random price based on property type
const generateRandomPrice = (propertyType) => {
  const type = propertyTypes.find(t => t.type === propertyType);
  const { min, max } = type.priceRange;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Get random areas based on division
const getAreasForDivision = (division) => {
  return areasByDivision[division] || areasByDivision['Dhaka'];
};

// Generate random featured properties
export const generateFeaturedProperties = (count = 8) => {
  const properties = [];
  for (let i = 0; i < count; i++) {
    const division = divisions[Math.floor(Math.random() * divisions.length)];
    const areas = getAreasForDivision(division);
    const area = areas[Math.floor(Math.random() * areas.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const imageIndex = Math.floor(Math.random() * sampleImages.length);

    // Select 3-6 random amenities
    const propertyAmenities = [...amenities]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 3);

    // Generate realistic room numbers based on property type
    const beds = propertyType.type === 'Studio Apartment' ? 1 :
                propertyType.type === 'Bachelor Mess' ? Math.floor(Math.random() * 2) + 1 :
                Math.floor(Math.random() * 4) + 2;

    const baths = Math.max(1, Math.floor(beds * 0.75));

    // Generate realistic size based on property type and beds
    const baseSize = propertyType.type === 'Studio Apartment' ? 450 :
                    propertyType.type === 'Bachelor Mess' ? 600 :
                    propertyType.type === 'Penthouse' ? 2000 :
                    propertyType.type === 'Villa' ? 3000 : 1000;
    
    const size = baseSize + (beds * 200) + Math.floor(Math.random() * 500);

    properties.push({
      id: i + 1,
      title: `${propertyType.type} in ${area}`,
      description: propertyType.description,
      location: `${area}, ${division}`,
      price: generateRandomPrice(propertyType.type),
      image: sampleImages[imageIndex],
      type: propertyType.type,
      amenities: propertyAmenities,
      size: size,
      beds: beds,
      baths: baths,
      available: Math.random() > 0.3, // 70% properties are available
      featured: Math.random() > 0.7, // 30% properties are featured
      verified: Math.random() > 0.2, // 80% properties are verified
    });
  }
  return properties;
};

// Export functions and data
export const getPopularAreas = (division) => division ? getAreasForDivision(division) : 
  Object.values(areasByDivision).flat();
export const getDivisions = () => divisions;
export const getPropertyTypes = () => propertyTypes;
export const getAmenities = () => amenities;
export const getPriceRanges = () => [
  { label: 'Below ৳10,000', value: [0, 10000] },
  { label: '৳10,000 - ৳20,000', value: [10000, 20000] },
  { label: '৳20,000 - ৳35,000', value: [20000, 35000] },
  { label: '৳35,000 - ৳50,000', value: [35000, 50000] },
  { label: '৳50,000 - ৳100,000', value: [50000, 100000] },
  { label: 'Above ৳100,000', value: [100000, 1000000] }
];
