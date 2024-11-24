import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from '@/hooks/useSession';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock API calls
jest.mock('@/services/api', () => ({
  login: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn()
}));

describe('Authentication and Session Management', () => {
  const mockRouter = {
    push: jest.fn(),
    pathname: '/'
  };

  const mockUsers = {
    user: {
      id: '1',
      email: 'user@example.com',
      role: 'user',
      token: 'user-token'
    },
    renter: {
      id: '2',
      email: 'renter@example.com',
      role: 'renter',
      token: 'renter-token'
    },
    admin: {
      id: '3',
      email: 'admin@example.com',
      role: 'admin',
      token: 'admin-token'
    },
    superadmin: {
      id: '4',
      email: 'superadmin@example.com',
      role: 'superadmin',
      token: 'superadmin-token'
    }
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Login Functionality', () => {
    test.each([
      ['user', mockUsers.user],
      ['renter', mockUsers.renter],
      ['admin', mockUsers.admin],
      ['superadmin', mockUsers.superadmin]
    ])('should successfully log in as %s', async (role, userData) => {
      const { login } = require('@/services/api');
      login.mockResolvedValueOnce({ data: userData });

      let session;
      const TestComponent = () => {
        session = useSession();
        return null;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await act(async () => {
        await session.login({
          email: userData.email,
          password: 'password123'
        });
      });

      expect(session.user).toEqual(userData);
      expect(session.isAuthenticated).toBe(true);
      expect(session.role).toBe(role);
      expect(localStorage.getItem('token')).toBe(userData.token);
    });
  });

  describe('Session Management', () => {
    test.each([
      ['user', mockUsers.user, ['/profile', '/bookings']],
      ['renter', mockUsers.renter, ['/profile', '/properties']],
      ['admin', mockUsers.admin, ['/admin/users', '/admin/properties']],
      ['superadmin', mockUsers.superadmin, ['/admin/users', '/admin/settings']]
    ])('should maintain %s session and access control', async (role, userData, allowedPaths) => {
      // Setup initial authenticated session
      localStorage.setItem('token', userData.token);
      const { refreshToken } = require('@/services/api');
      refreshToken.mockResolvedValueOnce({ data: userData });

      let session;
      const TestComponent = () => {
        session = useSession();
        return null;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for session to initialize
      await waitFor(() => {
        expect(session.isAuthenticated).toBe(true);
      });

      // Test allowed paths
      for (const path of allowedPaths) {
        mockRouter.pathname = path;
        const { container } = render(
          <AuthProvider>
            <ProtectedRoute allowedRoles={[role]}>
              <div data-testid="protected-content">Protected Content</div>
            </ProtectedRoute>
          </AuthProvider>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      }

      // Test forbidden path
      mockRouter.pathname = '/admin/superadmin-only';
      render(
        <AuthProvider>
          <ProtectedRoute allowedRoles={['superadmin']}>
            <div data-testid="forbidden-content">Forbidden Content</div>
          </ProtectedRoute>
        </AuthProvider>
      );

      if (role !== 'superadmin') {
        expect(mockRouter.push).toHaveBeenCalledWith('/unauthorized');
      }
    });

    test('should handle session expiration', async () => {
      const { refreshToken, login } = require('@/services/api');
      refreshToken.mockRejectedValueOnce(new Error('Token expired'));
      login.mockRejectedValueOnce(new Error('Invalid credentials'));

      let session;
      const TestComponent = () => {
        session = useSession();
        return null;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await act(async () => {
        await session.login({
          email: 'test@example.com',
          password: 'wrong-password'
        });
      });

      expect(session.isAuthenticated).toBe(false);
      expect(session.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Logout Functionality', () => {
    test('should successfully log out and clear session', async () => {
      const { logout } = require('@/services/api');
      logout.mockResolvedValueOnce({ success: true });

      // Setup authenticated session
      localStorage.setItem('token', mockUsers.user.token);

      let session;
      const TestComponent = () => {
        session = useSession();
        return null;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await act(async () => {
        await session.logout();
      });

      expect(session.isAuthenticated).toBe(false);
      expect(session.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });
});
