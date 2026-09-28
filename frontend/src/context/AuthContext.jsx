import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Synchronize Axios default Authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Synchronize user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Verify and hydrate session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.response?.data?.message || err.message);
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;

      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true, user: userData };
    } catch (err) {
      const isUnverified = err.response?.data?.isUnverified || false;
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message, isUnverified, email };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      // If email verification is required (standard buyer/seller registration)
      if (res.data?.requiresVerification) {
        return {
          success: true,
          requiresVerification: true,
          message: res.data.message,
          email: res.data.email,
          verificationUrl: res.data.verificationUrl,
        };
      }

      // If backend logged in directly (e.g. admin or pre-verified)
      if (res.data?.token) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return { success: true, user: newUser };
      }

      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Verify Email handler (via token link)
  const verifyEmail = async (verificationToken) => {
    try {
      const res = await axios.post('/api/auth/verify-email', { token: verificationToken });
      const { token: newToken, user: userData } = res.data;

      if (newToken && userData) {
        setToken(newToken);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }

      return { success: true, message: res.data.message, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed. Link may be invalid or expired.';
      return { success: false, message };
    }
  };

  // Resend Verification Email handler
  const resendVerification = async (email) => {
    try {
      const res = await axios.post('/api/auth/resend-verification', { email });
      return {
        success: true,
        message: res.data.message,
        verificationUrl: res.data.verificationUrl,
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend verification link.';
      return { success: false, message };
    }
  };

  // Google Direct Sign-In / Register handler
  const loginWithGoogle = async (credential, role = 'buyer') => {
    try {
      const res = await axios.post('/api/auth/google', { credential, role });
      const { token: newToken, user: userData } = res.data;

      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Google Sign-In failed. Please try again.';
      return { success: false, message };
    }
  };

  // Update user profile in context and backend
  const updateUserProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      if (res.data?.user) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      return { success: false, message };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data?.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    verifyEmail,
    resendVerification,
    loginWithGoogle,
    logout,
    updateUserProfile,
    refreshUser,
    setUser,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
