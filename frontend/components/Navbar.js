import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/AuthContext';
import { useSession } from 'hooks/useSession';
import { FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Navbar = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { user, isAuthenticated, notifications, clearNotifications } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      clearNotifications();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Rent House BD"
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/properties" className="nav-link">
                Properties
              </Link>
              <Link href="/posts" className="nav-link">
                Posts
              </Link>
              {isAuthenticated && (
                <Link href="/chat" className="nav-link">
                  Chat
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <div className="relative ml-3">
                  <button
                    onClick={toggleNotifications}
                    className="p-1 rounded-full hover:bg-gray-100 relative"
                  >
                    <FaBell className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                    )}
                  </button>
                  {showNotifications && notifications.length > 0 && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      {notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {notification.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative ml-3">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.avatar || '/default-avatar.png'}
                      alt={user?.name}
                    />
                    <span className="hidden md:block">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="btn-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-secondary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
