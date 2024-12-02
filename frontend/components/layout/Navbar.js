import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, User, LogOut, Home, Search, PlusCircle, Bell, Settings, Info, Mail, Building2, Users, Heart, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileDropdown from '@/components/ProfileDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Add check for About and Contact pages
  const isAboutOrContact = router.pathname === '/about' || router.pathname === '/contact';

  useEffect(() => {
    const handleScroll = () => {
      // Always show background on About/Contact pages, otherwise check scroll
      setIsScrolled(isAboutOrContact || window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Trigger initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAboutOrContact]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Agents', href: '/agents', icon: Users },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const userNavigation = [
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Help Center', href: '/help', icon: HelpCircle },
  ];

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', closeMenu);
    return () => router.events.off('routeChangeComplete', closeMenu);
  }, [router]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen || isAboutOrContact ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 z-10"
            onClick={closeMenu}
          >
            <span className={`text-xl font-bold ${
              isScrolled || isOpen || isAboutOrContact ? 'text-primary-600' : 'text-white'
            }`}>
              RentHouse<span className="text-primary-500">BD</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(({ href, name, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-1 ${
                  isScrolled || isAboutOrContact ? 'text-gray-700' : 'text-white'
                } hover:text-primary-500 transition-colors`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{name}</span>
              </Link>
            ))}
            {!user ? (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <ProfileDropdown />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-4 space-y-4">
            {navigation.map(({ href, name, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
                onClick={closeMenu}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{name}</span>
              </Link>
            ))}
            {userNavigation.map(({ href, name, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
                onClick={closeMenu}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{name}</span>
              </Link>
            ))}
            {!user ? (
              <Link
                href="/auth/login"
                className="block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            ) : (
              <div className="pt-2 border-t border-gray-100">
                <ProfileDropdown />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
