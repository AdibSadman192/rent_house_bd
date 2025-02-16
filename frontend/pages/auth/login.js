/**
 * @fileoverview Login page component for RentHouse BD platform.
 * Handles email/password authentication with comprehensive error handling
 * and session management.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting...', user);
      const route = user.role === 'admin' || user.role === 'super_admin' 
        ? '/admin/dashboard'
        : user.role === 'owner' 
          ? '/owner/dashboard' 
          : '/dashboard';
      
      router.replace(route);
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    console.log('Starting login process...');
    
    try {
      console.log('Submitting login credentials...');
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);

      if (!result.success) {
        console.log('Login failed:', result.error);
        toast.error(result.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      console.log('Login successful, preparing navigation...');
      toast.success('Login successful!');

      // Wait a bit for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Determine the route
      let route = '/dashboard';
      if (result.user) {
        console.log('User role:', result.user.role);
        if (result.user.role === 'admin' || result.user.role === 'super_admin') {
          route = '/admin/dashboard';
        } else if (result.user.role === 'owner') {
          route = '/owner/dashboard';
        }
      }

      console.log('Navigating to:', route);
      // Use replace instead of push to prevent back navigation to login
      await router.replace(route);
      
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Welcome back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-sm text-gray-600"
          >
            Sign in to your RentHouse BD account
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-lg border border-gray-200/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-400 bg-white/60 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-2.5 text-gray-900 placeholder-gray-400 bg-white/60 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 flex justify-center items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Links */}
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
