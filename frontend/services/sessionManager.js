class SessionManager {
  static TOKEN_KEY = 'token';
  static REFRESH_TOKEN_KEY = 'refreshToken';
  static USER_KEY = 'user';
  static INTENDED_ROUTE_KEY = 'intendedRoute';

  static async saveSession(token, refreshToken, user) {
    try {
      console.log('SessionManager: Starting session save...');
      
      // Store user data in localStorage first
      if (user) {
        console.log('SessionManager: Saving user data...');
        const userData = { ...user };
        delete userData.password; // Ensure password is never stored
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      }

      // Set cookies with simpler options first
      console.log('SessionManager: Setting cookies...');
      document.cookie = `${this.TOKEN_KEY}=${token}; path=/; max-age=${30 * 24 * 60 * 60}`;
      document.cookie = `${this.REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=${90 * 24 * 60 * 60}`;

      // Verify the data was saved
      const savedUser = localStorage.getItem(this.USER_KEY);
      const savedToken = this.getCookie(this.TOKEN_KEY);
      const savedRefreshToken = this.getCookie(this.REFRESH_TOKEN_KEY);

      console.log('SessionManager: Verifying saved data:', {
        hasUser: !!savedUser,
        hasToken: !!savedToken,
        hasRefreshToken: !!savedRefreshToken
      });

      if (!savedUser) {
        throw new Error('Failed to save user data');
      }

      if (!savedToken || !savedRefreshToken) {
        throw new Error('Failed to save tokens');
      }

      console.log('SessionManager: Session saved successfully');
      return true;
    } catch (error) {
      console.error('SessionManager: Error saving session:', error);
      // Try to clean up if save failed
      this.clearSession();
      throw error;
    }
  }

  static getSession() {
    try {
      console.log('SessionManager: Getting session...');
      const token = this.getCookie(this.TOKEN_KEY);
      const refreshToken = this.getCookie(this.REFRESH_TOKEN_KEY);
      let user = null;

      try {
        user = JSON.parse(localStorage.getItem(this.USER_KEY) || 'null');
      } catch (e) {
        console.error('SessionManager: Error parsing user data:', e);
      }

      console.log('SessionManager: Session data retrieved:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasUser: !!user
      });

      return { token, refreshToken, user };
    } catch (error) {
      console.error('SessionManager: Error getting session:', error);
      return { token: null, refreshToken: null, user: null };
    }
  }

  static clearSession() {
    try {
      console.log('SessionManager: Clearing session...');
      // Clear cookies
      document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      // Clear localStorage
      localStorage.removeItem(this.USER_KEY);
      this.clearIntendedRoute();
      
      console.log('SessionManager: Session cleared successfully');
    } catch (error) {
      console.error('SessionManager: Error clearing session:', error);
    }
  }

  static getCookie(name) {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        return cookieValue;
      }
      return null;
    } catch (error) {
      console.error(`SessionManager: Error getting cookie '${name}':`, error);
      return null;
    }
  }

  static saveIntendedRoute(route) {
    if (route) {
      localStorage.setItem(this.INTENDED_ROUTE_KEY, route);
      console.log('SessionManager: Intended route saved:', route);
    }
  }

  static getIntendedRoute() {
    const route = localStorage.getItem(this.INTENDED_ROUTE_KEY);
    console.log('SessionManager: Retrieved intended route:', route);
    return route;
  }

  static clearIntendedRoute() {
    localStorage.removeItem(this.INTENDED_ROUTE_KEY);
    console.log('SessionManager: Intended route cleared');
  }

  static async validateAndRefreshSession() {
    try {
      const session = this.getSession();
      if (!session.token && !session.refreshToken) {
        return null;
      }

      // If we have a token and it's not expired, return current session
      if (session.token && !this.isTokenExpired(session.token)) {
        return session;
      }

      // If token is expired but we have a refresh token, try to refresh
      if (session.refreshToken && !this.isTokenExpired(session.refreshToken)) {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ refreshToken: session.refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        if (data.success && data.token) {
          await this.saveSession(data.token, data.refreshToken || session.refreshToken, data.user);
          return this.getSession();
        }
      }

      // If we get here, session is invalid
      this.clearSession();
      return null;
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearSession();
      return null;
    }
  }

  static isTokenExpired(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const { exp } = JSON.parse(jsonPayload);
      return exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}

export default SessionManager;
