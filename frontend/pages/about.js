import Head from 'next/head';
import { FiHome, FiUsers, FiShield, FiAward } from 'react-icons/fi';

const AboutPage = () => {
  const features = [
    {
      icon: FiHome,
      title: 'Extensive Property Listings',
      description: 'Access thousands of verified properties across Bangladesh, from modern apartments to traditional homes.'
    },
    {
      icon: FiUsers,
      title: 'Trusted Community',
      description: 'Join a community of verified owners and tenants, making your property journey safe and reliable.'
    },
    {
      icon: FiShield,
      title: 'Secure Transactions',
      description: 'Experience worry-free transactions with our secure payment system and verified property listings.'
    },
    {
      icon: FiAward,
      title: 'Quality Assurance',
      description: 'Every property undergoes thorough verification to ensure you get exactly what you see.'
    }
  ];

  return (
    <>
      <Head>
        <title>About Us | RentHouseBD</title>
        <meta name="description" content="Learn about RentHouseBD's mission to revolutionize property rental in Bangladesh" />
      </Head>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing Property Rental
            <br />
            <span className="text-primary-600">in Bangladesh</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to make property rental simple, secure, and accessible for everyone in Bangladesh.
          </p>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-8">
                At RentHouseBD, we believe everyone deserves access to quality housing. Our platform connects property owners with reliable tenants, creating a transparent and efficient rental marketplace that benefits all parties.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <h4 className="text-2xl font-bold text-primary-600 mb-2">50K+</h4>
                  <p className="text-gray-600">Active Listings</p>
                </div>
                <div className="p-4">
                  <h4 className="text-2xl font-bold text-primary-600 mb-2">100K+</h4>
                  <p className="text-gray-600">Happy Users</p>
                </div>
                <div className="p-4">
                  <h4 className="text-2xl font-bold text-primary-600 mb-2">64</h4>
                  <p className="text-gray-600">Districts Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">Building trust through transparency and verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Creating a supportive community of owners and tenants</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">Striving for excellence in every interaction</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
