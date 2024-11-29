import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  MessageCircle,
  X,
  Search,
  Filter,
  Trash2
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // Assuming you have an auth context

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

export default function NotificationsPage() {
  const { user } = useAuth(); // Get current user from auth context
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async (resetPage = false) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get('/api/notifications', {
        params: {
          page: resetPage ? 1 : page,
          limit: 10,
          category: filterType === 'all' ? undefined : filterType,
          search: searchQuery
        }
      });

      const newNotifications = response.data.notifications;
      
      setNotifications(prev => 
        resetPage ? newNotifications : [...prev, ...newNotifications]
      );
      
      setPage(prev => resetPage ? 1 : prev + 1);
      setHasMore(newNotifications.length === 10);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
      setLoading(false);
    }
  }, [user, filterType, searchQuery, page]);

  // Initial load and when filter/search changes
  useEffect(() => {
    fetchNotifications(true);
  }, [fetchNotifications]);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch('/api/notifications/mark-all-read');
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      setError('Failed to mark notifications as read');
    }
  };

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { isRead: true });
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  // Delete single notification
  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  // Load more notifications
  const handleLoadMore = () => {
    fetchNotifications();
  };

  // Notification icon based on category
  const getNotificationIcon = (category) => {
    switch(category) {
      case 'booking': return <MessageCircle className="w-6 h-6 text-primary-600" />;
      case 'payment': return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'property': return <Info className="w-6 h-6 text-blue-600" />;
      default: return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Notifications - RentHouse BD</title>
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
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your property and rental activities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleMarkAllAsRead}
              className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Mark All Read
            </button>
            <button 
              onClick={() => setNotifications([])}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear All
            </button>
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
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              {['all', 'booking', 'payment', 'property', 'system', 'message'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterType(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    filterType === category
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Notifications List */}
        <motion.div
          variants={fadeInUp}
          className="space-y-4"
        >
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`bg-white rounded-lg border border-gray-200 p-6 flex items-start space-x-4 ${
                !notification.isRead ? 'bg-primary-50 border-primary-100' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.category)}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {notification.message}
                </p>

                <div className="flex items-center space-x-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification._id)}
                    className="flex items-center text-sm text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Notifications'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <motion.div
            variants={fadeInUp}
            className="text-center py-12"
          >
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No notifications match your search "${searchQuery}"`
                : "You're all caught up! No new notifications."}
            </p>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
