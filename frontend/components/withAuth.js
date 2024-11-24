import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login');
      }
    }, [loading, user, router]);

    // Show nothing while checking authentication
    if (loading || !user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
