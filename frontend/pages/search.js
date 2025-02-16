import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropertyCard from '@/components/properties/PropertyCard';
import { 
  FiSearch, 
  FiMapPin, 
  FiDollarSign, 
  FiHome,
  FiFilter,
  FiX,
  FiChevronDown,
  FiHeart,
  FiBed,
  FiBath,
  FiMaximize2,
  FiSliders
} from 'react-icons/fi';

const SearchPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    location: '',
    amenities: []
  });

  // Mock properties data
  const mockProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      description: 'Beautifully furnished 3-bedroom apartment with city views',
      price: 45000,
      location: 'Gulshan, Dhaka',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      images: ['/images/property1.jpg', '/images/property2.jpg'],
      amenities: ['Parking', 'Security', 'Generator', 'Elevator'],
      type: 'Apartment',
      status: 'Available'
    },
    {
      id: 2,
      title: 'Spacious House in Dhanmondi',
      description: 'Family-friendly 4-bedroom house with garden',
      price: 65000,
      location: 'Dhanmondi, Dhaka',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      images: ['/images/property3.jpg', '/images/property4.jpg'],
      amenities: ['Garden', 'Parking', 'Security', 'Generator'],
      type: 'House',
      status: 'Available'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic
    console.log('Searching for:', searchTerm);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const FilterSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <>
      <Head>
        <title>Search Properties | RentHouseBD</title>
        <meta name="description" content="Search for your perfect rental property in Bangladesh" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
        {/* Search Section */}
        <div className="container mx-auto px-4 pt-4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                <FiFilter className="h-5 w-5" />
                Filters
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Any Price</option>
                      <option value="0-20000">Below ৳20,000</option>
                      <option value="20000-40000">৳20,000 - ৳40,000</option>
                      <option value="40000-60000">৳40,000 - ৳60,000</option>
                      <option value="60000+">Above ৳60,000</option>
                    </select>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Any Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4+">4+ Bedrooms</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Any Location</option>
                      <option value="Gulshan">Gulshan</option>
                      <option value="Banani">Banani</option>
                      <option value="Dhanmondi">Dhanmondi</option>
                      <option value="Uttara">Uttara</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {properties.length} Properties Found
                </h2>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
