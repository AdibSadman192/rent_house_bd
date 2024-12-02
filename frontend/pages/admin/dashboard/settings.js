import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Settings,
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  Save,
} from 'lucide-react';

const DashboardSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      enableNotifications: true,
      dailyDigest: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: false,
      passwordExpiry: 90,
      sessionTimeout: 30,
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheTimeout: 3600,
    },
    api: {
      rateLimit: 100,
      timeout: 30,
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const settingsSections = [
    {
      title: 'Email Notifications',
      icon: Mail,
      settings: [
        {
          name: 'enableNotifications',
          label: 'Enable Email Notifications',
          description: 'Send email notifications for important updates',
          type: 'toggle',
          category: 'email',
        },
        {
          name: 'dailyDigest',
          label: 'Daily Digest',
          description: 'Receive a daily summary of platform activities',
          type: 'toggle',
          category: 'email',
        },
        {
          name: 'marketingEmails',
          label: 'Marketing Emails',
          description: 'Receive promotional emails and updates',
          type: 'toggle',
          category: 'email',
        },
      ],
    },
    {
      title: 'Security Settings',
      icon: Shield,
      settings: [
        {
          name: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Require 2FA for admin access',
          type: 'toggle',
          category: 'security',
        },
        {
          name: 'passwordExpiry',
          label: 'Password Expiry (days)',
          description: 'Days before password must be changed',
          type: 'number',
          category: 'security',
        },
        {
          name: 'sessionTimeout',
          label: 'Session Timeout (minutes)',
          description: 'Inactive session timeout duration',
          type: 'number',
          category: 'security',
        },
      ],
    },
    {
      title: 'System Settings',
      icon: Database,
      settings: [
        {
          name: 'maintenanceMode',
          label: 'Maintenance Mode',
          description: 'Enable maintenance mode for the platform',
          type: 'toggle',
          category: 'system',
        },
        {
          name: 'debugMode',
          label: 'Debug Mode',
          description: 'Enable detailed error logging',
          type: 'toggle',
          category: 'system',
        },
        {
          name: 'cacheTimeout',
          label: 'Cache Timeout (seconds)',
          description: 'Duration to cache API responses',
          type: 'number',
          category: 'system',
        },
      ],
    },
    {
      title: 'API Settings',
      icon: Globe,
      settings: [
        {
          name: 'rateLimit',
          label: 'Rate Limit (requests/minute)',
          description: 'Maximum API requests per minute',
          type: 'number',
          category: 'api',
        },
        {
          name: 'timeout',
          label: 'API Timeout (seconds)',
          description: 'Maximum API request duration',
          type: 'number',
          category: 'api',
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard Settings | RentHouse BD Admin</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Settings</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {settingsSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="flex items-center">
                    <section.icon className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                  {section.settings.map((setting) => (
                    <div key={setting.name} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                      <label
                        htmlFor={setting.name}
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        {setting.label}
                        <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        {setting.type === 'toggle' ? (
                          <button
                            type="button"
                            onClick={() => handleSettingChange(
                              setting.category,
                              setting.name,
                              !settings[setting.category][setting.name]
                            )}
                            className={`${
                              settings[setting.category][setting.name]
                                ? 'bg-blue-600'
                                : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            <span
                              className={`${
                                settings[setting.category][setting.name]
                                  ? 'translate-x-5'
                                  : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            />
                          </button>
                        ) : (
                          <input
                            type="number"
                            id={setting.name}
                            value={settings[setting.category][setting.name]}
                            onChange={(e) => handleSettingChange(
                              setting.category,
                              setting.name,
                              parseInt(e.target.value)
                            )}
                            className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed bottom-4 right-4 bg-green-50 p-4 rounded-md shadow-lg"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Settings saved successfully
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

DashboardSettings.requireAuth = true;
DashboardSettings.requireAdmin = true;

export default DashboardSettings;
