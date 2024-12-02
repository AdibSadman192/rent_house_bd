import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Filter as FilterIcon,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Check,
  Sliders,
} from 'lucide-react';

const AdvancedPropertyFilter = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    type: [],
    minPrice: 0,
    maxPrice: 100000,
    bedrooms: [],
    bathrooms: [],
    minArea: 0,
    maxArea: 5000,
    amenities: [],
    location: [],
  });

  const [availableFilters, setAvailableFilters] = useState({
    types: ['Apartment', 'House', 'Studio', 'Duplex'],
    locations: ['Gulshan', 'Dhanmondi', 'Banani', 'Mirpur', 'Uttara'],
    amenities: [
      'WiFi', 'AC', 'Parking', 'Elevator', 'Gym', 
      'Swimming Pool', 'Security', 'Balcony', 'Kitchen'
    ]
  });

  useEffect(() => {
    // Fetch properties with full details
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties/advanced-filter');
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const applyFilters = () => {
    let result = properties;

    // Type filter
    if (filters.type.length > 0) {
      result = result.filter(prop => filters.type.includes(prop.type));
    }

    // Price filter
    result = result.filter(prop => 
      prop.price >= filters.minPrice && 
      prop.price <= filters.maxPrice
    );

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      result = result.filter(prop => filters.bedrooms.includes(prop.bedrooms));
    }

    // Bathrooms filter
    if (filters.bathrooms.length > 0) {
      result = result.filter(prop => filters.bathrooms.includes(prop.bathrooms));
    }

    // Area filter
    result = result.filter(prop => 
      prop.area >= filters.minArea && 
      prop.area <= filters.maxArea
    );

    // Location filter
    if (filters.location.length > 0) {
      result = result.filter(prop => 
        filters.location.some(loc => prop.location.includes(loc))
      );
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      result = result.filter(prop => 
        filters.amenities.every(amenity => prop.amenities.includes(amenity))
      );
    }

    setFilteredProperties(result);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentFilter = prev[filterType];
      const newFilter = currentFilter.includes(value)
        ? currentFilter.filter(item => item !== value)
        : [...currentFilter, value];
      
      return { ...prev, [filterType]: newFilter };
    });
  };

  const renderFilterSection = (title, options, filterType) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {options.map(option => (
          <label 
            key={option} 
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters[filterType].includes(option)}
              onChange={() => handleFilterChange(filterType, option)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Advanced Property Filter | RentHouse BD</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <FilterIcon className="mr-3 text-blue-600" /> 
              Advanced Property Filter
            </h1>
            <button 
              onClick={applyFilters}
              className="btn btn-primary flex items-center"
            >
              <Sliders className="mr-2" /> Apply Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="bg-white shadow-md rounded-lg p-6">
              {renderFilterSection('Property Type', availableFilters.types, 'type')}
              
              {renderFilterSection('Location', availableFilters.locations, 'location')}
              
              {renderFilterSection('Amenities', availableFilters.amenities, 'amenities')}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                      className="block w-full pl-10 border rounded-md"
                    />
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="block w-full pl-10 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Bedrooms</h3>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map(beds => (
                    <button
                      key={beds}
                      onClick={() => handleFilterChange('bedrooms', beds)}
                      className={`
                        px-3 py-1 rounded-md
                        ${filters.bedrooms.includes(beds) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}
                    >
                      {beds}+ Beds
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Area Range (sq.ft)</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min Area"
                    value={filters.minArea}
                    onChange={(e) => setFilters(prev => ({ ...prev, minArea: Number(e.target.value) }))}
                    className="block w-full border rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Max Area"
                    value={filters.maxArea}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxArea: Number(e.target.value) }))}
                    className="block w-full border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${property.images[0]})` }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                      <div className="flex items-center mb-2">
                        <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                        <span>{property.location}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="flex items-center">
                          <Bed className="mr-1 h-4 w-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="mr-1 h-4 w-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="mr-1 h-4 w-4" />
                          <span>{property.area} sqft</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-blue-600">
                          ৳{property.price.toLocaleString()}/month
                        </div>
                        <Link 
                          href={`/properties/${property.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <p className="text-xl text-gray-600">No properties found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdvancedPropertyFilter;
