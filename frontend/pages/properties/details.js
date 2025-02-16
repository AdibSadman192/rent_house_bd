import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiBed, 
  FiDollarSign, 
  FiHome, 
  FiCheckCircle, 
  FiHeart, 
  FiShare2 
} from 'react-icons/fi';
import Image from 'next/image';

const PropertyDetailsPage = () => {
  // Mock property data
  const property = {
    id: 1,
    title: 'Luxurious 3-Bedroom Apartment in Gulshan',
    location: 'Gulshan-2, Dhaka',
    price: 45000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'Apartment',
    description: `
      A stunning, fully-furnished apartment in the heart of Gulshan. 
      Perfect for professionals and families looking for a modern living space 
      with all amenities at their doorstep.
    `,
    amenities: [
      'Gym', 
      'Swimming Pool', 
      'Security', 
      'Parking', 
      'Elevator'
    ],
    images: [
      '/images/properties/property1.jpg',
      '/images/properties/property2.jpg',
      '/images/properties/property3.jpg'
    ]
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg"
        >
          {/* Image Gallery */}
          <div className="relative h-[500px] w-full">
            <Image 
              src={property.images[currentImage]} 
              alt={property.title}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-300"
            />
            
            {/* Image Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentImage === index 
                      ? 'bg-primary-600' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiMapPin />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full transition-colors ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiHeart />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gray-100 text-gray-600 rounded-full"
                >
                  <FiShare2 />
                </motion.button>
              </div>
            </div>

            {/* Property Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
                <FiDollarSign className="text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold">৳{property.price}/month</p>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
                <FiBed className="text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
                <FiHome className="text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{property.type}</p>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3">
                <FiCheckCircle className="text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-semibold">{property.area} sq.ft</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Property Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <FiCheckCircle className="text-primary-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Agent */}
            <div className="mt-8 bg-gray-100 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Interested in this Property?
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors"
              >
                Contact Agent
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
