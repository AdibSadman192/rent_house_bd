const samplePosts = [
  {
    title: "Modern 3 BHK Apartment in Gulshan",
    description: "Beautifully furnished 3-bedroom apartment with modern amenities. Perfect for families. Located in a quiet neighborhood with easy access to shopping centers and restaurants.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.4152, 23.7925] // Gulshan
      },
      address: {
        street: "Road 103",
        area: "Gulshan",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1212"
      },
      formattedAddress: "Road 103, Gulshan 2, Dhaka 1212"
    },
    price: {
      amount: 45000,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        caption: "Living Room",
        isMain: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
        caption: "Kitchen"
      }
    ],
    propertyType: "Apartment",
    amenities: ["Furnished", "AC", "Hot Water", "Parking", "Security", "Generator"],
    preferences: {
      gender: "Any",
      tenantType: "Family",
      maxOccupants: 5
    }
  },
  {
    title: "Bachelor's Paradise in Mohammadpur",
    description: "Cozy 2-room setup perfect for bachelors. Near BUET and Dhaka University. All utilities included.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.3596, 23.7577] // Mohammadpur
      },
      address: {
        street: "Shahjahan Road",
        area: "Mohammadpur",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1207"
      },
      formattedAddress: "Shahjahan Road, Mohammadpur, Dhaka 1207"
    },
    price: {
      amount: 15000,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb",
        caption: "Room View",
        isMain: true
      }
    ],
    propertyType: "Room",
    amenities: ["Furnished", "Internet", "Water"],
    preferences: {
      gender: "Male",
      tenantType: "Bachelor",
      maxOccupants: 2
    }
  },
  {
    title: "Student Hostel near North South University",
    description: "Female student hostel with all facilities. Safe and secure environment. Walking distance to NSU.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.4219, 23.8151] // Bashundhara
      },
      address: {
        street: "Block D",
        area: "Bashundhara R/A",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1229"
      },
      formattedAddress: "Block D, Bashundhara R/A, Dhaka 1229"
    },
    price: {
      amount: 8000,
      negotiable: false
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
        caption: "Hostel Front",
        isMain: true
      }
    ],
    propertyType: "Hostel",
    amenities: ["Furnished", "Internet", "Water", "Security", "CCTV"],
    preferences: {
      gender: "Female",
      tenantType: "Student",
      maxOccupants: 1
    }
  },
  {
    title: "Affordable Mess at Mirpur DOHS",
    description: "Shared accommodation for working professionals. Clean and well-maintained with dedicated dining space.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.3742, 23.8361] // Mirpur DOHS
      },
      address: {
        street: "Road 3",
        area: "Mirpur DOHS",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1216"
      },
      formattedAddress: "Road 3, Mirpur DOHS, Dhaka 1216"
    },
    price: {
      amount: 6500,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
        caption: "Room",
        isMain: true
      }
    ],
    propertyType: "Mess",
    amenities: ["Furnished", "Internet", "Water", "Gas"],
    preferences: {
      gender: "Male",
      tenantType: "Bachelor",
      maxOccupants: 1
    }
  },
  {
    title: "Luxury Family Apartment in Dhanmondi",
    description: "Spacious 4-bedroom apartment with lake view. Premium location near Dhanmondi Lake.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.3733, 23.7461] // Dhanmondi
      },
      address: {
        street: "Road 27",
        area: "Dhanmondi",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1209"
      },
      formattedAddress: "Road 27, Dhanmondi, Dhaka 1209"
    },
    price: {
      amount: 65000,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        caption: "Living Area",
        isMain: true
      }
    ],
    propertyType: "Apartment",
    amenities: ["Furnished", "AC", "Hot Water", "Parking", "Security", "Generator", "Elevator"],
    preferences: {
      gender: "Any",
      tenantType: "Family",
      maxOccupants: 6
    }
  },
  {
    title: "Student Apartment Share in Uttara",
    description: "Looking for female students to share a fully furnished 3-bedroom apartment. Each room has attached bathroom. Common study area and kitchen. 24/7 security.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.3995, 23.8759] // Uttara
      },
      address: {
        street: "Sector 13",
        area: "Uttara",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1230"
      },
      formattedAddress: "Sector 13, Uttara, Dhaka 1230"
    },
    price: {
      amount: 12000,
      negotiable: false
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
        caption: "Study Area",
        isMain: true
      }
    ],
    propertyType: "Shared Apartment",
    amenities: ["Furnished", "AC", "Internet", "Study Room", "Security", "CCTV"],
    preferences: {
      gender: "Female",
      tenantType: "Student",
      maxOccupants: 3
    }
  },
  {
    title: "Premium Bachelor Flat in Banani",
    description: "Exclusive bachelor flat in prime location. Fully furnished with modern amenities. Perfect for young professionals. Close to restaurants and shopping areas.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.4043, 23.7937] // Banani
      },
      address: {
        street: "Road 12",
        area: "Banani",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1213"
      },
      formattedAddress: "Road 12, Banani, Dhaka 1213"
    },
    price: {
      amount: 35000,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        caption: "Living Space",
        isMain: true
      }
    ],
    propertyType: "Apartment",
    amenities: ["Furnished", "AC", "Internet", "Gym", "Parking", "Security"],
    preferences: {
      gender: "Male",
      tenantType: "Professional",
      maxOccupants: 2
    }
  },
  {
    title: "Family House with Garden in Uttara",
    description: "Beautiful 4-bedroom house with garden space. Perfect for families. Quiet neighborhood with good schools nearby. Separate servant quarter.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.3897, 23.8683] // Uttara
      },
      address: {
        street: "Sector 4",
        area: "Uttara",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1230"
      },
      formattedAddress: "Sector 4, Uttara, Dhaka 1230"
    },
    price: {
      amount: 55000,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        caption: "House Front",
        isMain: true
      }
    ],
    propertyType: "House",
    amenities: ["Garden", "Servant Quarter", "Garage", "Generator", "Security", "CCTV"],
    preferences: {
      gender: "Any",
      tenantType: "Family",
      maxOccupants: 7
    }
  },
  {
    title: "Affordable Student Mess in Mohammadpur",
    description: "Budget-friendly mess for male students. Near Jahangirnagar University. All utilities included. Meal service available.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.3586, 23.7557] // Mohammadpur
      },
      address: {
        street: "Tajmahal Road",
        area: "Mohammadpur",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1207"
      },
      formattedAddress: "Tajmahal Road, Mohammadpur, Dhaka 1207"
    },
    price: {
      amount: 5500,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
        caption: "Room",
        isMain: true
      }
    ],
    propertyType: "Mess",
    amenities: ["Internet", "Water", "Gas", "Study Table", "Common Room"],
    preferences: {
      gender: "Male",
      tenantType: "Student",
      maxOccupants: 1
    }
  },
  {
    title: "Sublet Available in Mirpur 10",
    description: "Single room available for sublet in a 3-bedroom apartment. Short-term rental welcome. All bills included.",
    location: {
      coordinates: {
        type: "Point",
        coordinates: [90.3673, 23.8071] // Mirpur 10
      },
      address: {
        street: "Section 10",
        area: "Mirpur",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1216"
      },
      formattedAddress: "Section 10, Mirpur, Dhaka 1216"
    },
    price: {
      amount: 7000,
      negotiable: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9",
        caption: "Bedroom",
        isMain: true
      }
    ],
    propertyType: "Sublet",
    amenities: ["Furnished", "Internet", "Water", "Gas"],
    preferences: {
      gender: "Any",
      tenantType: "Any",
      maxOccupants: 2
    }
  }
];

module.exports = samplePosts;
