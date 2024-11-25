import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export function withAuth(WrappedComponent, options = {}) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { requireAuth = true, requiredRole = null } = options;

    useEffect(() => {
      if (!loading) {
        if (requireAuth && !user) {
          router.replace(`/login?redirect=${router.pathname}`);
        } else if (requiredRole && (!user || user.role !== requiredRole)) {
          router.replace('/');
        }
      }
    }, [loading, user, router, requireAuth, requiredRole]);

    // Don't show anything while checking auth
    if (loading) {
      return null;
    }

    // If auth is required and user is not logged in, don't render component
    if (requireAuth && !user) {
      return null;
    }

    // If role is required and user doesn't have it, don't render component
    if (requiredRole && (!user || user.role !== requiredRole)) {
      return null;
    }

    // Otherwise, render the protected component
    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
