import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import api from './api';

// Tạo AuthContext để quản lý trạng thái đăng nhập
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // Thêm trạng thái admin
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');
      const storedUserId = localStorage.getItem('userId');

      if (token && storedUserId) {
        try {
          await api.get(`/users/${storedUserId}`);
          setIsAuthenticated(true);
          setUserId(storedUserId);
        } catch (error) {
          console.error('User auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setIsAuthenticated(false);
          setUserId(null);
        }
      }

      if (adminToken) {
        try {
          await api.get('/admin/users', {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          setIsAdminAuthenticated(true);
        } catch (error) {
          console.error('Admin auth check failed:', error);
          localStorage.removeItem('adminToken');
          setIsAdminAuthenticated(false);
        }
      }

      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        userId,
        setUserId,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/Social-Media-App-Frontend">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);