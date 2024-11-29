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
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="w-full max-w-md"
          >
            {/* Logo and Title */}
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <Image
                  src="/images/logo.png"
                  alt="RentHouse BD"
                  width={180}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Reset your password
              </h1>
              <p className="text-gray-600 mt-2">
                Enter your email and we'll send you instructions to reset your password
              </p>
            </motion.div>

            {/* Back to Login */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
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

            {/* Success Message */}
            {isEmailSent ? (
              <motion.div
                variants={fadeInUp}
                className="text-center"
              >
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
              </motion.div>
            ) : (
              /* Reset Password Form */
              <motion.form
                variants={fadeInUp}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </motion.form>
            )}
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block relative flex-1">
          <Image
            src="/images/auth-bg-3.jpg"
            alt="Cozy home office"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <blockquote className="text-2xl font-display font-medium mb-4">
              "Secure access to your RentHouse BD account."
            </blockquote>
            <p className="text-white/80">
              We take your account security seriously
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
