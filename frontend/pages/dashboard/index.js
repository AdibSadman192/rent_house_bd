import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { 
  FiHome,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiTrendingUp,
  FiChevronRight,
  FiPlus,
  FiEye,
  FiClock,
  FiDollarSign,
  FiSearch,
  FiActivity
} from 'react-icons/fi';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'activity-chart',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      colors: ['#0071e3']
    },
    series: [{
      name: 'Activity',
      data: [30, 40, 35, 50, 49, 60, 70]
    }]
  });

  useEffect(() => {
    // Simulate data fetching based on period
    const fetchData = () => {
      // This would be replaced with actual API calls
      console.log('Fetching data for period:', selectedPeriod);
    };

    fetchData();
  }, [selectedPeriod]);

  // Mock data (replace with API data)
  const user = {
    name: 'John Doe',
    role: 'owner'
  };

  const stats = {
    owner: [
      {
        label: 'Total Properties',
        value: '12',
        icon: FiHome,
        trend: '+2.5%',
        isPositive: true,
      },
      {
        label: 'Total Tenants',
        value: '48',
        icon: FiUsers,
        trend: '+12%',
        isPositive: true,
      },
      {
        label: 'Active Bookings',
        value: '8',
        icon: FiCalendar,
        trend: '+5%',
        isPositive: true,
      },
      {
        label: 'Total Revenue',
        value: '৳480,000',
        icon: FiDollarSign,
        trend: '+18%',
        isPositive: true,
      }
    ],
    renter: [
      {
        label: 'Viewed Properties',
        value: '42',
        icon: FiEye,
        trend: '+7.2%',
        isPositive: true,
      },
      {
        label: 'Booking Requests',
        value: '6',
        icon: FiClock,
        trend: '+3%',
        isPositive: true,
      },
      {
        label: 'Active Rentals',
        value: '2',
        icon: FiHome,
        trend: '+1',
        isPositive: true,
      },
      {
        label: 'Spent This Month',
        value: '৳24,000',
        icon: FiDollarSign,
        trend: '+5%',
        isPositive: true,
      }
    ]
  };

  const quickActions = user.role === 'owner' ? [
    {
      label: 'Add New Property',
      icon: FiPlus,
      href: '/dashboard/properties/new',
      description: 'List a new property for rent',
    },
    {
      label: 'View Bookings',
      icon: FiCalendar,
      href: '/dashboard/bookings',
      description: 'Manage your property bookings',
    },
    {
      label: 'Manage Properties',
      icon: FiHome,
      href: '/dashboard/properties',
      description: 'View and edit your properties',
    },
  ] : [
    {
      label: 'Browse Properties',
      icon: FiSearch,
      href: '/properties',
      description: 'Find your next home',
    },
    {
      label: 'My Rentals',
      icon: FiHome,
      href: '/dashboard/rentals',
      description: 'Manage your current rentals',
    },
    {
      label: 'View Messages',
      icon: FiMessageSquare,
      href: '/dashboard/messages',
      description: 'Check your messages',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'property_listed',
      title: 'New Property Listed',
      description: 'You listed "Modern Apartment in Gulshan" for rent',
      time: '2 hours ago',
      icon: FiHome,
    },
    {
      id: 2,
      type: 'booking_request',
      title: 'Booking Request Received',
      description: 'New booking request for "Luxury Villa in Banani"',
      time: '5 hours ago',
      icon: FiCalendar,
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      description: 'Sarah sent you a message about the apartment',
      time: '1 day ago',
      icon: FiMessageSquare,
    },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | RentHouseBD</title>
        <meta name="description" content="Manage your properties and rentals" />
      </Head>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your {user.role === 'owner' ? 'properties' : 'rentals'} today.
              </p>
            </div>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats[user.role].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className={`flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  <FiTrendingUp className={`w-4 h-4 mr-1 ${!stat.isPositive && 'transform rotate-180'}`} />
                  <span className="text-sm font-medium">{stat.trend}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Activity Overview</h2>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                {['week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height="100%"
              />
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center p-4 rounded-xl hover:bg-primary-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-4 group-hover:bg-white">
                    <action.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">{action.label}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 flex items-start space-x-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex-shrink-0 flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
