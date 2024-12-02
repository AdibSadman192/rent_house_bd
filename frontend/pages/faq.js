import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState(new Set());

  const categories = [
    { id: 'general', name: 'General Questions' },
    { id: 'rental', name: 'Rental Process' },
    { id: 'payment', name: 'Payments & Fees' },
    { id: 'legal', name: 'Legal & Documentation' },
    { id: 'maintenance', name: 'Maintenance & Support' },
  ];

  const faqs = {
    general: [
      {
        id: 'g1',
        question: 'What is RentHouse BD?',
        answer: 'RentHouse BD is a comprehensive property rental platform in Bangladesh that connects property owners with potential tenants. We provide a secure and efficient way to list, search, and rent properties across the country.'
      },
      {
        id: 'g2',
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking the \'Sign Up\' button in the top right corner. Fill in your details, verify your email address and you are ready to start using our platform.'
      } 
      // Add more general FAQs
    ],
    rental: [
      {
        id: 'r1',
        question: 'How do I search for properties?',
        answer: 'Use our search feature to filter properties by location, price range, number of rooms, and other criteria. You can also save your favorite properties and set up alerts for new listings.'
      },
      {
        id: 'r2',
        question: 'How do I schedule a property viewing?',
        answer: 'Once you find a property you\'re interested in, click the "Schedule Viewing" button on the property page. Choose your preferred date and time, and we\'ll coordinate with the property owner.'
      },
      // Add more rental FAQs
    ],
    payment: [
      {
        id: 'p1',
        question: 'What payment methods are accepted?',
        answer: 'We accept various payment methods including bank transfers, bKash, Nagad, and credit/debit cards. All payments are processed securely through our platform.'
      },
      {
        id: 'p2',
        question: 'Is there a security deposit?',
        answer: 'Security deposit requirements vary by property and landlord. Typically, it\'s equivalent to 2-3 months\' rent and is refundable at the end of your tenancy, subject to property condition.'
      },
      // Add more payment FAQs
    ],
    legal: [
      {
        id: 'l1',
        question: 'What documents do I need for renting?',
        answer: 'Required documents typically include valid ID (NID/Passport), proof of income, employment verification, and references. Specific requirements may vary by property owner.'
      },
      {
        id: 'l2',
        question: 'How long is the typical lease agreement?',
        answer: 'Most lease agreements are for 12 months, but shorter or longer terms may be available depending on the property owner\'s preferences.'
      },
      // Add more legal FAQs
    ],
    maintenance: [
      {
        id: 'm1',
        question: 'How do I report maintenance issues?',
        answer: 'You can report maintenance issues through your dashboard. Click on "Report Issue," describe the problem, and attach photos if needed. We\'ll coordinate with the property owner for resolution.'
      },
      {
        id: 'm2',
        question: 'What\'s the typical response time for maintenance requests?',
        answer: 'Response times vary based on the urgency of the issue. Emergency issues are addressed within 24 hours, while non-emergency requests are typically handled within 3-5 business days.'
      },
      // Add more maintenance FAQs
    ],
  };

  const toggleQuestion = (questionId) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const filteredFaqs = faqs[activeCategory].filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <title>FAQ | RentHouse BD</title>
        <meta name="description" content="Frequently asked questions about property rental in Bangladesh" />
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
            <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">Find answers to common questions about RentHouse BD</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* FAQ List */}
          <motion.div variants={containerVariants} className="space-y-4">
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openQuestions.has(faq.id) ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openQuestions.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredFaqs.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No matching questions found.</p>
              <p className="text-gray-400">Try adjusting your search terms.</p>
            </motion.div>
          )}

          {/* Contact Support */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center bg-blue-50 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-4">We're here to help! Contact our support team.</p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default FAQPage;
