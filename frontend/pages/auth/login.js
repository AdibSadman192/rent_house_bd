/**
 * @fileoverview Login page component for RentHouse BD platform.
 * Handles email/password and social authentication with comprehensive error handling
 * and session management.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { ErrorTypes, AuthError, trackError, formatErrorMessage } from '../../lib/errorTracking';
import { SessionManager } from '../../lib/sessionRecovery';

// Animation variants for smooth transitions
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Loading animation variants
const loadingVariants = {
  start: {
    scale: 0.8,
    opacity: 0.5
  },
  end: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

/**
 * Loads Google OAuth SDK script with error handling.
 * @returns {Promise<Function>} Cleanup function to remove the script
 */
const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    try {
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        resolve(() => {}); // Script already loaded
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      script.onerror = () => {
        reject(new AuthError(
          ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
          'Failed to load Google authentication'
        ));
      };
      document.body.appendChild(script);
    } catch (error) {
      reject(new AuthError(
        ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
        'Error initializing Google authentication'
      ));
    }
  });
};

/**
 * Loads Facebook SDK script and initializes the FB object with error handling.
 * @returns {Promise<Function>} Cleanup function to remove the script
 */
const loadFacebookScript = () => {
  return new Promise((resolve, reject) => {
    try {
      // Check if FB SDK is already loaded
      if (typeof window.FB !== 'undefined') {
        resolve(() => {}); // SDK already loaded
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="connect.facebook.net"]')) {
        resolve(() => {}); // Script already being loaded
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      
      // Add FB init function to window before loading SDK
      window.fbAsyncInit = function() {
        try {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v17.0'
          });
        } catch (error) {
          reject(new AuthError(
            ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
            'Failed to initialize Facebook SDK'
          ));
        }
      };

      script.onload = () => resolve(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete window.fbAsyncInit;
      });

      script.onerror = () => {
        reject(new AuthError(
          ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
          'Failed to load Facebook authentication'
        ));
      };

      document.body.appendChild(script);
    } catch (error) {
      reject(new AuthError(
        ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
        'Error initializing Facebook authentication'
      ));
    }
  });
};

