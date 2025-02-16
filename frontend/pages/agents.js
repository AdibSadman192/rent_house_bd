import Head from 'next/head';
import { useState } from 'react';
import { 
  FiSearch, 
  FiMapPin, 
  FiStar,
  FiPhone,
  FiMail,
  FiFilter,
  FiGrid,
  FiList,
  FiAward,
  FiHome,
  FiCheck
} from 'react-icons/fi';

const AgentsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    experience: '',
    specialization: '',
    rating: '',
    verified: false
  });

  const locations = [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal'
  ];

  const experienceLevels = [
    { label: '0-2 years', value: '0-2' },
    { label: '2-5 years', value: '2-5' },
    { label: '5-10 years', value: '5-10' },
    { label: '10+ years', value: '10+' }
  ];

  const specializations = [
    'Residential',
    'Commercial',
    'Luxury',
    'Student Housing',
    'Family Homes'
  ];

  const agents = [
    {
      id: 1,
      name: 'Karim Ahmed',
      image: '/images/agents/agent1.jpg',
      location: 'Gulshan, Dhaka',
      rating: 4.8,
      reviews: 127,
      experience: '8 years',
      properties: 45,
      specialization: 'Luxury',
      verified: true,
      phone: '+880 1712-345678',
      email: 'karim.ahmed@renthousebd.com',
      bio: 'Specialized in luxury properties in Gulshan and Banani areas. Helping families find their dream homes since 2015.'
    },
    // Add more agents here
  ];

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      location: '',
      experience: '',
      specialization: '',
      rating: '',
      verified: false
    });
  };

  return (
    <>
      <Head>
        <title>Our Expert Agents | RentHouseBD</title>
        <meta name="description" content="Connect with our experienced real estate agents" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
        <div className="pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Our Expert Agents</h1>
            <p className="mt-2 text-gray-600 text-sm">
              Connect with our experienced real estate agents who will help you find the perfect
              property that matches your needs and preferences.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search agents by name, location, or specialization..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                <FiFilter className="h-5 w-5" />
                Filters
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {agents.length} agents
            </div>
          </div>

          {/* Filters */}
          <div className={`bg-white rounded-lg shadow-sm p-4 mb-8 ${isFilterOpen ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <select
                  value={selectedFilters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Experience</option>
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialization Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  value={selectedFilters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={selectedFilters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>

            {/* Verified Filter */}
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show verified agents only</span>
              </label>
            </div>

            {/* Clear Filters */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Agents Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Agent Image */}
                <div className={viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'relative pb-[75%]'}>
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className={`${
                      viewMode === 'list'
                        ? 'w-full h-full object-cover'
                        : 'absolute inset-0 w-full h-full object-cover'
                    }`}
                  />
                  {agent.verified && (
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
                      <FiCheck className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                </div>

                {/* Agent Info */}
                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {agent.name}
                    </h3>
                    <div className="flex items-center text-yellow-400">
                      <FiStar className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {agent.rating} ({agent.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    <span>{agent.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Experience</span>
                      <p className="font-medium text-gray-900">{agent.experience}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Properties</span>
                      <p className="font-medium text-gray-900">{agent.properties}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{agent.bio}</p>

                  <div className="flex flex-col space-y-2">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center text-gray-600 hover:text-primary-600"
                    >
                      <FiPhone className="w-4 h-4 mr-2" />
                      <span>{agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center text-gray-600 hover:text-primary-600"
                    >
                      <FiMail className="w-4 h-4 mr-2" />
                      <span>{agent.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentsPage;
