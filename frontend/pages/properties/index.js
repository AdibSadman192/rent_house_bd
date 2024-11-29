import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    propertyType: [],
    bedrooms: '',
    bathrooms: '',
    area: [0, 5000],
    furnished: false,
    parking: false,
  });

  // Sample properties data (will be replaced with API data)
  const properties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      location: 'Gulshan 2, Dhaka',
      price: 45000,
      images: ['/images/properties/apartment1.jpg'],
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      type: 'Apartment',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Luxury Villa in Banani',
      location: 'Banani DOHS, Dhaka',
      price: 85000,
      images: ['/images/properties/villa1.jpg'],
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      type: 'Villa',
      isFeatured: true
    },
    // Add more sample properties...
  ];

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Studio', 'Office'];
  const locations = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara'];

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Head>
        <title>Search Properties - RentHouse BD</title>
        <meta 
          name="description" 
          content="Search and filter through thousands of rental properties across Bangladesh." 
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              <motion.h1
                variants={fadeInUp}
                className="text-3xl font-display font-bold text-gray-900 mb-6"
              >
                Find Your Perfect Rental Property
              </motion.h1>

              {/* Search Bar */}
              <motion.div variants={fadeInUp} className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by location, property type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>
              </motion.div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        value={filters.propertyType}
                        onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">All Types</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.priceRange[0]}
                          onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                          className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.priceRange[1]}
                          onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                          className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <select
                        value={filters.bedrooms}
                        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Any</option>
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}+ Beds</option>
                        ))}
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <select
                        value={filters.bathrooms}
                        onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Any</option>
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}+ Baths</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="mt-4 flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.furnished}
                        onChange={(e) => handleFilterChange('furnished', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Furnished</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.parking}
                        onChange={(e) => handleFilterChange('parking', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Parking Available</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
