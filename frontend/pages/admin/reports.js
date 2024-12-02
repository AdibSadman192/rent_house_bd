import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Home,
  BarChart2,
  Calendar,
} from 'lucide-react';

// Dynamic imports for charts to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

const ReportsAndAnalytics = () => {
  const [reportData, setReportData] = useState({
    revenueData: [],
    userGrowth: [],
    propertyStats: [],
    topLocations: [],
    bookingStats: [],
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('/api/admin/reports', {
          method: 'POST',
          body: JSON.stringify({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        });
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, [dateRange]);

  const renderRevenueChart = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <DollarSign className="mr-2 text-green-500" /> Monthly Revenue
        </h3>
        <div className="flex items-center space-x-2">
          <Calendar className="text-gray-500" />
          <span>{dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={reportData.revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderUserGrowthChart = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold flex items-center mb-4">
        <Users className="mr-2 text-blue-500" /> User Growth
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={reportData.userGrowth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPropertyTypeChart = () => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold flex items-center mb-4">
          <Home className="mr-2 text-purple-500" /> Property Types
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData.propertyStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {reportData.propertyStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4 space-x-4">
          {reportData.propertyStats.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{entry.type}: {entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTopLocationsTable = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold flex items-center mb-4">
        <MapPin className="mr-2 text-red-500" /> Top Locations
      </h3>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-right">Properties</th>
            <th className="p-3 text-right">Bookings</th>
          </tr>
        </thead>
        <tbody>
          {reportData.topLocations.map((location, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{location.name}</td>
              <td className="p-3 text-right">{location.properties}</td>
              <td className="p-3 text-right">{location.bookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBookingStatsChart = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold flex items-center mb-4">
        <BarChart2 className="mr-2 text-orange-500" /> Booking Statistics
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={reportData.bookingStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalBookings" stroke="#FF6384" />
          <Line type="monotone" dataKey="completedBookings" stroke="#36A2EB" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

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
              <FileText className="mr-3 text-blue-600" /> 
              Reports & Analytics
            </h1>
            <div className="flex items-center space-x-4">
              <input 
                type="date"
                value={dateRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                className="border rounded-md p-2"
              />
              <input 
                type="date"
                value={dateRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                className="border rounded-md p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderRevenueChart()}
            {renderUserGrowthChart()}
            {renderPropertyTypeChart()}
            {renderTopLocationsTable()}
            {renderBookingStatsChart()}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default ReportsAndAnalytics;
