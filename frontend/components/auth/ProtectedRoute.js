import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '@/hooks/useSession';
import { checkRolePermission, canAccessRoute } from '@/utils/authMiddleware';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSession();

  useEffect(() => {
    const validateAccess = () => {
      if (!isAuthenticated) {
        const currentPath = router.asPath;
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (requiredRole && !checkRolePermission(user?.role, requiredRole)) {
        router.replace('/unauthorized');
        return;
      }

      if (!canAccessRoute(user, router.pathname)) {
        router.replace('/unauthorized');
        return;
      }
    };

    validateAccess();
  }, [isAuthenticated, user, requiredRole, router]);

  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return <LoadingSpinner />;
  }

  // Check role-based access
  if (requiredRole && !checkRolePermission(user.role, requiredRole)) {
    return null;
  }

  // Check route access
  if (!canAccessRoute(user, router.pathname)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
