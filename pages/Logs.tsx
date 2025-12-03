import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TRANSLATIONS } from '../constants';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const Logs: React.FC = () => {
  const { language, logs } = useAppContext();
  const t = TRANSLATIONS[language];

  const getIcon = (level: string) => {
    switch(level) {
      case 'error': return <AlertTriangle className="text-red-500" size={16} />;
      case 'warning': return <Shield className="text-amber-500" size={16} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{t.logsTitle}</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Shield size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">{t.filterToxic}</span>
        </div>
      </div>

      <div className="flex-1 bg-black/50 border border-slate-800 rounded-xl overflow-hidden font-mono text-sm flex flex-col">
        <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-500 flex gap-4 uppercase tracking-wider font-semibold">
          <span className="w-24">Timestamp</span>
          <span className="w-20">Level</span>
          <span className="flex-1">Message</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 p-2 hover:bg-white/5 rounded transition-colors group">
              <span className="w-24 text-slate-500 shrink-0">{log.timestamp}</span>
              <div className="w-20 shrink-0 flex items-center">
                 {getIcon(log.level)}
                 <span className={`ml-2 text-xs uppercase ${
                   log.level === 'error' ? 'text-red-400' : 
                   log.level === 'warning' ? 'text-amber-400' : 
                   log.level === 'success' ? 'text-emerald-400' : 'text-blue-400'
                 }`}>{log.level}</span>
              </div>
              <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
