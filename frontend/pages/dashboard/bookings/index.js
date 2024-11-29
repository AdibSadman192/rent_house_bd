import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Home,
  MapPin,
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Eye,
  X,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

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

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mock bookings data (replace with actual API data)
  const bookings = [
    {
      id: 1,
      propertyTitle: 'Modern Apartment in Gulshan',
      propertyLocation: 'Gulshan 2, Dhaka',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      monthlyRent: 45000,
      status: 'active',
      propertyImage: '/images/properties/apartment1.jpg',
      owner: {
        name: 'Adib Rahman',
        email: 'adib@example.com'
      }
    },
    {
      id: 2,
      propertyTitle: 'Cozy Studio in Banani',
      propertyLocation: 'Banani, Dhaka',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      monthlyRent: 30000,
      status: 'pending',
      propertyImage: '/images/properties/studio1.jpg',
      owner: {
        name: 'Sarah Khan',
        email: 'sarah@example.com'
      }
    },
    {
      id: 3,
      propertyTitle: 'Luxury Villa in Dhanmondi',
      propertyLocation: 'Dhanmondi, Dhaka',
      startDate: '2023-12-01',
      endDate: '2024-05-31',
      monthlyRent: 75000,
      status: 'expired',
      propertyImage: '/images/properties/villa1.jpg',
      owner: {
        name: 'Imran Hassan',
        email: 'imran@example.com'
      }
    }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <Head>
        <title>My Bookings - RentHouse BD</title>
      </Head>

      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              My Bookings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track your rental bookings
            </p>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === 'all'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === 'active'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleFilterChange('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleFilterChange('expired')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === 'expired'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Expired
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          variants={fadeInUp}
          className="space-y-4"
        >
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-stretch">
                {/* Property Image */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                  <img
                    src={booking.propertyImage}
                    alt={booking.propertyTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'active'
                        ? 'bg-green-100 text-green-600'
                        : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                    }`}>
                      {booking.status === 'active'
                        ? 'Active'
                        : booking.status === 'pending'
                          ? 'Pending'
                          : 'Expired'}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.propertyTitle}
                      </h3>
                      <div className="relative">
                        <button
                          onClick={() => setSelectedBooking(
                            selectedBooking === booking.id ? null : booking.id
                          )}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {selectedBooking === booking.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            <Link
                              href={`/dashboard/properties/${booking.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Property
                            </Link>
                            {booking.status === 'pending' && (
                              <button
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{booking.propertyLocation}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                        <div>
                          <span className="block text-sm text-gray-600">
                            Booking Period
                          </span>
                          <span className="font-semibold">
                            {new Date(booking.startDate).toLocaleDateString()} - 
                            {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                        <div>
                          <span className="block text-sm text-gray-600">
                            Monthly Rent
                          </span>
                          <span className="font-semibold">
                            ৳{booking.monthlyRent.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Owner */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">Property Owner</span>
                      <div className="flex items-center mt-1">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm font-bold text-primary-600">
                            {booking.owner.name[0]}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">
                            {booking.owner.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {booking.status === 'active' && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                      {booking.status === 'pending' && (
                        <div className="flex items-center text-yellow-600">
                          <span className="mr-2 text-sm">Pending</span>
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      {booking.status === 'expired' && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <motion.div
            variants={fadeInUp}
            className="text-center py-12"
          >
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No bookings match your search "${searchQuery}"`
                : "You haven't made any bookings yet"}
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Properties
            </Link>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
