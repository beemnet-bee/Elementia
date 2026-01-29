
import React, { useState, useEffect, useMemo } from 'react';
import type { ElementData } from '../types';
import { CATEGORY_BORDER_COLORS, CATEGORY_ACCENT_COLORS } from '../constants';
import { AtomAnimation } from './AtomAnimation';
import { QuantumModel3D } from './QuantumModel3D';
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
  const [visMode, setVisMode] = useState<'2d' | '3d'>('3d');

  const mastered = isMastered(element.number);

  // Helper to map Tailwind categories to consistent Hex colors for 3D engine
  const themeColor = useMemo(() => {
    const bgClass = CATEGORY_ACCENT_COLORS[element.category]?.bg || 'bg-cyan-500';
    if (bgClass.includes('rose')) return '#f43f5e';
    if (bgClass.includes('amber')) return '#f59e0b';
    if (bgClass.includes('violet')) return '#8b5cf6';
    if (bgClass.includes('fuchsia')) return '#d946ef';
    if (bgClass.includes('emerald')) return '#10b981';
    if (bgClass.includes('teal')) return '#14b8a6';
    if (bgClass.includes('lime')) return '#84cc16';
    if (bgClass.includes('green')) return '#22c55e';
    if (bgClass.includes('indigo')) return '#6366f1';
    if (bgClass.includes('sky')) return '#0ea5e9';
    return '#22d3ee'; // Default Cyan
  }, [element.category]);

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

  const PropertyBadge = ({ label, value, unit }: { label: string; value?: string | number; unit?: string }) => (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col group hover:border-cyan-500/30 transition-all">
      <p className="text-[7px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black mb-1 group-hover:text-cyan-500 transition-colors">{label}</p>
      <div className="flex items-baseline space-x-1">
        <p className="text-sm font-black text-slate-800 dark:text-slate-100">{value ?? 'N/A'}</p>
        {unit && value && <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600">{unit}</p>}
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-2 sm:p-4 animate-fade-in overflow-hidden"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900/95 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-5xl text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 transform animate-slide-up flex flex-col overflow-hidden relative"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-10 left-0 w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
        <div className="absolute top-10 right-0 w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>

        {/* Header Section */}
        <div className="p-8 pb-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 flex-shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center space-x-8">
            <div className={`w-20 h-20 flex items-center justify-center rounded-[1.5rem] border-2 ${borderClass} bg-white dark:bg-slate-950 shadow-xl group transition-transform`}>
              <h2 className="text-5xl font-black font-ubuntu tracking-tighter text-slate-900 dark:text-white drop-shadow-md group-hover:scale-110 transition-transform">{element.symbol}</h2>
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">{element.name}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full ${borderClass.replace('border', 'bg')}/10 ${borderClass.replace('border', 'text')}`}>
                  {element.category}
                </span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Period {element.row} • Group {element.col}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className="text-5xl font-black text-slate-200 dark:text-slate-800 font-ubuntu">#{element.number}</div>
            <button 
              onClick={() => toggleMastery(element.number)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                mastered 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-cyan-500 hover:border-cyan-500'
              }`}
            >
              <span>{mastered ? 'DATABASE SYNCED' : 'INITIALIZE SYNC'}</span>
              {mastered && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow p-8 space-y-10 overflow-y-auto scrollbar-hide grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Visuals & AI */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div className="bg-slate-50 dark:bg-slate-950/80 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[380px] relative group overflow-hidden shadow-inner">
              <div className="absolute top-4 left-6 z-10 flex items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-1 border border-slate-200 dark:border-slate-700/50">
                <button 
                  onClick={() => setVisMode('2d')}
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${visMode === '2d' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-md scale-105' : 'text-slate-400'}`}
                >Probabilistic</button>
                <button 
                  onClick={() => setVisMode('3d')}
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${visMode === '3d' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-md scale-105' : 'text-slate-400'}`}
                >Volumetric</button>
              </div>

              <div className="w-full h-full min-h-[300px] relative">
                 {visMode === '2d' ? (
                   <AtomAnimation electron_configuration={element.electron_configuration} animationsEnabled={animationsEnabled} />
                 ) : (
                   <QuantumModel3D 
                      electrons={element.electrons} 
                      config={element.electron_configuration} 
                      color={themeColor}
                      meltingPoint={element.melting_point}
                      boilingPoint={element.boiling_point}
                      density={element.density}
                      electronegativity={element.electronegativity}
                    />
                 )}
              </div>
              
              <div className="absolute bottom-4 right-8 text-[8px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 pointer-events-none italic">
                 Astrometric Visualization Alpha-1
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 p-6 rounded-[2rem] border border-cyan-500/10 space-y-4 shadow-lg">
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                 <h4 className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.3em]">AI Synthesis Report</h4>
              </div>
              <div className={`text-sm leading-relaxed ${isLoadingFact ? 'animate-pulse text-slate-400' : 'text-slate-600 dark:text-slate-300 italic font-medium'}`}>
                "{fact}"
              </div>
            </div>
          </div>
          
          {/* Right Column: Detailed Stats */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">Unit Core Specifications</h4>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <PropertyBadge label="Atomic Mass" value={element.atomic_mass} unit="u" />
                  <PropertyBadge label="Density" value={element.density} unit="g/cm³" />
                  <PropertyBadge label="Melting Pt" value={element.melting_point} unit="K" />
                  <PropertyBadge label="Boiling Pt" value={element.boiling_point} unit="K" />
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">Electrodynamics</h4>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <PropertyBadge label="Electronegativity" value={element.electronegativity} unit="Pauling" />
                  <PropertyBadge label="Ionization Energy" value={element.ionization_energy} unit="kJ/mol" />
                  <PropertyBadge label="Electron Affinity" value={element.electron_affinity} unit="kJ/mol" />
               </div>
               <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  <p className="text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black mb-2">Quantized Orbital Configuration</p>
                  <code className="text-xs font-mono text-cyan-600 dark:text-cyan-400 break-all leading-loose tracking-widest">
                    {element.electron_configuration}
                  </code>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Historical Registry</h4>
                     <div className="bg-white dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[8px] font-bold text-slate-500 uppercase">First Isolated By</span>
                           <span className="text-xs font-black text-slate-800 dark:text-slate-200">{element.discovered_by || 'Ancient Heritage'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[8px] font-bold text-slate-500 uppercase">Registry Epoch</span>
                           <span className="text-xs font-black text-indigo-500">{element.year_discovered || 'Antiquity'}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 space-y-2">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Subatomic Inventory</h4>
                     <div className="grid grid-cols-3 gap-2">
                        <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
                           <div className="text-[7px] font-black text-slate-400 uppercase">Protons</div>
                           <div className="text-sm font-black text-rose-500">{element.protons}</div>
                        </div>
                        <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
                           <div className="text-[7px] font-black text-slate-400 uppercase">Neutrons</div>
                           <div className="text-sm font-black text-emerald-500">{element.neutrons}</div>
                        </div>
                        <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
                           <div className="text-[7px] font-black text-slate-400 uppercase">Electrons</div>
                           <div className="text-sm font-black text-cyan-500">{element.electrons}</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Elemental Dossier Summary</h4>
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">
                      {element.summary}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Footer Area */}
        <div className="p-6 px-10 bg-slate-50 dark:bg-slate-950 flex justify-between items-center border-t border-slate-200 dark:border-slate-800/50">
           <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                 <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Database Node</span>
                 <span className="text-[9px] font-black text-slate-600 dark:text-slate-400">#QX-127-A</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex flex-col">
                 <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                 <span className="text-[9px] font-black text-emerald-500">ENCRYPTED LATTICE</span>
              </div>
           </div>
           <button 
              onClick={onClose}
              className="px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all active:scale-95 shadow-xl hover:shadow-cyan-500/20"
            >
              Close Interface
            </button>
        </div>
      </div>
    </div>
  );
};
