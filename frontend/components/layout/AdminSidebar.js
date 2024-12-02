import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText, 
  Settings 
} from 'lucide-react';

const AdminSidebar = () => {
  const adminMenuItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users
    },
    {
      label: 'Properties',
      href: '/admin/properties',
      icon: Home
    },
    {
      label: 'Reports',
      href: '/admin/reports',
      icon: FileText
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  return (
    <div className="w-64 bg-white shadow-md h-full fixed left-0 top-0 pt-16 z-40">
      <nav className="p-4">
        {adminMenuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className="flex items-center p-3 hover:bg-gray-100 rounded-md transition-colors"
          >
            <item.icon className="mr-3 text-gray-600" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
