
import React, { useState } from 'react';
import { CATEGORY_ACCENT_COLORS } from '../constants';

export const Legend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-[60] flex flex-col items-end pointer-events-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-3 px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg transition-all active:scale-95 pointer-events-auto"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 group-hover:text-cyan-500 transition-colors">
          Registry Atlas
        </span>
        <div className={`w-5 h-5 flex flex-col justify-center items-center transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`absolute top-full right-0 mt-4 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl transition-all duration-500 transform origin-top-right ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none translate-y-[-20px]'}`}>
        <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">Classification Matrix</h3>
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(CATEGORY_ACCENT_COLORS).map(([key, accent]) => (
            <div key={key} className="flex items-center space-x-3 group cursor-default">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${accent.bg} ${accent.glow}`}></div>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter group-hover:text-cyan-500 transition-colors">
                {key.split(',')[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">Ref. IUPAC Standard v2025</p>
        </div>
      </div>
    </div>
  );
};
