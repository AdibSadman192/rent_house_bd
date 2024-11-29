/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx'],
  images: {
    domains: ['cdni.iconscout.com'],
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, '.');
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        '**/public/**',
      ],
      aggregateTimeout: 300,
      poll: 1000,
    };
    return config;
  }
};

module.exports = nextConfig;
