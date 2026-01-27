
import React from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS, CATEGORY_GLOW_COLORS } from '../constants';
import { useMastery } from '../contexts/MasteryContext';

interface ElementTileProps {
  element: ElementData;
  onClick: (element: ElementData) => void;
  isDimmed: boolean;
  onHover: (element: ElementData | null) => void;
  heatmapProperty?: keyof ElementData | null;
  isResponsive?: boolean;
}

const hexagonStyle = {
  clipPath: 'polygon(50% 1%, 98% 25%, 98% 75%, 50% 99%, 2% 75%, 2% 25%)',
};

export const ElementTile: React.FC<ElementTileProps> = ({ element, onClick, isDimmed, onHover, heatmapProperty, isResponsive }) => {
  const { isMastered } = useMastery();
  const mastered = isMastered(element.number);
  
  let colorClass = CATEGORY_COLORS[element.category] || 'bg-slate-200/40 text-slate-600 border-slate-300 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-500/50';
  let glowClass = CATEGORY_GLOW_COLORS[element.category] || 'shadow-slate-200 dark:shadow-slate-500/20';
  let customStyle: React.CSSProperties = {};

  if (heatmapProperty) {
    const val = element[heatmapProperty];
    const numVal = parseFloat(String(val));
    
    if (!isNaN(numVal)) {
      let ratio = 0;
      let rgb = [20, 50, 100]; 

      if (heatmapProperty === 'electronegativity') {
        ratio = (numVal - 0.7) / (4.0 - 0.7);
        rgb = [20, 50 + Math.floor(ratio * 150), 100 + Math.floor(ratio * 155)];
      } else if (heatmapProperty === 'ionization_energy') {
        ratio = (numVal - 300) / (2400 - 300);
        rgb = [80 + Math.floor(ratio * 170), 20 + Math.floor(ratio * 50), 150 + Math.floor(ratio * 105)];
      } else if (heatmapProperty === 'electron_affinity') {
        ratio = Math.max(0, numVal) / 350;
        rgb = [200 + Math.floor(ratio * 55), 100 + Math.floor(ratio * 100), 20];
      }

      colorClass = `text-white border-transparent`;
      customStyle = { backgroundColor: isDimmed ? undefined : `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` };
    }
  }

  const dimensionClasses = isResponsive 
    ? "w-full h-full" 
    : "w-[5.8rem] h-[6.5rem]";

  const tileClasses = `
    relative ${dimensionClasses} flex flex-col items-center justify-center 
    font-ubuntu transition-all duration-300 ease-out transform 
    focus:z-20 focus:outline-none group ${colorClass} border backdrop-blur-md
    ${isDimmed 
      ? 'opacity-10 grayscale scale-90 pointer-events-none' 
      : `opacity-100 hover:scale-[1.15] hover:z-20 focus:scale-[1.15] hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] ${glowClass} cursor-pointer`
    }
  `;

  const numberFontSize = isResponsive ? 'text-[clamp(6px,0.7vw,12px)]' : 'text-[10px]';
  const symbolFontSize = isResponsive ? 'text-[clamp(10px,2vw,32px)]' : 'text-3xl';
  const nameFontSize = isResponsive ? 'text-[clamp(5px,0.5vw,10px)]' : 'text-[9px]';

  return (
    <button
      onClick={() => onClick(element)}
      className={tileClasses}
      style={{ ...hexagonStyle, ...customStyle }}
      disabled={isDimmed}
      onMouseEnter={() => onHover(element)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`absolute top-0.5 sm:top-1 left-0 right-0 ${numberFontSize} font-black opacity-80 text-center tracking-tighter transition-all`}>
        {element.number}
      </div>
      
      <div className={`${symbolFontSize} font-black z-10 tracking-tighter drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-all transform group-hover:scale-105`}>
        {element.symbol}
      </div>
      
      <div className={`${nameFontSize} font-bold uppercase tracking-[0.1em] sm:tracking-widest truncate w-full px-0.5 sm:px-2 text-center z-10 opacity-70 mt-0 sm:mt-0.5 transition-all overflow-hidden whitespace-nowrap`}>
        {heatmapProperty && !isNaN(parseFloat(String(element[heatmapProperty]))) 
          ? element[heatmapProperty] 
          : element.name}
      </div>

      {/* Mastery Indicator */}
      {mastered && !isDimmed && (
        <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
      )}
      
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-white/40 via-transparent to-black/10 transition-opacity duration-300 pointer-events-none"
        style={hexagonStyle}
      ></div>

      <div 
        className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"
        style={hexagonStyle}
      ></div>
      
      {heatmapProperty && !isDimmed && (
        <div className="absolute bottom-1 w-0.5 h-0.5 rounded-full bg-white animate-pulse opacity-60"></div>
      )}
    </button>
  );
};
