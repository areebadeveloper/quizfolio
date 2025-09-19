// src/contexts/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [expirationTime, setExpirationTime] = useState<number | null>(
    parseInt(localStorage.getItem('expiration') || '0', 10)
  );

  const login = (newToken: string) => {
    const expiration = Date.now() + SESSION_DURATION; // Set expiration time 20 minutes from now
    localStorage.setItem('token', newToken);
    localStorage.setItem('expiration', expiration.toString());
    setToken(newToken);
    setExpirationTime(expiration);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    setToken(null);
    setExpirationTime(null);
  };

  const isLoggedIn = !!token && expirationTime && Date.now() < expirationTime;

  // Auto-logout on session expiration
  useEffect(() => {
    const interval = setInterval(() => {
      if (expirationTime && Date.now() >= expirationTime) {
        logout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);
  return (
    <AuthContext.Provider value={{ token, isLoggedIn: Boolean(isLoggedIn), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
