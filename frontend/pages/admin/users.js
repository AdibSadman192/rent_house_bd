import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Users,
  Edit,
  Trash2,
  Filter,
  Search,
  UserPlus,
  Shield,
  Lock,
  Unlock,
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    searchTerm: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    usersPerPage: 10,
    totalUsers: 0,
  });

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          page: pagination.currentPage,
          limit: pagination.usersPerPage,
          filters,
        }),
      });
      const data = await response.json();
      
      const usersList = data.users || [];
      setUsers(usersList);
      setFilteredUsers(usersList);
      setPagination(prev => ({ ...prev, totalUsers: data.total || 0 }));
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  const handleSearch = (term) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const handleRoleFilter = (role) => {
    setFilters(prev => ({ ...prev, role }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleUserAction = async (action, userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const renderUserModal = () => {
    if (!isModalOpen || !currentUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-8 w-96"
        >
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          {/* User Edit Form Fields */}
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Name" 
              defaultValue={currentUser.name}
              className="w-full border rounded-md p-2"
            />
            <input 
              type="email" 
              placeholder="Email" 
              defaultValue={currentUser.email}
              className="w-full border rounded-md p-2"
            />
            <select 
              className="w-full border rounded-md p-2"
              defaultValue={currentUser.role}
            >
              <option value="user">User</option>
              <option value="landlord">Landlord</option>
              <option value="admin">Admin</option>
            </select>
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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <Users className="mr-3 text-blue-600" /> 
              User Management
            </h1>
            <button className="btn btn-primary flex items-center">
              <UserPlus className="mr-2" /> Add User
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select 
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="w-full py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="landlord">Landlords</option>
              <option value="admin">Admins</option>
            </select>

            <select 
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full py-2 border rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* User Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">
                    <input 
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={() => setSelectedUsers(
                        selectedUsers.length === users.length ? [] : users.map(u => u.id)
                      )}
                    />
                  </th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input 
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className="p-4 flex items-center">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      {user.name}
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.role === 'landlord' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'}
                      `}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {user.status ? 
                          user.status.charAt(0).toUpperCase() + user.status.slice(1) : 
                          'Pending'
                        }
                      </span>
                    </td>
                    <td className="p-4 flex space-x-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleUserAction('delete', user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleUserAction('suspend', user.id)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <Lock className="h-5 w-5" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserAction('activate', user.id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Unlock className="h-5 w-5" />
                        </button>
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
              Showing {(pagination.currentPage - 1) * pagination.usersPerPage + 1} 
              {' '} to {' '}
              {Math.min(
                pagination.currentPage * pagination.usersPerPage, 
                pagination.totalUsers
              )} 
              {' '} of {pagination.totalUsers} users
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
                disabled={pagination.currentPage * pagination.usersPerPage >= pagination.totalUsers}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          </div>

          {renderUserModal()}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
