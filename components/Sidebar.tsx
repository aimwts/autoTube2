import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { TRANSLATIONS, NAV_ITEMS } from '../constants';
import { Languages, Zap } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { language, toggleLanguage } = useAppContext();
  const location = useLocation();
  const t = TRANSLATIONS[language];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Zap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AutoTube</h1>
          <span className="text-xs text-blue-400 font-medium">Studio v1.0</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === `/${item.id}` || (location.pathname === '/' && item.id === 'dashboard');
          return (
            <Link
              key={item.id}
              to={`/${item.id}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{t[item.id as keyof typeof t]}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={toggleLanguage}
          className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-lg transition-colors border border-slate-700"
        >
          <Languages size={18} />
          <span className="text-sm font-medium">{language === 'en' ? '中文 (繁體)' : 'English'}</span>
        </button>
      </div>
    </div>
  );
};