/**
 * LoginPage component handles user authentication through email/password
 * and social login methods.
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Form state management
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loadingState, setLoadingState] = useState('idle');
  const [error, setError] = useState('');

  /**
   * Handles loading state transitions with animation delays
   * @param {string} newState - The new loading state
   */
  const updateLoadingState = async (newState) => {
    if (newState === 'loading') {
      setLoadingState('loading');
    } else if (newState === 'success') {
      setLoadingState('success');
      await new Promise(resolve => setTimeout(resolve, 500)); // Success animation
    } else if (newState === 'error') {
      setLoadingState('error');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Error animation
      setLoadingState('idle');
    } else {
      setLoadingState('idle');
    }
  };

  // Load social SDKs with improved error handling
  useEffect(() => {
    let isMounted = true;
    let cleanup1 = () => {};
    let cleanup2 = () => {};

    const loadSDKs = async () => {
      try {
        // Load SDKs in parallel
        const [googleCleanup, facebookCleanup] = await Promise.allSettled([
          loadGoogleScript(),
          loadFacebookScript()
        ]);

        if (!isMounted) return;

        // Handle individual SDK loading results
        if (googleCleanup.status === 'fulfilled') {
          cleanup1 = googleCleanup.value;
        } else {
          console.error('Google SDK loading failed:', googleCleanup.reason);
          trackError(googleCleanup.reason, {
            component: 'LoginPage',
            action: 'loadGoogleSDK'
          });
        }

        if (facebookCleanup.status === 'fulfilled') {
          cleanup2 = facebookCleanup.value;
        } else {
          console.error('Facebook SDK loading failed:', facebookCleanup.reason);
          trackError(facebookCleanup.reason, {
            component: 'LoginPage',
            action: 'loadFacebookSDK'
          });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error loading social SDKs:', error);
        trackError(error, {
          component: 'LoginPage',
          action: 'loadSDKs'
        });
      }
    };

    loadSDKs();

    return () => {
      isMounted = false;
      cleanup1();
      cleanup2();
    };
  }, []);

  /**
   * Handles Google sign in
   * @returns {Promise<void>}
   */
  const handleGoogleLogin = async () => {
    try {
      setSocialLoading(prev => ({ ...prev, google: true }));
      await updateLoadingState('loading');

      // Initialize Google Sign-In
      const auth2 = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
          if (response.error) {
            throw new AuthError(
              ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
              'Google authentication failed'
            );
          }

          try {
            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: response.access_token,
                rememberMe: formData.rememberMe
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              throw new AuthError(
                ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
                data.message || 'Failed to authenticate with Google'
              );
            }

            await login(data.token, data.user);
            await updateLoadingState('success');
            
            if (formData.rememberMe) {
              await SessionManager.saveSession(data.token, data.user);
            }

            router.push(router.query.returnUrl || '/');
          } catch (error) {
            throw error;
          }
        },
      });

      auth2.requestAccessToken();
    } catch (error) {
      await trackError(error, {
        component: 'LoginPage',
        action: 'handleGoogleLogin',
      });
      await updateLoadingState('error');
      setError(formatErrorMessage(error));
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  /**
   * Handles Facebook sign in
   * @returns {Promise<void>}
   */
  const handleFacebookLogin = async () => {
    try {
      setSocialLoading(prev => ({ ...prev, facebook: true }));
      await updateLoadingState('loading');

      const response = await new Promise((resolve, reject) => {
        window.FB.login((response) => {
          if (response.authResponse) {
            resolve(response.authResponse);
          } else {
            reject(new AuthError(
              ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
              'Facebook authentication cancelled'
            ));
          }
        }, { scope: 'email,public_profile' });
      });

      const res = await fetch('/api/auth/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
          rememberMe: formData.rememberMe
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new AuthError(
          ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED,
          data.message || 'Failed to authenticate with Facebook'
        );
      }

      await login(data.token, data.user);
      await updateLoadingState('success');
      
      if (formData.rememberMe) {
        await SessionManager.saveSession(data.token, data.user);
      }

      router.push(router.query.returnUrl || '/');
    } catch (error) {
      await trackError(error, {
        component: 'LoginPage',
        action: 'handleFacebookLogin',
      });
      await updateLoadingState('error');
      setError(formatErrorMessage(error));
    } finally {
      setSocialLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  // Session recovery
  useEffect(() => {
    let isActive = true; // For cleanup
    const recoverSession = async () => {
      try {
        updateLoadingState('loading');
        const session = await SessionManager.validateAndRefreshSession();
        if (!isActive) return; // Prevent state updates if component unmounted

        if (session) {
          await login(session.token, session.user);
          await updateLoadingState('success');
          router.push(router.query.returnUrl || '/');
        } else {
          updateLoadingState('idle');
        }
      } catch (error) {
        if (!isActive) return;

        if (error.type !== ErrorTypes.AUTH.SESSION_EXPIRED) {
          await trackError(error, { 
            component: 'LoginPage', 
            action: 'recoverSession' 
          });
        }
        SessionManager.clearSession();
        await updateLoadingState('error');
      }
    };

    recoverSession();
    return () => {
      isActive = false;
    };
  }, [login, router]);

  /**
   * Handles form input changes
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Validates form data before submission
   * @returns {boolean} Whether the form data is valid
   */
  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission for email/password login
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateLoadingState('loading');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AuthError(
          ErrorTypes.AUTH.LOGIN_FAILED,
          data.message || 'Login failed'
        );
      }

      await login(data.token, data.user);
      await updateLoadingState('success');
      
      if (formData.rememberMe) {
        await SessionManager.saveSession(data.token, data.user);
      }

      router.push(router.query.returnUrl || '/');
    } catch (error) {
      await trackError(error, {
        component: 'LoginPage',
        action: 'handleSubmit',
        email: formData.email
      });
      
      await updateLoadingState('error');
      setError(formatErrorMessage(error));
    }
  };

  return (
    <>
      <Head>
        <title>Login - RentHouse BD</title>
        <meta 
          name="description" 
          content="Login to RentHouse BD to access your account and manage your properties." 
        />
      </Head>

      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="w-full max-w-md"
          >
            {/* Logo and Title */}
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <Link href="/" className="inline-block">
                <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  RentHouse BD
                </h1>
              </Link>
              <p className="text-gray-600 mt-2">
                Please enter your details to sign in
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                variants={fadeInUp}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email Input */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loadingState === 'loading'}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loadingState === 'loading'}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={loadingState === 'loading'}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loadingState === 'loading'}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loadingState === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </motion.form>

            {/* Social Login Section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={socialLoading.google || loadingState === 'loading'}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {socialLoading.google ? (
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Image
                        src="/images/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Google
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={socialLoading.facebook || loadingState === 'loading'}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {socialLoading.facebook ? (
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Image
                        src="/images/facebook.svg"
                        alt="Facebook"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Facebook
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 z-10" />
          <Image
            src="/images/login-illustration-blue.jpg"
            alt="Login Illustration"
            layout="fill"
            objectFit="contain"
            className="object-center bg-gray-50 p-12"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20 bg-gradient-to-t from-black/80">
            <h2 className="text-3xl font-bold mb-2">
              Find Your Dream Home in Bangladesh
            </h2>
            <p className="text-lg text-gray-200">
              Discover modern living spaces in prime locations
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
