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

      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
        {/* Search and Filter Section */}
        <div className="container mx-auto px-4 pt-4">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="backdrop-blur-xl bg-white rounded-lg shadow-sm p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </button>
            </div>

            {/* Filters Section */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Price Range</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Property Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}+ Beds</option>
                      ))}
                    </select>
                  </div>

                  {/* Additional Features */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Features</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.furnished}
                          onChange={(e) => handleFilterChange('furnished', e.target.checked)}
                          className="rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Furnished</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.parking}
                          onChange={(e) => handleFilterChange('parking', e.target.checked)}
                          className="rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Parking</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property) => (
              <motion.div key={property.id} variants={fadeInUp}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
