import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Users, Shield, ArrowRight, Star, Home, Key, BadgeCheck, Bed, Bath, Clock, ChevronDown, Sliders, DollarSign } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import { AnimatePresence } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleUp = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const featuredProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      location: 'Gulshan 2, Dhaka',
      price: 45000,
      image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
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
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      type: 'Villa',
      isFeatured: true
    },
    {
      id: 3,
      title: 'Cozy Studio in Dhanmondi',
      location: 'Dhanmondi 27, Dhaka',
      price: 25000,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      type: 'Studio',
      isFeatured: true
    }
  ];

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find your perfect property with our advanced search filters'
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'All properties are verified for your peace of mind'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our support team is always here to help you'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Listings' },
    { number: '50K+', label: 'Happy Tenants' },
    { number: '1000+', label: 'Property Owners' },
    { number: '100+', label: 'Cities Covered' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600"
            >
              Find Your Perfect Home in Bangladesh
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8"
            >
              Discover the perfect rental property that matches your lifestyle
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative max-w-3xl mx-auto px-4"
            >
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 hover:border-primary-300/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-stretch p-3 gap-3">
                  {/* Location Input */}
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Location"
                      className="peer w-full h-12 pl-11 pr-4 bg-white/50 rounded-xl outline-none border border-transparent focus:border-primary-300/50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Property Type */}
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary-500">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <select
                      className="peer w-full h-12 pl-11 pr-10 bg-white/50 rounded-xl outline-none border border-transparent focus:border-primary-300/50 text-gray-700 appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="">Property Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="office">Office</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary-500">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <select
                      className="peer w-full h-12 pl-11 pr-10 bg-white/50 rounded-xl outline-none border border-transparent focus:border-primary-300/50 text-gray-700 appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="">Price Range</option>
                      <option value="0-25000">৳0 - ৳25,000</option>
                      <option value="25000-50000">৳25,000 - ৳50,000</option>
                      <option value="50000-100000">৳50,000 - ৳1,00,000</option>
                      <option value="100000+">৳1,00,000+</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Search Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 px-6 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </motion.button>
                </div>

                {/* Advanced Filters Button */}
                <div className="px-4 py-2 border-t border-gray-200/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors duration-200 text-sm font-medium"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Advanced Filters</span>
                    <motion.div
                      animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-t border-gray-200/50">
                        {[
                          { label: 'Bedrooms', options: ['Any', '1+', '2+', '3+', '4+'] },
                          { label: 'Bathrooms', options: ['Any', '1+', '2+', '3+'] },
                          { label: 'Floor Area', options: ['Any', '500-1000 sq.ft', '1000-1500 sq.ft', '1500+ sq.ft'] },
                          { label: 'Furnishing', options: ['Any', 'Furnished', 'Semi-Furnished', 'Unfurnished'] }
                        ].map((filter, index) => (
                          <div key={filter.label} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{filter.label}</label>
                            <div className="relative">
                              <select className="w-full h-10 pl-3 pr-10 bg-white/50 rounded-lg border border-gray-200/50 focus:border-primary-300/50 outline-none appearance-none cursor-pointer text-gray-700 text-sm">
                                {filter.options.map(option => (
                                  <option key={option} value={option.toLowerCase()}>{option}</option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-4 right-4 mt-2 backdrop-blur-xl bg-white/90 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden z-10"
                  >
                    <div className="p-2">
                      <div className="text-sm font-medium text-gray-500 px-3 py-2">Popular Locations</div>
                      {['Gulshan', 'Banani', 'Dhanmondi', 'Uttara'].map((location) => (
                        <motion.button
                          key={location}
                          whileHover={{ x: 5 }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-xl transition-colors duration-200"
                        >
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span>{location}, Dhaka</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-gray-400"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Featured Properties */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600">Explore our hand-picked selection of premium properties</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="backdrop-blur-xl bg-white/70 rounded-2xl overflow-hidden border border-gray-200/50 hover:border-primary-300/50 transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{property.title}</h3>
                    <p className="text-white/90">{property.location}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                      ৳{property.price.toLocaleString()}/month
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-gray-600">
                        <Bed className="w-5 h-5 mr-2" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <Bath className="w-5 h-5 mr-2" />
                        {property.bathrooms}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-b from-gray-50/50 to-white/50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600">Experience the best rental service in Bangladesh</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-white/70 rounded-2xl p-8 border border-gray-200/50 hover:border-primary-300/50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-6"
                >
                  <feature.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-12 text-center"
          >
            {/* Animated Background Shapes */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute inset-0 opacity-10"
            >
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </motion.div>

            <div className="relative z-10">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-white mb-6"
              >
                Ready to Find Your Perfect Home?
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/90 text-xl mb-8"
              >
                Join thousands of happy tenants who found their home with us
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
