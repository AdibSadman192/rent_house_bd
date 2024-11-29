import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';

// Routes that don't need a navbar/footer
const BLANK_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

const Layout = ({ children }) => {
  const router = useRouter();
  const { loading } = useAuth();

  useEffect(() => {
    // Smooth scroll to top on route change
    const handleRouteChange = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isBlankRoute = BLANK_ROUTES.includes(router.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isBlankRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {!isBlankRoute && (
        <>
          <Footer />
          <button
            id="scroll-to-top"
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-primary-600 text-white rounded-full shadow-lg opacity-0 pointer-events-none transition-opacity duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default Layout;
