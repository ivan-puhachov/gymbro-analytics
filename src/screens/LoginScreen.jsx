import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('admin_token', data.access_token);
      
      // Verify Admin
      const user = await api.getMe(data.access_token);
      if (!user.is_admin) {
        localStorage.removeItem('admin_token');
        setError('Access Denied. You are not an administrator.');
        return;
      }
      navigate('/');
    } catch (err) {
      setError('Login failed. Check credentials.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="w-96 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">GymBro Admin</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <input 
          className="w-full mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          className="w-full mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors">
          Login to Dashboard
        </button>
      </form>
    </div>
  );
}
