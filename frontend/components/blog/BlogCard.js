import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiUser } from 'react-icons/fi';

const BlogCard = ({ post }) => {
  return (
    <motion.div
      className="group relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
          {/* Blog Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Blog Content */}
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {post.title}
            </h3>
            
            <p className="text-gray-600 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
