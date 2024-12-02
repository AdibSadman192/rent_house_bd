import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  MessageCircle 
} from 'lucide-react';

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic
    console.log('Contact form submitted:', formData);
  };

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen pt-24"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <Head>
        <title>Contact RentHouse BD - Get in Touch</title>
      </Head>

      <main className="container mx-auto px-4 py-16">
        <motion.section 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-16"
        >
          <motion.div className="text-center mb-8">
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Contact Us
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-600"
            >
              Have questions? Check our{' '}
              <Link href="/faq" className="text-blue-600 hover:text-blue-700">
                FAQ
              </Link>
              {' '}or{' '}
              <Link href="/help" className="text-blue-600 hover:text-blue-700">
                Help Center
              </Link>
              {' '}first.
            </motion.p>
          </motion.div>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Have questions or need assistance? We're here to help! Reach out to us through the form below or our contact information.
          </motion.p>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-gray-900 mb-6"
            >
              Send us a Message
            </motion.h2>
            <motion.form 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-700 mb-2">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </motion.div>
              <motion.button
                variants={fadeInUp}
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </motion.button>
            </motion.form>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-primary-600" />
                Our Office
              </h3>
              <p className="text-gray-600">
                House 42, Road 15, Sector 10
                Uttara, Dhaka 1230, Bangladesh
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-6 h-6 mr-3 text-primary-600" />
                Contact Numbers
              </h3>
              <p className="text-gray-600">
                +880 1234 567890
                +880 9876 543210
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-primary-600" />
                Email Addresses
              </h3>
              <p className="text-gray-600">
                support@renthousebd.com
                info@renthousebd.com
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
