
import React, { useMemo } from 'react';
import { ELEMENTS } from '../constants';
import { ElementData } from '../types';

interface ElementOfTheDayProps {
  onSelect: (el: ElementData) => void;
}

export const ElementOfTheDay: React.FC<ElementOfTheDayProps> = ({ onSelect }) => {
  const element = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
    const index = seed % ELEMENTS.length;
    return ELEMENTS[index];
  }, []);

  return (
    <div 
      onClick={() => onSelect(element)}
      className="p-5 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 dark:from-indigo-500/5 dark:to-cyan-500/5 border border-cyan-500/20 rounded-3xl cursor-pointer group hover:border-cyan-500/40 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-cyan-600 dark:text-cyan-400">Featured Unit</span>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-xl font-black font-ubuntu text-slate-900 dark:text-white group-hover:scale-110 transition-transform shadow-sm">
          {element.symbol}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tighter">{element.name}</h4>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Epoch {element.year_discovered}</p>
        </div>
      </div>
    </div>
  );
};
