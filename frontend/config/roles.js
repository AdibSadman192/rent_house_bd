export const ROLES = {
  USER: 'user',
  RENTER: 'renter',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

export const BASE_PERMISSIONS = {
  routes: ['/profile', '/notifications'],
  actions: ['view_profile', 'update_profile']
};

export const ROLE_PERMISSIONS = {
  [ROLES.USER]: {
    routes: [...BASE_PERMISSIONS.routes, '/bookings'],
    actions: [...BASE_PERMISSIONS.actions, 'create_booking', 'view_booking']
  },
  [ROLES.RENTER]: {
    routes: [...BASE_PERMISSIONS.routes, '/properties/manage'],
    actions: [...BASE_PERMISSIONS.actions, 'create_property', 'update_property', 'delete_property']
  },
  [ROLES.ADMIN]: {
    routes: [...BASE_PERMISSIONS.routes, '/admin/dashboard', '/admin/users', '/admin/properties'],
    actions: [
      ...BASE_PERMISSIONS.actions,
      'manage_users',
      'manage_properties',
      'view_analytics'
    ]
  },
  [ROLES.SUPERADMIN]: {
    routes: [
      ...BASE_PERMISSIONS.routes,
      '/admin/dashboard',
      '/admin/users',
      '/admin/properties',
      '/admin/settings'
    ],
    actions: [
      ...BASE_PERMISSIONS.actions,
      'manage_users',
      'manage_properties',
      'manage_admins',
      'manage_settings',
      'view_analytics'
    ]
  }
};
