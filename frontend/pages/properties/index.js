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
        <title>Properties | RentHouse BD</title>
        <meta name="description" content="Browse rental properties across Bangladesh" />
      </Head>

      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        {/* Search and Filter Section */}
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by location, property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
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
