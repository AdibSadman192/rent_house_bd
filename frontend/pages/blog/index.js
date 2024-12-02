import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag } from 'lucide-react';

const BlogPage = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'tips', name: 'Rental Tips' },
    { id: 'market', name: 'Market Updates' },
    { id: 'guide', name: 'Property Guide' },
    { id: 'legal', name: 'Legal Advice' },
  ];

  // Mock data - Replace with actual API call
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Areas to Rent in Dhaka',
      excerpt: 'Discover the most sought-after residential areas in Dhaka for renting properties...',
      category: 'guide',
      author: 'Ahmed Khan',
      date: '2024-02-20',
      readTime: '5 min',
      image: '/images/blog/dhaka-areas.jpg'
    },
    {
      id: 2,
      title: 'Understanding Rental Agreements in Bangladesh',
      excerpt: 'Learn about the essential components of a rental agreement and your rights as a tenant...',
      category: 'legal',
      author: 'Fatima Rahman',
      date: '2024-02-18',
      readTime: '8 min',
      image: '/images/blog/rental-agreement.jpg'
    },
    // Add more mock posts
  ];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

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
        <title>Blog | RentHouse BD</title>
        <meta name="description" content="Latest news, tips, and insights about property rental in Bangladesh" />
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">RentHouse BD Blog</h1>
            <p className="text-lg text-gray-600">Latest news, tips, and insights about property rental in Bangladesh</p>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 capitalize">{post.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No posts found in this category.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default BlogPage;
