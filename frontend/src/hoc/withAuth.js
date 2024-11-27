import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent, options = { requireAuth: false }) => {
  const WithAuthWrapper = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = Cookies.get('token');
          
          if (!token && options.requireAuth) {
            // Redirect to login if authentication is required but no token exists
            router.push('/auth/login');
            return;
          }

          if (token) {
            // TODO: Validate token with your backend API
            // For now, we'll just parse the token and set basic user info
            try {
              const userInfo = JSON.parse(atob(token.split('.')[1]));
              setUser(userInfo);
            } catch (error) {
              console.error('Error parsing token:', error);
              if (options.requireAuth) {
                router.push('/auth/login');
                return;
              }
            }
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsLoading(false);
          if (options.requireAuth) {
            router.push('/auth/login');
          }
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // If authentication is required and user is not authenticated, don't render component
    if (options.requireAuth && !user) {
      return null;
    }

    // Pass user data and auth status to wrapped component
    return (
      <WrappedComponent
        {...props}
        user={user}
        isAuthenticated={!!user}
      />
    );
  };

  // Copy static methods and display name
  WithAuthWrapper.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuthWrapper;
};

// Helper function to get component display name
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
