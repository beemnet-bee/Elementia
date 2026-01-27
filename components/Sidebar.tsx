
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ELEMENTS } from '../constants';
import type { ElementData } from '../types';
import { ElementOfTheDay } from './ElementOfTheDay';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onRandomElement: () => void;
  onCompareClick: () => void;
  onReset: () => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
  onAIResearcherClick: () => void;
  onSolubilityClick: () => void;
  onMemorizationClick: () => void;
  heatmapProperty: keyof ElementData | null;
  onHeatmapToggle: (prop: keyof ElementData) => void;
  onSelectElement: (el: ElementData) => void;
  currentView: 'registry' | 'dashboard';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  onRandomElement, 
  onCompareClick, 
  onReset,
  animationsEnabled,
  onToggleAnimations,
  onAIResearcherClick,
  onSolubilityClick,
  onMemorizationClick,
  heatmapProperty,
  onHeatmapToggle,
  onSelectElement,
  currentView
}) => {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || 'dark';
  const toggleTheme = themeContext?.toggleTheme || (() => {});
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const exportRegistry = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ELEMENTS, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quantum_registry_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <>
      <div className="fixed top-10 left-6 z-[60] pointer-events-none">
        <button 
          onClick={onToggle}
          className={`p-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all active:scale-90 focus:outline-none backdrop-blur-xl ${isOpen ? 'translate-x-64' : 'translate-x-0'} duration-500 shadow-lg dark:shadow-none pointer-events-auto`}
          aria-label="Toggle Registry Sidebar"
        >
          <svg className={`w-6 h-6 transform transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      <div 
        className={`fixed inset-0 bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />

      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800/50 z-[55] transition-transform duration-500 transform backdrop-blur-3xl shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex-grow overflow-y-auto custom-sidebar-scroll p-8 pt-24 pb-12 space-y-10 scrollbar-hide">
          
          <ElementOfTheDay onSelect={(el) => { onSelectElement(el); onToggle(); }} />

          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2"></span>
              Atlas Navigation
            </h2>
            <nav className="space-y-2">
               <SidebarItem icon={<HomeIcon />} label="Registry Grid" active={currentView === 'registry'} onClick={() => { onReset(); onToggle(); }} />
               <SidebarItem icon={<AtomIcon />} label="Random Atomic Probe" onClick={() => { onRandomElement(); onToggle(); }} />
               <SidebarItem icon={<CompareIcon />} label="Comparison Matrix" onClick={() => { onCompareClick(); onToggle(); }} />
               <SidebarItem icon={<BrainIcon />} label="Analytics Dashboard" active={currentView === 'dashboard'} badge="NEW" onClick={() => { onMemorizationClick(); onToggle(); }} />
            </nav>
          </div>

          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 flex items-center">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
               Laboratory Tools
            </h2>
            <nav className="space-y-2">
               <SidebarItem 
                  icon={<SparklesIcon />} 
                  label="AI Researcher" 
                  onClick={() => { onAIResearcherClick(); onToggle(); }} 
               />
               <SidebarItem 
                  icon={<MagnetIcon />} 
                  label="Electron Negativity" 
                  active={heatmapProperty === 'electronegativity'}
                  onClick={() => { onHeatmapToggle('electronegativity'); onToggle(); }} 
               />
               <SidebarItem 
                  icon={<BoltIcon />} 
                  label="Ionization Energy" 
                  active={heatmapProperty === 'ionization_energy'}
                  onClick={() => { onHeatmapToggle('ionization_energy'); onToggle(); }} 
               />
               <SidebarItem 
                  icon={<TargetIcon />} 
                  label="Electron Affinity" 
                  active={heatmapProperty === 'electron_affinity'}
                  onClick={() => { onHeatmapToggle('electron_affinity'); onToggle(); }} 
               />
               <SidebarItem 
                  icon={<BeakerIcon />} 
                  label="Solubility Matrix" 
                  onClick={() => { onSolubilityClick(); onToggle(); }} 
               />
            </nav>
          </div>

          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
              Quantum Configuration
            </h2>
            <div className="space-y-4">
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                   {theme === 'dark' ? <MoonIcon className="w-4 h-4 text-cyan-400" /> : <SunIcon className="w-4 h-4 text-amber-500" />}
                   <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Dark Protocol</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-cyan-500 dark:bg-cyan-400 rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
                </div>
              </button>
              
              <button 
                onClick={onToggleAnimations}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center space-x-3 text-left">
                   <MotionIcon className={`w-4 h-4 ${animationsEnabled ? 'text-emerald-500 animate-spin-slow' : 'text-slate-400'}`} />
                   <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kinetic Flow</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${animationsEnabled ? 'bg-emerald-500/20' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all ${animationsEnabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/30">
           <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">System Health</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter animate-pulse text-left">Optimal</span>
           </div>
           <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest leading-loose text-left">
             Elementia Database v2.8.4<br/>
             © 2025 Quantum Research Group
           </p>
        </div>
      </aside>

      <style>{`
        .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        .dark .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; badge?: string; onClick?: () => void }> = ({ icon, label, active, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group border ${active ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 shadow-sm' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}`}
  >
    <div className="flex items-center space-x-4 flex-1 text-left min-w-0">
      <div className={`w-5 h-5 transition-colors flex-shrink-0 ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-300'}`}>
        {icon}
      </div>
      <span className="text-xs font-bold tracking-tight text-left truncate flex-1">{label}</span>
    </div>
    {badge && (
      <span className="ml-2 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[8px] font-black tracking-tighter border border-amber-500/20 flex-shrink-0">
        {badge}
      </span>
    )}
  </button>
);

const HomeIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const AtomIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.34a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.162 1.162a2 2 0 00.586 3.414l1.171.17a6 6 0 014.243 4.242l.17 1.17a2 2 0 003.414.586l1.162-1.162a2 2 0 00.547-1.022l.477-2.387a6 6 0 00-.517-3.86l-.34-.691a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00-.547-1.022l-1.162-1.162a2 2 0 00-3.414.586l-.17 1.171a6 6 0 01-4.242 4.243l-1.17.17a2 2 0 00-.586 3.414l1.162 1.162z" /></svg>;
const CompareIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const BrainIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-.853l-.548-.547z" /></svg>;
const SparklesIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>;
const BeakerIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.34a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.162 1.162a2 2 0 00.586 3.414l1.171.17a6 6 0 014.243 4.242l.17 1.17a2 2 0 003.414.586l1.162-1.162a2 2 0 00.547-1.022l.477-2.387a6 6 0 00-.517-3.86l-.34-.691a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00-.547-1.022l-1.162-1.162a2 2 0 00-3.414.586l-.17 1.171a6 6 0 01-4.242 4.243l-1.17.17a2 2 0 00-.586 3.414l1.162 1.162z" /></svg>;
const MoonIcon = (props: any) => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const SunIcon = (props: any) => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MotionIcon = (props: any) => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const MagnetIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9a3 3 0 013-3h1m0 0l-1 1m1-1l-1-1m-3 3h3v10h-3V9zm0 0H7a3 3 0 00-3 3v1h1m0 0l-1-1m1 1l-1 1m3-3H4v10h3V9z" /></svg>;
const BoltIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TargetIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
