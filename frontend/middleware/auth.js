import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('auth_token');
  const path = req.nextUrl.pathname;

  const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  const dashboardPaths = path.startsWith('/dashboard');

  // Redirect logged-in users away from auth pages
  if (publicPaths.includes(path) && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect dashboard routes
  if (dashboardPaths && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Role-based access control (example)
  if (dashboardPaths) {
    const userRole = req.cookies.get('user_role');
    
    // Example: Block owner-specific routes for renters
    const ownerOnlyRoutes = ['/dashboard/properties/new', '/dashboard/properties/[id]/edit'];
    if (ownerOnlyRoutes.some(route => path.match(route)) && userRole !== 'owner') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
};
