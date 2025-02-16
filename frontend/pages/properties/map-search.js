import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiSearch, 
  FiFilter, 
  FiX 
} from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((module) => module.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((module) => module.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((module) => module.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((module) => module.Popup),
  { ssr: false }
);

const PropertyMapSearch = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]); // Dhaka center
  const [zoom, setZoom] = useState(12);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    propertyType: '',
    bedrooms: '',
    amenities: []
  });

  const mockProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      location: 'Gulshan, Dhaka',
      coordinates: [23.7957, 90.4125],
      price: 45000,
      bedrooms: 3,
      type: 'Apartment',
      amenities: ['Parking', 'Security', 'Generator']
    },
    {
      id: 2,
      title: 'Spacious House in Dhanmondi',
      location: 'Dhanmondi, Dhaka',
      coordinates: [23.7461, 90.3742],
      price: 65000,
      bedrooms: 4,
      type: 'House',
      amenities: ['Garden', 'Parking', 'Security']
    },
    {
      id: 3,
      title: 'Cozy Apartment in Banani',
      location: 'Banani, Dhaka',
      coordinates: [23.7941, 90.4020],
      price: 35000,
      bedrooms: 2,
      type: 'Apartment',
      amenities: ['Elevator', 'Security', 'Generator']
    }
  ];

  useEffect(() => {
    setProperties(mockProperties);
    setFilteredProperties(mockProperties);
  }, []);

  const applyFilters = useCallback(() => {
    const filtered = mockProperties.filter(property => {
      const matchPrice = 
        property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1];
      
      const matchType = 
        !filters.propertyType || 
        property.type === filters.propertyType;
      
      const matchBedrooms = 
        !filters.bedrooms || 
        property.bedrooms === parseInt(filters.bedrooms);
      
      const matchAmenities = 
        filters.amenities.length === 0 || 
        filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );

      return matchPrice && matchType && matchBedrooms && matchAmenities;
    });

    setFilteredProperties(filtered);
  }, [filters, mockProperties]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      propertyType: '',
      bedrooms: '',
      amenities: []
    });
    setFilteredProperties(mockProperties);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Map Filters
            </h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Reset All
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (৳)
            </label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev, 
                  priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                }))}
                className="w-1/2 p-2 bg-gray-100 rounded-xl"
                placeholder="Min"
              />
              <input 
                type="number" 
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev, 
                  priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                }))}
                className="w-1/2 p-2 bg-gray-100 rounded-xl"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <div className="grid grid-cols-3 gap-2">
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
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
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

          {/* Amenities Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Parking', 'Security', 'Generator', 'Elevator', 'Garden'].map(amenity => (
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
            </div>
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

        {/* Map and Results */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl overflow-hidden">
            {typeof window !== 'undefined' && (
              <MapContainer 
                center={mapCenter} 
                zoom={zoom} 
                style={{ height: '500px', width: '100%' }}
                whenCreated={(mapInstance) => {
                  // You can add additional map configurations here
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredProperties.map(property => (
                  <Marker 
                    key={property.id} 
                    position={property.coordinates}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{property.title}</h3>
                        <p>Price: ৳{property.price}/month</p>
                        <p>Bedrooms: {property.bedrooms}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Property List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Properties on Map ({filteredProperties.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProperties.map(property => (
                <motion.div
                  key={property.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <FiMapPin className="mr-1" /> {property.location}
                      </p>
                    </div>
                    <span className="font-bold text-primary-600">
                      ৳{property.price}/month
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <span>{property.bedrooms} Bedrooms</span>
                    <span>{property.type}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapSearch;
