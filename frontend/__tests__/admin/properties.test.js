import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMockAuthContext } from '../mocks/AuthContextMock';
import PropertyManagement from '@/pages/admin/properties';

// Mock the fetch function
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      properties: [
        {
          id: '1',
          title: 'Test Property',
          type: 'Apartment',
          status: 'active',
          location: 'Test Location',
          price: 1000,
          bedrooms: 2,
          bathrooms: 1
        }
      ],
      total: 1
    })
  })
);

// Mock Next.js Head component
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => children
  };
});

describe('Property Management Page', () => {
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

  const mockProperties = [
    { 
      id: '1', 
      title: 'Luxury Apartment', 
      location: 'Dhaka', 
      price: 5000, 
      status: 'Available' 
    },
    { 
      id: '2', 
      title: 'Cozy Studio', 
      location: 'Chittagong', 
      price: 3000, 
      status: 'Rented' 
    }
  ];

  beforeEach(() => {
    // Reset fetch mock
    global.fetch.mockReset();
  });

  it('renders property management page for admin', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch response for properties
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProperties)
    });

    render(
      <MockAuthProvider>
        <PropertyManagement />
      </MockAuthProvider>
    );

    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
      expect(screen.getByText('Cozy Studio')).toBeInTheDocument();
    });
  });

  it('allows filtering properties', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch response for properties
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProperties)
    });

    render(
      <MockAuthProvider>
        <PropertyManagement />
      </MockAuthProvider>
    );

    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    });

    // Simulate filtering by location
    const locationFilter = screen.getByLabelText(/Filter by Location/i);
    fireEvent.change(locationFilter, { target: { value: 'Dhaka' } });

    await waitFor(() => {
      expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
      expect(screen.queryByText('Cozy Studio')).not.toBeInTheDocument();
    });
  });

  it('handles property actions', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch responses
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProperties)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Property updated successfully' })
      });

    render(
      <MockAuthProvider>
        <PropertyManagement />
      </MockAuthProvider>
    );

    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    });

    // Simulate edit action
    const editButtons = screen.getAllByText(/Edit/i);
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Edit Property/i)).toBeInTheDocument();
    });
  });

  it('prevents non-admin access', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(mockNonAdminUser);

    render(
      <MockAuthProvider>
        <PropertyManagement />
      </MockAuthProvider>
    );

    // Wait for unauthorized message
    await waitFor(() => {
      expect(screen.getByText(/Unauthorized Access/i)).toBeInTheDocument();
    });
  });
});
