import React from 'react';
import Head from 'next/head';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';

const AdminLayout = ({ children, title }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p>You must be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>{title} | RentHouse BD Admin</title>
      </Head>
      
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
