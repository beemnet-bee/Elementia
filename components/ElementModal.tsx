
import React, { useState, useEffect } from 'react';
import type { ElementData } from '../types';
import { CATEGORY_BORDER_COLORS } from '../constants';
import { AtomAnimation } from './AtomAnimation';
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
  const [fact, setFact] = useState<string>('Querying neural network for atomic insights...');
  const [isLoadingFact, setIsLoadingFact] = useState(true);

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
      className="fixed inset-0 bg-white/20 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in overflow-hidden"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-5xl text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50 transform animate-slide-up flex flex-col overflow-hidden relative"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-3xl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-3xl"></div>

        <div className={`p-8 pb-4 flex justify-between items-end border-b border-slate-100 dark:border-slate-700/50 flex-shrink-0`}>
          <div className="flex items-baseline space-x-6">
            <h2 className="text-8xl font-black font-ubuntu tracking-tighter text-slate-900 dark:text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{element.symbol}</h2>
            <div>
              <h3 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-200">{element.name}</h3>
              <p className={`text-sm font-bold uppercase tracking-[0.3em] mt-1 ${borderClass.replace('border', 'text')}`}>{element.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className="text-5xl font-light text-slate-300 dark:text-slate-500">#{element.number}</div>
            <button 
              onClick={() => toggleMastery(element.number)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                mastered 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-cyan-500 hover:border-cyan-500'
              }`}
            >
              <span>{mastered ? 'Mastered' : 'Mark as Learned'}</span>
              {mastered && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </button>
          </div>
        </div>
        
        <div className="flex-grow p-8 space-y-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-10 scrollbar-hide">
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative group overflow-hidden">
              <div className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-600 font-bold">Electron Probability Map</div>
              <AtomAnimation electron_configuration={element.electron_configuration} animationsEnabled={animationsEnabled} />
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                <span className="w-4 h-[1px] bg-indigo-500/50 mr-2"></span>
                Bonding Dynamics
              </h4>
              <div className="h-32">
                <BondingVisualization category={element.category} symbol={element.symbol} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Quantum State Insights (AI Generated)</h4>
              <div className={`text-sm leading-relaxed ${isLoadingFact ? 'animate-pulse text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300 italic'}`}>
                {fact}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">Atomic Mass</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{element.atomic_mass} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">u</span></p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">Neutrons</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{element.neutrons}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">Protons</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{element.protons}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                <span className="w-4 h-[1px] bg-cyan-500/50 mr-2"></span>
                Atomic Properties Matrix
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/50">
                  <span className="text-[11px] text-slate-400 uppercase font-black">Melting Point</span>
                  <span className="text-sm font-bold">{element.melting_point ?? 'N/A'} <span className="text-[10px] font-normal text-slate-500">K</span></span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/50">
                  <span className="text-[11px] text-slate-400 uppercase font-black">Boiling Point</span>
                  <span className="text-sm font-bold">{element.boiling_point ?? 'N/A'} <span className="text-[10px] font-normal text-slate-500">K</span></span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/50">
                  <span className="text-[11px] text-slate-400 uppercase font-black">Density</span>
                  <span className="text-sm font-bold">{element.density ?? 'N/A'} <span className="text-[10px] font-normal text-slate-500">g/cm³</span></span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/50">
                  <span className="text-[11px] text-slate-400 uppercase font-black">Electronegativity</span>
                  <span className="text-sm font-bold">{element.electronegativity ?? 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Historical Dossier</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-light">
                {element.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
               <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">Discovery Origin</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{element.discovered_by || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">Discovery Epoch</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{element.year_discovered || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">Electronic Shell Structure</p>
                  <p className="text-sm font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 px-3 py-2 rounded-lg border border-cyan-100 dark:border-cyan-900/30">
                    {element.electron_configuration}
                  </p>
                </div>
            </div>

            {element.image_url && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 group h-40">
                <img src={element.image_url} alt={element.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 dark:from-slate-950/80 to-transparent"></div>
                <p className="absolute bottom-2 left-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Spectroscopic Reference</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 px-8 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center border-t border-slate-200 dark:border-slate-800/50">
           <div className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Quantum Lattice Entry confirmed</div>
           <button 
              onClick={onClose}
              className="px-8 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full font-bold hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all active:scale-95 focus:outline-none shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              EXIT CONSOLE
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { 
          from { transform: translateY(60px) scale(0.95); opacity: 0; filter: blur(10px); } 
          to { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); } 
        }
        .animate-fade-in { animation: ${animationsEnabled ? 'fade-in 0.4s ease-out forwards' : 'none'}; }
        .animate-slide-up { animation: ${animationsEnabled ? 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'}; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
