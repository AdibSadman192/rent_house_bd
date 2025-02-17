import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Filter as FilterIcon,
  MapPin,
  Bed,
  Bath,
  Square,
} from 'lucide-react';
import Image from 'next/image';
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

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const applyFilters = useCallback(() => {
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
  }, [filters, properties]);
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentFilter = prev[filterType];
      const newFilter = currentFilter.includes(value)
        ? currentFilter.filter(item => item !== value)
        : [...currentFilter, value];
      
      return { ...prev, [filterType]: newFilter };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FilterIcon className="h-8 w-8 text-primary-500" />
              Advanced Property Search
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-1 space-y-6"
            >
              {/* Filter Sections */}
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50 space-y-6">
                {/* Property Type */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Property Type</h3>
                  <div className="space-y-2">
                    {availableFilters.types.map((type) => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={(e) => {
                            const updatedTypes = e.target.checked
                              ? [...filters.type, type]
                              : filters.type.filter((t) => t !== type);
                            setFilters({ ...filters, type: updatedTypes });
                          }}
                          className="rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Minimum (৳)</label>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Maximum (৳)</label>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Bedrooms</label>
                      <select
                        multiple
                        value={filters.bedrooms}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                          setFilters({ ...filters, bedrooms: values });
                        }}
                        className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}+ Beds</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Bathrooms</label>
                      <select
                        multiple
                        value={filters.bathrooms}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                          setFilters({ ...filters, bathrooms: values });
                        }}
                        className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}+ Baths</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Area Range */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Area (sqft)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Minimum</label>
                      <input
                        type="number"
                        value={filters.minArea}
                        onChange={(e) => setFilters({ ...filters, minArea: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Maximum</label>
                      <input
                        type="number"
                        value={filters.maxArea}
                        onChange={(e) => setFilters({ ...filters, maxArea: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                  <div className="space-y-2">
                    {availableFilters.locations.map((loc) => (
                      <label key={loc} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(loc)}
                          onChange={(e) => {
                            const updatedLocations = e.target.checked
                              ? [...filters.location, loc]
                              : filters.location.filter((l) => l !== loc);
                            setFilters({ ...filters, location: updatedLocations });
                          }}
                          className="rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
                  <div className="space-y-2">
                    {availableFilters.amenities.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={(e) => {
                            const updatedAmenities = e.target.checked
                              ? [...filters.amenities, amenity]
                              : filters.amenities.filter((a) => a !== amenity);
                            setFilters({ ...filters, amenities: updatedAmenities });
                          }}
                          className="rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Grid */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="lg:col-span-3 space-y-6"
            >
              {/* Results Header */}
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filteredProperties.length} Properties Found
                  </h2>
                  <div className="flex items-center space-x-4">
                    <select
                      className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      <option>Sort by: Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    variants={fadeInUp}
                    className="backdrop-blur-xl bg-white/70 rounded-2xl border border-gray-200/50 overflow-hidden transition-all duration-200 hover:shadow-lg"
                  >
                    <Link href={`/properties/${property.id}`}>
                      <div className="relative h-48">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{property.location}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Square className="h-4 w-4 mr-1" />
                            <span>{property.area} sqft</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-primary-600">
                            ৳{property.price.toLocaleString()}/month
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedPropertyFilter;
