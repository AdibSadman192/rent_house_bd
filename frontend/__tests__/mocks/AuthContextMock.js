import React, { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refreshToken: () => {},
  setUser: () => {},
  addNotification: () => {},
  clearNotifications: () => {},
});

export const createMockAuthContext = (user = {
  id: '1', 
  name: 'Admin User', 
  role: 'admin', 
  email: 'admin@example.com'
}) => {
  const mockAuthContext = {
    user,
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    setUser: jest.fn(),
    addNotification: jest.fn(),
    clearNotifications: jest.fn(),
  };

  const MockAuthProvider = ({ children }) => (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );

  return { mockAuthContext, MockAuthProvider, AuthContext };
};

// Add a simple test to prevent "no tests" error
describe('AuthContextMock', () => {
  it('creates a mock auth context', () => {
    const mockUser = { id: '1', name: 'Test User', role: 'user' };
    const { mockAuthContext } = createMockAuthContext(mockUser);
    
    expect(mockAuthContext.user).toEqual(mockUser);
    expect(mockAuthContext.isAuthenticated).toBe(true);
  });
});
