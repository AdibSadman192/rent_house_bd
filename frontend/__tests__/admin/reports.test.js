import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMockAuthContext } from '../mocks/AuthContextMock';
import ReportsAndAnalytics from '@/pages/admin/reports';

// Mock the fetch function
global.fetch = jest.fn();

// Mock Chart.js to prevent rendering issues
jest.mock('chart.js/auto', () => ({}));
jest.mock('react-chartjs-2', () => ({
  Pie: () => null,
  Bar: () => null,
  Line: () => null,
}));

describe('Reports and Analytics Page', () => {
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

  const mockReportData = {
    topLocations: [
      { location: 'Dhaka', count: 50 },
      { location: 'Chittagong', count: 30 },
    ],
    bookingTrends: [
      { month: 'January', count: 20 },
      { month: 'February', count: 25 },
    ],
    propertyTypes: [
      { type: 'Apartment', count: 40 },
      { type: 'Studio', count: 25 },
    ],
  };

  beforeEach(() => {
    // Reset fetch mock
    global.fetch.mockReset();
  });

  it('renders reports page for admin', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch response for reports
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockReportData)
    });

    render(
      <MockAuthProvider>
        <ReportsAndAnalytics />
      </MockAuthProvider>
    );

    // Wait for reports to load
    await waitFor(() => {
      expect(screen.getByText(/Reports and Analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/Top Locations/i)).toBeInTheDocument();
      expect(screen.getByText(/Booking Trends/i)).toBeInTheDocument();
    });
  });

  it('allows date range selection', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch response for reports
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReportData)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          topLocations: [
            { location: 'Dhaka', count: 60 },
            { location: 'Chittagong', count: 40 },
          ],
          bookingTrends: [
            { month: 'March', count: 30 },
            { month: 'April', count: 35 },
          ],
          propertyTypes: [
            { type: 'Apartment', count: 50 },
            { type: 'Studio', count: 35 },
          ],
        })
      });

    render(
      <MockAuthProvider>
        <ReportsAndAnalytics />
      </MockAuthProvider>
    );

    // Wait for initial reports to load
    await waitFor(() => {
      expect(screen.getByText(/Top Locations/i)).toBeInTheDocument();
    });

    // Simulate date range selection
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);
    
    fireEvent.change(startDateInput, { target: { value: '2023-03-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-04-30' } });

    const applyButton = screen.getByText(/Apply/i);
    fireEvent.click(applyButton);

    // Wait for updated reports
    await waitFor(() => {
      expect(screen.getByText('March')).toBeInTheDocument();
      expect(screen.getByText('April')).toBeInTheDocument();
    });
  });

  it('displays top locations data', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Mock fetch response for reports
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockReportData)
    });

    render(
      <MockAuthProvider>
        <ReportsAndAnalytics />
      </MockAuthProvider>
    );

    // Wait for reports to load
    await waitFor(() => {
      expect(screen.getByText('Dhaka')).toBeInTheDocument();
      expect(screen.getByText('Chittagong')).toBeInTheDocument();
    });
  });

  it('handles data fetching errors', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(defaultAdminUser);

    // Simulate fetch error
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch reports'));

    render(
      <MockAuthProvider>
        <ReportsAndAnalytics />
      </MockAuthProvider>
    );

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading reports/i)).toBeInTheDocument();
    });
  });

  it('prevents non-admin access', async () => {
    const { mockAuthContext, MockAuthProvider } = createMockAuthContext(mockNonAdminUser);

    render(
      <MockAuthProvider>
        <ReportsAndAnalytics />
      </MockAuthProvider>
    );

    // Wait for unauthorized message
    await waitFor(() => {
      expect(screen.getByText(/Unauthorized Access/i)).toBeInTheDocument();
    });
  });
});
