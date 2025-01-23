class SessionManager {
  static TOKEN_KEY = 'auth_token';
  static REFRESH_TOKEN_KEY = 'refresh_token';
  static USER_KEY = 'user_data';

  static saveSession(token, refreshToken, user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  static getSession() {
    if (typeof window !== 'undefined') {
      return {
        token: localStorage.getItem(this.TOKEN_KEY),
        refreshToken: localStorage.getItem(this.REFRESH_TOKEN_KEY),
        user: JSON.parse(localStorage.getItem(this.USER_KEY) || 'null')
      };
    }
    return { token: null, refreshToken: null, user: null };
  }

  static async validateAndRefreshSession() {
    const { token, refreshToken, user } = this.getSession();
    
    if (!token || !refreshToken) {
      throw new Error('No session found');
    }

    // Check if token is expired (you may want to use jwt-decode to check expiration)
    try {
      // First try to use the current token
      return { token, refreshToken, user };
    } catch (error) {
      // If token is expired, try to refresh it
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        this.saveSession(data.token, data.refreshToken, data.user);
        return data;
      } catch (refreshError) {
        this.clearSession();
        throw new Error('Session refresh failed');
      }
    }
  }

  static isAuthenticated() {
    const { token } = this.getSession();
    return !!token;
  }
}

export default SessionManager;
