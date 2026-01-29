
import React, { useState, useEffect } from 'react';
import type { ElementData } from '../types';
import { ElementTile } from './ElementTile';

interface PeriodicTableProps {
  elements: ElementData[];
  onElementClick: (element: ElementData) => void;
  activeCategory: string | null;
  searchQuery: string;
  onElementHover: (element: ElementData | null) => void;
  hoveredElement?: ElementData | null;
  isFitToScreen?: boolean;
  heatmapProperty?: keyof ElementData | null;
  heatmapTooltipElement?: ElementData | null;
  onCloseTooltip?: () => void;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ 
  elements, 
  onElementClick, 
  activeCategory, 
  searchQuery, 
  onElementHover, 
  hoveredElement,
  isFitToScreen,
  heatmapProperty,
  heatmapTooltipElement,
  onCloseTooltip
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Small delay to ensure the mount is clean before cascading
    const timer = setTimeout(() => setIsRevealed(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const gridStyles = isFitToScreen 
    ? {
        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
        width: '100%',
        maxWidth: '100%',
      }
    : { 
        gridTemplateColumns: 'repeat(18, 5.4rem)',
        gridAutoRows: '5.9rem',
        width: 'max-content'
      };

  return (
    <div className={`flex flex-col items-center relative transition-all duration-700 ${isFitToScreen ? 'w-full px-1' : 'w-fit'}`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[90%] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="w-full pb-10 relative z-10">
        <div 
          className={`grid ${isFitToScreen ? 'gap-x-[clamp(1px,0.4vw,6px)] gap-y-[clamp(1px,0.3vw,8px)]' : 'gap-x-2 gap-y-1.5'} px-2 transition-all duration-700`}
          style={gridStyles}
        >
          {elements.map((element) => {
            const isFilteredByCategory = activeCategory && activeCategory !== element.category;
            const searchLower = searchQuery.toLowerCase();
            const isFilteredBySearch = searchQuery && 
              !element.name.toLowerCase().includes(searchLower) &&
              !element.symbol.toLowerCase().includes(searchLower) &&
              !String(element.number).includes(searchLower);

            const isDimmed = isFilteredByCategory || isFilteredBySearch;
            const isHovered = hoveredElement?.number === element.number && !isDimmed;
            
            const isHydrogen = element.number === 1;
            const isHelium = element.number === 2;

            // Staggered entry delay based on row and column position
            const entryDelay = (element.row * 60) + (element.col * 20);

            let tooltipContainerClasses = "absolute bottom-full left-1/2 -translate-x-1/2 mb-6 z-[100] pointer-events-none animate-tooltip-in";
            let arrowClasses = "absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95 dark:border-t-white/95";

            if (isHydrogen) {
              tooltipContainerClasses = "absolute top-1/2 left-full -translate-y-1/2 ml-6 z-[100] pointer-events-none animate-tooltip-right-in";
              arrowClasses = "absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900/95 dark:border-r-white/95";
            } else if (isHelium) {
              tooltipContainerClasses = "absolute top-1/2 right-full -translate-y-1/2 mr-6 z-[100] pointer-events-none animate-tooltip-left-in";
              arrowClasses = "absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-slate-900/95 dark:border-l-white/95";
            }
            
            return (
              <div
                key={element.number}
                className={`relative transition-all duration-700 w-full ${isFitToScreen ? '' : 'h-full'}`}
                style={{ 
                  gridColumn: element.col, 
                  gridRow: element.row,
                  opacity: isRevealed ? (isDimmed ? 0.2 : 1) : 0,
                  transform: isRevealed ? (isHovered ? 'scale(1.15)' : 'scale(1)') : 'scale(0.5) translateY(20px)',
                  transitionDelay: isRevealed && !isDimmed ? '0ms' : `${entryDelay}ms`,
                  zIndex: isHovered ? 50 : 1
                }}
              >
                <ElementTile 
                  element={element} 
                  onClick={onElementClick} 
                  isDimmed={isDimmed}
                  onHover={onElementHover}
                  heatmapProperty={heatmapProperty}
                  isResponsive={isFitToScreen}
                />

                {isHovered && !heatmapProperty && (
                  <div className={`${tooltipContainerClasses} ${isFitToScreen ? 'scale-75 sm:scale-90 md:scale-100 origin-bottom' : ''}`}>
                    <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-2xl border border-white/10 dark:border-black/10 rounded-2xl p-4 shadow-2xl min-w-[180px] flex flex-col items-center text-center">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl font-black text-cyan-400 dark:text-cyan-600 font-ubuntu">{element.symbol}</span>
                        <div className="h-6 w-[1px] bg-slate-700 dark:bg-slate-300"></div>
                        <div className="text-left">
                          <div className="text-[11px] font-black uppercase text-white dark:text-slate-900 truncate max-w-[90px]">{element.name}</div>
                          <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500">Atomic {element.number}</div>
                        </div>
                      </div>
                      <div className="w-full border-t border-slate-800 dark:border-slate-200 pt-2 flex justify-between items-center px-1">
                        <span className="text-[8px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Spectral Mass</span>
                        <span className="text-xs font-bold text-white dark:text-slate-800 font-mono">{element.atomic_mass}</span>
                      </div>
                      <div className={arrowClasses}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Legend Connectors for f-block */}
          <div 
            className={`flex items-center justify-end text-right ${isFitToScreen ? 'text-[clamp(6px,1.2vw,10px)] pr-1' : 'text-[9px] pr-4'} font-black tracking-[0.3em] uppercase text-slate-400 dark:text-slate-600 pointer-events-none transition-all duration-700 ${isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            style={{ gridRow: 9, gridColumn: '1 / span 3', transitionDelay: '800ms' }}
          >
            {isFitToScreen ? 'LN' : 'Lanthanoids'} <span className="ml-2 opacity-40">→</span>
          </div>
          <div 
            className={`flex items-center justify-end text-right ${isFitToScreen ? 'text-[clamp(6px,1.2vw,10px)] pr-1' : 'text-[9px] pr-4'} font-black tracking-[0.3em] uppercase text-slate-400 dark:text-slate-600 pointer-events-none transition-all duration-700 ${isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            style={{ gridRow: 10, gridColumn: '1 / span 3', transitionDelay: '900ms' }}
          >
            {isFitToScreen ? 'AC' : 'Actinoids'} <span className="ml-2 opacity-40">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
