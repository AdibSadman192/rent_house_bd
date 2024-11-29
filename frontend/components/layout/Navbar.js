import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, User, LogOut, Home, Search, PlusCircle, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const publicNavLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Search },
    { href: '/about', label: 'About', icon: null },
    { href: '/contact', label: 'Contact', icon: null },
  ];

  const authNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: User },
    { href: '/list-property', label: 'List Property', icon: PlusCircle },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const activeNavLinks = user ? [...publicNavLinks, ...authNavLinks] : publicNavLinks;

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
        isScrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
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
              isScrolled || isOpen ? 'text-primary-600' : 'text-white'
            }`}>
              RentHouse<span className="text-primary-500">BD</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {activeNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-1 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } hover:text-primary-500 transition-colors`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
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
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
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
            {activeNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
                onClick={closeMenu}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
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
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
