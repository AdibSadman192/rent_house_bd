import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiSearch, FiHeart, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm h-14' : 'bg-white h-14'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-gray-900">
            RentHouseBD
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/search" 
              className={`text-sm ${router.pathname === '/search' ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Properties
            </Link>
            <Link 
              href="/agents" 
              className={`text-sm ${router.pathname === '/agents' ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Agents
            </Link>
            <Link 
              href="/about" 
              className={`text-sm ${router.pathname === '/about' ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm ${router.pathname === '/contact' ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/search" 
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiSearch className="h-4 w-4" />
            </Link>
            {user ? (
              <>
                <Link 
                  href="/favorites" 
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FiHeart className="h-4 w-4" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 p-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none">
                    <FiUser className="h-4 w-4" />
                    <span>{user.name?.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-1 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/search" 
                className={`block text-sm ${router.pathname === '/search' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                Properties
              </Link>
              <Link 
                href="/agents" 
                className={`block text-sm ${router.pathname === '/agents' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                Agents
              </Link>
              <Link 
                href="/about" 
                className={`block text-sm ${router.pathname === '/about' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`block text-sm ${router.pathname === '/contact' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              {!user && (
                <Link 
                  href="/auth/login" 
                  className="block text-sm text-primary-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
