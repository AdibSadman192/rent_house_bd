import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Settings as SettingsIcon,
  Server,
  Shield,
  Mail,
  Bell,
  Lock,
  Database,
} from 'lucide-react';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    systemConfig: {
      maintenance: false,
      maxPropertyListings: 10,
      defaultListingDuration: 30,
    },
    securitySettings: {
      twoFactorAuth: false,
      passwordComplexity: 'medium',
      maxLoginAttempts: 5,
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
    emailSettings: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpSecure: true,
    },
    databaseConfig: {
      backupFrequency: 'daily',
      retentionPeriod: 30,
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCurrentSettings = async () => {
      try {
        const response = await fetch('/api/admin/platform-settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchCurrentSettings();
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      await fetch('/api/admin/platform-settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const renderSettingSection = (title, icon, category, settings) => {
    const Icon = icon;
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Icon className="mr-3 text-blue-600" />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center mb-4">
            <span className="text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
            {typeof value === 'boolean' ? (
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleSettingChange(category, key, !value)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                {value ? 'Enabled' : 'Disabled'}
              </label>
            ) : (
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => handleSettingChange(category, key, 
                  typeof value === 'number' ? Number(e.target.value) : e.target.value
                )}
                disabled={!isEditing}
                className="border rounded-md p-2 w-1/2"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <SettingsIcon className="mr-3 text-blue-600" /> 
              Platform Settings
            </h1>
            <div className="space-x-4">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Settings
                </button>
              ) : (
                <>
                  <button 
                    onClick={saveSettings}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSettingSection(
              'System Configuration', 
              Server, 
              'systemConfig', 
              settings.systemConfig
            )}
            {renderSettingSection(
              'Security Settings', 
              Shield, 
              'securitySettings', 
              settings.securitySettings
            )}
            {renderSettingSection(
              'Notification Settings', 
              Bell, 
              'notificationSettings', 
              settings.notificationSettings
            )}
            {renderSettingSection(
              'Email Configuration', 
              Mail, 
              'emailSettings', 
              settings.emailSettings
            )}
            {renderSettingSection(
              'Database Configuration', 
              Database, 
              'databaseConfig', 
              settings.databaseConfig
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default PlatformSettings;
