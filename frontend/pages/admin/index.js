import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  Settings,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    activeListings: 0,
    pendingReports: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check user role and redirect if not admin
    if (!user || user.role !== 'admin') {
      router.push('/access-denied');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/admin/dashboard-stats', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          }),
          fetch('/api/admin/recent-activities', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          })
        ]);

        if (!statsResponse.ok || !activitiesResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();

        setDashboardStats(statsData);
        setRecentActivities(activitiesData);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, router]);

  const adminSections = [
    {
      title: 'User Management',
      icon: Users,
      href: '/admin/users',
      description: 'Manage user accounts and roles',
      color: 'text-blue-500',
    },
    {
      title: 'Property Management',
      icon: Home,
      href: '/admin/properties',
      description: 'Oversee property listings',
      color: 'text-green-500',
    },
    {
      title: 'Reports & Analytics',
      icon: FileText,
      href: '/admin/reports',
      description: 'Detailed platform insights',
      color: 'text-purple-500',
    },
    {
      title: 'Platform Settings',
      icon: Settings,
      href: '/admin/settings',
      description: 'Configure system parameters',
      color: 'text-orange-500',
    }
  ];

  const renderStatCard = (title, value, icon, color) => {
    const Icon = icon;
    const safeValue = value || 0;  // Default to 0 if value is undefined
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`bg-white shadow-md rounded-lg p-6 flex items-center ${color} bg-opacity-10`}
      >
        <div className={`mr-4 ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{safeValue.toLocaleString()}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderStatCard('Total Users', dashboardStats.totalUsers, Users, 'text-blue-500')}
            {renderStatCard('Total Properties', dashboardStats.totalProperties, Home, 'text-green-500')}
            {renderStatCard('Active Listings', dashboardStats.activeListings, TrendingUp, 'text-purple-500')}
            {renderStatCard('Pending Reports', dashboardStats.pendingReports, AlertTriangle, 'text-yellow-500')}
            {renderStatCard('Total Revenue', dashboardStats.totalRevenue, DollarSign, 'text-emerald-500')}
            {renderStatCard('New Users', dashboardStats.newUsersThisMonth, Clock, 'text-indigo-500')}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-4">
                {adminSections.map((section, index) => (
                  <Link key={index} href={section.href}>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center ${section.color} bg-opacity-10 hover:bg-opacity-20 transition-all`}
                    >
                      <section.icon className="h-8 w-8 mb-2" />
                      <h3 className="font-medium">{section.title}</h3>
                      <p className="text-xs text-gray-500">{section.description}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
              <div className="bg-white shadow-md rounded-lg p-4">
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center">No recent activities</p>
                ) : (
                  <ul className="space-y-2">
                    {recentActivities.slice(0, 5).map((activity, index) => (
                      <li key={index} className="border-b last:border-b-0 pb-2 last:pb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
