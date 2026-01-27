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
        // Use a fixed height for rows to prevent vertical squishing while fitting width
        gridAutoRows: '6.8rem', 
        width: '100%',
        maxWidth: '100%',
      }
    : { 
        gridTemplateColumns: 'repeat(18, 6.4rem)',
        gridAutoRows: '7.2rem',
        width: 'max-content'
      };

  return (
    <div className={`flex flex-col items-center relative transition-all duration-700 ${isFitToScreen ? 'w-full' : 'w-fit'}`}>
      {/* Structural Glow Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[90%] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[180px]"></div>
      </div>

      <div className="w-full pb-10 relative z-10">
        <div 
          className={`grid ${isFitToScreen ? 'gap-[1px] sm:gap-1.5' : 'gap-2'} px-1 sm:px-4 transition-all duration-700`}
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
            
            // Positioning Tooltips
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

                {/* General Hover Tooltip */}
                {isHovered && !heatmapProperty && (
                  <div className={tooltipContainerClasses}>
                    <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl border border-white/10 dark:border-black/10 rounded-2xl p-4 shadow-2xl min-w-[180px] flex flex-col items-center text-center">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl font-black text-cyan-400 dark:text-cyan-600 font-ubuntu">{element.symbol}</span>
                        <div className="h-6 w-[1px] bg-slate-700 dark:bg-slate-300"></div>
                        <div className="text-left">
                          <div className="text-xs font-black uppercase text-white dark:text-slate-900 truncate max-w-[100px]">{element.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Atomic {element.number}</div>
                        </div>
                      </div>
                      <div className="w-full border-t border-slate-800 dark:border-slate-200 pt-2 flex justify-between items-center px-1">
                        <span className="text-[8px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Standard Mass</span>
                        <span className="text-[11px] font-bold text-white dark:text-slate-800 font-mono">{element.atomic_mass}</span>
                      </div>
                      <div className={arrowClasses}></div>
                    </div>
                  </div>
                )}

                {/* Heatmap Tooltip */}
                {heatmapTooltipElement?.number === element.number && heatmapProperty && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[100] animate-bounce-in pointer-events-none">
                    <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl border border-white/20 dark:border-black/20 rounded-2xl px-4 py-3 shadow-2xl min-w-[140px] flex flex-col items-center text-center relative pointer-events-auto">
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-400 dark:text-cyan-600 mb-1">
                        {heatmapProperty.replace('_', ' ')}
                      </div>
                      <div className="text-xl font-black text-white dark:text-slate-900 font-mono">
                        {String(element[heatmapProperty])}
                      </div>
                      <div className="mt-1.5 flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{element.symbol}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-700 dark:bg-slate-300"></div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Atomic {element.number}</span>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); onCloseTooltip?.(); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform pointer-events-auto"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>

                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95 dark:border-t-white/95"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Row Labels */}
          <div 
            className={`flex items-center justify-end text-right ${isFitToScreen ? 'text-[clamp(6px,0.8vw,10px)] pr-1' : 'text-[10px] pr-4'} font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-600 pointer-events-none transition-all duration-700`}
            style={{ gridRow: 9, gridColumn: '1 / span 3' }}
          >
            {isFitToScreen ? 'LANTH.' : 'Lanthanoids'} <span className="ml-1 opacity-40">→</span>
          </div>
          <div 
            className={`flex items-center justify-end text-right ${isFitToScreen ? 'text-[clamp(6px,0.8vw,10px)] pr-1' : 'text-[10px] pr-4'} font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-600 pointer-events-none transition-all duration-700`}
            style={{ gridRow: 10, gridColumn: '1 / span 3' }}
          >
            {isFitToScreen ? 'ACTIN.' : 'Actinoids'} <span className="ml-1 opacity-40">→</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: translate(-50%, 10px) scale(0.9); }
          60% { opacity: 1; transform: translate(-50%, -5px) scale(1.05); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes tooltip-in {
          from { opacity: 0; transform: translate(-50%, 5px) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes tooltip-right-in {
          from { opacity: 0; transform: translateY(-50%) translateX(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(-50%) translateX(0) scale(1); }
        }
        @keyframes tooltip-left-in {
          from { opacity: 0; transform: translateY(-50%) translateX(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(-50%) translateX(0) scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-tooltip-in { animation: tooltip-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-tooltip-right-in { animation: tooltip-right-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-tooltip-left-in { animation: tooltip-left-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};