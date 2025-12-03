import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import { TRANSLATIONS } from '../constants';
import { StatCard } from '../components/StatCard';
import { Eye, ThumbsUp, MessageCircle, PlayCircle, Search, Globe, Loader2, ExternalLink } from 'lucide-react';
import { searchTrends } from '../services/geminiService';
import { SearchResult } from '../types';

const DATA = [
  { name: 'Mon', views: 4000, likes: 2400 },
  { name: 'Tue', views: 3000, likes: 1398 },
  { name: 'Wed', views: 2000, likes: 9800 },
  { name: 'Thu', views: 2780, likes: 3908 },
  { name: 'Fri', views: 1890, likes: 4800 },
  { name: 'Sat', views: 2390, likes: 3800 },
  { name: 'Sun', views: 3490, likes: 4300 },
];

export const Dashboard: React.FC = () => {
  const { language } = useAppContext();
  const t = TRANSLATIONS[language];
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    try {
      const result = await searchTrends(searchQuery, language);
      setSearchResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white">{t.dashboard}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t.totalViews} value="1.2M" trend="12.5% vs last week" icon={Eye} color="text-blue-500" />
        <StatCard title={t.activeChannels} value="3" icon={PlayCircle} color="text-red-500" />
        <StatCard title="Total Likes" value="84.3K" trend="5.2% vs last week" icon={ThumbsUp} color="text-emerald-500" />
        <StatCard title={t.pendingUploads} value="12" icon={MessageCircle} color="text-amber-500" />
      </div>

      {/* Trend Research Section */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">{t.trendSearch}</h3>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : t.searchButton}
          </button>
        </form>

        {searchResult && (
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 animate-slide-up">
            <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-4">
              {searchResult.text}
            </div>
            
            {searchResult.sources.length > 0 && (
              <div className="border-t border-slate-800 pt-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.sources}</span>
                <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                  {searchResult.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 transition-colors group"
                    >
                      <ExternalLink size={14} className="text-blue-500 group-hover:text-blue-400" />
                      <span className="text-xs text-blue-400 group-hover:text-blue-300 truncate underline decoration-blue-500/30">
                        {source.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">{t.analytics}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">{t.recentActivity}</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm text-slate-200">Video "Space Facts #{i}" uploaded</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};