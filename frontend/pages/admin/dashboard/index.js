import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Users,
  Home,
  FileText,
  AlertCircle,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats] = useState({
    totalUsers: 1250,
    totalProperties: 450,
    totalBookings: 320,
    totalRevenue: 125000,
    activeListings: 380,
    pendingApprovals: 15,
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Home,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: TrendingUp,
      color: 'bg-indigo-500',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard | RentHouse BD</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon
                        className={`h-6 w-6 text-white p-1 rounded-md ${stat.color}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
                <div className="mt-5">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <li key={item} className="py-5">
                          <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                            <h3 className="text-sm font-semibold text-gray-800">
                              New property listing approval request
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              A new property has been listed and requires approval.
                              Location: Dhanmondi, Dhaka
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <a
                      href="#"
                      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View all
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AdminDashboard.requireAuth = true;
AdminDashboard.requireAdmin = true;

export default AdminDashboard;
