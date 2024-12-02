import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LifeBuoy,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  Home,
  CreditCard,
  Shield,
  Settings
} from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: Home,
      title: 'Getting Started',
      description: 'Learn the basics of using RentHouse BD',
      links: [
        { text: 'Creating an account', url: '/help/account-creation' },
        { text: 'Searching for properties', url: '/help/property-search' },
        { text: 'Booking a property', url: '/help/booking-process' }
      ]
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      description: 'Stay safe while renting properties',
      links: [
        { text: 'Secure payments', url: '/help/secure-payments' },
        { text: 'Avoiding scams', url: '/help/avoid-scams' },
        { text: 'Property verification', url: '/help/verification' }
      ]
    },
    {
      icon: CreditCard,
      title: 'Payments & Billing',
      description: 'Understanding payments and fees',
      links: [
        { text: 'Payment methods', url: '/help/payment-methods' },
        { text: 'Security deposits', url: '/help/deposits' },
        { text: 'Refund policy', url: '/help/refunds' }
      ]
    },
    {
      icon: Settings,
      title: 'Account Management',
      description: 'Manage your RentHouse BD account',
      links: [
        { text: 'Profile settings', url: '/help/profile-settings' },
        { text: 'Notification preferences', url: '/help/notifications' },
        { text: 'Privacy settings', url: '/help/privacy-settings' }
      ]
    }
  ];

  const quickLinks = [
    { icon: Book, text: 'Browse FAQ', url: '/faq' },
    { icon: MessageCircle, text: 'Live Chat', url: '#chat' },
    { icon: FileText, text: 'Documentation', url: '/docs' },
    { icon: Phone, text: 'Call Support', url: 'tel:+8801234567890' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <>
      <Head>
        <title>Help Center | RentHouse BD</title>
        <meta name="description" content="Get help and support for using RentHouse BD's property rental services" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <LifeBuoy className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
            <p className="text-lg text-gray-600">
              Find answers to your questions and get the support you need
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <link.icon className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-gray-900 font-medium">{link.text}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Help Categories */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center mb-4">
                  <category.icon className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.url}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Support */}
          <motion.div
            variants={itemVariants}
            className="mt-12 bg-blue-50 rounded-lg p-8 text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@renthousebd.com"
                className="flex items-center justify-center px-6 py-3 rounded-md bg-white text-blue-600 hover:bg-gray-50 transition-colors duration-200 w-full sm:w-auto"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </a>
              <a
                href="tel:+8801234567890"
                className="flex items-center justify-center px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Support
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default HelpPage;
