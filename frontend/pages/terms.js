import Head from 'next/head';
import { motion } from 'framer-motion';
import { Shield, FileText } from 'lucide-react';

const TermsPage = () => {
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

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using RentHouse BD's services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`
    },
    {
      title: '2. User Registration',
      content: `Users must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.`
    },
    {
      title: '3. Property Listings',
      content: `3.1. Property owners must provide accurate information about their properties.
3.2. All images must be genuine and represent the actual property.
3.3. Pricing information must be current and accurate.
3.4. RentHouse BD reserves the right to remove any listing that violates our policies.`
    },
    {
      title: '4. Booking and Payments',
      content: `4.1. All payments must be made through our secure payment system.
4.2. Security deposits are handled according to local regulations.
4.3. Cancellation policies vary by property and are clearly stated on each listing.`
    },
    {
      title: '5. User Conduct',
      content: `Users must:
5.1. Not engage in fraudulent activities
5.2. Respect other users' privacy and rights
5.3. Not use the platform for illegal purposes
5.4. Not manipulate listings or reviews`
    },
    {
      title: '6. Privacy and Data Protection',
      content: `6.1. We collect and process data in accordance with our Privacy Policy.
6.2. User data is protected using industry-standard security measures.
6.3. We do not sell personal information to third parties.`
    },
    {
      title: '7. Intellectual Property',
      content: `7.1. All content on RentHouse BD is protected by copyright laws.
7.2. Users may not copy or reproduce content without permission.
7.3. Property images remain the property of their respective owners.`
    },
    {
      title: '8. Liability and Disclaimers',
      content: `8.1. RentHouse BD is not responsible for disputes between users.
8.2. We do not guarantee the accuracy of property listings.
8.3. Users are responsible for verifying property conditions before renting.`
    },
    {
      title: '9. Termination',
      content: `We reserve the right to terminate or suspend accounts that violate our terms or engage in suspicious activities.`
    },
    {
      title: '10. Changes to Terms',
      content: `RentHouse BD may modify these terms at any time. Users will be notified of significant changes.`
    }
  ];

  return (
    <>
      <Head>
        <title>Terms and Conditions | RentHouse BD</title>
        <meta name="description" content="Terms and conditions for using RentHouse BD's property rental services" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-lg text-gray-600">
              Last updated: February 20, 2024
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <p className="text-gray-600">
              Welcome to RentHouse BD. These terms and conditions outline the rules and regulations
              for the use of our property rental platform. By accessing this website, we assume
              you accept these terms and conditions in full.
            </p>
          </motion.div>

          {/* Terms Sections */}
          <motion.div variants={containerVariants} className="space-y-6">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={itemVariants}
            className="mt-12 bg-blue-50 rounded-lg p-6 text-center"
          >
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Questions about our terms?
            </h2>
            <p className="text-gray-600 mb-4">
              Contact our legal team for clarification
            </p>
            <a
              href="mailto:legal@renthousebd.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Legal Team
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default TermsPage;
