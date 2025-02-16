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

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
        {/* Search and Filter Section */}
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200/50"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by location, property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-white/50 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200/50"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Panel */}
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: showFilters ? 'auto' : 0,
                opacity: showFilters ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price Range</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:bg-white/70"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:bg-white/70"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Property Type</label>
                  <select
                    multiple
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:bg-white/70"
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', Array.from(e.target.selectedOptions, option => option.value))}
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                  <select
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:bg-white/70"
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  >
                    <option value="">Any</option>
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{num}+ Beds</option>
                    ))}
                  </select>
                </div>

                {/* Additional Filters */}
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
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.map(property => (
              <motion.div
                key={property.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="transform transition-all duration-200"
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
