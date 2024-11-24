import { ROLES, ROLE_PERMISSIONS } from '@/config/roles';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAuthGuard(requiredRole) {
  const { user, isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }

      if (requiredRole) {
        const userRole = user?.role || ROLES.USER;
        const hasPermission = checkRolePermission(userRole, requiredRole);
        
        if (!hasPermission) {
          router.replace('/unauthorized');
        }
      }
    };

    checkAccess();
  }, [isAuthenticated, user, requiredRole, router]);

  return { isAuthenticated, user };
}

export function checkRolePermission(userRole, requiredRole) {
  const roleHierarchy = [
    ROLES.USER,
    ROLES.RENTER,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ];

  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
}

export function hasPermission(user, permission) {
  if (!user) return false;

  const userRole = user.role || ROLES.USER;
  const rolePermissions = ROLE_PERMISSIONS[userRole];

  return rolePermissions?.actions.includes(permission) || false;
}

export function canAccessRoute(user, route) {
  if (!user) return false;

  const userRole = user.role || ROLES.USER;
  const rolePermissions = ROLE_PERMISSIONS[userRole];

  return rolePermissions?.routes.some(allowedRoute => 
    route.startsWith(allowedRoute)
  ) || false;
}
