import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Compare,
  Home,
  Bed,
  Bath,
  Square,
  Check,
  X,
  Filter,
  PlusCircle
} from 'lucide-react';

const PropertyComparison = () => {
  const [properties, setProperties] = useState([]);
  const [comparedProperties, setComparedProperties] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch available properties for comparison
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    // Filter properties based on search term
    if (searchTerm) {
      const filtered = properties.filter(prop => 
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, properties]);

  const addPropertyToComparison = (property) => {
    if (comparedProperties.length < 4 && 
        !comparedProperties.some(p => p.id === property.id)) {
      setComparedProperties([...comparedProperties, property]);
    }
  };

  const removePropertyFromComparison = (propertyId) => {
    setComparedProperties(
      comparedProperties.filter(prop => prop.id !== propertyId)
    );
  };

  const compareFeatures = (feature) => {
    if (comparedProperties.length < 2) return null;
    
    const values = comparedProperties.map(prop => prop[feature]);
    const allSame = values.every(val => val === values[0]);
    
    return {
      values,
      allSame
    };
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
              <Compare className="h-8 w-8 text-primary-500" />
              Compare Properties
            </h1>
          </div>

          {/* Search Properties */}
          <motion.div
            variants={fadeInUp}
            className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50 mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties to compare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
              <Filter className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-2"
              >
                {searchResults.map((property) => (
                  <motion.div
                    key={property.id}
                    className="backdrop-blur-xl bg-white/50 rounded-xl p-4 border border-gray-200/50 flex items-center justify-between hover:bg-white/70 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addPropertyToComparison(property)}
                      disabled={comparedProperties.length >= 4}
                      className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add to Compare</span>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Comparison Table */}
          {comparedProperties.length > 0 ? (
            <motion.div
              variants={fadeInUp}
              className="backdrop-blur-xl bg-white/70 rounded-2xl border border-gray-200/50 overflow-hidden"
            >
              {/* Property Headers */}
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200/50">
                {comparedProperties.map((property) => (
                  <div key={property.id} className="relative p-6">
                    <button
                      onClick={() => removePropertyFromComparison(property.id)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <p className="text-gray-600">{property.location}</p>
                    <div className="text-xl font-bold text-primary-600 mt-2">
                      ৳{property.price.toLocaleString()}/month
                    </div>
                  </div>
                ))}
                {Array.from({ length: 4 - comparedProperties.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="p-6 flex items-center justify-center border-l border-gray-200/50"
                  >
                    <div className="text-center text-gray-400">
                      <PlusCircle className="h-12 w-12 mx-auto mb-2" />
                      <p>Add Property</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-gray-200/50">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  {comparedProperties.map((property) => (
                    <div key={property.id} className="p-6 space-y-4 border-l border-gray-200/50">
                      <div className="flex items-center space-x-2">
                        <Bed className="h-5 w-5 text-primary-500" />
                        <span>{property.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bath className="h-5 w-5 text-primary-500" />
                        <span>{property.bathrooms} Bathrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Square className="h-5 w-5 text-primary-500" />
                        <span>{property.area} sqft</span>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: 4 - comparedProperties.length }).map((_, index) => (
                    <div key={`empty-info-${index}`} className="p-6 border-l border-gray-200/50" />
                  ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  {comparedProperties.map((property) => (
                    <div key={property.id} className="p-6 space-y-3 border-l border-gray-200/50">
                      <h4 className="font-semibold text-gray-900">Features</h4>
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-primary-500" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  {Array.from({ length: 4 - comparedProperties.length }).map((_, index) => (
                    <div key={`empty-features-${index}`} className="p-6 border-l border-gray-200/50" />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeInUp}
              className="backdrop-blur-xl bg-white/70 rounded-2xl p-12 border border-gray-200/50 text-center"
            >
              <Compare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Start Comparing Properties</h2>
              <p className="text-gray-600">
                Search and add up to 4 properties to compare their features side by side
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyComparison;
