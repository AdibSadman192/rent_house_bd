import Head from 'next/head';
import { motion } from 'framer-motion';
import { Lock, Shield, Database, UserCheck, Bell, Mail } from 'lucide-react';

const PrivacyPage = () => {
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
      icon: UserCheck,
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us, including:
• Personal information (name, email, phone number)
• Account credentials
• Property preferences and search history
• Payment information
• Communication history
• Device and usage information`
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: `We use your information to:
• Provide and improve our services
• Process transactions and bookings
• Send notifications about properties
• Verify your identity
• Prevent fraud and abuse
• Customize your experience
• Communicate with you about our services`
    },
    {
      icon: Shield,
      title: 'Information Sharing',
      content: `We may share your information with:
• Property owners (for booking purposes)
• Payment processors
• Service providers
• Legal authorities (when required by law)
We never sell your personal information to third parties.`
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We implement strong security measures:
• Encryption of sensitive data
• Regular security audits
• Secure data storage
• Access controls
• Employee training on data protection
• Regular system updates`
    },
    {
      icon: Bell,
      title: 'Your Privacy Rights',
      content: `You have the right to:
• Access your personal data
• Correct inaccurate information
• Request data deletion
• Opt-out of marketing communications
• Export your data
• Withdraw consent`
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: `For privacy-related concerns:
Email: privacy@renthousebd.com
Phone: +880 1234-567890
Address: House 123, Road 45, Gulshan, Dhaka`
    }
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy | RentHouse BD</title>
        <meta name="description" content="Learn how RentHouse BD protects and handles your personal information" />
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
            <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
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
              At RentHouse BD, we take your privacy seriously. This Privacy Policy explains how
              we collect, use, and protect your personal information when you use our platform.
              By using our services, you agree to the collection and use of information in
              accordance with this policy.
            </p>
          </motion.div>

          {/* Privacy Sections */}
          <motion.div variants={containerVariants} className="space-y-6">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center mb-4">
                  <section.icon className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-600 whitespace-pre-line">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </motion.div>

          {/* Privacy Shield */}
          <motion.div
            variants={itemVariants}
            className="mt-12 bg-blue-50 rounded-lg p-6 text-center"
          >
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your Privacy Matters
            </h2>
            <p className="text-gray-600 mb-4">
              Have questions about our privacy practices?
            </p>
            <a
              href="mailto:privacy@renthousebd.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Privacy Team
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PrivacyPage;
