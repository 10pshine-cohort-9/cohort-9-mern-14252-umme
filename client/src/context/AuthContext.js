import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('notes_app_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistSession = (user, token) => {
    localStorage.setItem('notes_app_token', token);
    localStorage.setItem('notes_app_user', JSON.stringify(user));
    setUser(user);
  };

  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.signup({ name, email, password });
      persistSession(data.data.user, data.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login({ email, password });
      persistSession(data.data.user, data.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('notes_app_token');
    localStorage.removeItem('notes_app_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
