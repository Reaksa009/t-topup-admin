import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full"></div>
        <AlertTriangle className="relative h-24 w-24 text-red-500 animate-pulse mx-auto" />
      </div>
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-300 mb-4">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
      >
        <Home size={18} />
        {t('home')}
      </Link>
    </div>
  );
};

export default NotFound;
