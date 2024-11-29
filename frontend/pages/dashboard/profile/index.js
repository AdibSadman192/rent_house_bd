import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Edit2,
  Save,
  Camera,
  X
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Adib Rahman',
    email: 'adib@example.com',
    phone: '+880 1234 567890',
    userType: 'owner',
    profileImage: '/images/avatars/default.png'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>User Profile - RentHouse BD</title>
      </Head>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100">
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </label>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.name}
          </h1>
          <p className="text-gray-600 capitalize">
            {profile.userType} Account
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Details
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              {isEditing ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <Mail className="w-5 h-5 mr-2 text-primary-600" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <Phone className="w-5 h-5 mr-2 text-primary-600" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <Shield className="w-5 h-5 mr-2 text-primary-600" />
                  Account Type
                </label>
                <p className="text-gray-900 capitalize">{profile.userType}</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Security Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="w-6 h-6 mr-4 text-primary-600" />
                <div>
                  <h3 className="text-gray-900 font-medium">
                    Change Password
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Secure your account with a strong password
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100">
                Change
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
