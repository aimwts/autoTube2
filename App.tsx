import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Automation } from './pages/Automation';
import { Channels } from './pages/Channels';
import { Logs } from './pages/Logs';
import { Chatbot } from './pages/Chatbot';
import { Construction } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-900 text-slate-50 flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 overflow-y-auto max-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {children}
    </main>
  </div>
);

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 space-y-4 animate-fade-in">
    <div className="p-4 bg-slate-800 rounded-full">
      <Construction size={48} className="text-blue-500" />
    </div>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <p>This module is under development.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/analytics" element={<PlaceholderPage title="Analytics Advanced" />} />
            <Route path="/settings" element={<PlaceholderPage title="System Settings" />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;