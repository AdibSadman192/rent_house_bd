import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import SessionManager from '@/services/sessionManager';

// Routes that don't need a navbar
const BLANK_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

// Routes that don't need a footer
const NO_FOOTER_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/dashboard',
  '/admin/dashboard',
  '/profile',
  '/settings'
];

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  '/owner',
  '/properties/create',
  '/properties/edit',
  '/bookings',
  '/messages',
  '/favorites'
];

const Layout = ({ children }) => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [pageLoading, setPageLoading] = useState(false);

  // Handle route changes and session validation
  useEffect(() => {
    const validateSession = async (url) => {
      if (!PROTECTED_ROUTES.some(route => url.startsWith(route))) {
        return true;
      }

      try {
        const session = await SessionManager.validateAndRefreshSession();
        return !!session?.user;
      } catch (error) {
        console.error('Session validation failed:', error);
        return false;
      }
    };

    const handleRouteChangeStart = async (url) => {
      setPageLoading(true);

      if (PROTECTED_ROUTES.some(route => url.startsWith(route))) {
        const isValid = await validateSession(url);
        if (!isValid) {
          SessionManager.saveIntendedRoute(url);
          router.push('/auth/login');
          setPageLoading(false);
          return;
        }
      }
    };

    const handleRouteChangeComplete = () => {
      setPageLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRouteChangeError = (err) => {
      setPageLoading(false);
      if (!err.cancelled) {
        console.error('Route change error:', err);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  // Scroll to top button visibility
  useEffect(() => {
    const scrollBtn = document.getElementById('scroll-to-top');
    const toggleScrollBtn = () => {
      if (scrollBtn) {
        if (window.scrollY > 300) {
          scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
          scrollBtn.classList.add('opacity-0', 'pointer-events-none');
        }
      }
    };

    window.addEventListener('scroll', toggleScrollBtn);
    return () => window.removeEventListener('scroll', toggleScrollBtn);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">
            {loading ? 'Checking authentication...' : 'Loading page...'}
          </p>
        </div>
      </div>
    );
  }

  const isBlankRoute = BLANK_ROUTES.includes(router.pathname);
  const shouldShowFooter = !NO_FOOTER_ROUTES.some(route => router.pathname.startsWith(route));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isBlankRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`flex-grow ${!isBlankRoute ? 'pt-14' : ''}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {shouldShowFooter && <Footer />}
      
      <button
        id="scroll-to-top"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-2 bg-white text-gray-600 rounded-full shadow-md opacity-0 pointer-events-none transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-40"
        aria-label="Scroll to top"
      >
        <FiArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Layout;
