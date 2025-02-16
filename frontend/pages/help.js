import Head from 'next/head';
import Link from 'next/link';
import { FiSearch, FiHelpCircle, FiBook, FiMessageCircle, FiPhone } from 'react-icons/fi';

const HelpPage = () => {
  const helpCategories = [
    {
      icon: FiBook,
      title: 'Getting Started',
      description: 'Learn the basics of using RentHouseBD',
      articles: [
        'How to create an account',
        'Searching for properties',
        'Scheduling viewings',
        'Understanding property listings'
      ]
    },
    {
      icon: FiMessageCircle,
      title: 'Common Questions',
      description: 'Find answers to frequently asked questions',
      articles: [
        'Payment methods',
        'Security deposits',
        'Rental agreements',
        'Cancellation policies'
      ]
    },
    {
      icon: FiPhone,
      title: 'Support',
      description: 'Get help from our support team',
      articles: [
        'Contact support',
        'Report an issue',
        'Emergency assistance',
        'Feedback and suggestions'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Help Center | RentHouseBD</title>
        <meta name="description" content="Get help and support for using RentHouseBD's property rental services" />
      </Head>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 mb-16">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How can we help you?
            </h1>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-soft"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
                    <category.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-3">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-primary-600 flex items-center"
                      >
                        <FiHelpCircle className="w-4 h-4 mr-2" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How to List Your Property
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how to create an effective property listing that attracts potential tenants.
              </p>
              <Link
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Read More
              </Link>
            </article>

            <article className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Understanding Rental Agreements
              </h3>
              <p className="text-gray-600 mb-4">
                Everything you need to know about rental agreements and terms.
              </p>
              <Link
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Read More
              </Link>
            </article>

            <article className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Security Deposit Guidelines
              </h3>
              <p className="text-gray-600 mb-4">
                Learn about security deposit requirements, payments, and refunds.
              </p>
              <Link
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Read More
              </Link>
            </article>
          </div>
        </div>

        {/* Contact Support */}
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is available to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <FiMessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
              <Link
                href="/faq"
                className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <FiHelpCircle className="w-5 h-5 mr-2" />
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
