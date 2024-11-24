import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from '@/hooks/useSession';
import ProtectedRoute from '../ProtectedRoute';
import { useRouter } from 'next/router';

// Mock the useSession hook
jest.mock('@/hooks/useSession');

describe('ProtectedRoute', () => {
  const mockRouter = useRouter();
  const mockChild = <div>Protected Content</div>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should render loading spinner when authenticating', () => {
    useSession.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true
    });

    render(<ProtectedRoute>{mockChild}</ProtectedRoute>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', async () => {
    useSession.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false
    });

    render(<ProtectedRoute>{mockChild}</ProtectedRoute>);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('should render children when user is authenticated', () => {
    useSession.mockReturnValue({
      user: { id: 1, role: 'USER' },
      isAuthenticated: true,
      loading: false
    });

    render(<ProtectedRoute>{mockChild}</ProtectedRoute>);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when user does not have required role', async () => {
    useSession.mockReturnValue({
      user: { id: 1, role: 'USER' },
      isAuthenticated: true,
      loading: false
    });

    render(
      <ProtectedRoute requiredRole="ADMIN">
        {mockChild}
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/unauthorized');
    });
  });

  it('should render children when user has required role', () => {
    useSession.mockReturnValue({
      user: { id: 1, role: 'ADMIN' },
      isAuthenticated: true,
      loading: false
    });

    render(
      <ProtectedRoute requiredRole="ADMIN">
        {mockChild}
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
