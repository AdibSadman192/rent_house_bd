import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiLayout, FiHome, FiCalendar, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const menuItems = [
  {
    label: 'Dashboard',
    icon: FiLayout,
    href: '/dashboard',
  },
  {
    label: 'My Properties',
    icon: FiHome,
    href: '/dashboard/properties',
    ownerOnly: true,
  },
  {
    label: 'My Rentals',
    icon: FiHome,
    href: '/dashboard/rentals',
    renterOnly: true,
  },
  {
    label: 'Bookings',
    icon: FiCalendar,
    href: '/dashboard/bookings',
  },
  {
    label: 'Messages',
    icon: FiMessageSquare,
    href: '/dashboard/messages',
  },
  {
    label: 'Settings',
    icon: FiSettings,
    href: '/dashboard/settings',
  },
];

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Handle window resize and mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [router.pathname, isMobile]);

  // Mock user data (replace with actual user data from context)
  const user = {
    role: 'owner', // or 'renter'
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (item.ownerOnly && user.role !== 'owner') return false;
    if (item.renterOnly && user.role !== 'renter') return false;
    return true;
  });

  const handleLogout = async () => {
    router.push('/auth/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col h-screen overflow-hidden
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0`}
      >
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 md:hidden"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col h-full">
          {/* Navigation Menu */}
          <nav className="flex-1 pt-4 px-4 space-y-1 overflow-y-auto scrollbar-thin">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200
                  group hover:bg-gray-50
                  ${router.pathname === item.href
                    ? 'text-primary-600 bg-primary-50 font-medium shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3.5 flex-shrink-0 
                  group-hover:text-primary-600" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-lg 
                hover:bg-red-50 transition-all duration-200 group"
            >
              <FiLogOut className="w-5 h-5 mr-3.5 flex-shrink-0 
                group-hover:text-red-700" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 p-2 text-gray-600 bg-white rounded-lg 
              hover:bg-gray-100 focus:outline-none focus:ring-2 
              focus:ring-primary-500 focus:ring-offset-2 shadow-md"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
