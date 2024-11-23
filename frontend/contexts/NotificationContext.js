import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import wsService, { WS_EVENTS } from '../lib/websocket';
import { notificationAPI } from '../lib/api';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notification preferences
  const fetchPreferences = useCallback(async () => {
    try {
      const response = await notificationAPI.getPreferences();
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  }, []);

  // Initialize WebSocket connection and fetch data
  useEffect(() => {
    if (user) {
      wsService.connect();
      fetchNotifications();
      fetchPreferences();

      // Subscribe to notification events
      const unsubscribe = wsService.subscribe(WS_EVENTS.NOTIFICATION, (notification) => {
        handleNewNotification(notification);
      });

      return () => {
        unsubscribe();
        wsService.disconnect();
      };
    }
  }, [user, fetchNotifications, fetchPreferences]);

  // Handle new notification
  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification based on type
    switch (notification.type) {
      case 'success':
        toast.success(notification.message);
        break;
      case 'error':
        toast.error(notification.message);
        break;
      case 'warning':
        toast.warning(notification.message);
        break;
      default:
        toast.info(notification.message);
    }

    // Play notification sound if enabled
    if (preferences.sound) {
      playNotificationSound();
    }
  }, [preferences]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => notificationAPI.markAsRead(n.id))
      );
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications]);

  // Update notification preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    try {
      await notificationAPI.updatePreferences(newPreferences);
      setPreferences(newPreferences);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    }
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    preferences,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
