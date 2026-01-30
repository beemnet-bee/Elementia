
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AIResearcherModalProps {
  onClose: () => void;
}

export const AIResearcherModal: React.FC<AIResearcherModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');
    setErrorInfo(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Attempt with Pro model first for deep insights
      try {
        const result = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `You are an expert theoretical chemist. Research query: ${query}. Provide a sophisticated, technical, yet accessible analysis in under 300 words. Focus on quantum mechanics or industrial applications.`,
          config: {
              temperature: 0.7,
              maxOutputTokens: 2000,
              thinkingConfig: { thinkingBudget: 1000 }
          }
        });
        setResponse(result.text || "No insights generated.");
      } catch (proErr: any) {
        console.warn("Pro model failed, falling back to Flash:", proErr);
        
        // Fallback to Flash model if Pro fails (common for 500 errors in specific regions/previews)
        const flashResult = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Expert analysis on: ${query}. technical, scientific, precise, under 250 words.`,
          config: {
            temperature: 0.5,
          }
        });
        setResponse(flashResult.text || "No insights generated.");
      }
    } catch (err: any) {
      console.error("AI Research Error:", err);
      setErrorInfo(err.message || 'Connection to Quantum Intelligence failed.');
      setResponse(`System Error: The neural link was interrupted by a server-side exception (500). This is likely a transient network failure in the AI cluster.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]"></div>
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">AI Research Terminal</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the database (e.g., 'Impact of d-block contraction on metallic bonding')..."
              className="relative w-full h-24 p-4 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none font-medium text-slate-700 dark:text-slate-200 shadow-inner"
            />
            <button 
              onClick={handleResearch}
              disabled={isLoading || !query.trim()}
              className="absolute bottom-4 right-4 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full text-xs font-black uppercase tracking-widest hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-30 shadow-lg"
            >
              {isLoading ? 'Processing...' : 'Execute'}
            </button>
          </div>

          <div className="min-h-[220px] p-6 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/50 overflow-y-auto max-h-[40vh] custom-scrollbar relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-10 opacity-60">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse text-cyan-500">Synthesizing Data</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Consulting Neural Archive...</p>
                </div>
              </div>
            ) : response ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium">
                {response}
                {errorInfo && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-500 not-italic font-black uppercase tracking-wider">
                    Debug Log: {errorInfo}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 opacity-30 space-y-3">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-.853l-.548-.547z" />
                </svg>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Neural Input</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800"></span>
            <span>Secure Quantum Link Alpha-1</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800"></span>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};
