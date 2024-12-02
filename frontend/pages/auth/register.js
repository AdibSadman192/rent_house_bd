import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useRouter } from 'next/router';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nidNumber: '',  
    password: '',
    confirmPassword: '',
    userType: 'renter',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateNID = (nid) => {
    // Bangladeshi NID validation rules
    // 1. Must be 10 or 17 digits long
    // 2. Should only contain numbers
    const nidRegex = /^(\d{10}|\d{17})$/;
    return nidRegex.test(nid);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.nidNumber || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate NID number (10 or 17 digits)
    if (!/^\d{10}$|^\d{17}$/.test(formData.nidNumber)) {
      setError('NID number must be either 10 or 17 digits');
      return;
    }

    // Validate phone number (BD format)
    if (!/^\+8801\d{9}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid Bangladeshi phone number (+8801XXXXXXXXX)');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Prepare the user data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        nidNumber: formData.nidNumber,
        password: formData.password,
        userType: formData.userType.toLowerCase(),
      };

      // Make API call to create account
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      // Show success message
      setSuccess(true);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Account - RentHouse BD</title>
        <meta 
          name="description" 
          content="Create your account on RentHouse BD to start your journey of finding the perfect rental property." 
        />
      </Head>

      <div className="min-h-screen flex">
        {/* Left Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="w-full max-w-md"
          >
            {/* Logo and Title */}
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <div className="mb-8">
                <Link href="/" className="inline-block">
                  <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    RentHouse BD
                  </h1>
                </Link>
                <p className="text-gray-600 mt-2">
                  Join RentHouse BD to find your perfect home
                </p>
              </div>
            </motion.div>

            {/* Success Message */}
            {success && (
              <motion.div
                variants={fadeInUp}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
              >
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Registration Successful!</h3>
                  <p className="mt-1 text-sm text-green-600">
                    Your account has been created. Redirecting you to login...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                variants={fadeInUp}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
              >
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Registration Form */}
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="firstName" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label 
                    htmlFor="lastName" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>

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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label 
                  htmlFor="phoneNumber" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* NID Number Input */}
              <div>
                <label 
                  htmlFor="nidNumber" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  NID Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="nidNumber"
                  name="nidNumber"
                  type="text"
                  required
                  value={formData.nidNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your National ID number"
                />
              </div>

              {/* User Type Selection */}
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative flex items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="userType"
                      value="renter"
                      checked={formData.userType === 'renter'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${formData.userType === 'renter' ? 'text-primary-600' : 'text-gray-700'}`}>
                      Renter
                    </span>
                    {formData.userType === 'renter' && (
                      <span className="absolute inset-0 border-2 border-primary-500 rounded-lg" />
                    )}
                  </label>
                  <label className="relative flex items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="userType"
                      value="owner"
                      checked={formData.userType === 'owner'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${formData.userType === 'owner' ? 'text-primary-600' : 'text-gray-700'}`}>
                      Property Owner
                    </span>
                    {formData.userType === 'owner' && (
                      <span className="absolute inset-0 border-2 border-primary-500 rounded-lg" />
                    )}
                  </label>
                </div>
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Create a password"
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

              {/* Confirm Password Input */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      href="/privacy"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                By registering, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </motion.form>
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 z-10" />
          <Image
            src="/images/house-register-illustration.jpg"
            alt="Property Search Illustration"
            layout="fill"
            objectFit="contain"
            className="object-center bg-gray-100 p-8"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20 bg-gradient-to-t from-black/80">
            <h2 className="text-3xl font-bold mb-2">
              Join Bangladesh's Premier Property Platform
            </h2>
            <p className="text-lg text-gray-200">
              Connect with trusted property owners and find your ideal home
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
