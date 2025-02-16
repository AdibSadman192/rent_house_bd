import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

const BlogPostPage = ({ post }) => {
  // Mock post data - replace with actual data fetching
  const mockPost = {
    id: 1,
    title: 'Top 10 Areas to Rent in Dhaka',
    slug: 'top-10-areas-dhaka',
    content: `
      # Top 10 Areas to Rent in Dhaka

      Dhaka, the bustling capital of Bangladesh, offers numerous residential areas for renters. Here are the top 10 areas you should consider:

      ## 1. Gulshan
      A prime location known for its modern amenities and international community.

      ## 2. Banani
      Popular among young professionals, with numerous restaurants and shopping centers.

      ## 3. Dhanmondi
      A classic residential area with a mix of educational institutions and residential spaces.

      ## 4. Uttara
      A planned residential area with good infrastructure and connectivity.

      ## 5. Mirpur
      An affordable area with good transportation links.

      ## 6. Bashundhara
      A modern residential area with gated communities and modern facilities.

      ## 7. Mohammadpur
      A diverse neighborhood with a mix of residential and commercial spaces.

      ## 8. Eskaton
      A central location with proximity to key city areas.

      ## 9. Lalmatia
      A quiet residential area popular among students and professionals.

      ## 10. Baridhara
      An upscale neighborhood with spacious apartments and diplomatic zones.

      **Disclaimer**: Rental prices and availability may vary. Always conduct thorough research before making a decision.
    `,
    excerpt: 'Discover the most sought-after residential areas in Dhaka for renting properties...',
    category: 'guide',
    author: 'Ahmed Khan',
    date: '2024-02-20',
    readTime: 5,
    coverImage: '/images/blog/dhaka-areas.jpg'
  };

  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const calculateReadingProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', calculateReadingProgress);
    return () => window.removeEventListener('scroll', calculateReadingProgress);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{mockPost.title} - House Rent BD Blog</title>
        <meta name="description" content={mockPost.excerpt} />
      </Head>

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary-600 z-50" 
        style={{ width: `${readingProgress}%` }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Back Button */}
        <Link href="/blog">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -left-16 top-0 hidden lg:block"
          >
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-full p-3 shadow-lg cursor-pointer">
              <FiArrowLeft className="w-6 h-6 text-gray-700" />
            </div>
          </motion.div>
        </Link>

        {/* Blog Post Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 md:p-12 shadow-lg"
        >
          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {mockPost.title}
            </h1>

            {/* Post Metadata */}
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <FiUser className="w-5 h-5" />
                <span>{mockPost.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-5 h-5" />
                <span>{mockPost.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock className="w-5 h-5" />
                <span>{mockPost.readTime} min read</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="mb-8 rounded-2xl overflow-hidden">
            <Image 
              src={mockPost.coverImage} 
              alt={mockPost.title}
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-full prose-headings:text-gray-900 prose-p:text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: mockPost.content }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;
