import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSession = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      notifications: [],
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      clearNotifications: () => set({ notifications: [] }),
      logout: () => set({ user: null, isAuthenticated: false, notifications: [] }),
    }),
    {
      name: 'session-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useSession;
