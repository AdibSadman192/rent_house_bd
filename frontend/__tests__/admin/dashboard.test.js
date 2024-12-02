import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createMockAuthContext } from '../mocks/AuthContextMock';
import AdminDashboard from '@/pages/admin/index';
import { AuthContext } from '@/contexts/AuthContext';

// Mock the fetch function
global.fetch = jest.fn();

describe('Admin Dashboard', () => {
  const mockAdminUser = {
    id: '1',
    name: 'Admin User',
    role: 'admin',
  };

  beforeEach(() => {
    // Reset fetch mock
    global.fetch.mockReset();
  });

  it('renders dashboard for admin user', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(mockAdminUser);

    // Mock fetch responses
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          totalProperties: 50,
          totalUsers: 100,
          totalBookings: 75,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { id: '1', name: 'Recent Property 1' },
          { id: '2', name: 'Recent Property 2' },
        ]),
      });

    render(
      <MockAuthProvider>
        <AdminDashboard />
      </MockAuthProvider>
    );

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/Total Properties/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Bookings/i)).toBeInTheDocument();
    });
  });

  it('displays correct statistics', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(mockAdminUser);

    // Mock fetch responses with specific data
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          totalProperties: 50,
          totalUsers: 100,
          totalBookings: 75,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { id: '1', name: 'Recent Property 1' },
          { id: '2', name: 'Recent Property 2' },
        ]),
      });

    render(
      <MockAuthProvider>
        <AdminDashboard />
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument(); // Total Properties
      expect(screen.getByText('100')).toBeInTheDocument(); // Total Users
      expect(screen.getByText('75')).toBeInTheDocument(); // Total Bookings
    });
  });

  it('handles loading and error states', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(mockAdminUser);

    // Simulate error in fetch
    global.fetch.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <MockAuthProvider>
        <AdminDashboard />
      </MockAuthProvider>
    );

    // Wait for error state to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error loading dashboard/i)).toBeInTheDocument();
    });
  });
});
