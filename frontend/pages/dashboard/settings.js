import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FiSettings, 
  FiUser, 
  FiLock, 
  FiBell, 
  FiShield, 
  FiAlertTriangle 
} from 'react-icons/fi';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [userSettings, setUserSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      avatar: ''
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user settings when component mounts or user changes
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/user/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user settings');
        }

        const data = await response.json();
        setUserSettings(data);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  const updateSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSettings),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      setUserSettings(data);
      setError(null);
    } catch (error) {
      console.error('Error updating settings:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img 
            src={userSettings.profile.avatar || '/default-avatar.png'} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-500">JPG or PNG, max 5MB</p>
          <input 
            type="file" 
            accept="image/jpeg,image/png"
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input 
            type="text" 
            value={userSettings.profile.name}
            onChange={(e) => setUserSettings(prev => ({
              ...prev, 
              profile: { ...prev.profile, name: e.target.value }
            }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" 
            value={userSettings.profile.email}
            onChange={(e) => setUserSettings(prev => ({
              ...prev, 
              profile: { ...prev.profile, email: e.target.value }
            }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <FiShield className="w-6 h-6 text-primary-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
          </div>
        </div>
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={userSettings.security.twoFactorAuth}
            onChange={(e) => setUserSettings(prev => ({
              ...prev, 
              security: { ...prev.security, twoFactorAuth: e.target.checked }
            }))}
            className="hidden"
          />
          <div className={`w-12 h-6 rounded-full transition-colors ${
            userSettings.security.twoFactorAuth ? 'bg-primary-500' : 'bg-gray-300'
          }`}>
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
              userSettings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Login Alerts</h3>
            <p className="text-xs text-gray-500">Get notified of any unusual login activity</p>
          </div>
        </div>
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={userSettings.security.loginAlerts}
            onChange={(e) => setUserSettings(prev => ({
              ...prev, 
              security: { ...prev.security, loginAlerts: e.target.checked }
            }))}
            className="hidden"
          />
          <div className={`w-12 h-6 rounded-full transition-colors ${
            userSettings.security.loginAlerts ? 'bg-primary-500' : 'bg-gray-300'
          }`}>
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
              userSettings.security.loginAlerts ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </div>
        </label>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <FiBell className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Email Notifications</h3>
            <p className="text-xs text-gray-500">Receive email updates about your account</p>
          </div>
        </div>
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={userSettings.notifications.emailNotifications}
            onChange={(e) => setUserSettings(prev => ({
              ...prev, 
              notifications: { ...prev.notifications, emailNotifications: e.target.checked }
            }))}
            className="hidden"
          />
          <div className={`w-12 h-6 rounded-full transition-colors ${
            userSettings.notifications.emailNotifications ? 'bg-primary-500' : 'bg-gray-300'
          }`}>
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
              userSettings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <FiUser className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">SMS Notifications</h3>
            <p className="text-xs text-gray-500">Get SMS alerts for important updates</p>
          </div>
        </div>
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={userSettings.notifications.smsNotifications}
            onChange={(e) => setUserSettings(prev => ({
              ...prev, 
              notifications: { ...prev.notifications, smsNotifications: e.target.checked }
            }))}
            className="hidden"
          />
          <div className={`w-12 h-6 rounded-full transition-colors ${
            userSettings.notifications.smsNotifications ? 'bg-primary-500' : 'bg-gray-300'
          }`}>
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
              userSettings.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </div>
        </label>
      </div>
    </div>
  );

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Account Settings | RentHouseBD</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FiSettings className="mr-3 text-primary-600" /> Account Settings
          </h1>

          <div className="grid grid-cols-12 gap-6 bg-white rounded-xl shadow-soft">
            {/* Sidebar Navigation */}
            <div className="col-span-3 border-r border-gray-100 p-6">
              <nav className="space-y-2">
                {[
                  { 
                    key: 'profile', 
                    label: 'Profile', 
                    icon: FiUser 
                  },
                  { 
                    key: 'security', 
                    label: 'Security', 
                    icon: FiLock 
                  },
                  { 
                    key: 'notifications', 
                    label: 'Notifications', 
                    icon: FiBell 
                  }
                ].map(section => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                      activeSection === section.key 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="mr-3 w-5 h-5" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="col-span-9 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {activeSection} Settings
                </h2>
                <button 
                  onClick={updateSettings}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {activeSection === 'profile' && renderProfileSection()}
              {activeSection === 'security' && renderSecuritySection()}
              {activeSection === 'notifications' && renderNotificationsSection()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
