import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  FileText,
  Download,
  Search,
  ChevronDown
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

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock payment transactions (replace with actual API data)
  const transactions = [
    {
      id: 1,
      propertyTitle: 'Modern Apartment in Gulshan',
      amount: 45000,
      date: '2024-02-01',
      status: 'completed',
      type: 'rent',
      method: 'bank_transfer'
    },
    {
      id: 2,
      propertyTitle: 'Cozy Studio in Banani',
      amount: 30000,
      date: '2024-01-15',
      status: 'pending',
      type: 'rent',
      method: 'credit_card'
    },
    {
      id: 3,
      propertyTitle: 'Luxury Villa in Dhanmondi',
      amount: 10000,
      date: '2024-01-10',
      status: 'failed',
      type: 'security_deposit',
      method: 'online_banking'
    }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'failed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'bank_transfer': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'credit_card': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'online_banking': return <DollarSign className="w-5 h-5 text-green-600" />;
      default: return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Payments - RentHouse BD</title>
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
              Payments
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your rental payments
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100">
              <Download className="w-5 h-5 mr-2" />
              Download Statement
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
                placeholder="Search transactions..."
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
                onClick={() => handleFilterChange('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === 'completed'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Completed
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
                onClick={() => handleFilterChange('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === 'failed'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Failed
              </button>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-lg border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.propertyTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ৳{transaction.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusColor(transaction.status)
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(transaction.method)}
                        <span className="ml-2 text-sm text-gray-500 capitalize">
                          {transaction.method.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700">
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <motion.div
            variants={fadeInUp}
            className="text-center py-12"
          >
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No transactions match your search "${searchQuery}"`
                : "You haven't made any payments yet"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
