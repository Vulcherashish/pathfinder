import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Correct state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on refresh (IMPORTANT)
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('pathfinder_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('pathfinder_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });

    // ✅ store ONLY token
    localStorage.setItem('pathfinder_token', data.token);

    setUser(data.user);

    return data;
  };

  // ✅ REGISTER
  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });

    localStorage.setItem('pathfinder_token', data.token);

    setUser(data.user);

    return data;
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('pathfinder_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);