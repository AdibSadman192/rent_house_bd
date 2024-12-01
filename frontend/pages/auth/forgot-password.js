import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement forgot password logic with API
      // const response = await sendPasswordResetEmail(email);
      // Handle successful email send
      console.log('Password reset attempted for:', email);
      setIsEmailSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - RentHouse BD</title>
        <meta 
          name="description" 
          content="Reset your password for RentHouse BD account." 
        />
      </Head>

      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            {/* Logo */}
            <div className="mb-8">
              <Link href="/" className="inline-block">
                <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  RentHouse BD
                </h1>
              </Link>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Reset your password
              </h2>
              <p className="mt-2 text-gray-600">
                Enter your email and we'll send you instructions to reset your password
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {isEmailSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Check your email
                </h2>
                <p className="text-gray-600 mb-8">
                  We have sent password reset instructions to your email address.
                  Please check your inbox and follow the instructions.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 w-full"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  ← Back to login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 z-10" />
          <Image
            src="/images/forgot-password-illustration.jpg"
            alt="Password Reset Illustration"
            layout="fill"
            objectFit="contain"
            className="object-center bg-gray-100 p-8"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20 bg-gradient-to-t from-black/80">
            <h2 className="text-3xl font-bold mb-2">
              Secure access to your RentHouse BD account
            </h2>
            <p className="text-lg text-gray-200">
              We take your account security seriously
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
