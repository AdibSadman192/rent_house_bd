import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Plus,
  Eye,
  Heart,
  Home,
  Clock,
  Wallet,
  Search
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

export default function DashboardPage() {
  // Mock data (replace with API data)
  const user = {
    name: 'John Doe',
    role: 'owner',
  };

  const stats = {
    owner: [
      {
        label: 'Total Properties',
        value: '12',
        icon: Building2,
        trend: '+2.5%',
        color: 'blue',
      },
      {
        label: 'Total Tenants',
        value: '48',
        icon: Users,
        trend: '+12%',
        color: 'green',
      },
      {
        label: 'Active Bookings',
        value: '8',
        icon: CalendarCheck,
        trend: '+5%',
        color: 'purple',
      },
      {
        label: 'New Messages',
        value: '24',
        icon: MessageSquare,
        trend: '+18%',
        color: 'orange',
      },
    ],
    renter: [
      {
        label: 'Saved Properties',
        value: '15',
        icon: Heart,
        trend: '+3',
        color: 'red',
      },
      {
        label: 'Active Rentals',
        value: '2',
        icon: Home,
        trend: '0',
        color: 'blue',
      },
      {
        label: 'Pending Requests',
        value: '3',
        icon: Clock,
        trend: '+1',
        color: 'yellow',
      },
      {
        label: 'Total Spent',
        value: '৳45,000',
        icon: Wallet,
        trend: '+৳5,000',
        color: 'green',
      },
    ],
  };

  const recentActivities = [
    {
      id: 1,
      type: 'property_listed',
      title: 'New Property Listed',
      description: 'You listed "Modern Apartment in Gulshan" for rent',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'booking_request',
      title: 'Booking Request Received',
      description: 'New booking request for "Luxury Villa in Banani"',
      time: '5 hours ago',
    },
    // Add more activities
  ];

  const quickActions = user.role === 'owner' ? [
    {
      label: 'Add New Property',
      icon: Plus,
      href: '/dashboard/properties/new',
      color: 'primary',
    },
    {
      label: 'View Bookings',
      icon: CalendarCheck,
      href: '/dashboard/bookings',
      color: 'secondary',
    },
    {
      label: 'Manage Properties',
      icon: Building2,
      href: '/dashboard/properties',
      color: 'success',
    },
  ] : [
    {
      label: 'Browse Properties',
      icon: Search,
      href: '/properties',
      color: 'primary',
    },
    {
      label: 'View Saved Properties',
      icon: Heart,
      href: '/dashboard/favorites',
      color: 'secondary',
    },
    {
      label: 'My Rentals',
      icon: Home,
      href: '/dashboard/rentals',
      color: 'success',
    },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard - RentHouse BD</title>
      </Head>

      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="space-y-6"
      >
        {/* Welcome Section */}
        <motion.div variants={fadeInUp} className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your {user.role === 'owner' ? 'properties' : 'rentals'} today.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-500 transition-colors flex items-center justify-between group`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg bg-${action.color}-50 flex items-center justify-center mr-3`}>
                    <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats[user.role].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link
              href="/dashboard/activity"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {/* Activity Icon based on type */}
                    {activity.type === 'property_listed' ? (
                      <Building2 className="w-5 h-5 text-blue-600" />
                    ) : (
                      <CalendarCheck className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Property Performance (for owners) */}
        {user.role === 'owner' && (
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Property Performance</h2>
              <Link
                href="/dashboard/analytics"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                View detailed analytics
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample Property Cards */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Modern Apartment in Gulshan</h3>
                  <Link
                    href="/dashboard/properties/1"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupancy Rate</span>
                    <span className="font-medium text-gray-900">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Revenue</span>
                    <span className="font-medium text-gray-900">৳45,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tenant Satisfaction</span>
                    <span className="font-medium text-gray-900">4.8/5</span>
                  </div>
                </div>
              </div>
              {/* Add more property cards */}
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
