import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  const [loading, setLoading] = useState(false);
  const [appInitializing, setAppInitializing] = useState(true);

  // Validate the current token and fetch fresh user profile on load
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/user/profile');
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        } catch (err) {
          console.error('Failed to validate initial token', err);
          logoutState();
        }
      }
      setAppInitializing(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, user: userData } = res.data.data;
      
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password, password_confirmation, role = 'customer') => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        password_confirmation,
        role,
      });
      const { token: userToken, user: userData } = res.data.data;

      setToken(userToken);
      setUser(userData);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      logoutState();
      setLoading(false);
    }
  };

  const logoutState = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await api.put('/user/profile', data);
      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Profile update failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (old_password, password, password_confirmation) => {
    setLoading(true);
    try {
      await api.put('/user/change-password', {
        old_password,
        password,
        password_confirmation
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Password update failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Forgot password request failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (id, hash, expires, signature) => {
    setLoading(true);
    try {
      await api.get(`/auth/verify-email/${id}/${hash}?expires=${expires}&signature=${signature}`);
      // Refresh user details
      if (token) {
        const res = await api.get('/user/profile');
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Email verification failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole(['admin', 'super-admin']);
  const isSuperAdmin = () => hasRole(['super-admin']);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      appInitializing,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      verifyEmail,
      isAdmin,
      isSuperAdmin,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
