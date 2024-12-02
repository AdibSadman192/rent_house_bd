import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMockAuthContext } from '../mocks/AuthContextMock';
import UserManagement from '@/pages/admin/users';

// Mock the fetch function
global.fetch = jest.fn();

describe('User Management Page', () => {
  const defaultAdminUser = {
    id: '1',
    name: 'Admin User',
    role: 'admin',
  };

  const mockNonAdminUser = {
    id: '2',
    name: 'Regular User',
    role: 'user',
  };

  const mockUsers = [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'admin',
      status: 'active'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'user',
      status: undefined
    }
  ];

  beforeEach(() => {
    // Reset fetch mock
    global.fetch.mockReset();
  });

  it('renders user management page for admin', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch response for users
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        users: mockUsers,
        total: mockUsers.length
      })
    });

    render(
      <MockAuthProvider>
        <UserManagement />
      </MockAuthProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('allows filtering users', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch response for users
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        users: mockUsers,
        total: mockUsers.length
      })
    });

    render(
      <MockAuthProvider>
        <UserManagement />
      </MockAuthProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate filtering by role
    const roleFilter = screen.getByLabelText(/Filter by Role/i);
    fireEvent.change(roleFilter, { target: { value: 'admin' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('handles user actions', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch responses
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          users: mockUsers,
          total: mockUsers.length
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'User updated successfully' })
      });

    render(
      <MockAuthProvider>
        <UserManagement />
      </MockAuthProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate edit action
    const editButtons = screen.getAllByText(/Edit/i);
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Edit User/i)).toBeInTheDocument();
    });
  });

  it('prevents non-admin access', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(mockNonAdminUser);

    render(
      <MockAuthProvider>
        <UserManagement />
      </MockAuthProvider>
    );

    // Wait for unauthorized message
    await waitFor(() => {
      expect(screen.getByText(/Unauthorized Access/i)).toBeInTheDocument();
    });
  });
});
