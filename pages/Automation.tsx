import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TRANSLATIONS } from '../constants';
import { generateVideoContent } from '../services/geminiService';
import { VideoScript } from '../types';
import { Loader2, CheckCircle, Video, FileText, Download, AlertTriangle } from 'lucide-react';

export const Automation: React.FC = () => {
  const { language, addLog } = useAppContext();
  const t = TRANSLATIONS[language];
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<VideoScript | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    t.stepFact,
    t.stepScript,
    t.stepVoice,
    t.stepVideo,
    t.stepUpload
  ];

  const handleGenerate = async () => {
    if (!topic) return;
    
    // Check if API key is configured (client-side check to avoid call)
    if (!process.env.API_KEY) {
      const msg = "Missing API_KEY in environment variables. Please check your Netlify configuration or .env file.";
      setError(msg);
      addLog('error', msg);
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);

    // Simulate Workflow Steps
    addLog('info', `Starting workflow for topic: ${topic}`);
    
    // Step 1: Source Facts
    setCurrentStep(1);
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 2: Gemini Generation
    setCurrentStep(2);
    addLog('info', 'Calling Gemini 2.5 Flash for script generation...');
    
    try {
      const data = await generateVideoContent(topic, language);
      setResult(data);
      addLog('success', 'Script generated successfully');
      
      // Step 3: Simulate Voiceover
      setCurrentStep(3);
      await new Promise(r => setTimeout(r, 2000));
      addLog('info', 'Voiceover synthesized (Simulated: Google TTS/Bark)');

      // Step 4: Simulate Assembly
      setCurrentStep(4);
      await new Promise(r => setTimeout(r, 2500));
      addLog('info', 'Video assembled with FFmpeg (Simulated)');

      // Step 5: Ready
      setCurrentStep(5);
      addLog('success', 'Video ready for upload');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to generate content';
      addLog('error', errorMsg);
      setError(errorMsg);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportConfig = () => {
    const config = {
      workflow: "AutoTube Generic",
      nodes: ["Cron", "Gemini API", "Google Translate", "FFmpeg", "YouTube Upload"],
      connections: "standard-linear"
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'n8n-workflow-autotube.json';
    a.click();
    addLog('info', 'n8n Workflow config exported');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{t.automation}</h2>
        <button 
          onClick={exportConfig}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <Download size={16} />
          {t.exportConfig}
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-lg">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          {t.generateScript}
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t.topicPlaceholder}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
              isGenerating 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Video size={20} />}
            {isGenerating ? t.generating : t.runWorkflow}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Workflow Visualization */}
        {isGenerating && (
          <div className="mt-8 space-y-4">
            <h4 className="text-sm font-medium text-slate-400 mb-4">{t.workflowStatus}</h4>
            <div className="relative">
              {steps.map((step, index) => {
                const isActive = index + 1 === currentStep;
                const isCompleted = index + 1 < currentStep;
                
                return (
                  <div key={index} className="flex items-center gap-4 mb-4 last:mb-0 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive ? 'border-blue-500 bg-blue-500/20 text-blue-500' :
                      isCompleted ? 'border-emerald-500 bg-emerald-500 text-slate-900' :
                      'border-slate-700 bg-slate-800 text-slate-600'
                    }`}>
                      {isCompleted ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{index + 1}</span>}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-slate-600'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
              {/* Vertical Line */}
              <div className="absolute top-4 left-4 w-0.5 h-[calc(100%-32px)] bg-slate-800 -z-0" />
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden animate-slide-up">
          <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex items-center gap-2">
            <FileText className="text-emerald-400" size={20} />
            <h3 className="font-semibold text-white">{result.title}</h3>
          </div>
          
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.description}</span>
                <p className="mt-1 text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  {result.description}
                </p>
              </div>
              
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.tags}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.visualPrompt}</span>
                <p className="mt-1 text-xs text-slate-400 italic font-mono bg-slate-900 p-2 rounded border border-slate-800">
                  {result.thumbnailPrompt}
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.script}</span>
              <div className="mt-1 h-[400px] overflow-y-auto bg-slate-900 p-4 rounded-lg border border-slate-700 text-slate-300 text-sm whitespace-pre-line leading-7 shadow-inner font-serif">
                {result.script}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};