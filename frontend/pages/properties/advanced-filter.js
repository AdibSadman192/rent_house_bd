import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiMapPin, 
  FiDollarSign, 
  FiHome,
  FiFilter,
  FiX,
  FiChevronDown,
  FiHeart,
  FiBed,
  FiBath,
  FiMaximize2,
  FiSliders
} from 'react-icons/fi';
import PropertyCard from '@/components/properties/PropertyCard';
import RangeSlider from '@/components/ui/RangeSlider';

const AdvancedPropertyFilter = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: [0, 5000],
    location: '',
    amenities: [],
    features: []
  });

  const [expandedSections, setExpandedSections] = useState({
    price: false,
    type: false,
    rooms: false,
    area: false,
    location: false,
    amenities: false
  });

  const mockProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      price: 45000,
      location: 'Gulshan, Dhaka',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      type: 'Apartment',
      amenities: ['Parking', 'Security', 'Generator', 'Elevator'],
      features: ['Balcony', 'City View']
    },
    {
      id: 2,
      title: 'Spacious House in Dhanmondi',
      price: 65000,
      location: 'Dhanmondi, Dhaka',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      type: 'House',
      amenities: ['Garden', 'Parking', 'Security', 'Generator'],
      features: ['Private Garden', 'Terrace']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyFilters = () => {
    const filteredProperties = mockProperties.filter(property => {
      const matchPrice = 
        property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1];
      
      const matchType = 
        !filters.propertyType || 
        property.type === filters.propertyType;
      
      const matchBedrooms = 
        !filters.bedrooms || 
        property.bedrooms === parseInt(filters.bedrooms);
      
      const matchBathrooms = 
        !filters.bathrooms || 
        property.bathrooms === parseInt(filters.bathrooms);
      
      const matchArea = 
        property.area >= filters.area[0] && 
        property.area <= filters.area[1];
      
      const matchLocation = 
        !filters.location || 
        property.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchAmenities = 
        filters.amenities.length === 0 || 
        filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
      
      const matchFeatures = 
        filters.features.length === 0 || 
        filters.features.every(feature => 
          property.features.includes(feature)
        );

      return matchPrice && 
             matchType && 
             matchBedrooms && 
             matchBathrooms && 
             matchArea && 
             matchLocation && 
             matchAmenities && 
             matchFeatures;
    });

    setProperties(filteredProperties);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      area: [0, 5000],
      location: '',
      amenities: [],
      features: []
    });
    setProperties(mockProperties);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Advanced Filters
            </h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Reset All
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <div 
              onClick={() => toggleSection('price')}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
              <FiChevronDown 
                className={`transform transition-transform ${
                  expandedSections.price ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <AnimatePresence>
              {expandedSections.price && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <RangeSlider
                    min={0}
                    max={100000}
                    step={1000}
                    value={filters.priceRange}
                    onChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>৳{filters.priceRange[0]}</span>
                    <span>৳{filters.priceRange[1]}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Property Type */}
          <div className="mb-6">
            <div 
              onClick={() => toggleSection('type')}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">Property Type</h3>
              <FiChevronDown 
                className={`transform transition-transform ${
                  expandedSections.type ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <AnimatePresence>
              {expandedSections.type && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-3 gap-2 mt-4"
                >
                  {['Apartment', 'House', 'Duplex'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        propertyType: prev.propertyType === type ? '' : type 
                      }))}
                      className={`py-2 rounded-xl transition-colors ${
                        filters.propertyType === type
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rooms and Bathrooms */}
          <div className="mb-6">
            <div 
              onClick={() => toggleSection('rooms')}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
              <FiChevronDown 
                className={`transform transition-transform ${
                  expandedSections.rooms ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <AnimatePresence>
              {expandedSections.rooms && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">Bedrooms</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => setFilters(prev => ({ 
                            ...prev, 
                            bedrooms: prev.bedrooms === num.toString() ? '' : num.toString() 
                          }))}
                          className={`py-2 rounded-xl transition-colors ${
                            filters.bedrooms === num.toString()
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">Bathrooms</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => setFilters(prev => ({ 
                            ...prev, 
                            bathrooms: prev.bathrooms === num.toString() ? '' : num.toString() 
                          }))}
                          className={`py-2 rounded-xl transition-colors ${
                            filters.bathrooms === num.toString()
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Area Range */}
          <div className="mb-6">
            <div 
              onClick={() => toggleSection('area')}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">Area (sq.ft)</h3>
              <FiChevronDown 
                className={`transform transition-transform ${
                  expandedSections.area ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <AnimatePresence>
              {expandedSections.area && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <RangeSlider
                    min={0}
                    max={5000}
                    step={100}
                    value={filters.area}
                    onChange={(value) => setFilters(prev => ({ ...prev, area: value }))}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{filters.area[0]} sq.ft</span>
                    <span>{filters.area[1]} sq.ft</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div 
              onClick={() => toggleSection('location')}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              <FiChevronDown 
                className={`transform transition-transform ${
                  expandedSections.location ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <AnimatePresence>
              {expandedSections.location && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <input 
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <div 
              onClick={() => toggleSection('amenities')}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
              <FiChevronDown 
                className={`transform transition-transform ${
                  expandedSections.amenities ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <AnimatePresence>
              {expandedSections.amenities && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-2 mt-4"
                >
                  {['Parking', 'Security', 'Generator', 'Elevator', 'Garden', 'Gym'].map(amenity => (
                    <label 
                      key={amenity} 
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input 
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          amenities: prev.amenities.includes(amenity)
                            ? prev.amenities.filter(a => a !== amenity)
                            : [...prev.amenities, amenity]
                        }))}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={applyFilters}
            className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            Apply Filters
          </motion.button>
        </div>

        {/* Search Results */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results ({properties.length})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl p-2">
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Area: Low to High</option>
                <option>Area: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p>No properties found matching your filters.</p>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { 
                    delayChildren: 0.2,
                    staggerChildren: 0.1 
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {properties.map(property => (
                <motion.div
                  key={property.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedPropertyFilter;
