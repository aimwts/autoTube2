import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TRANSLATIONS } from '../constants';
import { ExternalLink, MoreVertical, PauseCircle, PlayCircle, Plus } from 'lucide-react';

export const Channels: React.FC = () => {
  const { language, channels, addLog } = useAppContext();
  const t = TRANSLATIONS[language];

  const handleAddChannel = () => {
    addLog('info', language === 'en' ? 'Opened "Add Channel" modal (Mock)' : '已開啟「新增頻道」視窗 (模擬)');
  };

  const handleToggleStatus = (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    addLog('warning', `${name} is now ${newStatus}`);
  };

  const handleOpenLink = (name: string) => {
    addLog('info', `Opening YouTube Studio for: ${name}`);
  };

  const handleMoreOptions = (name: string) => {
    addLog('info', `Opened settings menu for: ${name}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{t.channels}</h2>
        <button 
          onClick={handleAddChannel}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          {language === 'en' ? 'Add Channel' : '新增頻道'}
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/80">
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.channelName}</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.niche}</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.subscribers}</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.status}</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {channels.map((channel) => (
              <tr key={channel.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={channel.avatar} alt={channel.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-white">{channel.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-300 text-sm">{channel.niche}</td>
                <td className="p-4 text-slate-300 text-sm">{channel.subscribers}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    channel.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {channel.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleToggleStatus(channel.id, channel.status, channel.name)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Toggle Status"
                    >
                      {channel.status === 'active' ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                    </button>
                    <button 
                      onClick={() => handleOpenLink(channel.name)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Open Channel"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => handleMoreOptions(channel.name)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="More Options"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};