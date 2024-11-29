import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Users, Shield, ArrowRight, Star, Home, Key, BadgeCheck } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';

// Animation variants
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample featured properties (will be replaced with API data)
  const featuredProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      location: 'Gulshan 2, Dhaka',
      price: 45000,
      images: ['https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg'],
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
      images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
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
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      type: 'Studio',
      isFeatured: true
    }
  ];

  const features = [
    {
      icon: Home,
      title: 'Wide Selection',
      description: 'Browse through thousands of verified properties across Bangladesh'
    },
    {
      icon: Key,
      title: 'Easy Process',
      description: 'Simple and streamlined rental process from start to finish'
    },
    {
      icon: BadgeCheck,
      title: 'Verified Listings',
      description: 'All properties are verified to ensure quality and authenticity'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Listings' },
    { number: '50K+', label: 'Happy Tenants' },
    { number: '1000+', label: 'Property Owners' },
    { number: '100+', label: 'Cities Covered' }
  ];

  return (
    <>
      <Head>
        <title>RentHouse BD - Find Your Perfect Rental Home in Bangladesh</title>
        <meta 
          name="description" 
          content="Discover and rent the perfect property in Bangladesh. Browse through verified listings of apartments, houses, and commercial spaces." 
        />
      </Head>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/hero-bg.jpg"
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
            >
              Find Your Perfect Home in Bangladesh
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-200 mb-8"
            >
              Discover thousands of rental properties across Bangladesh. 
              Your dream home is just a few clicks away.
            </motion.p>

            {/* Search Box */}
            <motion.div variants={fadeInUp} className="max-w-2xl">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search by location or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 text-gray-700 focus:outline-none"
                />
                <button className="px-8 py-4 bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RentHouse BD?
            </h2>
            <p className="text-lg text-gray-600">
              We make finding your next home simple and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
              >
                <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">
              Explore our hand-picked selection of premium properties
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              View All Properties
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of happy tenants who found their home through RentHouse BD
            </p>
            <div className="space-x-4">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700 transition-colors"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
