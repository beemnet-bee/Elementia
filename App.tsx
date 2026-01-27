
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { PeriodicTable } from './components/PeriodicTable';
import { ElementModal } from './components/ElementModal';
import type { ElementData } from './types';
import { ELEMENTS } from './constants';
import { CategoryFilters } from './components/CategoryFilters';
import { BottomNavBar } from './components/BottomNavBar';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { ComparisonModal } from './components/ComparisonModal';
import { AIResearcherModal } from './components/AIResearcherModal';
import { SolubilityModal } from './components/SolubilityModal';
import { DashboardView } from './components/DashboardView';
import { ThemeProvider } from './contexts/ThemeContext';
import { MasteryProvider } from './contexts/MasteryContext';
import { InteractiveBackground } from './components/InteractiveBackground';
import { Legend } from './components/Legend';

type ViewType = 'registry' | 'dashboard';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewType>('registry');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [comparisonPair, setComparisonPair] = useState<[ElementData, ElementData] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [isFitToScreen, setIsFitToScreen] = useState(false);
  
  const [isAIResearcherOpen, setIsAIResearcherOpen] = useState(false);
  const [isSolubilityOpen, setIsSolubilityOpen] = useState(false);
  const [heatmapProperty, setHeatmapProperty] = useState<keyof ElementData | null>(null);
  const [heatmapTooltipElement, setHeatmapTooltipElement] = useState<ElementData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500); 
    return () => clearTimeout(timer);
  }, []);

  const handleElementClick = useCallback((element: ElementData) => {
    if (heatmapProperty) {
      setHeatmapTooltipElement(prev => prev?.number === element.number ? null : element);
    } else {
      setSelectedElement(element);
    }
  }, [heatmapProperty]);

  const handleCloseModal = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setActiveCategory(category);
    setHeatmapProperty(null); 
    setHeatmapTooltipElement(null);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleElementHover = useCallback((element: ElementData | null) => {
    setHoveredElement(element);
  }, []);

  const triggerRandomElement = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ELEMENTS.length);
    setSelectedElement(ELEMENTS[randomIndex]);
  }, []);

  const startComparison = useCallback((el1?: ElementData, el2?: ElementData) => {
    const e1 = el1 || ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    const e2 = el2 || ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    setComparisonPair([e1, e2]);
  }, []);

  const resetView = useCallback(() => {
    setActiveCategory(null);
    setSearchQuery('');
    setSelectedElement(null);
    setComparisonPair(null);
    setHeatmapProperty(null);
    setHeatmapTooltipElement(null);
    setView('registry');
  }, []);

  const matchingCount = useMemo(() => {
    return ELEMENTS.filter((element) => {
      const isFilteredByCategory = activeCategory && activeCategory !== element.category;
      const searchLower = searchQuery.toLowerCase();
      const isFilteredBySearch = searchQuery && 
        !element.name.toLowerCase().includes(searchLower) &&
        !element.symbol.toLowerCase().includes(searchLower) &&
        !String(element.number).includes(searchLower);
      return !isFilteredByCategory && !isFilteredBySearch;
    }).length;
  }, [activeCategory, searchQuery]);

  if (showSplash) {
    return (
      <SplashScreen />
    );
  }
  
  return (
    <div className={`min-h-screen ${isFitToScreen ? 'p-1 sm:p-2' : 'p-4 sm:p-6 lg:p-10'} pb-40 relative overflow-x-hidden flex flex-col items-center transition-all duration-700 bg-[#f9fafb] text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onRandomElement={triggerRandomElement}
        onCompareClick={() => startComparison()}
        onReset={resetView}
        animationsEnabled={animationsEnabled}
        onToggleAnimations={() => setAnimationsEnabled(!animationsEnabled)}
        onAIResearcherClick={() => setIsAIResearcherOpen(true)}
        onSolubilityClick={() => setIsSolubilityOpen(true)}
        onMemorizationClick={() => setView('dashboard')}
        heatmapProperty={heatmapProperty}
        onHeatmapToggle={(prop) => {
          setHeatmapProperty(prev => prev === prop ? null : prop);
          setHeatmapTooltipElement(null);
        }}
        onSelectElement={(el) => setSelectedElement(el)}
        currentView={view}
      />

      {/* View Specific UI */}
      {view === 'registry' ? (
        <>
          <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[60] flex flex-col items-end space-y-3 pointer-events-none">
            <button 
              onClick={() => setIsFitToScreen(!isFitToScreen)}
              className={`group flex items-center space-x-3 px-4 py-2 sm:px-6 sm:py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl transition-all active:scale-95 pointer-events-auto ${isFitToScreen ? 'border-cyan-500/50 text-cyan-500' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.3em] transition-colors group-hover:text-cyan-500">
                {isFitToScreen ? 'GRID VIEW' : 'FIT WIDTH'}
              </span>
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${isFitToScreen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFitToScreen ? "M4 4l5 5m0-5v5h5M20 20l-5-5m5 5v-5h-5M4 20l5-5m-5 5v-5h5M20 4l-5 5m5-5V9h-5" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"} />
              </svg>
            </button>
            <Legend />
          </div>

          <header className={`w-full max-w-7xl text-center ${isFitToScreen ? 'mb-1 sm:mb-2' : 'mb-12'} animate-reveal relative z-10 transition-all duration-700`}>
            <div className={`inline-flex items-center space-x-4 ${isFitToScreen ? 'mb-1 scale-[0.85]' : 'mb-5'} px-5 py-2 rounded-full border border-slate-200 dark:border-cyan-500/20 bg-white/60 dark:bg-cyan-500/5 backdrop-blur-md text-slate-500 dark:text-cyan-400 text-[9px] font-black tracking-[0.3em] uppercase shadow-sm dark:shadow-none transition-all`}>
              {animationsEnabled && <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>}
              <span>QUANTUM REGISTRY v2.8.4</span>
            </div>
            <h1 className={`${isFitToScreen ? 'text-2xl sm:text-4xl lg:text-6xl' : 'text-6xl sm:text-7xl lg:text-9xl'} font-black bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white dark:to-slate-500 tracking-tighter font-ubuntu drop-shadow-[0_5px_10px_rgba(0,0,0,0.05)] transition-all duration-700`}>
              ELEMENTIA
            </h1>
            {!isFitToScreen && (
              <p className="text-slate-500 dark:text-slate-400 mt-5 text-xl sm:text-2xl font-light tracking-wide max-w-3xl mx-auto opacity-80 leading-relaxed italic animate-fade-in">
                High-fidelity periodic atlas for the modern laboratory.
              </p>
            )}
          </header>
          
          <div className={`w-full max-w-screen-2xl animate-reveal relative z-10 transition-all duration-700 ${isFitToScreen ? 'mb-1' : ''}`} style={{ animationDelay: '0.2s' }}>
            <CategoryFilters activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          </div>

          <div className={`w-full relative z-10 mt-2 sm:mt-8 mb-20 px-1 sm:px-6 transition-all duration-700 ${isFitToScreen ? 'overflow-x-hidden overflow-y-auto' : 'overflow-x-auto custom-scrollbar'}`}>
            <main className={`mx-auto animate-reveal ${isFitToScreen ? 'w-full max-w-[99vw]' : 'w-fit'}`} style={{ animationDelay: '0.4s' }}>
              <PeriodicTable 
                elements={ELEMENTS} 
                onElementClick={handleElementClick}
                activeCategory={activeCategory}
                searchQuery={searchQuery}
                onElementHover={handleElementHover}
                hoveredElement={hoveredElement}
                isFitToScreen={isFitToScreen}
                heatmapProperty={heatmapProperty}
                heatmapTooltipElement={heatmapTooltipElement}
                onCloseTooltip={() => setHeatmapTooltipElement(null)}
              />
            </main>
          </div>
        </>
      ) : (
        <DashboardView onBack={() => setView('registry')} />
      )}

      {animationsEnabled && <InteractiveBackground />}
      
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${animationsEnabled ? 'opacity-100' : 'opacity-20'}`}>
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/5 dark:bg-cyan-900/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {selectedElement && (
        <ElementModal 
          element={selectedElement} 
          onClose={handleCloseModal}
          animationsEnabled={animationsEnabled}
        />
      )}

      {comparisonPair && (
        <ComparisonModal 
          pair={comparisonPair}
          onClose={() => setComparisonPair(null)}
        />
      )}

      {isAIResearcherOpen && (
        <AIResearcherModal onClose={() => setIsAIResearcherOpen(false)} />
      )}

      {isSolubilityOpen && (
        <SolubilityModal onClose={() => setIsSolubilityOpen(false)} />
      )}

      <BottomNavBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        hoveredElement={hoveredElement}
        onRandomClick={triggerRandomElement}
        onCompareClick={() => startComparison()}
        matchingCount={matchingCount}
        view={view}
        onViewChange={setView}
      />
      
       <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(40px); filter: blur(15px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-reveal { animation: reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.03); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; border: 2px solid transparent; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border: 2px solid #020617; }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <MasteryProvider>
      <AppContent />
    </MasteryProvider>
  </ThemeProvider>
);

export default App;
