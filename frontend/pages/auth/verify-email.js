import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineMailOpen, HiOutlineExclamation } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying');
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      // TODO: Implement email verification logic using the token
      setStatus('success');
      toast.success('Email verified successfully');
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (error) {
      setStatus('error');
      toast.error(error.message || 'Failed to verify email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {status === 'verifying' && (
          <>
            <div className="animate-pulse">
              <HiOutlineMailOpen className="mx-auto h-16 w-16 text-blue-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verifying your email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          </>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <HiOutlineMailOpen className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been successfully verified. Redirecting you to login...
            </p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <HiOutlineExclamation className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We couldn&apos;t verify your email address. The link may be invalid or expired.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Return to Login
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
