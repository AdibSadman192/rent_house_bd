const { getClientInfo } = require('../utils/security');
const User = require('../models/User');

class SecurityService {
  constructor() {
    this.loginAttempts = new Map();
    this.blockedIPs = new Set();
  }

  initialize() {
    // Clear login attempts every hour
    setInterval(() => {
      this.loginAttempts.clear();
    }, 60 * 60 * 1000);
  }

  async logSecurityEvent(userId, eventType, req, details = {}) {
    try {
      const clientInfo = getClientInfo(req);
      const securityLog = {
        eventType,
        timestamp: new Date(),
        ip: clientInfo.ip,
        device: clientInfo.device,
        location: clientInfo.location,
        ...details
      };

      await User.findByIdAndUpdate(userId, {
        $push: {
          'security.logs': {
            $each: [securityLog],
            $position: 0,
            $slice: 50 // Keep only last 50 logs
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Error logging security event:', error);
      return false;
    }
  }

  async recordLoginAttempt(ip, success) {
    if (!this.loginAttempts.has(ip)) {
      this.loginAttempts.set(ip, { count: 0, firstAttempt: Date.now() });
    }

    const attempt = this.loginAttempts.get(ip);
    attempt.count++;

    if (!success && attempt.count >= 5) {
      // Block IP if 5 failed attempts within 15 minutes
      const timeDiff = Date.now() - attempt.firstAttempt;
      if (timeDiff <= 15 * 60 * 1000) {
        this.blockedIPs.add(ip);
        // Remove IP from blocked list after 1 hour
        setTimeout(() => {
          this.blockedIPs.delete(ip);
          this.loginAttempts.delete(ip);
        }, 60 * 60 * 1000);
        return false;
      }
      // Reset attempts if more than 15 minutes have passed
      this.loginAttempts.set(ip, { count: 1, firstAttempt: Date.now() });
    }

    if (success) {
      this.loginAttempts.delete(ip);
    }

    return !this.blockedIPs.has(ip);
  }

  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  async updateSecuritySettings(userId, settings) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          $set: {
            'security.twoFactorEnabled': settings.twoFactorEnabled,
            'security.loginNotifications': settings.loginNotifications,
            'security.activityAlerts': settings.activityAlerts
          }
        },
        { new: true }
      );
      return updatedUser.security;
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  }

  async getSecurityLogs(userId, limit = 20) {
    try {
      const user = await User.findById(userId).select('security.logs');
      return user.security.logs.slice(0, limit);
    } catch (error) {
      console.error('Error getting security logs:', error);
      throw error;
    }
  }
}

module.exports = new SecurityService();
