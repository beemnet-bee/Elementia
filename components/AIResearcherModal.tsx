import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AIResearcherModalProps {
  onClose: () => void;
}

export const AIResearcherModal: React.FC<AIResearcherModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');
    try {
      // Create a fresh instance for current context
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `You are an expert theoretical chemist. Research query: ${query}. Provide a sophisticated, technical, yet accessible analysis in under 300 words. Focus on quantum mechanics or industrial applications.`,
        config: {
            temperature: 0.8,
            // CRITICAL: maxOutputTokens MUST be set when using thinkingBudget
            maxOutputTokens: 4000,
            thinkingConfig: { thinkingBudget: 2000 }
        }
      });
      setResponse(result.text || "No insights generated.");
    } catch (err: any) {
      console.error("AI Research Error:", err);
      setResponse(`System Error: ${err.message || 'Connection to Quantum Intelligence failed.'} Please try a different query or check your environment configuration.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">AI Research Terminal</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="relative">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the database (e.g., 'Impact of d-block contraction on metallic bonding')..."
              className="w-full h-24 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none font-medium text-slate-700 dark:text-slate-200"
            />
            <button 
              onClick={handleResearch}
              disabled={isLoading || !query.trim()}
              className="absolute bottom-4 right-4 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full text-xs font-black uppercase tracking-widest hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-30"
            >
              {isLoading ? 'Processing...' : 'Execute'}
            </button>
          </div>

          <div className="min-h-[200px] p-6 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/50 overflow-y-auto max-h-[40vh]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-10 opacity-40">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Consulting Scientific Archive...</p>
              </div>
            ) : response ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed italic">
                {response}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Neural Input</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};