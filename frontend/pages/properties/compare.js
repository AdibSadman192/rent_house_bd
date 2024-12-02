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
    <>
      <Head>
        <title>Property Comparison | RentHouse BD</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <Compare className="mr-3 text-blue-600" /> 
            Property Comparison
          </h1>

          {/* Search and Add Properties */}
          <div className="mb-8 relative">
            <div className="flex items-center">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search properties to compare..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <Filter className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-2 max-h-60 overflow-y-auto">
                {searchResults.map(property => (
                  <div 
                    key={property.id}
                    className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addPropertyToComparison(property)}
                  >
                    <div className="flex items-center">
                      <Image 
                        src={property.images[0]} 
                        alt={property.title}
                        width={50}
                        height={50}
                        className="rounded-md mr-3"
                      />
                      <div>
                        <p className="font-semibold">{property.title}</p>
                        <p className="text-sm text-gray-500">{property.location}</p>
                      </div>
                    </div>
                    <PlusCircle className="text-blue-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...comparedProperties, null].slice(0, 4).map((property, index) => (
              <motion.div
                key={property ? property.id : 'empty'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  ${property ? 'bg-white shadow-md rounded-lg overflow-hidden' : 'bg-gray-100 border-2 border-dashed border-gray-300'}
                  relative
                `}
              >
                {property ? (
                  <>
                    <div 
                      className="h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${property.images[0]})` }}
                    >
                      <button 
                        onClick={() => removePropertyFromComparison(property.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-2">{property.title}</h2>
                      <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                      <div className="text-xl font-bold text-blue-600">
                        ৳{property.price.toLocaleString()}/month
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <PlusCircle className="mx-auto mb-2 text-gray-300" size={48} />
                      <p>Add a property to compare</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Comparison Details */}
          {comparedProperties.length > 1 && (
            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Comparison Details</h2>
              
              {/* Key Features Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Bedrooms', feature: 'bedrooms' },
                  { label: 'Bathrooms', feature: 'bathrooms' },
                  { label: 'Area (sq.ft)', feature: 'area' },
                  { label: 'Monthly Rent', feature: 'price' }
                ].map(({ label, feature }) => {
                  const comparison = compareFeatures(feature);
                  return comparison && (
                    <div 
                      key={feature}
                      className={`
                        p-4 rounded-lg 
                        ${comparison.allSame 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-yellow-50 border-yellow-200'
                        }
                      `}
                    >
                      <h3 className="font-semibold mb-2">{label}</h3>
                      <div className="flex justify-between">
                        {comparison.values.map((value, index) => (
                          <span 
                            key={index}
                            className={`
                              font-bold 
                              ${comparison.allSame 
                                ? 'text-green-700' 
                                : 'text-yellow-700'
                              }
                            `}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                      {!comparison.allSame && (
                        <div className="text-xs text-yellow-600 mt-1">
                          Values differ between properties
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default PropertyComparison;
