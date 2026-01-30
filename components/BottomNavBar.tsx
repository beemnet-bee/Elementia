
import React, { useRef, useEffect } from 'react';
import type { ElementData } from '../types';

interface BottomNavBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hoveredElement: ElementData | null;
  onRandomClick?: () => void;
  onCompareClick?: () => void;
  matchingCount?: number;
  view: 'registry' | 'dashboard';
  onViewChange: (view: 'registry' | 'dashboard') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  hoveredElement,
  onRandomClick,
  onCompareClick,
  matchingCount = 127,
  view,
  onViewChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === '/') {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl pointer-events-none animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] h-20 sm:h-24 px-4 sm:px-8 flex items-center justify-between shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] group/nav transition-all duration-500 pointer-events-auto">
        
        {/* Left Side Utilities */}
        <div className="flex items-center space-x-2 sm:space-x-4 pr-6 border-r border-slate-200 dark:border-slate-800/50">
          <button 
            onClick={() => onViewChange(view === 'registry' ? 'dashboard' : 'registry')}
            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all active:scale-95 ${view === 'dashboard' ? 'bg-cyan-600 dark:bg-cyan-500 text-white shadow-[0_10px_30px_rgba(6,182,212,0.3)]' : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:bg-white dark:hover:bg-slate-800'}`}
          >
             {view === 'registry' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                </>
             ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Registry Table</span>
                </>
             )}
          </button>
          
          <div className="hidden sm:flex items-center space-x-2">
             <button 
               onClick={onRandomClick}
               className="group relative p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-90 shadow-sm dark:shadow-none"
             >
               <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.34a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.162 1.162a2 2 0 00.586 3.414l1.171.17a6 6 0 014.243 4.242l.17 1.17a2 2 0 003.414.586l1.162-1.162a2 2 0 00.547-1.022l.477-2.387a6 6 0 00-.517-3.86l-.34-.691a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00-.547-1.022l-1.162-1.162a2 2 0 00-3.414.586l-.17 1.171a6 6 0 01-4.242 4.243l-1.17.17a2 2 0 00-.586 3.414l1.162 1.162z" />
               </svg>
             </button>
             <button 
               onClick={onCompareClick}
               className="group relative p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-90 shadow-sm dark:shadow-none"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
             </button>
          </div>
        </div>
        
        {/* ENHANCED SEARCH BAR */}
        <div className="relative flex-1 max-w-[12rem] sm:max-w-md mx-4 sm:mx-10 group/search">
          <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-500"></div>
          
          <input 
            ref={inputRef}
            type="text"
            placeholder="Type Symbol, Name or Number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="relative w-full pl-12 pr-28 py-3 sm:py-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium text-xs sm:text-sm shadow-inner"
          />
          
          <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-300 ${searchQuery ? 'text-cyan-500' : 'text-slate-400 dark:text-slate-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-all hover:scale-110 active:scale-90"
              >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <div className={`flex items-center transition-all duration-300 ${searchQuery ? 'opacity-100' : 'opacity-40 group-focus-within/search:opacity-100'}`}>
               {searchQuery ? (
                  <span className="px-2 py-1 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 text-[9px] font-black text-cyan-600 dark:text-cyan-400 tracking-tighter whitespace-nowrap">
                    {matchingCount} MATCHES
                  </span>
               ) : (
                  <div className="hidden sm:flex items-center space-x-1.5 text-slate-400 dark:text-slate-500">
                    <span className="text-[9px] font-bold tracking-tighter border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md leading-none">/</span>
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Real-time Preview */}
        <div className="hidden lg:flex items-center space-x-12 text-right min-w-[280px] justify-end">
          {hoveredElement ? (
            <div key={hoveredElement.number} className="flex items-center space-x-10 animate-fade-in-fast">
               <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 mb-0.5 tracking-[0.2em] uppercase">Symbol</span>
                  <div className="text-4xl font-black font-ubuntu text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                    {hoveredElement.symbol}
                  </div>
               </div>
              <div className="border-l border-slate-200 dark:border-slate-800 pl-10 h-10 flex flex-col justify-center">
                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-[0.3em] mb-1">Elemental Unit</p>
                <p className="font-bold text-xl text-slate-800 dark:text-white tracking-tighter leading-none">{hoveredElement.name}</p>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-800 pl-10 h-10 flex flex-col justify-center">
                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-[0.3em] mb-1">Mass Spec</p>
                <p className="font-mono font-bold text-lg text-slate-700 dark:text-slate-200 tracking-tight leading-none">{hoveredElement.atomic_mass}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-slate-300 dark:text-slate-700 font-black tracking-[0.5em] uppercase text-[10px] opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800 animate-pulse"></span>
              <span>Scanning Registry</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800 animate-pulse delay-75"></span>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; transform: translateX(20px); filter: blur(5px); }
          to { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
