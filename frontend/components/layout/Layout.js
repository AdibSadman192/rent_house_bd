import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const router = useRouter();

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

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="flex-grow pt-16"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />

      {/* Scroll to Top Button */}
      <button
        id="scroll-to-top"
        onClick={scrollToTop}
        className="fixed right-6 bottom-6 p-3 bg-white rounded-xl shadow-soft text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all opacity-0 pointer-events-none"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Layout;
