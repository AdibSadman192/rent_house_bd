import { useEffect, useState } from 'react';
import { FaUsers, FaHome, FaMoneyBill, FaChartLine } from 'react-icons/fa';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useSession } from '@/hooks/useSession';
import { ROLES } from '@/config/roles';
import axios from '@/utils/axios';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your properties today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FaUsers}
            colorClass="text-blue-600"
          />
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={FaHome}
            colorClass="text-green-600"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={FaMoneyBill}
            colorClass="text-yellow-600"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={FaChartLine}
            colorClass="text-purple-600"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {/* Add recent activity content here */}
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Add role-based access control
AdminDashboard.requireAuth = true;
AdminDashboard.requiredRole = ROLES.ADMIN;

export default AdminDashboard;
