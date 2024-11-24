import { act } from '@testing-library/react';
import { create } from 'zustand';
import { useSession } from '../useSession';

describe('useSession', () => {
  beforeEach(() => {
    // Clear the store before each test
    act(() => {
      useSession.setState({
        isAuthenticated: false,
        user: null,
        notifications: [],
      });
    });
  });

  it('should initialize with default values', () => {
    const state = useSession.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.notifications).toEqual([]);
  });

  it('should set user and authentication status', () => {
    const mockUser = { id: 1, name: 'Test User' };

    act(() => {
      useSession.getState().setUser(mockUser);
    });

    const state = useSession.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it('should handle notifications', () => {
    const mockNotification = { id: 1, message: 'Test notification' };

    act(() => {
      useSession.getState().addNotification(mockNotification);
    });

    const state = useSession.getState();
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0]).toEqual(mockNotification);
  });

  it('should clear notifications', () => {
    const mockNotification = { id: 1, message: 'Test notification' };

    act(() => {
      useSession.getState().addNotification(mockNotification);
      useSession.getState().clearNotifications();
    });

    const state = useSession.getState();
    expect(state.notifications).toHaveLength(0);
  });

  it('should handle logout', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockNotification = { id: 1, message: 'Test notification' };

    act(() => {
      useSession.getState().setUser(mockUser);
      useSession.getState().addNotification(mockNotification);
      useSession.getState().logout();
    });

    const state = useSession.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.notifications).toHaveLength(0);
  });
});
