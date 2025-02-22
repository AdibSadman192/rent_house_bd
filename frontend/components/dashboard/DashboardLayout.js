import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiLayout, FiHome, FiCalendar, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { FiLogOut as FiLogOutIcon } from 'react-icons/fi';

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
      {/* Fixed Navigation Panel */}
      <aside className="fixed left-0 top-0 h-full w-16 hover:w-64 bg-white shadow-lg z-50 transition-all duration-300 ease-in-out overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Navigation Menu */}
          <nav className="flex-1 pt-4 space-y-2">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm transition-all duration-200
                  group hover:bg-primary-50
                  ${router.pathname === item.href
                    ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-primary-600" />
                <span className="ml-4 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600
                hover:bg-red-50 transition-all duration-200 group rounded-lg"
            >
              <FiLogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-700" />
              <span className="ml-4 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-16">
        <main className="p-6 overflow-y-auto min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
