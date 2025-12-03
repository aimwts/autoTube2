import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, Channel, LogEntry } from '../types';
import { MOCK_CHANNELS } from '../constants';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  channels: Channel[];
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh-TW' : 'en');
  };

  const addLog = (level: LogEntry['level'], message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  // Simulate incoming logs/comments
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.7) {
        const types: LogEntry['level'][] = ['info', 'success', 'warning'];
        const msgs = language === 'en' 
          ? ["Comment filter: Blocked spam", "Channel 'Tech Daily' stats updated", "Upload scheduled: 18:00 EST"]
          : ["評論過濾：已封鎖垃圾訊息", "頻道 'Tech Daily' 數據已更新", "影片已排程：18:00 EST"];
        
        addLog(types[Math.floor(Math.random() * 3)], msgs[Math.floor(Math.random() * msgs.length)]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <AppContext.Provider value={{ language, toggleLanguage, channels, logs, addLog }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
