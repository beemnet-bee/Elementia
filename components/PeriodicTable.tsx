
import React from 'react';
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

  const gridStyles = isFitToScreen 
    ? {
        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
        gridAutoRows: '5.2rem', 
        width: '100%',
        maxWidth: '100%',
      }
    : { 
        gridTemplateColumns: 'repeat(18, 5.2rem)',
        gridAutoRows: '5.8rem',
        width: 'max-content'
      };

  return (
    <div className={`flex flex-col items-center relative transition-all duration-700 ${isFitToScreen ? 'w-full' : 'w-fit'}`}>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[90%] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="w-full pb-10 relative z-10">
        <div 
          className={`grid ${isFitToScreen ? 'gap-[1px] sm:gap-1' : 'gap-1.5'} px-1 sm:px-2 transition-all duration-700`}
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

            let tooltipContainerClasses = "absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[100] pointer-events-none animate-tooltip-in";
            let arrowClasses = "absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95 dark:border-t-white/95";

            if (isHydrogen) {
              tooltipContainerClasses = "absolute top-1/2 left-full -translate-y-1/2 ml-4 z-[100] pointer-events-none animate-tooltip-right-in";
              arrowClasses = "absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900/95 dark:border-r-white/95";
            } else if (isHelium) {
              tooltipContainerClasses = "absolute top-1/2 right-full -translate-y-1/2 mr-4 z-[100] pointer-events-none animate-tooltip-left-in";
              arrowClasses = "absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-slate-900/95 dark:border-l-white/95";
            }
            
            return (
              <div
                key={element.number}
                className="relative transition-all duration-300 h-full w-full"
                style={{ gridColumn: element.col, gridRow: element.row }}
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
                  <div className={tooltipContainerClasses}>
                    <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl border border-white/10 dark:border-black/10 rounded-2xl p-4 shadow-2xl min-w-[160px] flex flex-col items-center text-center">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-black text-cyan-400 dark:text-cyan-600 font-ubuntu">{element.symbol}</span>
                        <div className="h-5 w-[1px] bg-slate-700 dark:bg-slate-300"></div>
                        <div className="text-left">
                          <div className="text-[10px] font-black uppercase text-white dark:text-slate-900 truncate max-w-[80px]">{element.name}</div>
                          <div className="text-[8px] font-bold text-slate-400 dark:text-slate-500">Atomic {element.number}</div>
                        </div>
                      </div>
                      <div className="w-full border-t border-slate-800 dark:border-slate-200 pt-2 flex justify-between items-center px-1">
                        <span className="text-[7px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Mass</span>
                        <span className="text-[10px] font-bold text-white dark:text-slate-800 font-mono">{element.atomic_mass}</span>
                      </div>
                      <div className={arrowClasses}></div>
                    </div>
                  </div>
                )}

                {heatmapTooltipElement?.number === element.number && heatmapProperty && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] animate-bounce-in pointer-events-none">
                    <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl border border-white/20 dark:border-black/20 rounded-xl px-3 py-2 shadow-xl min-w-[120px] flex flex-col items-center text-center relative pointer-events-auto">
                      <div className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-400 dark:text-cyan-600 mb-0.5">
                        {heatmapProperty.replace('_', ' ')}
                      </div>
                      <div className="text-lg font-black text-white dark:text-slate-900 font-mono">
                        {String(element[heatmapProperty])}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onCloseTooltip?.(); }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform pointer-events-auto"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-slate-900/95 dark:border-t-white/95"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <div 
            className={`flex items-center justify-end text-right ${isFitToScreen ? 'text-[clamp(5px,0.6vw,8px)] pr-0.5' : 'text-[8px] pr-2'} font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-600 pointer-events-none transition-all duration-700`}
            style={{ gridRow: 9, gridColumn: '1 / span 3' }}
          >
            {isFitToScreen ? 'LN' : 'Lanthanoids'} <span className="ml-1 opacity-40">→</span>
          </div>
          <div 
            className={`flex items-center justify-end text-right ${isFitToScreen ? 'text-[clamp(5px,0.6vw,8px)] pr-0.5' : 'text-[8px] pr-2'} font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-600 pointer-events-none transition-all duration-700`}
            style={{ gridRow: 10, gridColumn: '1 / span 3' }}
          >
            {isFitToScreen ? 'AC' : 'Actinoids'} <span className="ml-1 opacity-40">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
