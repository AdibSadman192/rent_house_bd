/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Disable file watching for certain directories
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
      ],
      aggregateTimeout: 300,
      poll: 1000,
    };
    return config;
  },
  // Add rewrites for API calls
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
