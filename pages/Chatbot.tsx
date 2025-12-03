import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { TRANSLATIONS } from '../constants';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const { language } = useAppContext();
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    if (!process.env.API_KEY) {
        console.error("API Key missing");
        return;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // System instruction tailored for the app context
    const systemInstruction = language === 'zh-TW' 
      ? "你是一個協助 AutoTube Studio 用戶的專業 AI 助手。你精通 YouTube 演算法、影片腳本創作、SEO 優化以及自動化工作流。請以繁體中文回答用戶的問題，語氣專業且友善。"
      : "You are a professional AI assistant for AutoTube Studio users. You are an expert in YouTube algorithms, video script writing, SEO optimization, and automation workflows. Answer user questions in English with a professional and helpful tone.";

    chatSessionRef.current = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction,
      }
    });

    // Add initial welcome message
    setMessages([{
      id: 'init',
      role: 'model',
      content: t.chatWelcome,
      timestamp: Date.now()
    }]);
  }, [language, t.chatWelcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMsg.content });
      const text = response.text;
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: text || (language === 'zh-TW' ? "抱歉，我無法生成回應。" : "I couldn't generate a response."),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: language === 'zh-TW' ? "連線發生錯誤，請檢查您的 API 金鑰或網路狀態。" : "Connection error. Please check your API key or network status.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg">
            <Bot className="text-white w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t.chatbot}</h2>
      </div>

      <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-xl">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-700 text-slate-100 rounded-tl-none border border-slate-600'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <Loader2 size={16} className="animate-spin text-white" />
              </div>
              <div className="bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-600">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-700">
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatPlaceholder}
              disabled={isLoading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};