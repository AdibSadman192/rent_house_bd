import jwt from 'jsonwebtoken';
import { ErrorTypes, AuthError } from './errorTracking';

export class SessionManager {
  static getStoredSession() {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return { token, user };
    } catch (error) {
      console.error('Error reading session from storage:', error);
      return { token: null, user: null };
    }
  }

  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return true;
      // Add 5-minute buffer for token expiration
      return decoded.exp * 1000 < Date.now() + 5 * 60 * 1000;
    } catch {
      return true;
    }
  }

  static async refreshSession(token) {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new AuthError(
          ErrorTypes.AUTH.TOKEN_EXPIRED,
          'Failed to refresh session'
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new AuthError(
        ErrorTypes.AUTH.SESSION_EXPIRED,
        'Session refresh failed'
      );
    }
  }

  static async validateAndRefreshSession() {
    const { token, user } = this.getStoredSession();
    
    if (!token || !user) {
      throw new AuthError(
        ErrorTypes.AUTH.SESSION_EXPIRED,
        'No session found'
      );
    }

    if (this.isTokenExpired(token)) {
      if (user.rememberMe) {
        // Attempt to refresh the session
        const refreshedSession = await this.refreshSession(token);
        this.saveSession(refreshedSession.token, refreshedSession.user);
        return refreshedSession;
      } else {
        throw new AuthError(
          ErrorTypes.AUTH.TOKEN_EXPIRED,
          'Session expired'
        );
      }
    }

    return { token, user };
  }

  static saveSession(token, user, rememberMe = false) {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, rememberMe }));
    } catch (error) {
      console.error('Error saving session:', error);
      throw new AuthError(
        ErrorTypes.AUTH.DATABASE_ERROR,
        'Failed to save session'
      );
    }
  }

  static clearSession() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}
