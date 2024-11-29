// Environment Configuration
const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    debug: true,
    features: {
      mockData: true,
      performanceLogging: true
    }
  },
  production: {
    apiUrl: 'https://api.renthousebd.com/api',
    debug: false,
    features: {
      mockData: false,
      performanceLogging: false
    }
  },
  staging: {
    apiUrl: 'https://staging-api.renthousebd.com/api',
    debug: true,
    features: {
      mockData: false,
      performanceLogging: true
    }
  }
};

// Determine current environment
const getEnvironment = () => {
  const env = process.env.NEXT_PUBLIC_APP_ENV || 'development';
  return config[env] || config.development;
};

// Export configuration
export const ENV = getEnvironment();

// Feature flags
export const isFeatureEnabled = (feature) => {
  return ENV.features[feature] || false;
};

// Performance logging
export const logPerformance = (label, startTime) => {
  if (isFeatureEnabled('performanceLogging')) {
    const duration = performance.now() - startTime;
    console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
  }
};

export default {
  ENV,
  isFeatureEnabled,
  logPerformance
};
