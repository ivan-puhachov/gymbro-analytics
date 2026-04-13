import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import LanguageToggle from '../components/LanguageToggle';

export default function LoginScreen() {
  const { t, i18n } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t('pageTitle');
  }, [i18n.resolvedLanguage, t]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorKey(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('admin_token', data.access_token);
      
      // Verify Admin
      const user = await api.getMe(data.access_token);
      if (!user.is_admin) {
        localStorage.removeItem('admin_token');
        setErrorKey('login.errors.notAdmin');
        return;
      }
      navigate('/');
    } catch (err) {
      setErrorKey('login.errors.invalidCredentials');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="w-96 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 leading-snug">
            {t('login.title')}
          </h2>
          <LanguageToggle className="shrink-0" />
        </div>
        {errorKey && <div className="mb-4 text-red-500 text-sm">{t(errorKey)}</div>}
        <input 
          className="w-full mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          aria-label={t('login.emailPlaceholder')}
          placeholder={t('login.emailPlaceholder')}
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          autoComplete="username"
          required 
        />
        <input 
          className="w-full mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          aria-label={t('login.passwordPlaceholder')}
          placeholder={t('login.passwordPlaceholder')}
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          autoComplete="current-password"
          required 
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors">
          {t('login.submit')}
        </button>
      </form>
    </div>
  );
}
