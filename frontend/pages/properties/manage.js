import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home,
  Edit,
  Trash2,
  PlusCircle,
  Search,
  Filter,
  Eye,
} from 'lucide-react';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priceRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch user's properties
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties/user');
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
    let result = properties;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(prop => 
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(prop => prop.status === filters.status);
    }

    // Filter by property type
    if (filters.type !== 'all') {
      result = result.filter(prop => prop.type === filters.type);
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(prop => prop.price >= min && prop.price <= max);
    }

    setFilteredProperties(result);
  }, [searchTerm, filters, properties]);

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProperties(prev => prev.filter(prop => prop.id !== propertyId));
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (error) {
      console.error('Delete property error:', error);
      alert('Failed to delete property');
    }
  };

  return (
    <>
      <Head>
        <title>Manage Properties | RentHouse BD</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Home className="mr-3 text-blue-600" /> My Properties
          </h1>
          <Link href="/properties/submit" className="btn btn-primary flex items-center">
            <PlusCircle className="mr-2" /> Add New Property
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rented">Rented</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-600">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${property.images[0]})` }}
                />

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {property.title}
                    </h2>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {property.location}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-blue-600">
                      ৳{property.price.toLocaleString()}/month
                    </div>

                    <div className="flex space-x-2">
                      <Link 
                        href={`/properties/${property.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Eye size={20} />
                      </Link>
                      <Link 
                        href={`/properties/edit/${property.id}`}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Edit size={20} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

PropertyManagement.requireAuth = true;

export default PropertyManagement;
