
import React, { useState, useEffect } from 'react';
import type { ElementData } from '../types';
import { CATEGORY_BORDER_COLORS, CATEGORY_ACCENT_COLORS } from '../constants';
import { AtomAnimation } from './AtomAnimation';
import { QuantumModel3D } from './QuantumModel3D';
import { BondingVisualization } from './BondingVisualization';
import { getElementFact } from '../services/geminiService';
import { useMastery } from '../contexts/MasteryContext';

interface ElementModalProps {
  element: ElementData;
  onClose: () => void;
  animationsEnabled?: boolean;
}

export const ElementModal: React.FC<ElementModalProps> = ({ element, onClose, animationsEnabled = true }) => {
  const { isMastered, toggleMastery } = useMastery();
  const borderClass = CATEGORY_BORDER_COLORS[element.category] || 'border-slate-500';
  const accent = CATEGORY_ACCENT_COLORS[element.category];
  
  const [fact, setFact] = useState<string>('Querying neural network for atomic insights...');
  const [isLoadingFact, setIsLoadingFact] = useState(true);
  const [visMode, setVisMode] = useState<'2d' | '3d'>('3d');

  const mastered = isMastered(element.number);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingFact(true);
    getElementFact(element.name).then(res => {
      if (isMounted) {
        setFact(res);
        setIsLoadingFact(false);
      }
    });
    return () => { isMounted = false; };
  }, [element.name]);

  return (
    <div 
      className="fixed inset-0 bg-white/10 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in overflow-hidden"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900/95 rounded-[2.5rem] shadow-2xl w-full max-w-4xl text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50 transform animate-slide-up flex flex-col overflow-hidden relative"
        style={{ maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-[2.5rem]"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-[2.5rem]"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-[2.5rem]"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30 rounded-br-[2.5rem]"></div>

        <div className={`p-6 pb-4 flex justify-between items-end border-b border-slate-100 dark:border-slate-700/50 flex-shrink-0`}>
          <div className="flex items-baseline space-x-5">
            <h2 className="text-6xl font-black font-ubuntu tracking-tighter text-slate-900 dark:text-white drop-shadow-md">{element.symbol}</h2>
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-200">{element.name}</h3>
              <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-0.5 ${borderClass.replace('border', 'text')}`}>{element.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="text-3xl font-light text-slate-300 dark:text-slate-500">#{element.number}</div>
            <button 
              onClick={() => toggleMastery(element.number)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
                mastered 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-cyan-500 hover:border-cyan-500'
              }`}
            >
              <span>{mastered ? 'Mastered' : 'Learn'}</span>
              {mastered && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </button>
          </div>
        </div>
        
        <div className="flex-grow p-6 space-y-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 scrollbar-hide">
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative group overflow-hidden">
              <div className="absolute top-2 left-3 z-10 flex items-center space-x-2">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 font-bold">Quantum Projection</span>
                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5 ml-2">
                   <button 
                    onClick={() => setVisMode('2d')}
                    className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-md transition-all ${visMode === '2d' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' : 'text-slate-500'}`}
                   >2D</button>
                   <button 
                    onClick={() => setVisMode('3d')}
                    className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-md transition-all ${visMode === '3d' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' : 'text-slate-50'}`}
                   >3D</button>
                </div>
              </div>

              <div className="w-full h-full min-h-[250px] relative">
                 {visMode === '2d' ? (
                   <AtomAnimation electron_configuration={element.electron_configuration} animationsEnabled={animationsEnabled} />
                 ) : (
                   <QuantumModel3D 
                      electrons={element.electrons} 
                      config={element.electron_configuration} 
                      color={accent?.glow?.split('-')[1]?.replace('/20', '') || '#22d3ee'} 
                    />
                 )}
              </div>
              
              <div className="absolute bottom-2 right-3 text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 pointer-events-none opacity-40">
                 {visMode === '3d' ? 'Interactive WebGL' : 'Orbital Trace'}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI Quantum Insights</h4>
              <div className={`text-xs leading-relaxed ${isLoadingFact ? 'animate-pulse text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300 italic'}`}>
                {fact}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-0.5">Mass</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{element.atomic_mass} <span className="text-[10px] font-normal opacity-50">u</span></p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-0.5">Neutrons</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{element.neutrons}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-0.5">Protons</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{element.protons}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dossier Summary</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-snug text-base font-light line-clamp-5">
                {element.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="col-span-2">
                  <p className="text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">Electronic Shell Structure</p>
                  <p className="text-xs font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 px-3 py-1.5 rounded-lg border border-cyan-100 dark:border-cyan-900/30 truncate">
                    {element.electron_configuration}
                  </p>
                </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center border-t border-slate-200 dark:border-slate-800/50">
           <div className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Entry confirmed v2.8</div>
           <button 
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full font-bold text-xs hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all active:scale-95 shadow-md"
            >
              EXIT CONSOLE
            </button>
        </div>
      </div>
    </div>
  );
};
