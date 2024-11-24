import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaChartBar, FaUsers, FaHome, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useSession } from '@/hooks/useSession';
import { ROLES } from '@/config/roles';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { user } = useSession();

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <FaChartBar />, 
      href: '/admin' 
    },
    { 
      label: 'Users', 
      icon: <FaUsers />, 
      href: '/admin/users' 
    },
    { 
      label: 'Properties', 
      icon: <FaHome />, 
      href: '/admin/properties' 
    },
    {
      label: 'Settings',
      icon: <FaCog />,
      href: '/admin/settings',
      role: ROLES.SUPER_ADMIN
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="text-xl font-bold text-gray-800">
              Admin Panel
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              if (item.role && user?.role !== item.role) return null;
              
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="flex items-center p-4 border-t">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-margin duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
