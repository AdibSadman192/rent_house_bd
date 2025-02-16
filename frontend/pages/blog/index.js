import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSearch } from 'react-icons/fi';
import BlogCard from '../../components/blog/BlogCard';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'tips', name: 'Rental Tips' },
    { id: 'market', name: 'Market Updates' },
    { id: 'guide', name: 'Property Guide' },
    { id: 'legal', name: 'Legal Advice' },
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Areas to Rent in Dhaka',
      slug: 'top-10-areas-dhaka',
      excerpt: 'Discover the most sought-after residential areas in Dhaka for renting properties...',
      category: 'guide',
      author: 'Ahmed Khan',
      date: '2024-02-20',
      readTime: 5,
      coverImage: '/images/blog/dhaka-areas.jpg'
    },
    {
      id: 2,
      title: 'Understanding Rental Agreements in Bangladesh',
      slug: 'rental-agreements-bangladesh',
      excerpt: 'Learn about the essential components of a rental agreement and your rights as a tenant...',
      category: 'legal',
      author: 'Fatima Rahman',
      date: '2024-02-18',
      readTime: 8,
      coverImage: '/images/blog/rental-agreement.jpg'
    },
  ];

  const filteredPosts = blogPosts.filter(post => 
    (selectedCategory === 'all' || post.category === selectedCategory) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>House Rent BD - Blog</title>
        <meta name="description" content="Insights and guides for renting in Bangladesh" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rental Insights & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice, market trends, and essential tips for renters and property seekers in Bangladesh
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Search Input */}
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white/70 backdrop-blur-xl border border-gray-200/50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <AnimatePresence>
          {filteredPosts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500"
            >
              No blog posts found matching your search.
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { 
                    delayChildren: 0.2,
                    staggerChildren: 0.1 
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPage;
