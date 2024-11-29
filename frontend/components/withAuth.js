import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function withAuth(WrappedComponent, options = { requireAuth: true }) {
  return function WithAuthComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user && options.requireAuth) {
        router.replace('/login');
      }
    }, [loading, user, router]);

    // For public pages, show the component regardless of auth state
    if (!options.requireAuth) {
      return <WrappedComponent {...props} />;
    }

    // For protected pages, show nothing while checking authentication
    if (loading || !user) {
      return null;
    }

    // If we have a user and requireAuth is true, show the component
    return <WrappedComponent {...props} />;
  };
}
