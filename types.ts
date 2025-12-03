export type Language = 'en' | 'zh-TW';

export interface Channel {
  id: string;
  name: string;
  subscribers: string;
  niche: string;
  avatar: string;
  status: 'active' | 'paused';
}

export interface VideoScript {
  title: string;
  description: string;
  script: string;
  hashtags: string[];
  thumbnailPrompt: string;
  bgMusicType: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  channelId?: string;
}

export interface AnalyticsData {
  name: string;
  views: number;
  likes: number;
  comments: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface SearchResult {
  text: string;
  sources: { title: string; uri: string }[];
}