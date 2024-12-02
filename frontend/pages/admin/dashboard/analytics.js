import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Home,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [propertyType, setPropertyType] = useState('all');

  // Mock data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 45000, 42000, 50000, 75000, 90000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [150, 230, 180, 290, 200, 180, 320],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const propertyTypeData = {
    labels: ['Apartment', 'House', 'Commercial', 'Land'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(168, 85, 247, 0.5)',
          'rgba(249, 115, 22, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(249, 115, 22)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <>
      <Head>
        <title>Analytics Dashboard | RentHouse BD Admin</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Properties</option>
              <option value="apartment">Apartments</option>
              <option value="house">Houses</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Total Revenue', value: '৳282,000', icon: DollarSign, color: 'bg-blue-500' },
              { title: 'Active Users', value: '1,420', icon: Users, color: 'bg-green-500' },
              { title: 'Listed Properties', value: '450', icon: Home, color: 'bg-purple-500' },
              { title: 'Bookings', value: '320', icon: Calendar, color: 'bg-yellow-500' },
            ].map((stat) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                        <dd className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
              <Line options={chartOptions} data={revenueData} />
            </motion.div>

            {/* User Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
              <Bar options={chartOptions} data={userActivityData} />
            </motion.div>

            {/* Property Types Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Types Distribution</h3>
              <div className="h-[300px] flex justify-center">
                <Pie options={chartOptions} data={propertyTypeData} />
              </div>
            </motion.div>

            {/* Top Locations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Locations</h3>
              <div className="space-y-4">
                {[
                  { name: 'Dhanmondi', value: 120, percentage: 25 },
                  { name: 'Gulshan', value: 95, percentage: 20 },
                  { name: 'Banani', value: 85, percentage: 18 },
                  { name: 'Uttara', value: 75, percentage: 16 },
                  { name: 'Mirpur', value: 65, percentage: 14 },
                ].map((location) => (
                  <div key={location.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">{location.name}</span>
                      <span className="text-sm text-gray-500">{location.value} properties</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

AnalyticsDashboard.requireAuth = true;
AnalyticsDashboard.requireAdmin = true;

export default AnalyticsDashboard;
