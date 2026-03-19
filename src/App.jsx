import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import { api } from './api';

function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        navigate('/login');
        return;
      }
      try {
        const user = await api.getMe(token);
        if (user.is_admin) {
          setIsAdmin(true);
        } else {
          alert('Access denied. You must be an administrator.');
          localStorage.removeItem('admin_token');
          navigate('/login');
        }
      } catch (err) {
        localStorage.removeItem('admin_token');
        navigate('/login');
      }
      setLoading(false);
    }
    checkAuth();
  }, [navigate]);

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading Auth...</div>;
  return isAdmin ? children : null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<AuthGuard><DashboardScreen /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
