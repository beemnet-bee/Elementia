import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS, ELEMENTS, CATEGORY_ACCENT_COLORS } from '../constants';

interface ComparisonModalProps {
  pair: [ElementData, ElementData];
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ pair, onClose }) => {
  const [leftElement, setLeftElement] = useState<ElementData>(pair[0]);
  const [rightElement, setRightElement] = useState<ElementData>(pair[1]);

  const sortedElements = useMemo(() => [...ELEMENTS].sort((a, b) => a.number - b.number), []);

  return (
    <div 
      className="fixed inset-0 bg-white/40 dark:bg-slate-950/90 backdrop-blur-2xl z-[70] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl dark:shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transform animate-slide-up max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40 sticky top-0 z-10">
           <div className="flex items-center space-x-4">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 dark:text-slate-400">Atomic Comparison Matrix</h2>
           </div>
           <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors p-2">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* Selection Area - Enhanced Comboboxes */}
        <div className="bg-slate-50/80 dark:bg-slate-950/60 p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-8 items-center justify-center z-20">
          <ElementSelector 
            label="Left Subject" 
            selected={leftElement} 
            elements={sortedElements} 
            onChange={setLeftElement} 
          />
          <div className="hidden sm:flex flex-col items-center">
             <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
             <div className="text-slate-300 dark:text-slate-700 font-black text-[10px] tracking-widest uppercase px-4 my-2">VS</div>
             <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <ElementSelector 
            label="Right Subject" 
            selected={rightElement} 
            elements={sortedElements} 
            onChange={setRightElement} 
          />
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar-v">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <ElementComparisonSide element={leftElement} />
            <ElementComparisonSide element={rightElement} />
          </div>

          <div className="p-8 sm:p-12 space-y-10 bg-white dark:bg-slate-950/50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                <StatRow label="Atomic Number" v1={leftElement.number} v2={rightElement.number} />
                <StatRow label="Atomic Mass" v1={leftElement.atomic_mass} v2={rightElement.atomic_mass} unit="u" />
                <StatRow label="Protons" v1={leftElement.protons} v2={rightElement.protons} />
                <StatRow label="Electrons" v1={leftElement.electrons} v2={rightElement.electrons} />
                <StatRow label="Neutrons" v1={leftElement.neutrons} v2={rightElement.neutrons} />
                <StatRow label="Electronegativity" v1={leftElement.electronegativity || 'N/A'} v2={rightElement.electronegativity || 'N/A'} />
             </div>
             
             <div className="pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-400 dark:text-slate-600">Quantum Parity Mapping v2.0</p>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar-v::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-v::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-v::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar-v::-webkit-scrollbar-thumb { background: #334155; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
};

const ElementSelector: React.FC<{ 
  label: string; 
  selected: ElementData; 
  elements: ElementData[]; 
  onChange: (el: ElementData) => void 
}> = ({ label, selected, elements, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredElements = useMemo(() => {
    return elements.filter(el => 
      el.name.toLowerCase().includes(search.toLowerCase()) || 
      el.symbol.toLowerCase().includes(search.toLowerCase()) ||
      String(el.number).includes(search)
    );
  }, [elements, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const accent = CATEGORY_ACCENT_COLORS[selected.category] || { bg: 'bg-slate-500', glow: '' };

  return (
    <div className="flex flex-col space-y-2 w-full max-w-[320px] relative" ref={containerRef}>
      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 pl-4">{label}</label>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border ${isOpen ? 'border-cyan-500 ring-4 ring-cyan-500/10' : 'border-slate-200 dark:border-slate-800'} rounded-3xl transition-all duration-300 group shadow-sm`}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${accent.bg} text-white font-black text-xs shadow-lg ${accent.glow}`}>
            {selected.symbol}
          </div>
          <div className="text-left">
             <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selected.name}</div>
             <div className="text-[9px] font-bold text-slate-400 dark:text-slate-600">ATOMIC NO. {selected.number}</div>
          </div>
        </div>
        <svg className={`w-5 h-5 text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-dropdown flex flex-col max-h-[400px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <input 
              type="text" 
              autoFocus
              placeholder="Search registry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 rounded-2xl text-xs font-bold border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <div className="overflow-y-auto custom-scrollbar-v flex-grow p-2 space-y-1">
            {filteredElements.length > 0 ? filteredElements.map(el => {
              const elAccent = CATEGORY_ACCENT_COLORS[el.category] || { bg: 'bg-slate-500' };
              return (
                <button
                  key={el.number}
                  onClick={() => {
                    onChange(el);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group ${selected.number === el.number ? 'bg-cyan-500/5' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${elAccent.bg} text-white font-black text-[10px]`}>
                      {el.symbol}
                    </div>
                    <div className="text-left">
                      <div className={`text-xs font-bold uppercase ${selected.number === el.number ? 'text-cyan-500' : 'text-slate-700 dark:text-slate-300'}`}>{el.name}</div>
                      <div className="text-[8px] font-black text-slate-400">UNIT {el.number}</div>
                    </div>
                  </div>
                  {selected.number === el.number && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>}
                </button>
              );
            }) : (
              <div className="p-10 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">No isotopes found</div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown { animation: dropdown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

const ElementComparisonSide: React.FC<{ element: ElementData }> = ({ element }) => (
  <div className="p-8 sm:p-14 flex flex-col items-center text-center space-y-8 animate-fade-in">
    <div className={`w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center text-4xl sm:text-6xl font-black rounded-[2rem] border-2 ${CATEGORY_COLORS[element.category] || 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-600'} shadow-xl group hover:scale-105 transition-transform duration-500 relative`}>
      <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10">{element.symbol}</span>
      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
        #{element.number}
      </div>
    </div>
    <div className="space-y-3">
      <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{element.name}</h3>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block">{element.category}</p>
    </div>
    <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 w-full text-left shadow-inner">
      <div className="flex items-center space-x-2 mb-3">
         <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
         <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-600 tracking-widest">Orbital Configuration</p>
      </div>
      <code className="text-cyan-700 dark:text-cyan-400 font-mono text-sm break-all leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 block">{element.electron_configuration}</code>
    </div>
  </div>
);

const StatRow: React.FC<{ label: string; v1: any; v2: any; unit?: string }> = ({ label, v1, v2, unit }) => {
  const n1 = typeof v1 === 'number' ? v1 : parseFloat(String(v1)) || 0;
  const n2 = typeof v2 === 'number' ? v2 : parseFloat(String(v2)) || 0;
  const diff = !isNaN(n1) && !isNaN(n2) ? Math.abs(n1 - n2).toFixed(2) : 'N/A';
  
  const p1 = n1 === 0 && n2 === 0 ? 50 : (n1 / (n1 + n2)) * 100;
  
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-end px-2">
        <div className="flex flex-col items-start">
           <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{v1}</span>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{unit}</span>
        </div>
        <div className="flex flex-col items-center mb-1">
           <span className="text-[10px] font-black uppercase text-cyan-500 dark:text-cyan-400 tracking-[0.3em]">{label}</span>
           <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800 mt-2 rounded-full"></div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{v2}</span>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{unit}</span>
        </div>
      </div>
      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full flex overflow-hidden border-2 border-slate-50 dark:border-slate-900 p-[1px]">
        <div className="h-full bg-cyan-500 rounded-l-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)" style={{ width: `${p1}%` }}></div>
        <div className="h-full bg-indigo-500 rounded-r-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)" style={{ width: `${100 - p1}%` }}></div>
      </div>
      {diff !== 'N/A' && (
        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest text-center">Variance Δ: {diff}</span>
      )}
    </div>
  );
}
