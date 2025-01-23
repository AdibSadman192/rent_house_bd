import jwt from 'jsonwebtoken';
import { ErrorTypes, AuthError } from './errorTracking';

export class SessionManager {
  static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  static REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

  static getStoredSession() {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
      
      return { token, refreshToken, user, lastActivity };
    } catch (error) {
      console.error('Error reading session from storage:', error);
      return { token: null, refreshToken: null, user: null, lastActivity: 0 };
    }
  }

  static isSessionExpired() {
    const { lastActivity } = this.getStoredSession();
    return Date.now() - lastActivity > this.SESSION_TIMEOUT;
  }

  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return true;
      return decoded.exp * 1000 < Date.now() + this.REFRESH_THRESHOLD;
    } catch {
      return true;
    }
  }

  static async refreshSession() {
    try {
      const { refreshToken } = this.getStoredSession();
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) throw new Error('Failed to refresh session');

      const { token: newToken, user } = await response.json();
      this.saveSession(newToken, refreshToken, user);
      return { token: newToken, user };
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.clearSession();
      throw error;
    }
  }

  static saveSession(token, refreshToken, user) {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('lastActivity', Date.now().toString());
    } catch (error) {
      console.error('Error saving session:', error);
      this.clearSession();
    }
  }

  static updateLastActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  static clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
  }

  static async validateAndRefreshSession() {
    const { token, user } = this.getStoredSession();
    
    if (this.isSessionExpired()) {
      this.clearSession();
      throw new Error('Session expired');
    }

    if (this.isTokenExpired(token)) {
      return await this.refreshSession();
    }

    this.updateLastActivity();
    return { token, user };
  }
}
