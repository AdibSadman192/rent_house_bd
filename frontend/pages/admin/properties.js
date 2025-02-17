import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Home,
  Edit,
  Trash2,
  Search,
  PlusCircle,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';

const PropertyManagement = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    searchTerm: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    propertiesPerPage: 10,
    totalProperties: 0,
  });

  const [selectedProperties, setSelectedProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          page: pagination.currentPage,
          limit: pagination.propertiesPerPage,
          filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const propertiesList = Array.isArray(data.properties) ? data.properties : [];
      setProperties(propertiesList);
      setFilteredProperties(propertiesList);
      setPagination(prev => ({ 
        ...prev, 
        totalProperties: typeof data.total === 'number' ? data.total : 0 
      }));
      setError(null);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again later.');
      setProperties([]);
      setFilteredProperties([]);
      setPagination(prev => ({ ...prev, totalProperties: 0 }));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.propertiesPerPage]);

  useEffect(() => {
    // Check user role and redirect if not admin
    if (!user || user.role !== 'admin') {
      router.push('/access-denied');
      return;
    }

    fetchProperties();
  }, [user, router, fetchProperties]);

  const handleSearch = (term) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleTypeFilter = (type) => {
    setFilters(prev => ({ ...prev, type }));
  };

  const togglePropertySelection = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const openEditModal = (property) => {
    setCurrentProperty(property);
    setIsModalOpen(true);
  };

  const handlePropertyAction = async (action, propertyId) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
      
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error(`Error ${action} property:`, error);
    }
  };

  const renderPropertyModal = () => {
    if (!isModalOpen || !currentProperty) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-8 w-[600px] max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Property Title</label>
              <input 
                type="text" 
                defaultValue={currentProperty.title}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Location</label>
              <input 
                type="text" 
                defaultValue={currentProperty.location}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Price</label>
              <input 
                type="number" 
                defaultValue={currentProperty.price}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Property Type</label>
              <select 
                defaultValue={currentProperty.type}
                className="w-full border rounded-md p-2"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="duplex">Duplex</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Description</label>
              <textarea 
                defaultValue={currentProperty.description}
                className="w-full border rounded-md p-2 h-24"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <Head>
          <title>Property Management | RentHouse BD</title>
        </Head>

        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex justify-center items-center h-screen">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-500" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Head>
          <title>Property Management | RentHouse BD</title>
        </Head>

        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex justify-center items-center h-screen">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <button 
                  onClick={() => fetchProperties()}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Property Management | RentHouse BD</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <Home className="mr-3 text-blue-600" /> 
              Property Management
            </h1>
            <button className="btn btn-primary flex items-center">
              <PlusCircle className="mr-2" /> Add Property
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select 
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full py-2 border rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            <select 
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="w-full py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="duplex">Duplex</option>
            </select>
          </div>

          {/* Property Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">
                    <input 
                      type="checkbox"
                      checked={properties.length > 0 && selectedProperties.length === properties.length}
                      onChange={() => setSelectedProperties(
                        selectedProperties.length === properties.length ? [] : properties.map(p => p.id)
                      )}
                    />
                  </th>
                  <th className="p-4 text-left">Property</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map(property => (
                  <tr key={property.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input 
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => togglePropertySelection(property.id)}
                      />
                    </td>
                    <td className="p-4 flex items-center">
                      <Image 
                        src={property.images[0]} 
                        alt={property.title}
                        width={50}
                        height={50}
                        className="rounded-md mr-3"
                      />
                      {property.title}
                    </td>
                    <td className="p-4">{property.location}</td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${property.type === 'apartment' ? 'bg-blue-100 text-blue-800' : 
                          property.type === 'house' ? 'bg-green-100 text-green-800' : 
                          property.type === 'studio' ? 'bg-purple-100 text-purple-800' : 
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">৳{property.price.toLocaleString()}/month</td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${property.status === 'active' ? 'bg-green-100 text-green-800' : 
                          property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}
                      `}>
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 flex space-x-2">
                      <button 
                        onClick={() => openEditModal(property)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handlePropertyAction('delete', property.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-green-500 hover:text-green-700"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {property.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handlePropertyAction('approve', property.id)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handlePropertyAction('reject', property.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div>
              Showing {(pagination.currentPage - 1) * pagination.propertiesPerPage + 1} 
              {' '} to {' '}
              {Math.min(
                pagination.currentPage * pagination.propertiesPerPage, 
                pagination.totalProperties
              )} 
              {' '} of {pagination.totalProperties} properties
            </div>
            <div className="flex space-x-2">
              <button 
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <button 
                disabled={pagination.currentPage * pagination.propertiesPerPage >= pagination.totalProperties}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          </div>

          {renderPropertyModal()}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default PropertyManagement;
