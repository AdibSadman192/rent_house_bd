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
        <meta name="description" content="Search for rental properties in Bangladesh" />
      </Head>

      <div className="pt-24 pb-16">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 mb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-soft"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                >
                  <FiSliders className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Section */}
            {showFilters && (
              <div className="lg:w-1/4 bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <FilterSection title="Price Range">
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Price</option>
                    <option value="0-20000">৳0 - ৳20,000</option>
                    <option value="20000-40000">৳20,000 - ৳40,000</option>
                    <option value="40000-60000">৳40,000 - ৳60,000</option>
                    <option value="60000+">৳60,000+</option>
                  </select>
                </FilterSection>

                <FilterSection title="Property Type">
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="room">Room</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </FilterSection>

                <FilterSection title="Bedrooms">
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </FilterSection>

                <FilterSection title="Bathrooms">
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                  </select>
                </FilterSection>

                <FilterSection title="Area (sqft)">
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minArea}
                      onChange={(e) => handleFilterChange('minArea', e.target.value)}
                      className="w-1/2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxArea}
                      onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                      className="w-1/2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </FilterSection>

                <button
                  onClick={() => setFilters({
                    priceRange: '',
                    propertyType: '',
                    bedrooms: '',
                    bathrooms: '',
                    minArea: '',
                    maxArea: '',
                    location: '',
                    amenities: []
                  })}
                  className="w-full mt-4 px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Results Section */}
            <div className={showFilters ? 'lg:w-3/4' : 'w-full'}>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {loading ? 'Loading properties...' : `${properties.length} Properties Found`}
                  </h2>
                  <p className="text-gray-600">
                    <FiMapPin className="inline-block mr-1" />
                    Showing results for all locations
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select>
                </div>
              </div>

              {/* Property Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="bg-gray-100 rounded-xl animate-pulse h-[400px]"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
