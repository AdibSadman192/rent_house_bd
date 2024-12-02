import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Mail, Building2, Filter, BadgeCheck } from 'lucide-react';

const AgentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const areas = [
    { id: 'all', name: 'All Areas' },
    { id: 'gulshan', name: 'Gulshan' },
    { id: 'banani', name: 'Banani' },
    { id: 'dhanmondi', name: 'Dhanmondi' },
    { id: 'uttara', name: 'Uttara' },
    { id: 'mirpur', name: 'Mirpur' }
  ];

  // Mock data - Replace with actual API call
  const agents = [
    {
      id: 1,
      name: 'Kamal Ahmed',
      image: '/images/agents/agent1.jpg',
      rating: 4.8,
      reviews: 124,
      properties: 45,
      experience: '8 years',
      areas: ['Gulshan', 'Banani'],
      phone: '+880 1711-123456',
      email: 'kamal@renthousebd.com',
      verified: true,
      specializations: ['Luxury Apartments', 'Commercial']
    },
    {
      id: 2,
      name: 'Fatima Rahman',
      image: '/images/agents/agent2.jpg',
      rating: 4.9,
      reviews: 98,
      properties: 37,
      experience: '6 years',
      areas: ['Dhanmondi', 'Mohammadpur'],
      phone: '+880 1722-234567',
      email: 'fatima@renthousebd.com',
      verified: true,
      specializations: ['Residential', 'Student Housing']
    },
    // Add more mock agents
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesArea = selectedArea === 'all' || agent.areas.some(a => a.toLowerCase() === selectedArea.toLowerCase());
    return matchesSearch && matchesArea;
  });

  return (
    <>
      <Head>
        <title>Property Agents | RentHouse BD</title>
        <meta name="description" content="Find experienced property agents in Bangladesh" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <BadgeCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Agents</h1>
            <p className="text-lg text-gray-600">
              Find experienced and trusted property agents in your area
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search agents or specializations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Area Filter */}
              <div className="relative">
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Agents Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Agent Image */}
                <div className="relative h-48">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  {agent.verified && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <BadgeCheck className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Agent Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{agent.name}</h2>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 text-gray-900">{agent.rating}</span>
                      <span className="ml-1 text-gray-500 text-sm">({agent.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-5 h-5 mr-2" />
                      <span>{agent.properties} Properties</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{agent.areas.join(', ')}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                      {agent.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center justify-center px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredAgents.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-white rounded-lg shadow-sm"
            >
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No agents found</h2>
              <p className="text-gray-600">Try adjusting your search filters</p>
            </motion.div>
          )}

          {/* Contact Support */}
          <motion.div
            variants={itemVariants}
            className="mt-12 bg-blue-50 rounded-lg p-6 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Want to become an agent?
            </h2>
            <p className="text-gray-600 mb-4">
              Join our network of professional property agents
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Now
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default AgentsPage;
