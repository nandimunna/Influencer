import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const demoRes = await api.getDemoUsers();
      if (demoRes.success && demoRes.users) {
        setDemoUsers(demoRes.users);
      }

      const token = localStorage.getItem('nex_token');
      if (token) {
        try {
          const meRes = await api.getMe();
          if (meRes.success && meRes.user) {
            setUser(meRes.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Session expired, defaulting to Admin');
        }
      }

      if (demoRes.users && demoRes.users.length > 0) {
        const defaultAdmin = demoRes.users[0];
        const loginRes = await api.login(defaultAdmin.email, 'admin123');
        if (loginRes.success) {
          localStorage.setItem('nex_token', loginRes.token);
          setUser(loginRes.user);
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchUser = async (targetUser) => {
    try {
      setLoading(true);
      const loginRes = await api.login(targetUser.email, 'admin123');
      if (loginRes.success) {
        localStorage.setItem('nex_token', loginRes.token);
        setUser(loginRes.user);
      }
    } catch (err) {
      console.error('Switch role failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nex_token');
    setUser(null);
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, demoUsers, loading, switchUser, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
