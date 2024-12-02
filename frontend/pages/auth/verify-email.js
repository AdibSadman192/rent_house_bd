import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const VerifyEmailPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setStatus('success');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const resendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      alert('Verification email has been resent. Please check your inbox.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Invalid Verification Link</h2>
          <p className="mt-1 text-sm text-gray-500">
            This email verification link is invalid or has expired.
          </p>
          <button
            onClick={resendVerification}
            className="mt-6 text-blue-600 hover:text-blue-500"
          >
            Resend verification email
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Verify Email | RentHouse BD</title>
        <meta name="description" content="Verify your email address for RentHouse BD" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verification
            </h2>
          </div>

          {status === 'loading' && (
            <div className="text-center">
              <Loader className="mx-auto h-8 w-8 text-blue-600 animate-spin" />
              <p className="mt-2 text-sm text-gray-600">
                Verifying your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md bg-green-50 p-4"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Email verified successfully!
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    Redirecting you to login...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                  <div className="mt-4">
                    <button
                      onClick={resendVerification}
                      className="text-sm text-red-800 underline hover:text-red-700"
                    >
                      Resend verification email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Return to login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default VerifyEmailPage;
